import { IUser } from './IUser';

export interface IComment {
  id: number;
  content: string;
  userId: number;
  user?: IUser;
  postId: number;
  post?: any;
  votes: {
    up: number;
    down: number;
  }
}

export const CommentFieldsKeysList = [
  'id',
  'content',
  'userId',
  'user',
  'postId',
  'post',
  'votes',
];
