import { ChatCompletion } from '@openai';

export interface DBPackage {
  name: string;
  description?: string;
  isPublished?: boolean;
  [key: string]: any;
}

export type DBPackages = DBPackage[];

export interface DBData {
  pageNumber: number;
  packages: DBPackages;
  chatCompletionHistory: DBChatCompletionHistoryItem[];
}

export interface DBChatCompletionHistoryItem {
  completionInfo: Omit<ChatCompletion, 'choices'>;
  articleTitle: string;
}