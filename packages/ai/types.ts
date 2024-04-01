export type AIRoles = 'system' | 'assistant' | 'user';

export enum AIModel {
  QWEN_TURBO = 'qwen-turbo',
  QWEN_PLUS = 'qwen-plus',
  QWEN_MAX = 'qwen-max',
  QWEN_MAX_1201 = 'qwen-max-1201',
  QWEN_MAX_LONGCONTEXT = 'qwen-max-longcontext',
  MOONSHOT_V1_8K = 'moonshot-v1-8k',
  MOONSHOT_V1_32K = 'moonshot-v1-32k',
  MOONSHOT_V1_128K = 'moonshot-v1-128k'
}

export type AIModelKeys = keyof typeof AIModel;

export interface ChatCompletionBase {}

export interface ChatCompletionChoice {
  message: ChatCompletionMessage;
  finish_reason: string;
}

export interface ChatCompletionMessage {
  role: AIRoles;
  content: string;
}

export interface ChatCompletionUsageBase {
  total_tokens: number;
}

export interface ChatCompletionUsageMoonshot extends ChatCompletionUsageBase {
  prompt_tokens: number;
  completion_tokens: number;
}

export interface ChatCompletionUsageQianwen extends ChatCompletionUsageBase {
  input_tokens: number;
  output_tokens: number;
}

export interface ChatCompletionMoonshot extends ChatCompletionBase {
  id: string;
  choices: ChatCompletionChoice[];
  usage: ChatCompletionUsageMoonshot;
}

export interface ChatCompletionQianwen extends ChatCompletionBase {
  request_id: string;
  output: {
    choices: ChatCompletionChoice[];
  };
  usage: ChatCompletionUsageQianwen;
}
