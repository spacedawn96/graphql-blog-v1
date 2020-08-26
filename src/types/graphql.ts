import { userLoader } from '../loaders/UserLoader';

export interface Context {
  req: Express.Request;
  res: Express.Response;
  userLoader: ReturnType<typeof userLoader>;
}
