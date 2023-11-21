import path from 'path';
import { JSONPreset } from 'lowdb/node';
import type { Low } from 'lowdb';
import { merge } from 'lodash';

export interface DBPackage {
  name: string;
  desc?: string;
  isPublished?: boolean;
}

export type DBPackages = DBPackage[];

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
}

export const getLocalDatabase = async () => {
  const db = await JSONPreset<DBData>(path.resolve(__dirname, '../db.json'), {
    pageNumber: 0,
    packages: []
  });

  return [db, db.data] as [Low<DBData>, DBData];
};

export const setOrAndPackage = async (newPkg: DBPackage) => {
  const [db, data] = await getLocalDatabase();

  let pkg = data.packages.find((item) => item.name === newPkg.name);

  if (pkg) {
    pkg = merge(pkg, newPkg);
  } else {
    data.packages.push(newPkg);
  }

  db.write();
};
