import { gql } from 'apollo-server';

module.exports = gql`
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

  type Query {
    user(id: ID, username: String): User!
    users: [User]
    me: User
  }

  type Mutation {
    register(email: String!, username: String!, password: String!): User!
    login(email: String!, password: String!): User!
    createProfile(bio: String): UserProfile!
    updateProfile(bio: String): UserProfile!
    followUser(username: String!): Followers
    unFollowUser(username: String!): Followers!
    revokeRefreshToken(userId: String!): Boolean
    logout: Boolean
  }
`;