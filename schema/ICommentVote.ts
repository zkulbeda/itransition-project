import { IComment } from './IComment';
import { IUser } from './IUser';

export enum CommentVoteType {
  UP = 'up',
  DOWN = 'down'
}

export interface ICommentVote {
  id: number;
  userId: number;
  user?: IUser;
  commentId: number;
  comment?: IComment;
  vote: CommentVoteType;
}

export const CommentVoteFieldsKeysList = [
  'id',
  'userId',
  'user',
  'commentId',
  'comment',
  'vote',
];
