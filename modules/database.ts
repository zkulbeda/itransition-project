import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import User from '../entity/User';
import Campaign from '../entity/Campaign';
import CampaignBonus from '../entity/CampaignBonus';
import CampaignMatter from '../entity/CampaignMatter';
import CommentVote from '../entity/CommentVote';
import Picture from '../entity/Picture';
import Post from '../entity/Post';
import Rating from '../entity/Rating';
import Tag from '../entity/Tag';
import Comment from '../entity/Comment';

export default function getBDInstance(synchronize: boolean = false, logging: boolean = false) {
  return createConnection({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
      User,
      Campaign,
      CampaignBonus,
      CampaignMatter,
      Comment,
      CommentVote,
      Picture,
      Post,
      Rating,
      Tag,
    ],
    synchronize,
    logging,
  } as MysqlConnectionOptions);
}
