import path from 'path';
import { JSONPreset } from 'lowdb/node';
import type { Low } from 'lowdb';
import { merge } from 'lodash';

export interface DBPackage {
  name: string;
  description?: string;
  isPublished?: boolean;
  [key: string]: any;
}

export type DBPackages = DBPackage[];

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
}

let db: Low<DBData>;

export const getLocalDatabase = async () => {
  if (!db) {
    db = await JSONPreset<DBData>(path.resolve(__dirname, '../db.json'), {
      pageNumber: 0,
      packages: []
    });
  }

  return [db, db.data] as [Low<DBData>, DBData];
};

export const updateOrInsertPackage = async (newPkg: DBPackage) => {
  const [db, data] = await getLocalDatabase();

  const index = data.packages.findIndex((item) => item.name === newPkg.name);

  if (index > -1) {
    const pkg = data.packages[index];
    data.packages.splice(index, 1, merge(pkg, newPkg));
  } else {
    data.packages.push(newPkg);
  }

  db.write();
};

export const setPackagePublished = async (name: string) => {
  const [db, data] = await getLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) {
    pkg.isPublished = true;
  }

  db.write();
};
