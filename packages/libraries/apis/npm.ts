import * as cheerio from 'cheerio';
import axios from 'axios';
import http from '../http';
import { database } from '../db';
import { DBPackage } from '../db/database';

export const getPackages = async () => {
  const [db, data] = await database.getLocalDatabase();

  const notPublished = data.packages.filter((item) => !item.isPublished);

  if (data.pageNumber && notPublished.length >= 30) return data.packages;

  const params = {
    page: data.pageNumber + 1,
    platforms: 'npm',
    sort: 'dependent_repos_count',
    order: 'desc'
  };

  try {
    const { data: html } = await axios.get('https://libraries.io/search', { params });

    const projects: { name: string; desc: string }[] = [];

    const $ = cheerio.load(html);
    const $projects = $('.project');
    if ($projects.length) {
      $projects.each((_, item) => {
        const name = $(item).find('h5 a').text();
        const desc = $(item).find('div').text().trim();
        projects.push({
          name,
          desc
        });
      });
      data.packages = [...data.packages, ...projects];
      data.pageNumber += 1;

      db.write();
    }
  } catch (err: any) {
    if (err?.isAxiosError) {
      console.error(`@auto-blog/libraries: Request [${err!.request.res.responseUrl}] returned a status code of ${err.response.status}.`);
    }
  }
  console.log(data.pageNumber)

  return data.packages;
};

export async function getPackage() {
  const list = await getPackages();

  const notPublished = list.filter((item) => !item.isPublished);

  return notPublished[0] as DBPackage | undefined;
}
