import 'reflect-metadata';
import { DataSource } from 'typeorm';
import constants from '@auto-blog/constants';

import { EnglishWordEntity } from './english-words/entities';
import { NpmPackageEntity } from './npm-packages/entities';
import { TagEntity } from './tags/entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: constants.MYSQL_HOST,
  port: constants.MYSQL_PORT,
  username: constants.MYSQL_USER,
  password: constants.MYSQL_PASSWORD,
  database: constants.MYSQL_DATABASE,
  synchronize: true,
  entities: [EnglishWordEntity, NpmPackageEntity, TagEntity]
});

export async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
}
