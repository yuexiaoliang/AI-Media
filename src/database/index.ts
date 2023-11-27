import path from 'path';
import { JSONPreset } from 'lowdb/node';
import { Low } from 'lowdb';
import { merge } from 'lodash';
import { getRandomItem, stringToMd5 } from '@utils';
import { DBData, DBPackage, DBChatCompletionHistoryItem, DBWeixinMaterial, DBPackageStepsStatusKeys, DBGeneratedArticleHistoryItem, DBPublishedPlatforms, DBPublishedPlatformStatus } from './types';
export * from './types';

let db: Low<DBData>;

export const openLocalDatabase = async () => {
  if (!db) {
    db = await JSONPreset<DBData>(path.resolve(__dirname, './db.json'), {
      pageNumber: 0,
      packages: [],
      generatedArticleHistory: {},
      chatCompletionHistory: [],
      weixinMaterials: {}
    });
  }

  return [db, db.data] as [Low<DBData>, DBData];
};

// 通过包名获取包信息
export const getPackageByName = async (name: string) => {
  const [_, data] = await openLocalDatabase();
  return data.packages.find((item) => item.name === name);
};

// 替换或插入包信息
export const replaceOrInsertPackage = async (newPkg: DBPackage) => {
  const [db, data] = await openLocalDatabase();

  const index = data.packages.findIndex((item) => item.name === newPkg.name);

  if (index > -1) {
    const pkg = data.packages[index];
    data.packages.splice(index, 1, merge(pkg, newPkg));
  } else {
    data.packages.push(newPkg);
  }

  db.write();
};

// 获取所有符合状态条件的包
export const getPackagesByStatus = async (key: DBPackageStepsStatusKeys, status: boolean = false) => {
  const [_, data] = await openLocalDatabase();

  return data.packages.filter((item) => item.stepsStatus?.[key] === status);
};

// 获取所有未发布到指定平台的包
export async function getNotPublishedPackages(platform: DBPublishedPlatforms) {
  const [_, data] = await openLocalDatabase();

  const keyMap: Record<DBPublishedPlatforms, keyof DBPublishedPlatformStatus> = {
    weixin: 'publishedWeixinDraft',
    github: 'publishedGithub'
  };

  const s = keyMap[platform];
  if (!s) {
    throw new Error('@auto-blog/libraries: invalid platform');
  }

  const notPublished = data.packages.filter((item) => {
    if (!item.stepsStatus) return true;
    if (!item.stepsStatus.gottenBaseInfo) return true;

    return !item.stepsStatus[s];
  });

  return notPublished;
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

// 设置包的某个状态
export const setPackageStatus = async (name: string, key: DBPackageStepsStatusKeys, status: boolean = true) => {
  const [db, data] = await openLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) {
    if (!pkg.stepsStatus) pkg.stepsStatus = {} as any;
    pkg.stepsStatus![key] = status;
  }

  db.write();
};

// 获取包的某个状态
export const getPackageStatus = async (name: string, key: DBPackageStepsStatusKeys) => {
  const [_, data] = await openLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  return pkg?.stepsStatus?.[key];
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

// 获取包的生成文章历史记录
export const getPackageGeneratedArticleHistory = async (name: string) => {
  const [_, data] = await openLocalDatabase();

  return data.generatedArticleHistory[name];
};

// 设置包的生成文章历史记录
export const setPackageGeneratedArticleHistory = async (pkgName: string, history: DBGeneratedArticleHistoryItem) => {
  const [db, data] = await openLocalDatabase();

  data.generatedArticleHistory[pkgName] = history;

  db.write();
};

// 设置微信素材
export const setWeixinMaterial = async (material: DBWeixinMaterial) => {
  const [db, dbData] = await openLocalDatabase();

  const key = stringToMd5(material.filepath);
  dbData.weixinMaterials[key] = material;

  db.write();
};

// 是否存在微信素材
export const hasWeixinMaterial = async (filepath: string) => {
  const [_, dbData] = await openLocalDatabase();

  const key = stringToMd5(filepath);
  return !!dbData.weixinMaterials[key];
};

// 获取微信素材
export const getWeixinMaterial = async (filepath: string) => {
  const [_, dbData] = await openLocalDatabase();

  const key = stringToMd5(filepath);
  return dbData.weixinMaterials[key];
};

export const setPackagePublished = async (name: string, status: boolean = true) => {
  const [db, data] = await openLocalDatabase();

  const pkg = data.packages.find((item) => item.name === name);

  if (pkg) pkg.isPublished = status;

  db.write();
};

export const insertChatCompletionHistory = async (item: DBChatCompletionHistoryItem) => {
  const [db, data] = await openLocalDatabase();

  data.chatCompletionHistory.push(item);

  db.write();
};
