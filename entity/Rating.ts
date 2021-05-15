import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import User from './User';
import Campaign from './Campaign';

@Entity()
export default class Rating {
  @PrimaryColumn()
  @ManyToOne(() => User)
  user: User;

  @PrimaryColumn()
  @ManyToOne(() => Campaign, (campaign) => campaign.ratings)
  campaign: Campaign;

  @Column({
    type: 'tinyint',
  })
  rating: number;
}
