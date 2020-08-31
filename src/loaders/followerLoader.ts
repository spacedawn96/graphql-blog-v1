import { getRepository } from 'typeorm';
import DataLoader from 'dataloader';
import Followers from '../entity/Followers';
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

const FollowerLoader = async (ids: any) => {
  const follower = getRepository(Followers);
  const userFollower = await follower
    .createQueryBuilder('followers')
    .where('user_id IN (:...ids)', { ids })
    .getMany();

  const normalized = normalize(userFollower, (follower) => follower.user_id);
  const ordered = ids.map((id: any) => normalized[id]);
  return ordered;
};

export const followerLoader = () =>
  new DataLoader<string, Followers>(FollowerLoader);
