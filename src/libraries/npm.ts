import * as cheerio from 'cheerio';
import axios from 'axios';
import http from './http';
import * as database from '@database';
import { getRandomItem } from '@utils';

// 采集包列表
export const collectPackages = async (platform: database.DBPublishedPlatforms) => {
  const [db, data] = await database.openLocalDatabase();

  const fnMap: Record<database.DBPublishedPlatforms, () => any> = {
    weixin: database.getNotPublishedWeixinPackages,
    github: database.getNotPublishedGithubPackages
  };

  if (!fnMap[platform]) {
    throw new Error('@auto-blog/libraries: invalid platform');
  }

  const notPublished = await fnMap[platform]();

  if (data.pageNumber && notPublished.length >= 30) return data.packages;

  const params = {
    page: data.pageNumber + 1,
    platforms: 'npm',
    sort: 'dependent_repos_count',
    order: 'desc'
  };

  try {
    const { data: html } = await axios.get('https://libraries.io/search', { params });

    const projects: database.DBPackages = [];

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

// 随机获取一个包的信息
export async function getPackageInfo(pkgName: string) {
  const { repository_url, homepage } = (await http.get(pkgName)) as Record<string, any>;

  if (!repository_url) {
    throw new Error(`@auto-blog/libraries: package [${pkgName}] not found`);
  }

  const pkg: database.DBPackage = {
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

  console.log(`\n 包数据正在入库...`);
  await database.replaceOrInsertPackage(pkg);

  return pkg;
}

// 获取所有未采集基本数据的包
export async function getNotGottenPackages() {
  const [_, data] = await database.openLocalDatabase();

  const notGotten = data.packages.filter((item) => {
    if (!item.stepsStatus) return true;

    return !item.stepsStatus.gottenBaseInfo;
  });

  return notGotten;
}
