import {
  Column, Entity, Index, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  content: string;
}
