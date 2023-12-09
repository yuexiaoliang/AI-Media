import * as cheerio from 'cheerio';
import axios from 'axios';
import http from './http';
import { npmPackagesDB } from '@auto-blog/database';

// 采集包列表
export const collectPackages = async () => {
  const [db, data] = await npmPackagesDB.openDatabase();

  const notPublished = await npmPackagesDB.getNotGottenBaseInfoPackages();

  if (data.pageNumber && notPublished.length >= 30) return data.packages;

  const params = {
    page: data.pageNumber + 1,
    platforms: 'npm',
    sort: 'dependent_repos_count',
    order: 'desc'
  };

  try {
    const { data: html } = await axios.get('https://libraries.io/search', { params });

    const projects: npmPackagesDB.DBPackages = [];

    const $ = cheerio.load(html);
    const $projects = $('.project');
    if ($projects.length) {
      $projects.each((_, item) => {
        const name = $(item).find('h5 a').text();
        projects.push({
          name,
          stepsStatus: {
            gottenBaseInfo: false,
            collectedGuide: false,
            generatedArticle: false,
            publishedWeixinDraft: false,
            publishedGithub: false
          }
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

// 获取包的基本信息
export async function getPackageInfo(pkgName: string) {
  const { repository_url, homepage } = (await http.get(pkgName)) as Record<string, any>;

  if (!repository_url) {
    throw new Error(`@auto-blog/libraries: package [${pkgName}] not found`);
  }

  const pkg: npmPackagesDB.Package = {
    name: pkgName,
    homepage,
    repository_url,
    stepsStatus: {
      gottenBaseInfo: true,
      collectedGuide: false,
      generatedArticle: false,
      publishedWeixinDraft: false,
      publishedGithub: false
    }
  };

  await npmPackagesDB.replaceOrInsertPackage(pkg);

  return pkg;
}
