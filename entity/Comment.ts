import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import Post from './Post';
import CommentVote from './CommentVote';

@Entity()
export default class Comment {
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
