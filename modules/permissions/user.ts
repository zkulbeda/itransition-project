import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import UserEntity from '../../entity/User';
import { UserRole } from '../../schema/IUser';
import { CRUDType } from '../helpers';
import { PermissionsObject } from '../permissions';

type User = InferSubjects<typeof UserEntity, true>

type UserPermissions = Ability<[CRUDType | 'login', User]>

export interface UserPermissionsObject extends PermissionsObject {
  user: UserEntity | null,
  userPermissions: UserPermissions
}

export default function getPermissionsForUser<T extends PermissionsObject
  & Pick<UserPermissionsObject, 'user'>>(
  obj: T,
) {
  const { user } = obj;
  const {
    can,
    cannot,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<UserPermissions>);

  const build = () => ({
    ...obj,
    userPermissions: buildAbility(),
  });

  can(['read', 'login'], 'User');

  if (user == null) return build();

  can(['update', 'delete'], 'User', { id: user.id });

  switch (user.userRole) {
    case UserRole.Blocked:
      cannot('login', 'User').because('You have been blocked.');
      break;
    case UserRole.Admin:
      can(['update', 'delete'], 'User');
      break;
    default:
  }

  return build();
}
