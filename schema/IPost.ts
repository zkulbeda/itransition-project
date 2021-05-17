import { IPicture } from './IPicture';

export interface IPost {
  id: number;
  title: string;
  content: string;
  pictureId?: number;
  picture: IPicture
  campaignId: number;
  campaign: number;
}

export const PostFieldsKeysList = [
  'id',
  'title',
  'content',
  'pictureId',
  'picture',
  'campaignId',
  'campaign',
];
