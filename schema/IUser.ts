import { ICampaign } from './ICampaign';
import { ICampaignBonus } from './ICampaignBonus';
import { IComment } from './IComment';
import { IPicture } from './IPicture';

export enum UserRole {
  Blocked = 'blocked',
  User = 'user',
  Admin = 'admin',
}

export interface IUser {
  id: number;
  name: string
  email: string;
  regDate: string
  lastLogIn: string,
  userRole: UserRole,
  achievedBonuses?: ICampaignBonus[],
  campaigns?: ICampaign[],
  pictures?: IPicture[],
  comments?: IComment[],
}

export const UserFieldsKeysList = [
  'id',
  'name',
  'email',
  'regDate',
  'lastLogIn',
  'userRole',
  'achievedBonuses',
  'campaigns',
  'pictures',
  'comments',
];
