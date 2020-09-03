import { getRepository, getManager } from 'typeorm';
import DataLoader from 'dataloader';
import Comments from '../entity/Comment';
import Post from '../entity/Post';

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

const CommentsLoader = async (ids: any) => {
  const posts = await getManager()
    .createQueryBuilder(Post, 'post')
    .leftJoinAndSelect('post.comments', 'comment')
    .whereInIds(ids)
    .andWhere('(deleted = false or has_replies = true)')
    .orderBy({
      'comment.created_at': 'ASC',
    })
    .getMany();

  const normalized = normalize<Post>(posts);
  const getcomments = ids.map((id: any) =>
    normalized[id] ? normalized[id].comments : []
  );

  return getcomments;
};

export const commentsLoader = () =>
  new DataLoader<string, Comments>(CommentsLoader);
