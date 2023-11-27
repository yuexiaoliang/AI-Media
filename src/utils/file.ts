import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

// 保存 README.md 文件到本地
export function saveReadmeMD(md: string, pkgName: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);

  fs.ensureDirSync(dir);

  fs.writeFileSync(path.join(dir, `README.md`), md);
}

// 获取 README.md 文件
export function getReadmeMD(pkgName: string) {
  const file = path.join(__dirname, `./packages/${pkgName}/README.md`);

  if (!fs.existsSync(file)) return;
  return fs.readFileSync(file, 'utf-8');
}

// 获取文章文件
export function getArticleFile(pkgName: string, filename: string) {
  const file = path.join(__dirname, `./packages/${pkgName}/${filename}`);

  if (!fs.existsSync(file)) return;
  return fs.readFileSync(file, 'utf-8');
}

// 保存文章文件到本地
export function saveArticleFile(pkgName: string, filename: string, content: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);

  fs.ensureDirSync(dir);
  fs.writeFileSync(path.join(dir, filename), content);
}

export function getCover(pkgName: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);

  const files = fs.readdirSync(dir);
  const cover = files.find((file) => /^cover\.(jpg|png|jpeg|webp|gif)$/.test(file));

  if (!cover) return;

  return path.resolve(__dirname, dir, cover);
}

// 保存图片到本地
export async function saveImageByB64(pkgName: string, b64Json: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);
  const buffer = Buffer.from(b64Json, 'base64');

  // 获取文件类型
  const type = await fileTypeFromBuffer(buffer);
  console.log(`🚀 > file: file.ts:58 > saveImageByB64 > type:`, type);
  if (!type) {
    throw new Error('@utils/file.ts: 保存图片到本地时，获取文件类型失败');
  }

  const filepath = path.resolve(dir, `cover.png`);

  fs.ensureDirSync(path.resolve(__dirname, dir));
  await sharp(buffer).withMetadata().toFile(filepath);

  return filepath;
}
