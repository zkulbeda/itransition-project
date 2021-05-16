import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Campaign from './Campaign';
import Picture from './Picture';

@Entity()
export default class Post {
  static readonly modelName = 'Post'

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Picture)
  picture: Picture;

  @ManyToOne(() => Campaign)
  campaign: Campaign;
}
