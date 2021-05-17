import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import CommentEntity from '../../entity/Comment';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { PostPermissionObject } from './post';
import { UserPermissionsObject } from './user';

type Comment = InferSubjects<typeof CommentEntity, true>
type CommentPermissions = Ability<[CRUDType | 'vote', Comment]>

export interface CommentPermissionObject{
  comment: CommentEntity | null,
  commentPermissions: CommentPermissions
}

export default function getPermissionsForComment<T extends UserPermissionsObject
  & PostPermissionObject>(
  obj: T,
) {
  const {
    user,
    post,
    postPermissions,
  } = obj;

  const {
    can,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<CommentPermissions>);

  const build = () => ({
    ...obj,
    commentPermissions: buildAbility(),
  });

  if (post && postPermissions.can('read', post)) {
    can(['create', 'vote'], 'Comment');
    can(['update', 'delete'], 'Comment', { userId: user.id });
  }

  if (user.userRole === UserRole.Admin) {
    can([...CRUD, 'vote'], 'Comment');
  }

  return build();
}
