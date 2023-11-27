import axios from 'axios';
import * as cheerio from 'cheerio';
import html2md from 'html-to-md';
import * as database from '@database'
import { file } from '@utils';

export const collectPackageReadme = async (name: string) => {
  try {
    const { data } = await axios.get(`https://libraries.io/npm/${name}`);
    const $ = cheerio.load(data);

    const $projects = $('#readme .markdown-body');
    const html = $projects.html();
    if (!html) return;

    const md = html2md(html);
    file.saveReadmeMD(md, name);

    database.setPackageCollectedGuideStatus(name);

    return md
  } catch (err) {
    console.log(`${err.message}`);
  }
};
