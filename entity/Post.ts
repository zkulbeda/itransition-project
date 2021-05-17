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

  @Column({
    nullable: true,
  })
  pictureId: number;

  @ManyToOne(() => Picture)
  picture: Picture;

  @Column({
    nullable: false,
  })
  campaignId: number;

  @ManyToOne(() => Campaign)
  campaign: Campaign;
}
