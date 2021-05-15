import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateTime } from 'luxon';
import { SqlDateTransformer } from '../modules/helpers';
import User from './User';
import CampaignMatter from './CampaignMatter';
import Picture from './Picture';
import Tag from './Tag';
import CampaignBonus from './CampaignBonus';
import Rating from './Rating';

@Entity()
export default class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  // max value is 4294967295
  @Column({
    type: 'int',
    unsigned: true,
  })
  requiredMoney: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  youtube: string;

  @Column({
    type: 'datetime',
    transformer: SqlDateTransformer,
  })
  endDate: DateTime;

  @ManyToOne(() => CampaignMatter, {
    nullable: false,
  })
  @JoinTable()
  matter: CampaignMatter;

  @OneToMany(() => CampaignBonus, (bonus) => bonus.campaign)
  @JoinTable()
  bonuses: CampaignBonus[];

  @ManyToOne(() => User, (user) => user.campaigns, {
    nullable: true,
  })
  user: User;

  @ManyToMany(() => Picture)
  @JoinTable()
  pictures: Picture[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Rating, (rating) => rating.campaign)
  ratings: Rating[];
}
