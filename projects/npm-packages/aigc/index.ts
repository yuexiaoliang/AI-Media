import html2md from 'html-to-md';
import { AIModel, chat, images } from '@auto-blog/openai';
import { getRandomItem, renderTemplate } from '@auto-blog/utils';
import { mdToWeixin } from '@auto-blog/md-render';

import * as file from '../file';
import genArticlePrompt from './prompts/genArticle.txt';
import genImagePromptPrompt from './prompts/genImagePrompt.txt';
import { NpmPackagesServices } from '@auto-blog/orm';

export const genArticle = async (readme: string, pkgName: string, repositoryUrl: string): Promise<NpmPackagesServices.NpmPackage> => {
  const pkg = await NpmPackagesServices.getNpmPackage(pkgName);

  // 如果生成过文章，则直接返回
  if (pkg && pkg.generatedData) return pkg;
  try {
    const completions = chat.defineCompletions({ model: AIModel.GPT4 });
    const { content } = await completions([
      {
        role: 'user',
        content: renderTemplate(genArticlePrompt, { readme, pkgName, repositoryUrl })
      }
    ]);
    console.log(`🚀 > genArticle > content:`, content);

    const [
      {
        html,
        meta: { title, desc, tags }
      }
    ] = mdToWeixin<{
      title: string;
      desc: string;
      tags: string[];
      pkgName: string;
    }>(content);

    const result = {
      pkg: pkgName,
      generatedData: true,
      title,
      tags,
      description: desc,
      content: html2md(html)
    };

    return await NpmPackagesServices.saveNpmPackage(result);
  } catch (error) {
    throw new Error(`@auto-blog/npm-packages: genArticle: ${error}`);
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
