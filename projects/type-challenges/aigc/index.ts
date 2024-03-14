import { AIModel, chat } from '@auto-blog/openai';
import { renderTemplate } from '@auto-blog/utils';
import { mdToHtml } from '@auto-blog/md-render';

import genArticlePrompt from './prompts/genArticle.txt';

export const genArticle = async (readme: string, tsUtil: string) => {
  const completions = chat.defineCompletions({ model: AIModel.GPT4 });
  const { content } = await completions([
    {
      role: 'user',
      content: renderTemplate(genArticlePrompt, { readme, tsUtil })
    }
  ]);

  const html = mdToHtml(content);

  return { md: content, html };
};
