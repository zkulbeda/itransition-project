import {
  Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { DateTime } from 'luxon';
import { UserRole } from '../modules/abilities';
import { SqlDateTransformer } from '../modules/helpers';
import CampaignBonus from './CampaignBonus';
import Campaign from './Campaign';
import Picture from './Picture';
import Comment from './Comment';

@Entity()
export default class User {
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
