import { getRepository } from 'typeorm';
import UserProfile from '../entity/UserProfile';
import DataLoader from 'dataloader';

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

const ProfileLoader = async (ids: any) => {
  const profile = getRepository(UserProfile);
  const profiles = await profile
    .createQueryBuilder('user_profiles')
    .where('user_id IN (:...ids)', { ids })
    .getMany();

  const normalized = normalize(profiles, (profile) => profile.user_id);

  const ordered = ids.map((id: any) => normalized[id]);
  return ordered;
};

export const profileLoader = () =>
  new DataLoader<string, UserProfile>(ProfileLoader);
