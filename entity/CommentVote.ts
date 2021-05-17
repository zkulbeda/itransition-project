import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentVoteType } from '../schema/ICommentVote';
import Comment from './Comment';
import User from './User';

@Entity()
export default class CommentVote {
  static readonly modelName = 'CommentVote'

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column({
    nullable: false,
  })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment: Comment;

  @Column({
    type: 'enum',
    enum: CommentVoteType,
  })
  vote: CommentVoteType;
}
