import { ICampaignBonus } from './ICampaignBonus';
import { ICampaignMatter } from './ICampaignMatter';
import { IPicture } from './IPicture';
import { ITag } from './ITag';
import { IUser } from './IUser';

export interface ICampaign {
  id: number;
  userId: number;
  name: string;
  description: string;
  requiredMoney: number;
  youtube: string;
  endDate: string;
  rating: number;
  matter: ICampaignMatter[];
  tags: ITag[];
  bonuses?: ICampaignBonus[];
  pictures?: IPicture[];
  user?: IUser
}

export const CampaignFieldsKeysList = [
  'id',
  'userId',
  'name',
  'description',
  'requiredMoney',
  'youtube',
  'endDate',
  'rating',
  'matter',
  'tag',
  'bonuses',
  'pictures',
  'user',
];
