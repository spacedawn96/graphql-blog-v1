import { userLoader } from './UserLoader';
import { profileLoader } from './ProfileLoader';
import { followerLoader } from './followerLoader';
import { tagsLoader } from './tagsLoader';
import { commentsLoader } from './commentsLoader';

function createLoaders() {
  return {
    user: userLoader(),
    userProfile: profileLoader(),
    follower: followerLoader(),
    comments: commentsLoader(),
    tags: tagsLoader(),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
export default createLoaders;
