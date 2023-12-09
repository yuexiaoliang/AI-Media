import path from 'path';
import { JSONPreset } from 'lowdb/node';
import { Low } from 'lowdb';
import { DBData, DBGeneratedArticleHistoryItem } from './types';
export * from './types';

let db: Low<DBData>;

export const openLocalDatabase = async () => {
  if (!db) {
    db = await JSONPreset<DBData>(path.resolve(__dirname, './db/aigc-records.json'), {
      pageNumber: 0,
      packages: [],
      generatedArticleHistory: {},
      weixinMaterials: {}
    });
  }

  return [db, db.data] as [Low<DBData>, DBData];
};

// 获取包的生成文章历史记录
export const getPackageGeneratedArticleHistory = async (name: string) => {
  const [_, data] = await openLocalDatabase();

  return data.generatedArticleHistory[name];
};

// 设置包的生成文章历史记录
export const setPackageGeneratedArticleHistory = async (pkgName: string, history: DBGeneratedArticleHistoryItem) => {
  const [db, data] = await openLocalDatabase();

  data.generatedArticleHistory[pkgName] = history;

  db.write();
};