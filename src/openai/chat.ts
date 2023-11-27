import * as database from '@database';
import createHttp from './http';
import { AIModel, ChatCompletion } from './types';
import { renderTemplate, file } from '@utils';
import genArticlePrompt from './prompts/genArticleV2.txt';
import genImagePromptPrompt from './prompts/genImagePrompt.txt';
import { mdToWeixin } from '@md-renders';

const http = createHttp('chat');

export const genArticle = async (readme: string, pkgName: string) => {
  // 如果生成过文章，则需要获取以生成的文章，避免重复请求浪费资源
  if (await database.getPackageGeneratedArticleStatus(pkgName)) {
    const history = await database.getPackageGeneratedArticleHistory(pkgName);
    if (history) {
      const { title } = history;
      const md = file.getArticleFile(pkgName, `${title}.md`);

      if (md) {
        const { html, meta } = renderAndSave(md);
        if (html) {
          return { md, html, meta };
        } else {
          const { html } = renderAndSave(md);
          return { md, html, meta };
        }
      }
    }
  }

  const res = (await http.post('completions', {
    model: AIModel.GPT4,
    stream: false,
    messages: [
      {
        role: 'user',
        content: renderTemplate(genArticlePrompt, { readme, pkgName })
      }
    ]
  })) as ChatCompletion;

  const { choices, usage, ...rest } = res;

  const [completion] = choices;
  const content = completion.message.content;

  const completionInfo = {
    ...rest,
    usage
  };

  const { html, meta } = renderAndSave(content);

  await database.setPackageGeneratedArticleHistory(pkgName, { title: meta.title, completionInfo });
  await database.setPackageGeneratedArticleStatus(pkgName, true);

  return { md: content, html, meta };

  function renderAndSave(md: string) {
    const [{ html, meta }] = mdToWeixin<{
      title: string;
      desc: string;
      tags: string[];
      pkgName: string;
    }>(md);

    file.saveArticleFile(pkgName, `${meta.title}.md`, md);
    file.saveArticleFile(pkgName, `${meta.title}.html`, html);

    return { html, meta };
  }
};

export const genImagePrompt = async () => {
  const messages = [
    {
      role: 'user',
      content: genImagePromptPrompt
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
