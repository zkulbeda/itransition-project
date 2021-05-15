import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pictures)
  user: User;
}
