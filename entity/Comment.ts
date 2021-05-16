import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import CommentVote from './CommentVote';
import Post from './Post';
import User from './User';

@Entity()
export default class Comment {
  static readonly modelName = 'Comment'

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @OneToMany(() => CommentVote, (vote) => vote.comment)
  votes: CommentVote[];
}
