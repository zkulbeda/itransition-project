import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import PictureEntity from '../../entity/Picture';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { PermissionsObject } from '../permissions';
import { UserPermissionsObject } from './user';

type Picture = InferSubjects<typeof PictureEntity, true>
type PicturePermissions = Ability<[CRUDType, Picture]>

export interface PicturePermissionObject extends PermissionsObject {
  picture: PictureEntity | null,
  picturePermissions: PicturePermissions
}

export default function getPermissionsForPicture<T extends UserPermissionsObject>(
  obj: T,
) {
  const { user } = obj;

  const {
    can,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<PicturePermissions>);

  const build = () => ({
    ...obj,
    picturePermissions: buildAbility(),
  });

  can('read', 'Picture');

  if (user == null || user.userRole === UserRole.Blocked) return build();

  can('create', 'Picture');
  can(['update', 'delete'], 'Picture', { userId: user.id });

  if (user.userRole === UserRole.Admin) {
    can([...CRUD], 'Picture');
  }

  return build();
}
