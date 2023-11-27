import { ChatCompletion } from '@openai';

export interface DBPackage {
  name: string;
  homepage?: string;
  repository_url?: string;
  stepsStatus?: DBPackageStepsStatus;

  [key: string]: any;
}

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

export type DBPackages = DBPackage[];

export interface DBWeixinMaterial {
  media_id: string;
  url: string;
}

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
  generatedArticleHistory: Record<string, DBGeneratedArticleHistoryItem>;
  chatCompletionHistory: DBChatCompletionHistoryItem[];
  weixinMaterials: Record<string, DBWeixinMaterial>;
}

export type DBCompletionInfo = Omit<ChatCompletion, 'choices'>;

export interface DBGeneratedArticleHistoryItem {
  title: string;
  completionInfo: DBCompletionInfo;
}

export interface DBChatCompletionHistoryItem {
  completionInfo: DBCompletionInfo;
  articleTitle: string;
}
