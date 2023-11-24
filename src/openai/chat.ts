import { DBPackage, insertChatCompletionHistory } from '@database';
import createHttp from './http';
import { AIModel, ChatCompletion } from './types';
import { renderTemplate } from '@utils';
import prompts from './prompts.txt';

const http = createHttp('chat');

export const genAndSaveArticle = async (pkg: DBPackage, model?: AIModel) => {
  const messages = [
    {
      role: 'system',
      content: renderTemplate(prompts, { pkgName: pkg.name, pkg: JSON.stringify(pkg) })
    }
  ];

  const res = (await http.post('completions', {
    model: model || AIModel.GPT4,
    stream: false,
    temperature: 0.7,
    top_p: 0.9,
    messages
  })) as ChatCompletion;

  const { choices, usage, ...rest } = res;

  await insertChatCompletionHistory({
    articleTitle: pkg.name,
    completionInfo: {
      ...rest,
      usage
    }
  });

  const [completion] = choices;
  const content = completion.message.content;

  return content;
};

export const genImagePrompt = async () => {
  const messages = [
    {
      role: 'user',
      content: `你是一个资深AI工程师，尤其精通Prompt工程，请帮我写一条用来生成图片的Prompt。
需要以“在代码中编织梦想”为核心意思。
需要适合作为缩略图。
需要加入一些随机元素，使每次生成的图片都不一样。
只回答我Prompt。
不要使用“”’’等符号进行包裹。`
    }
  ];

  const res = (await http.post('completions', {
    model: AIModel.GPT4,
    stream: false,
    temperature: 0.7,
    top_p: 0.9,
    messages
  })) as ChatCompletion;

  const { choices } = res;

  const [completion] = choices;
  const content = completion.message.content;

  return content;
};
