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
  simplifiedGuide: boolean;
  generatedArticle: boolean;
}

export type DBPackages = DBPackage[];

export interface DBWeixinMaterial {
  filepath: string;
  media_id: string;
  url: string;
}

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
  chatCompletionHistory: DBChatCompletionHistoryItem[];
  weixinMaterials: Record<string, DBWeixinMaterial>;
}

export interface DBChatCompletionHistoryItem {
  completionInfo: Omit<ChatCompletion, 'choices'>;
  articleTitle: string;
}
