import {
  IResolvers,
  UserInputError,
  AuthenticationError,
  ApolloError,
} from 'apollo-server-express';
import User from '../../entity/User';
import { getRepository, getConnection } from 'typeorm';
import { schemaLogin, schema } from '../../utils/authcheck';
import bcrypt from 'bcrypt';
import {
  createTokens,
  sendRefreshToken,
  createRefreshToken,
  createAccessToken,
} from '../../utils/auth';

import UserProfile from '../../entity/UserProfile';
import Followers from '../../entity/Followers';
import Following from '../../entity/Following';
import gql from 'graphql-tag';

export const typeDef = gql`
  type User {
    id: ID!
    username: String
    email: String
    password: String
    email_verified: Boolean
    tokenVersion: String
    profile: UserProfile
    auth: [User]
    follower: Followers
    accessToken: String
    refreshToken: String
    created_at: String
  }
  type UserProfile {
    id: ID!
    bio: String
    user_id: String
  }

  type Followers {
    id: ID!
    user_id: String
    follower_id: String
  }

  type Following {
    id: ID!
    user_id: String
    following_id: String
  }

  # type Query {
  #   user(id: ID, username: String): User!
  #   users: [User]
  #   me: User
  # }

  # type Mutation {
  #   register(email: String!, username: String!, password: String!): User!
  #   login(email: String!, password: String!): User!
  #   createProfile(bio: String): UserProfile!
  #   updateProfile(bio: String): UserProfile!
  #   followUser(username: String!): Followers
  #   unFollowUser(username: String!): Followers!
  #   revokeRefreshToken(userId: String!): Boolean
  #   logout: Boolean
  # }
`;

const comparePassword = async (
  credentialsPassword: string,
  userPassword: string
) => {
  const isPasswordMatch = await bcrypt.compare(
    credentialsPassword,
    userPassword
  );
  return isPasswordMatch;
};

export const resolvers: IResolvers = {
  User: {
    profile: async (parent: User, _: any, { loaders }) => {
      return loaders.userProfile.load(parent.id);
    },
    follower: async (parent: User, _: any, { loaders }) => {
      return loaders.follower.load(parent.id);
    },
  },
  Query: {
    me: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      const users = getRepository(User);

      console.log(req.userId);
      return users.findOne({ id: req.userId });
    },
    users: async () => {
      try {
        const user = getRepository(User);
        const users = await user.find();
        return users;
      } catch (err) {
        throw Error(err);
      }
    },
    user: async (_, { id, username }) => {
      const users = getRepository(User);
      try {
        if (username) {
          const user = await users.findOne({
            where: {
              username,
            },
          });
          return user;
        }
        const user = await users.findOne({
          id,
        });
        return user;
      } catch (e) {
        console.log(e);
      }
    },
  },
  Mutation: {
    login: async (_, { email, password }, { res }) => {
      const users = getRepository(User);
      try {
        await schemaLogin.validateAsync(
          { email, password },
          { abortEarly: false }
        );
      } catch (err) {
        return err;
      }
      const user = await users.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new UserInputError('user not exist', {
          errors: {
            email: 'user not exist',
          },
        });
      }
      // if (!user.email_verified) {
      //   throw new UserInputError('need to email confirmed', {
      //     errors: {
      //       email: 'need to email confirmed'
      //     }
      //   });
      // }

      const isPasswordValid = await comparePassword(password!, user.password);

      if (!isPasswordValid) {
        throw new UserInputError('password not validation', {
          errors: {
            password: 'password not validation',
          },
        });
      }

      sendRefreshToken(res, createRefreshToken(user));

      try {
        const result = await user;
        return {
          id: result.id,
          username: result.username,
          accessToken: createAccessToken(user),
        };
      } catch (ex) {
        throw ex;
      }
    },
    register: async (_, { email, username, password }, { res }) => {
      try {
        await schema.validateAsync(
          { username, email, password },
          { abortEarly: false }
        );
      } catch (err) {
        return err;
      }
      const users = getRepository(User);
      const user = await users.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new UserInputError('user already exist', {
          errors: {
            username: 'user already exist',
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User();

      newUser.email = email;
      newUser.username = username!;
      newUser.password = password!;

      await users.save(newUser);

      return newUser;
    },

    createProfile: async (_, { bio }, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz Loginin');
      }

      const userProfile = getRepository(UserProfile);

      const newBio = new UserProfile();
      newBio.bio = bio!;
      newBio.user_id = req.userId;

      await userProfile.save(newBio);

      return newBio;
    },
    updateProfile: async (_, bio, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz Loginin');
      }

      const userProfile = getRepository(UserProfile);

      const profile = await userProfile.findOne({
        where: {
          user_id: req.userId,
        },
      });
      if (!profile) {
        throw new ApolloError('Something went wrong');
      }

      Object.assign(profile, bio);

      await userProfile.save(profile);

      return profile;
    },
    revokeRefreshToken: async (_, args, { req }) => {
      if (!req.userId) {
        return false;
      }

      await getConnection()
        .getRepository(User)
        .increment({ id: args.userId }, 'tokenVersion', 1);
      return true;
    },

    followUser: async (_, args, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz Loginin');
      }

      const findUser = getRepository(User);
      const follower = getRepository(Followers);
      const following = getRepository(Following);

      const userToFollow = await findUser.findOne({
        where: {
          username: args.username,
        },
      });

      if (userToFollow!.id === req.userId) {
        throw new ApolloError("You can't follow yourself");
      }

      const alreadyFollowed = await follower.findOne({
        where: {
          follower_id: req.userId,
          user_id: userToFollow!.id,
        },
      });

      if (alreadyFollowed) {
        throw new ApolloError("You're already following this user");
      }

      const FollowingUser = new Following();
      FollowingUser.following_id = userToFollow!.id;
      FollowingUser.user_id = req.userId;
      const createFollowing = following.save(FollowingUser);

      const FollowerUser = new Followers();
      FollowerUser.follower_id = req.userId;
      FollowerUser.user_id = userToFollow!.id;
      const createFollower = follower.save(FollowerUser);

      await Promise.all([createFollowing, createFollower]);

      return FollowerUser;
    },

    unFollowUser: async (_, args, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz Loginin');
      }

      const findUser = getRepository(User);
      const follower = getRepository(Followers);
      const following = getRepository(Following);

      const unUserToFollow = await findUser.findOne({
        where: {
          username: args.username,
        },
      });

      if (unUserToFollow!.id === req.userId) {
        throw new ApolloError("You can't unfollow yourself");
      }

      const unFollowingUser = following
        .createQueryBuilder()
        .delete()
        .where('user_id = :userId', { userId: req.userId })
        .andWhere('following_id = :followingId', {
          followingId: unUserToFollow!.id,
        })
        .execute();

      const unFollowerUser = follower
        .createQueryBuilder()
        .delete()
        .where('user_id = :userId', { userId: unUserToFollow!.id })
        .andWhere('follower_id = :followerId', {
          followerId: req.userId,
        })
        .execute();
      await Promise.all([unFollowingUser, unFollowerUser]);

      return unUserToFollow;
    },
    logout: async (_, args, { res }) => {
      sendRefreshToken(res, '');
      return true;
    },
  },
};

//add email
