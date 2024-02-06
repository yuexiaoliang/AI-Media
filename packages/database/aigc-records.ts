import { defineDatabase } from './common';
import { ChatCompletion } from '@auto-blog/openai';
import { Project } from './types';
import { Word } from './english-words';

export type CompletionInfo = Omit<ChatCompletion, 'choices'>;

export interface AigcListItem<T> {
  project: Project;
  info: T;
  completionInfo: CompletionInfo;
}

export interface AigcDB<T = Record<string, any>> {
  list: AigcListItem<T>[];
}

export interface NpmPackageInfo {
  pkgName: string;
  title: string;
}

export const openDatabase = defineDatabase<AigcDB>('aigc-records', {
  list: []
});

// 筛选出指定项目的列表
export const filterProjectList = async <T>(project: Project) => {
  const [db, data] = await openDatabase();
  const list = data.list.filter((item) => item.project === project) as AigcListItem<T>[];

  return [list, db, data] as const;
};

// 获取包的生成文章历史记录
export const getNpmPackageRecord = async (pkgName: string) => {
  const [_, data] = await openDatabase();
  return data.list.find((item) => item.info.pkgName === pkgName);
};

// 设置包的生成文章历史记录
export const setNpmPackageRecord = async (info: NpmPackageInfo, completionInfo: CompletionInfo) => {
  const [db, data] = await openDatabase();
  const index = data.list.findIndex((item) => item.info.pkgName === info.pkgName);

  const item = {
    project: 'npm-packages',
    info,
    completionInfo
  } as AigcListItem<NpmPackageInfo>;

  if (index > -1) {
    data.list[index] = item;
  } else {
    data.list.push(item);
  }

  db.write();
};

/**
 * 保存 AIGC 记录
 */
export async function saveAigcRecord(word: Word, completionInfo: CompletionInfo) {
  const [db, data] = await openDatabase();
  const index = data.list.findIndex((item) => item.info.word === word);

  const item = {
    project: 'english-words',
    info: { word },
    completionInfo
  } as AigcListItem<any>;

  if (index > -1) {
    data.list[index] = item;
  } else {
    data.list.push(item);
  }

  db.write();
}
