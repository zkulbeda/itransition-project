import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import User from '../entity/User';

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
    ],
    synchronize,
    logging,
  } as MysqlConnectionOptions);
}
