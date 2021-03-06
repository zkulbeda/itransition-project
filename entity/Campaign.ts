import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SqlDateTransformer } from '../modules/helpers';
import CampaignBonus from './CampaignBonus';
import CampaignMatter from './CampaignMatter';
import Picture from './Picture';
import Rating from './Rating';
import Tag from './Tag';
import User from './User';

@Entity()
export default class Campaign {
  static readonly modelName = 'Campaign';

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

  @Column({
    nullable: false,
  })
  matterId: number;

  @ManyToOne(() => CampaignMatter, {
    nullable: false,
  })
  @JoinTable()
  matter: CampaignMatter;

  @OneToMany(() => CampaignBonus, (bonus) => bonus.campaign)
  @JoinTable()
  bonuses: CampaignBonus[];

  @Column({
    nullable: true,
  })
  userId: number;

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

  // async toPublicObject(this: Campaign, permissions: UserPermissionsObject) {
  //   let obj: ICampaign = {
  //     id: this.id,
  //     userId: this.userId,
  //     name: this.name,
  //     description: this.description,
  //     requiredMoney: this.requiredMoney,
  //     youtube: this.youtube,
  //     endDate: this.endDate.toISO(),
  //     rating: (await getRepository(Rating)
  //       .createQueryBuilder('rating')
  //       .select('AVG(rating.rating)', 'avg')
  //       .where('rating.campaignId != :id', { id: this.id })
  //       .getRawOne())?.avg,
  //     matter: (await this.matter).toPublicObject(),
  //     tags: ITag[],
  //     bonuses?: ICampaignBonus[],
  //     pictures?: IPicture[],
  //     user?: IUser,
  //   }
  // }
}
