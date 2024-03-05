import { merge } from 'lodash';
import { getRandomItem } from '@auto-blog/utils';
import { defineDatabase } from './common';

export type PublishedPlatformsMap = typeof publishedPlatformsMap
export type PublishedPlatforms = keyof PublishedPlatformsMap
export const publishedPlatformsMap = { weixin: '微信', github: 'Github', juejin: '掘金', xiaohongshu: '小红书', zhihu: '知乎' };
export const publishedPlatforms = Object.keys(publishedPlatformsMap) as PublishedPlatforms[];

export interface PublishedPlatformStatus {
  publishedWeixinDraft: boolean;
  publishedGithub: boolean;
  publishedJuejin: boolean;
  publishedXiaohongshu: boolean;
  publishedZhihu: boolean;
}

export interface PackageStepsStatus extends PublishedPlatformStatus {
  gottenBaseInfo: boolean;
  collectedGuide: boolean;
  generatedArticle: boolean;
}

export type PackageStepsStatusKeys = keyof PackageStepsStatus;

export interface Package {
  name: string;
  homepage?: string;
  repository_url?: string;
  stepsStatus?: PackageStepsStatus;

  [key: string]: any;
}

export type DBPackages = Package[];
export interface NpmPackagesDB {
  pageNumber: number;
  packages: DBPackages;
}

export const openDatabase = defineDatabase<NpmPackagesDB>('npm-packages', {
  pageNumber: 0,
  packages: []
});

// 替换或插入包信息
export const replaceOrInsertPackage = async (newPkg: Package) => {
  const [db, data] = await openDatabase();

  const index = data.packages.findIndex((item) => item.name === newPkg.name);

  if (index > -1) {
    const pkg = data.packages[index];
    data.packages.splice(index, 1, merge(pkg, newPkg));
  } else {
    data.packages.push(newPkg);
  }

  db.write();
};

// 根据宝名获取包信息
export const getPackageByName = async (name: string) => {
  const [_, data] = await openDatabase();

  return data.packages.find((item) => item.name === name);
};

// 获取所有未发布到指定平台的包
export async function getNotPublishedPackages(platform: PublishedPlatforms) {
  const [_, data] = await openDatabase();

  const keyMap: Record<PublishedPlatforms, keyof PublishedPlatformStatus> = {
    weixin: 'publishedWeixinDraft',
    github: 'publishedGithub',
    juejin: 'publishedJuejin',
    xiaohongshu: 'publishedXiaohongshu',
    zhihu: 'publishedZhihu'
  };

  const s = keyMap[platform];
  if (!s) {
    throw new Error('@auto-blog/libraries: invalid platform');
  }

  const notPlatformPublished = data.packages.filter((item) => {
    if (!item.stepsStatus) return false;
    if (!item.stepsStatus.gottenBaseInfo) return false;

    return !item.stepsStatus[s];
  });
  if (notPlatformPublished.length) return notPlatformPublished;

  const notPublished = data.packages.filter((item) => {
    if (!item.stepsStatus) return true;
    if (!item.stepsStatus.gottenBaseInfo) return true;

    return !item.stepsStatus[s];
  });

  const articleGenerated = notPublished.filter((item) => item.stepsStatus?.generatedArticle);

  return articleGenerated?.length > 0 ? articleGenerated : notPublished;
}

// 获取所有未发布到微信公众号的包
export const getNotPublishedWeixinPackages = async () => {
  return await getNotPublishedPackages('weixin');
};

// 获取所有未发布到 Github 的包
export const getNotPublishedGithubPackages = async () => {
  return await getNotPublishedPackages('github');
};

// 随机获取未发布到微信公众号的包
export async function getRandomNotPublishedWeixinDraft() {
  const pkgs = await getNotPublishedPackages('weixin');
  return getRandomItem(pkgs);
}

// 随机获取未发布到 Github 的包
export async function getRandomNotPublishedGithubDraft() {
  const pkgs = await getNotPublishedPackages('github');
  return getRandomItem(pkgs);
}

// 随机获取未发布到指定平台的包
export async function getRandomNotPublishedPkg(platform: PublishedPlatforms) {
  const pkgs = await getNotPublishedPackages(platform);
  return getRandomItem(pkgs);
}

// 设置包的某个状态
export const setPackageStatus = async (name: string, key: PackageStepsStatusKeys, status: boolean = true) => {
  const [db, data] = await openDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) {
    if (!pkg.stepsStatus) pkg.stepsStatus = {} as any;
    pkg.stepsStatus![key] = status;
  }

  db.write();
};

// 获取包的某个状态
export const getPackageStatus = async (name: string, key: PackageStepsStatusKeys) => {
  const [_, data] = await openDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  return pkg?.stepsStatus?.[key];
};

// 获取所有未获取基本信息的包
export const getNotGottenBaseInfoPackages = async () => {
  const [_, data] = await openDatabase();

  return data.packages.filter((item) => !item.stepsStatus?.gottenBaseInfo);
};

// 设置发布到微信公众号草稿状态
export const setPackagePublishedWeixinDraftStatus = async (name: string, status: boolean = true) => {
  await setPackageStatus(name, 'publishedWeixinDraft', status);
};

// 获取发布到微信公众号草稿状态
export const getPackagePublishedWeixinDraftStatus = async (name: string) => {
  return await getPackageStatus(name, 'publishedWeixinDraft');
};

// 设置包的采集基本信息（README）状态
export const setPackageCollectedGuideStatus = async (name: string, status: boolean = true) => {
  await setPackageStatus(name, 'collectedGuide', status);
};

// 获取包的采集基本信息（README）状态
export const getPackageCollectedGuideStatus = async (name: string) => {
  return await getPackageStatus(name, 'collectedGuide');
};

// 设置包的生成文章状态
export const setPackageGeneratedArticleStatus = async (name: string, status: boolean = true) => {
  await setPackageStatus(name, 'generatedArticle', status);
};

// 获取包的生成文章状态
export const getPackageGeneratedArticleStatus = async (name: string) => {
  return await getPackageStatus(name, 'generatedArticle');
};
