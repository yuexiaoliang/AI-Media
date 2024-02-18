export type AIRoles = 'system' | 'assistant' | 'user';

export enum AIModel {
  GPT3 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4-turbo-preview'
}

export type AIModelKeys = keyof typeof AIModel;

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string,
  choices: ChatCompletionChoice[];
  usage: ChatCompletionUsage;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finish_reason: string;
}

export interface ChatCompletionMessage {
  role: AIRoles;
  content: string;
}

export interface ChatCompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
