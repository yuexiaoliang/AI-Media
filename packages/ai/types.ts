export type AIRoles = 'system' | 'assistant' | 'user';

export enum AIModel {
  QWEN_TURBO = 'qwen-turbo',
  QWEN_PLUS = 'qwen-plus',
  QWEN_MAX = 'qwen-max',
  QWEN_MAX_1201 = 'qwen-max-1201',
  QWEN_MAX_LONGCONTEXT = 'qwen-max-longcontext'
}

export type AIModelKeys = keyof typeof AIModel;

export interface ChatCompletion {
  request_id: string;
  output: {
    choices: ChatCompletionChoice[];
  };
  usage: ChatCompletionUsage;
}

export interface ChatCompletionChoice {
  message: ChatCompletionMessage;
  finish_reason: string;
}

export interface ChatCompletionMessage {
  role: AIRoles;
  content: string;
}

export interface ChatCompletionUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}
