import path from 'path';
import fs from 'fs-extra';
import { file } from '@auto-blog/utils';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 保存 README.md 文件到本地
export function saveReadmeMD(md: string, tsUtil: string) {
  const filepath = path.resolve(__dirname, `./type-challenges/${tsUtil}/README.md`);
  file.saveFile(filepath, md);
}

// 获取 README.md 文件
export function getReadmeMD(tsUtil: string) {
  const filepath = path.resolve(__dirname, `./type-challenges/${tsUtil}/README.md`);
  return file.getFile(filepath);
}

// 保存文章文件到本地
export function saveArticleFile(tsUtil: string, filename: string, content: string) {
  const filepath = path.join(__dirname, `./type-challenges/${tsUtil}/${filename}`);
  file.saveFile(filepath, content);
}

// 获取文章文件
export function getArticleFile(tsUtil: string, filename: string) {
  const filepath = path.resolve(__dirname, `./type-challenges/${tsUtil}/${filename}`);
  return file.getFile(filepath);
}

// 保存图片到本地
export async function saveImageByB64(b64Json: string) {
  const dir = path.join(__dirname, `./html-templates/images/cover-bgs/`);
  return file.saveFileByB64(dir, b64Json);
}

// 随机获取一张封面背景图片
export async function getRandomCoverBgImage() {
  const dir = path.join(__dirname, `./html-templates/images/cover-bgs/`);
  return file.getRandomFile(dir);
}

// 获取封面图片
export function getCover(tsUtil: string) {
  const dir = path.join(__dirname, `./type-challenges/${tsUtil}/`);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  const cover = files.find((file) => /^cover\.(jpg|png|jpeg|webp|gif)$/.test(file));

  if (!cover) return;

  return path.resolve(__dirname, dir, cover);
}