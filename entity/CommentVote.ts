import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import Comment from './Comment';

export enum CommentVoteType {
  UP = 'up',
  DOWN = 'down'
}

@Entity()
export default class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment: Comment;

  @Column({
    type: 'enum',
    enum: CommentVoteType,
  })
  vote: CommentVoteType;
}
