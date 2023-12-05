import axios from 'axios';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';
import * as database from '@auto-blog/database';
import * as file from '../file';

export const collectPackageReadme = async (name: string) => {
  if (await database.getPackageCollectedGuideStatus(name)) {
    const md = file.getReadmeMD(name);
    if (md) return md;
  }

  const { data } = await axios.get(`https://libraries.io/npm/${name}`);
  const $ = cheerio.load(data);

  const $projects = $('#readme .markdown-body');
  const html = $projects.html();
  if (!html) {
    throw new Error('@auto-blog/libraries: package README not found');
  }

  const md = html2md(html);
  if (!md) {
    throw new Error('@auto-blog/libraries: package README convert to markdown failed');
  }

  file.saveReadmeMD(md, name);

  await database.setPackageCollectedGuideStatus(name);

  return md;
};
