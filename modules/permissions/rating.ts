import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import RatingEntity from '../../entity/Rating';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { PermissionsObject } from '../permissions';
import { CampaignPermissionObject } from './campaign';
import { UserPermissionsObject } from './user';

type Rating = InferSubjects<typeof RatingEntity, true>
type RatingPermissions = Ability<[CRUDType, Rating]>

export interface RatingPermissionObject extends PermissionsObject {
  rating: RatingEntity | null,
  ratingPermissions: RatingPermissions
}

export default function getPermissionsForRating<T extends UserPermissionsObject
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
  } = new AbilityBuilder(Ability as AbilityClass<RatingPermissions>);

  const build = () => ({
    ...obj,
    ratingPermissions: buildAbility(),
  });

  can('read', 'Rating');

  if (campaign && campaignPermissions.can('rate', campaign)) {
    can('create', 'Rating');
  }
  can(['update', 'delete'], 'Rating', { userId: user.id });

  if (user.userRole === UserRole.Admin) {
    can([...CRUD], 'Rating');
  }

  return build();
}
