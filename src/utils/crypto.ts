import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const isHash = process.env.HASH_KEY;

export default function hash(text: string) {
  if (!isHash) {
    throw new Error('there is no HashKey');
  }

  const hashed = crypto.createHmac('sha256', isHash).update(text).digest('hex');

  return hashed;
}
