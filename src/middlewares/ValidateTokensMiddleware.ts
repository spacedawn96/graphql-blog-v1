import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../entity/User';
import { getRepository } from 'typeorm';

export const ValidateTokensMiddleware = async (
  req: any,
  res: Response,
  next: any
) => {
  const refreshToken = req.cookies['jid'];

  let data;

  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
  } catch {
    return next();
  }

  const getUser = getRepository(User);

  const id = data.user.userId;

  const user = await getUser.findOne({
    id,
  });

  if (!user || user?.tokenVersion !== data.user.tokenVersion) {
    return next();
  }

  req.userId = user?.id;

  next();
};
