import * as cheerio from 'cheerio';
import axios from 'axios';
import http from '../http';
import { database } from '../db';
import { DBPackage, DBPackages } from '../db/database';

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

    const projects: DBPackages = [];

    const $ = cheerio.load(html);
    const $projects = $('.project');
    if ($projects.length) {
      $projects.each((_, item) => {
        const name = $(item).find('h5 a').text();
        const description = $(item).find('div').text().trim();
        projects.push({
          name,
          description
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

  return data.packages;
};

export async function getPackage() {
  const list = await getPackages();
  // return list[0];

  const notPublished = list.filter((item) => !item.isPublished);
  let pkg = notPublished[0];

  if (!pkg) {
    console.warn('@auto-blog/libraries: no package found');
    return;
  }

  const { versions, ...res } = (await http.get(pkg.name)) as DBPackage;
  pkg = { ...pkg, ...res };

  await database.updateOrInsertPackage(pkg);

  return pkg;
}
