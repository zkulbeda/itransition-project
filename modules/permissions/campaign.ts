import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import CampaignEntity from '../../entity/Campaign';
import { UserRole } from '../../schema/IUser';
import {
  CRUD,
  CRUDType,
} from '../helpers';
import { PermissionsObject } from '../permissions';
import { UserPermissionsObject } from './user';

type Campaign = InferSubjects<typeof CampaignEntity, true>
type CampaignPermissions = Ability<[CRUDType | 'rate', Campaign]>

export interface CampaignPermissionObject extends PermissionsObject {
  campaign: CampaignEntity | null,
  campaignPermissions: CampaignPermissions
}

export default function getPermissionsForCampaign<T extends UserPermissionsObject>(
  obj: T,
) {
  const { user } = obj;

  const {
    can,
    build: buildAbility,
  } = new AbilityBuilder(Ability as AbilityClass<CampaignPermissions>);

  const build = () => ({
    ...obj,
    campaignPermissions: buildAbility(),
  });

  can('read', 'Campaign');

  if (user == null || user.userRole === UserRole.Blocked) return build();

  can(['create', 'rate'], 'Campaign');
  can(['update', 'delete'], 'Campaign', { userId: user.id });

  if (user.userRole === UserRole.Admin) {
    can([...CRUD], 'Campaign');
  }

  return build();
}
