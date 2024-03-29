import lodash from 'lodash';
import constants from '@auto-blog/constants';
import axios from 'axios';
import * as Types from './types';

const { merge } = lodash;

const BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services';

const http = axios.create({
  baseURL: BASE_URL
});

http.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${constants.QIANWEN_API_KEY}`;
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = '*/*';
  return config;
});

http.interceptors.response.use((response) => {
  return response.data;
});

export const defineCompletions = (config: Record<string, any> = {}) => {
  const _config = merge(
    {
      model: Types.AIModel.QWEN_TURBO,
      parameters: {
        result_format: 'message'
      }
    },
    config
  );

  return async (messages: Types.ChatCompletionMessage[]) => {
    const res = (await http.post('/aigc/text-generation/generation', {
      ..._config,
      input: {
        messages
      }
    })) as Types.ChatCompletion;

    const { output, ...rest } = res;

    const [completion] = output.choices;
    const content = completion.message.content;

    return { content, completionInfo: rest };
  };
};
