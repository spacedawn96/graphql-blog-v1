import DataLoader from 'dataloader';
import User from '../entity/User';
import { getRepository } from 'typeorm';

function normalize<T>(
  array: T[],
  selector: (item: T) => string | number = (item: any) => item.id
) {
  const object: {
    [key: string]: T;
  } = {};
  array.forEach((item) => {
    object[selector(item)] = item;
  });
  return object;
}

const Users = async (ids: any) => {
  const getUser = getRepository(User);
  const users = await getUser.findByIds(ids);

  const normalized = normalize(users, (user) => user.id);

  return ids.map((id: any) => normalized[id]);
};

export const userLoader = () => new DataLoader<string, User>(Users);
