import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class CampaignMatter {
  static readonly modelName = 'CampaignMatter'

  @PrimaryGeneratedColumn()
  id: number;

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;
}
