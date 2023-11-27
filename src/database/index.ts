import path from 'path';
import { JSONPreset } from 'lowdb/node';
import { Low } from 'lowdb';
import { merge } from 'lodash';
import { stringToMd5 } from '@utils';
import { DBData, DBPackage, DBChatCompletionHistoryItem, DBWeixinMaterial } from './types';
export * from './types';

let db: Low<DBData>;

export const openLocalDatabase = async () => {
  if (!db) {
    db = await JSONPreset<DBData>(path.resolve(__dirname, './db.json'), {
      pageNumber: 0,
      packages: [],
      chatCompletionHistory: [],
      weixinMaterials: {}
    });
  }

  return [db, db.data] as [Low<DBData>, DBData];
};

export const getPackageByName = async (name: string) => {
  const [_, data] = await openLocalDatabase();
  return data.packages.find((item) => item.name === name);
};

export const replaceOrInsertPackage = async (newPkg: DBPackage) => {
  const [db, data] = await openLocalDatabase();

  const index = data.packages.findIndex((item) => item.name === newPkg.name);

  if (index > -1) {
    const pkg = data.packages[index];
    data.packages.splice(index, 1, merge(pkg, newPkg));
  } else {
    data.packages.push(newPkg);
  }

  db.write();
};

export const setPackagePublished = async (name: string, status: boolean = true) => {
  const [db, data] = await openLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) pkg.isPublished = status;

  db.write();
};

export const insertChatCompletionHistory = async (item: DBChatCompletionHistoryItem) => {
  const [db, data] = await openLocalDatabase();

  data.chatCompletionHistory.push(item);

  db.write();
};

export const setPackageCollectedGuideStatus = async (name: string, status: boolean = true) => {
  const [db, data] = await openLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) {
    if (!pkg.stepsStatus) pkg.stepsStatus = {} as any;
    pkg.stepsStatus!.collectedGuide = status;
  }

  db.write();
};

export const setWeixinMaterial = async (material: DBWeixinMaterial) => {
  const [db, dbData] = await openLocalDatabase();

  const key = stringToMd5(material.filepath);
  dbData.weixinMaterials[key] = material;

  db.write();
};

export const hasWeixinMaterial = async (filepath: string) => {
  const [_, dbData] = await openLocalDatabase();

  const key = stringToMd5(filepath);
  return !!dbData.weixinMaterials[key];
};

export const getWeixinMaterial = async (filepath: string) => {
  const [_, dbData] = await openLocalDatabase();

  const key = stringToMd5(filepath);
  return dbData.weixinMaterials[key];
};
