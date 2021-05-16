import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../modules/abilities';
import { SqlDateTransformer } from '../modules/helpers';
import Campaign from './Campaign';
import CampaignBonus from './CampaignBonus';
import Comment from './Comment';
import Picture from './Picture';

@Entity()
export default class User {
  static readonly modelName = 'User'

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'datetime',
    transformer: SqlDateTransformer,
  })
  regDate: DateTime;

  @Column({
    type: 'datetime',
    transformer: SqlDateTransformer,
  })
  lastLogIn: DateTime;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  userRole: UserRole;

  @Column()
  passwordHash: string;

  @ManyToMany(() => CampaignBonus)
  achievedBonuses: CampaignBonus[];

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
