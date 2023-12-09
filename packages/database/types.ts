import { ChatCompletion } from '@auto-blog/openai';

export type Project = 'npm-packages';

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
  generatedArticleHistory: Record<string, DBGeneratedArticleHistoryItem>;
  weixinMaterials: Record<string, DBWeixinMaterial>;
}

export interface DBPackage {
  name: string;
  homepage?: string;
  repository_url?: string;
  stepsStatus?: DBPackageStepsStatus;

  [key: string]: any;
}

export type DBPackages = DBPackage[];

export type DBPublishedPlatforms = 'weixin' | 'github';
export interface DBPublishedPlatformStatus {
  publishedWeixinDraft: boolean;
  publishedGithub: boolean;
}
export interface DBPackageStepsStatus extends DBPublishedPlatformStatus {
  gottenBaseInfo: boolean;
  collectedGuide: boolean;
  generatedArticle: boolean;
}

export type DBPackageStepsStatusKeys = keyof DBPackageStepsStatus;

export interface DBWeixinMaterial {
  media_id: string;
  url: string;
}

export type DBCompletionInfo = Omit<ChatCompletion, 'choices'>;

