import { sign, verify } from 'jsonwebtoken';
import User from '../entity/User';
import { Response } from 'express';

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15min',
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    {
      user: { userId: user.id, tokenVersion: user.tokenVersion },
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '3d',
    },
  );
};

export const validateAccessToken = (token: string) => {
  try {
    return verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createTokens = (user: User) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { accessToken, refreshToken };
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
