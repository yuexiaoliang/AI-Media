import lodash from 'lodash';
import createHttp from './http';
import { AIModel, ChatCompletion, ChatCompletionMessage } from './types';

const { merge } = lodash;

const http = createHttp('chat');

export const defineCompletions = (config: Record<string, any> = {}) => {
  const _config = merge(
    {
      model: AIModel.GPT3,
      stream: false
    },
    config
  );

  return async (messages: ChatCompletionMessage[]) => {
    const res = (await http.post('completions', {
      ..._config,
      messages
    })) as ChatCompletion;

    const { choices, usage, ...rest } = res;

    const [completion] = choices;
    const content = completion.message.content;

    const completionInfo = {
      ...rest,
      usage
    };

    return { choices, content, completionInfo };
  };
};
