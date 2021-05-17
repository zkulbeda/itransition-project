import { IUser } from './IUser';

export interface IPicture {
  id: number;
  userId: number;
  user?: IUser;
}

export const PictureFieldsKeysList = [
  'id',
  'userId',
  'user',
];
