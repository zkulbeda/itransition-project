import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import PostEntity from '../../entity/Post';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { PermissionsObject } from '../permissions';
import { CampaignPermissionObject } from './campaign';
import { UserPermissionsObject } from './user';

type Post = InferSubjects<typeof PostEntity, true>

type PostPermissions = Ability<[CRUDType | 'rate', Post]>

export interface PostPermissionObject extends PermissionsObject{
  post: PostEntity | null,
  postPermissions: PostPermissions,
}

export default function getPermissionsForPost<T extends UserPermissionsObject
  & CampaignPermissionObject>(
  obj: T,
) {
  const {
    user,
    campaign,
    campaignPermissions,
  } = obj;

  const {
    can,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<PostPermissions>);

  const build = () => ({
    ...obj,
    campaignPermissions: buildAbility(),
  });

  can('read', 'Post');

  if (user === null || user.userRole === UserRole.Blocked) return build();

  can('rate', 'Post');

  if (campaign && campaignPermissions.can('update', campaign, 'posts')) {
    can('create', 'Post');
  }

  can(['update', 'delete'], 'Post', { campaignId: campaign.id });

  if (user.userRole === UserRole.Admin) {
    can([...CRUD], 'Post');
  }

  return build();
}
