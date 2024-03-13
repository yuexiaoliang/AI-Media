import 'reflect-metadata';
import { DataSource } from 'typeorm';
import constants from '@auto-blog/constants';

import { EnglishWordsEntities } from './english-words';
import { NpmPackagesEntities } from './npm-packages';
import { TagsEntities } from './tags';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: constants.MYSQL_HOST,
  port: constants.MYSQL_PORT,
  username: constants.MYSQL_USER,
  password: constants.MYSQL_PASSWORD,
  database: constants.MYSQL_DATABASE,
  synchronize: true,
  entities: [EnglishWordsEntities.EnglishWordEntity, NpmPackagesEntities.NpmPackageEntity, TagsEntities.TagEntity]
});

export async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
}
