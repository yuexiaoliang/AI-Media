import lodash from 'lodash';
import constants from '@auto-blog/constants';
import axios from 'axios';
import * as Types from './types';

const { merge } = lodash;

const BASE_URL = 'https://api.moonshot.cn/v1';

const http = axios.create({
  baseURL: BASE_URL
});

http.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${constants.MOONSHOT_API_KEY}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

http.interceptors.response.use((response) => {
  return response.data;
});

export const defineCompletions = (config: Record<string, any> = {}) => {
  const _config = merge(
    {
      model: Types.AIModel.MOONSHOT_V1_8K
    },
    config
  );

  return async (messages: Types.ChatCompletionMessage[]) => {
    const res = (await http.post('/chat/completions', {
      ..._config,
      messages
    })) as Types.ChatCompletionMoonshot;

    const { choices, ...rest } = res;

    const [completion] = choices;
    const content = completion.message.content;

    return { content, completionInfo: rest };
  };
};
