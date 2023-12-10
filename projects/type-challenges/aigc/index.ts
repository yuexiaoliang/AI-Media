import { AIModel, chat } from '@auto-blog/openai';
import { aigcRecordsDB, npmPackagesDB } from '@auto-blog/database';
import { getRandomItem, renderTemplate } from '@auto-blog/utils';
import { mdToWeixin } from '@auto-blog/md-render';

import * as file from '../file';
import genArticlePrompt from './prompts/genArticle.txt';

export const genArticle = async (readme: string, tsUtil: string) => {
  console.log(tsUtil);
  console.log(readme);
  // 如果生成过文章，则需要获取以生成的文章，避免重复请求浪费资源
  // if (await npmPackagesDB.getPackageGeneratedArticleStatus(tsUtil)) {
  //   const history = await aigcRecordsDB.getNpmPackageRecord(tsUtil);
  //   if (history) {
  //     const { title } = history.info;
  //     const md = file.getArticleFile(tsUtil, `${title}.md`);

  //     if (md) {
  //       const { html, meta } = renderAndSave(md);
  //       if (html) {
  //         return { md, html, meta };
  //       } else {
  //         const { html } = renderAndSave(md);
  //         return { md, html, meta };
  //       }
  //     }
  //   }
  // }

  const completions = chat.defineCompletions({model: AIModel.GPT4});
  const { content, completionInfo } = await completions([
    {
      role: 'user',
      content: renderTemplate(genArticlePrompt, { readme, tsUtil })
    }
  ]);

  console.log(`🚀 > file: index.ts:33 > genArticle > content:`, content);

  const { html, meta } = renderAndSave(content);

  // await aigcRecordsDB.setNpmPackageRecord({ tsUtil, title: meta.title }, completionInfo);
  // await npmPackagesDB.setPackageGeneratedArticleStatus(tsUtil, true);

  return { md: content, html, meta };

  function renderAndSave(md: string) {
    const [{ html, meta }] = mdToWeixin<{
      title: string;
      tags: string[];
      effect: string;
      tsUtil: string;
  }>(md);

  file.saveArticleFile(tsUtil, `${meta.title}.md`, md);
  file.saveArticleFile(tsUtil, `${meta.title}.html`, html);

    return { html, meta };
  }
};
