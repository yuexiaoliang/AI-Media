import { DBPackage, insertChatCompletionHistory } from '@database';
import createHttp from './http';
import { AIModel, ChatCompletion } from './types';
import { renderTemplate } from '@utils';
import prompts from './prompts.txt';

const http = createHttp('chat');

export const genArticle = async (pkg: DBPackage, model?: AIModel) => {
  const messages = [
    {
      role: 'system',
      content: renderTemplate(prompts, { pkgName: pkg.name, pkg: JSON.stringify(pkg) })
    }
  ];

  const res = (await http.post('completions', {
    model: model || AIModel.GPT3,
    stream: false,
    temperature: 0.7,
    top_p: 0.9,
    messages
    // messages: [{ role: 'user', content: '你好，请说一句名言。' }]
  })) as ChatCompletion;

  const { choices, usage, ...rest } = res;

  await insertChatCompletionHistory({
    articleTitle: pkg.name,
    completionInfo: {
      ...rest,
      usage
    }
  });

  return choices;
};
