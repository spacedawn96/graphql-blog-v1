import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import PostsTags from '../entity/PostsTags';

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

const TagsLoader = async (ids: any) => {
  const getTags = getRepository(PostsTags);
  const postsTags = await getTags
    .createQueryBuilder('posts_tags')
    .where('post_id IN (:...ids)', { ids })
    .getMany();

  const normalized = normalize<PostsTags>(
    postsTags,
    (getTags) => getTags.post_id
  );

  const getTag = ids.map((id: any) => normalized[id]);

  // return groupById<PostsTags>(ids, postsTags, (pt) => pt.post_id).map((array) =>
  //   array.map((pt) => pt.name),
  // );

  console.log(getTag);

  return getTag;
};

export const tagsLoader = () =>
  new DataLoader<string, PostsTags>(TagsLoader as any);
