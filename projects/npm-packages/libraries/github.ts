import httpsGet from '@auto-blog/utils/httpsGet';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';

export const collectPackageReadme = async (name: string) => {
  const data = await httpsGet(`https://libraries.io/npm/${name}`);
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

  return md;
};
