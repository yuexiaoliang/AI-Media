import { AIModel, chat } from '@auto-blog/openai';
import { renderTemplate } from '@auto-blog/utils';
import { mdToHtml } from '@auto-blog/md-render';

import * as file from '../file';
import genArticlePrompt from './prompts/genArticle.txt';

export const genArticle = async (readme: string, tsUtil: string) => {
  console.log(tsUtil);
  console.log(readme);

  const completions = chat.defineCompletions({ model: AIModel.GPT4 });
  const { content } = await completions([
    {
      role: 'user',
      content: renderTemplate(genArticlePrompt, { readme, tsUtil })
    }
  ]);

  console.log(`🚀 > file: index.ts:33 > genArticle > content:`, content);

  const { html, meta } = renderAndSave(content);

  return { md: content, html, meta };

  function renderAndSave(md: string) {
    const [{ html, meta }] = mdToHtml<{
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
