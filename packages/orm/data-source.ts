import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { EnglishWordEntity } from './english-words/entities';
import { NpmPackageEntity } from './npm-packages/entities';
import { TagEntity } from './tags/entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '47.92.107.189',
  port: 3306,
  username: 'hFRoWG',
  password: 'ZWMyYsdB4282Nt88',
  database: 'auto_media',
  synchronize: true,
  entities: [EnglishWordEntity, NpmPackageEntity, TagEntity]
});

export async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
}
