import path from 'path';
import fs from 'fs-extra';
import { npm } from './apis';
import * as cheerio from 'cheerio';
import { JSONPreset } from 'lowdb/node';

export async function main() {
  const pkg = await npm.getPackage()
  if (!pkg) {
    console.warn('@auto-blog/libraries: no package found');
    return
  }
  console.log(`🚀 > file: index.ts:9 > main > package:`, pkg?.name);
}
