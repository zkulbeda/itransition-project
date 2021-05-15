import { Column, Entity, PrimaryColumn } from 'typeorm';
import User from './User';

@Entity()
export default class CampaignMatter {
  @PrimaryColumn()
  id: User;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;
}
