import { ChatCompletion } from '@openai';

export interface DBPackage {
  name: string;
  description?: string;
  isPublished?: boolean;
  [key: string]: any;
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
