import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import User from './entity/User';
import Post from './entity/Post';
import UserProfile from './entity/UserProfile';
import PostLike from './entity/PostLike';
import PostReadLog from './entity/PostReadLog';
import PostScore from './entity/PostScore';
import PostsTags from './entity/PostsTags';
import Followers from './entity/Followers';
import Following from './entity/Following';
import Comments from './entity/Comment';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema.ts';
import { ValidateTokensMiddleware } from './middlewares/ValidateTokensMiddleware';
import auth from './routes/auth';
import createLoaders from './loaders/createLoader';

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: false,
    extra: {
      connectionLimit: 5,
    },
    entities: [
      User,
      UserProfile,
      Followers,
      Following,
      Post,
      Comments,
      PostLike,
      PostScore,
      PostReadLog,
      PostsTags,
    ],
  });

  await connection.synchronize();
  const app = express();
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(ValidateTokensMiddleware);
  app.use('/', auth);
  app.get('/', (_req, res) => res.send('hello'));

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      loaders: createLoaders(),
    }),
    introspection: true,
    playground: true,
  });
  //http://localhost:3000
  //process.env.ORIGIN_URL
  //http://www.nodegraphqlnext.cf
  server.applyMiddleware({
    app,
    cors: {
      origin: 'http://www.nodegraphqlnext.cf',
      credentials: true,
    },
  });
  app.listen(process.env.PORT || 4000, () => {
    console.log('express server started');
  });
};

main();
