import path from 'path';
import { JSONPreset } from 'lowdb/node';
import { Low } from 'lowdb';
import { DBData, DBWeixinMaterial } from './types';
export * from './types';

let db: Low<DBData>;

export const openLocalDatabase = async () => {
  if (!db) {
    db = await JSONPreset<DBData>(path.resolve(__dirname, './db/weixin-materials.json'), {
      pageNumber: 0,
      packages: [],
      generatedArticleHistory: {},
      weixinMaterials: {}
    });
  }

  return [db, db.data] as [Low<DBData>, DBData];
};


// 设置微信素材
export const setWeixinMaterial = async (pkgName: string, material: DBWeixinMaterial) => {
  const [db, dbData] = await openLocalDatabase();

  dbData.weixinMaterials[pkgName] = material;

  db.write();
};

// 是否存在微信素材
export const hasWeixinMaterial = async (pkgName: string) => {
  const [_, dbData] = await openLocalDatabase();

  return !!dbData.weixinMaterials[pkgName];
};

// 获取微信素材
export const getWeixinMaterial = async (pkgName: string) => {
  const [_, dbData] = await openLocalDatabase();

  return dbData.weixinMaterials[pkgName];
};
