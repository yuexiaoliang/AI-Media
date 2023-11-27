import * as cheerio from 'cheerio';
import axios from 'axios';
import http from './http';
import * as database from '@database';
import { DBPackages } from '@database';
import { getRandomItem } from '@utils';

// 采集包列表
export const collectPackages = async () => {
  const [db, data] = await database.openLocalDatabase();

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
        projects.push({
          name,
          stepsStatus: {
            gottenBaseInfo: false,
            collectedGuide: false,
            simplifiedGuide: false,
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
export async function getRandomPackageInfo() {
  const basePkg = getRandomItem(await getNotGottenPackages());

  const { repository_url, homepage, name } = (await http.get(basePkg.name)) as Record<string, any>;
  if (!repository_url) return getRandomPackageInfo();

  const pkg = {
    name,
    homepage,
    repository_url,
    stepsStatus: {
      gottenBaseInfo: true,
      collectedGuide: false,
      simplifiedGuide: false,
      generatedArticle: false,
      publishedWeixinDraft: false,
      publishedGithub: false
    }
  };

  // 包信息入库
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

// 获取所有未发布到指定平台的包
export async function getNotPublishedPackages(platform: database.DBPublishedPlatforms) {
  const [_, data] = await database.openLocalDatabase();

  const keyMap: Record<database.DBPublishedPlatforms, keyof database.DBPublishedPlatformStatus> = {
    weixin: 'publishedWeixinDraft',
    github: 'publishedGithub'
  };

  const s = keyMap[platform];
  if (!s) {
    console.warn('@auto-blog/libraries: invalid platform');
    return [];
  }

  const notPublished = data.packages.filter((item) => {
    if (!item.stepsStatus) return false;
    if (!item.stepsStatus.gottenBaseInfo) return false;

    return !item.stepsStatus[s];
  });

  return notPublished;
}

// 随机获取未发布到微信公众号的包
export async function getRandomNotPublishedWeixinDraft() {
  const pkgs = await getNotPublishedPackages('weixin');

  return getRandomItem(pkgs);
}
