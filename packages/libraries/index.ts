import path from 'path';
import fs from 'fs-extra';
import { npm } from './apis';
import { database } from './db'
import * as cheerio from 'cheerio';
import { JSONPreset } from 'lowdb/node';

export async function main() {
  const pkg = await npm.getPackage();
  if (!pkg) return;
  console.log(`🚀 > file: index.ts:11 > main > pkg:`, pkg.name);

  // 文章发布完成后，将 isPublished 设置为 true
  await database.setPackagePublished(pkg.name);
}
