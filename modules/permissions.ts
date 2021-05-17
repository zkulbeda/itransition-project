import campaign from './permissions/campaign';
import comment from './permissions/comment';
import commentVote from './permissions/comment-vote';
import picture from './permissions/picture';
import post from './permissions/post';
import rating from './permissions/rating';
import user from './permissions/user';

export interface PermissionsObject extends Record<any, any> {}

const permissions = {
  user,
  campaign,
  post,
  comment,
  commentVote,
  picture,
  rating,
};

export default permissions;
