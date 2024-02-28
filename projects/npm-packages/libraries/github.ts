import httpsGet from '@auto-blog/utils/httpsGet';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';
import { npmPackagesDB } from '@auto-blog/database';
import * as file from '../file';

export const collectPackageReadme = async (name: string) => {
  if (await npmPackagesDB.getPackageCollectedGuideStatus(name)) {
    const md = file.getReadmeMD(name);
    if (md) return md;
  }

  try {
    const data = await httpsGet(`https://libraries.io/npm/${name}`);
    const $ = cheerio.load(data);

    const $projects = $('#readme .markdown-body');
    const html = $projects.html();
    if (!html) {
      console.log('@auto-blog/libraries: package README not found');
      return '';
    }

    const md = html2md(html);
    if (!md) {
      console.log('@auto-blog/libraries: package README convert to markdown failed');
      return '';
    }

    file.saveReadmeMD(md, name);

    await npmPackagesDB.setPackageCollectedGuideStatus(name);

    return md;
  } catch (error) {
    console.log(error?.toString())
    return '';
  }
};
