import html2md from 'html-to-md';
import { AIModel, chat } from '@auto-blog/openai';
import { renderTemplate } from '@auto-blog/utils';
import { mdToHtml } from '@auto-blog/md-render';

import genArticlePrompt from './prompts/genArticle.txt';
import { NpmPackagesServices } from '@auto-blog/orm';

export const genArticle = async (readme: string, pkgName: string, repositoryUrl: string): Promise<NpmPackagesServices.NpmPackage> => {
  const pkg = await NpmPackagesServices.getNpmPackage(pkgName);

  // 如果生成过文章，则直接返回
  if (pkg && pkg.generatedData) return pkg;
  try {
    const completions = chat.defineCompletions({ model: AIModel.GPT4, response_format: { type: 'json_object' } });
    const { content } = await completions([
      {
        role: 'system',
        content: renderTemplate(genArticlePrompt, {
          pkgName,
          repositoryUrl,
          example: JSON.stringify({
            title: '文章标题',
            description: '文章描述',
            tags: ['标签1', '标签2', '标签3'],
            markdown: `文章正文...`
          })
        })
      },
      {
        role: 'user',
        content: `## 包名：${pkgName}

## 仓库地址：${repositoryUrl}

## README：
\`\`\`markdown
${readme}
\`\`\``
      }
    ]);

    const data = JSON.parse(content);

    const [{ html }] = mdToHtml(data.markdown);

    const result = {
      pkg: pkgName,
      generatedData: true,
      title: data.title,
      tags: data.tags,
      description: data.description,
      content: html2md(html)
    };

    return await NpmPackagesServices.saveNpmPackage(result);
  } catch (error) {
    throw new Error(`@auto-blog/npm-packages：genArticle -> ${error}`);
  }
};
