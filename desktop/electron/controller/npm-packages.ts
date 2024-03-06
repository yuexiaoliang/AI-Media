import path from 'path';
import fs from 'fs-extra';
import { file } from '@auto-blog/utils';
import { getRandomNotPublishedPkg, publishedPlatformsMap } from '@auto-blog/database/npm-packages';
import { getNpmPackageRecord } from '@auto-blog/database/aigc-records';
import { mdToWeixin } from '@auto-blog/md-render';
import html2md from 'html-to-md';

const root = file.getRootDir();

export { getRandomNotPublishedPkg };

export type GetRandomNotPublishedPkg = typeof getRandomNotPublishedPkg;

export const getPublishedPlatformsMap = () => publishedPlatformsMap;
export type GetPublishedPlatformsMap = typeof getPublishedPlatformsMap;

// 获取文章文件
export async function getArticleFile(pkgName: string) {
  try {
    const record = await getNpmPackageRecord(pkgName);
    if (!record) throw new Error('record not found');

    const title = record.info?.title as string;
    if (!title) throw new Error('title is required');

    const filepath = path.resolve(root, `./packages/${pkgName}/${title}.md`);

    const md = file.getFile(filepath);
    if (!md) throw new Error('md file not found');

    const [{ meta, html }] = mdToWeixin<{ title: string; desc: string }>(md);
    if (!html || !meta) throw new Error('html or meta not found');

    let { desc } = meta;
    if (desc.length > 100) {
      desc = desc.slice(0, 100);
    }

    return { name: pkgName, title, desc, cover: getCover(pkgName), md: html2md(html) };
  } catch (error) {
    console.log(`🚀 > getArticleFile > error:`, error);
  }
}
export type GetArticleFile = typeof getArticleFile;

// 获取封面图片
export function getCover(pkgName: string) {
  const dir = path.join(root, `./packages/${pkgName}/`);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  const cover = files.find((file) => /^cover\.(jpg|png|jpeg|webp|gif)$/.test(file));

  if (!cover) return;

  return path.resolve(root, dir, cover);
}
export type GetCover = typeof getCover;
