import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Campaign from './Campaign';

@Entity()
export default class CampaignBonus {
  static readonly modelName = 'CampaignBonus';

  @PrimaryGeneratedColumn()
  id: string;

  // @Column({
  //   nullable: false,
  // })
  campaignID: number;

  @ManyToOne(() => Campaign, (c) => c.bonuses, {})
  campaign: Campaign;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  // max value is 4294967295
  @Column({
    type: 'int',
    unsigned: true,
  })
  price: number;
}
