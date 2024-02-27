import path from 'path';
import { JSONPreset } from 'lowdb/node';
import { Low } from 'lowdb';

export type DBName = 'aigc-records' | 'npm-packages' | 'weixin-materials' | 'english-words';

export const defineDatabase = <T extends Record<string, any>>(name: DBName, defaultData: T) => {
  let db: Low<T>;

  const cwd = process.cwd()
  const root = path.resolve(cwd.split('auto-blog')[0], 'auto-blog/dist')

  return async () => {
    if (!db) {
      db = await JSONPreset<T>(path.resolve(root, `./db/${name}.json`), defaultData);
    }

    return [db, db.data] as const;
  };
};
