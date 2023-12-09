import { AIModel, chat, images } from '@auto-blog/openai';
import { aigcRecordsDB, npmPackagesDB } from '@auto-blog/database';
import { getRandomItem, renderTemplate } from '@auto-blog/utils';
import { mdToWeixin } from '@auto-blog/md-render';

import * as file from '../file';
import genArticlePrompt from './prompts/genArticle.txt';
import genImagePromptPrompt from './prompts/genImagePrompt.txt';

export const genArticle = async (readme: string, pkgName: string) => {
  // 如果生成过文章，则需要获取以生成的文章，避免重复请求浪费资源
  if (await npmPackagesDB.getPackageGeneratedArticleStatus(pkgName)) {
    const history = await aigcRecordsDB.getNpmPackageRecord(pkgName);
    if (history) {
      const { title } = history.info;
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

  const completions = chat.defineCompletions({ model: AIModel.GPT4 });
  const { content, completionInfo } = await completions([
    {
      role: 'user',
      content: renderTemplate(genArticlePrompt, { readme, pkgName })
    }
  ]);

  const { html, meta } = renderAndSave(content);

  await aigcRecordsDB.setNpmPackageRecord({ pkgName, title: meta.title }, completionInfo);
  await npmPackagesDB.setPackageGeneratedArticleStatus(pkgName, true);

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
  const completions = chat.defineCompletions({
    temperature: 0.7,
    top_p: 0.9
  });

  const { content } = await completions([
    {
      role: 'user',
      content: genImagePromptPrompt
    }
  ]);

  return content;
};

export const genArticleBgImage = async () => {
  const prompt = await genImagePrompt();

  const generator = images.defineImagesGenerations({
    model: 'dall-e-3',
    size: '1792x1024',
    style: getRandomItem(['vivid', 'natural'])
  });

  const { b64_json } = await generator(prompt);

  const filepath = file.saveImageByB64(b64_json);

  return filepath;
};
