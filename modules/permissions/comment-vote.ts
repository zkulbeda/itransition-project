import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import CommentVoteEntity from '../../entity/CommentVote';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { CommentPermissionObject } from './comment';
import { UserPermissionsObject } from './user';

type CommentVote = InferSubjects<typeof CommentVoteEntity, true>
type CommentVotePermissions = Ability<[CRUDType, CommentVote]>

export interface CommentVotePermissionObject {
  commentVote: CommentVoteEntity | null,
  commentVotePermissions: CommentVotePermissions
}

export default function getPermissionsForComment<T extends UserPermissionsObject
  & CommentPermissionObject>(
  obj: T,
) {
  const {
    user,
    comment,
    commentPermissions,
  } = obj;

  const {
    can,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<CommentVotePermissions>);

  const build = () => ({
    ...obj,
    commentVotePermissions: buildAbility(),
  });

  can('read', 'CommentVote');

  if (comment && commentPermissions.can('read', comment)) {
    can(['create'], 'CommentVote');
    can(['update', 'delete'], 'CommentVote', { userId: user.id });
  }

  if (user.userRole === UserRole.Admin) {
    can([...CRUD], 'CommentVote');
  }

  return build();
}
