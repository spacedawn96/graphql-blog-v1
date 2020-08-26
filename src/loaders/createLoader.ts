import { userLoader } from './UserLoader';
import { profileLoader } from './ProfileLoader';
import { followerLoader } from './followerLoader';
import { commentsLoader } from './commentsLoader';
import { tagsLoader } from './tagsLoader';

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
