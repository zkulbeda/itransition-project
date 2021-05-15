import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class CampaignMatter {
  @PrimaryGeneratedColumn()
  id: User;

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;
}
