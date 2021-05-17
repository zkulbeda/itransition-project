import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SqlDateTransformer } from '../modules/helpers';
import { UserRole } from '../schema/IUser';
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

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    type: 'datetime',
    transformer: SqlDateTransformer,
    default: () => 'now()',
  })
  regDate: DateTime;

  @Column({
    type: 'datetime',
    transformer: SqlDateTransformer,
    default: () => 'now()',
  })
  lastLogIn: DateTime;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  userRole: UserRole;

  @Column({
    nullable: true,
  })
  passwordHash: string;

  @ManyToMany(() => CampaignBonus)
  @JoinTable()
  achievedBonuses: CampaignBonus[];

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  async setPassword(this: User, password: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(password, 8);
  }

  async comparePassword(this: User, password: string):Promise<boolean> {
    if (!this.passwordHash) return false;

    return bcrypt.compare(password, this.passwordHash);
  }
}
