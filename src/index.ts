import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import cookieParser from 'cookie-parser';
import graphqlSchema from './graphql/schema.ts';
import dotenv from 'dotenv';
import Post from './entity/Post';
import User from './entity/User';
import UserProfile from './entity/UserProfile';
import Tag from './entity/Tag';
import PostLike from './entity/PostLike';
import PostReadLog from './entity/PostReadLog';
import PostScore from './entity/PostScore';
import PostsTags from './entity/PostsTags';
import Notification from './entity/Notification';
import Comment from './entity/Comment';
import Following from './entity/Following';
import Followers from './entity/Followers';
import createLoaders from './loaders/createLoader';
import { ValidateTokensMiddleware } from './middlewares/ValidateTokensMiddleware';
import auth from './routes/auth';
import path from 'path';

dotenv.config();

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : process.env.DATABASE,
    logging: false,
    synchronize: true,

    entities: [
      Post,
      User,
      UserProfile,
      Tag,
      PostLike,
      PostReadLog,
      PostScore,
      PostsTags,
      Notification,
      Followers,
      Following,
      Comment,
    ],
  });

  await connection.synchronize();

  const schema = graphqlSchema;

  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: ({ req, res }) => ({
      req,
      res,
      loaders: createLoaders(),
    }),
  });

  const app = express();
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(ValidateTokensMiddleware);
  app.use('/', auth);
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    },
  });

  app.listen(process.env.PORT || 4000, () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
