import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import Campaign from './Campaign';
import User from './User';

@Entity()
export default class Rating {
  static readonly modelName = 'Rating'

  @PrimaryColumn()
  id: number;

  // @Column({
  //   nullable: true,
  // })
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    nullable: false,
  })
  campaignId: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.ratings)
  campaign: Campaign;

  @Column({
    type: 'tinyint',
  })
  rating: number;
}
