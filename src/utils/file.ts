import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import sharp from 'sharp';

export function saveReadmeMD(md: string, pkgName: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);

  fs.ensureDirSync(dir);

  fs.writeFileSync(path.join(dir, `README.md`), md);
}

export function saveArticleFile(filename: string, content: string) {
  const dir = path.join(__dirname, './articles');
  fs.ensureDirSync(dir);
  fs.writeFileSync(path.join(dir, filename), content);
}

export async function saveImageByB64(b64_json: string) {
  const buffer = Buffer.from(b64_json, 'base64');

  // 将 buffer 转换为 md5
  const hash = crypto.createHash('md5').update(buffer);
  const md5 = hash.digest('hex');

  // 将图片保存到本地
  const dir = './images';
  const filepath = path.join(dir, `${md5}.png`);

  fs.ensureDirSync(path.resolve(__dirname, dir));
  await sharp(buffer).withMetadata().toFile(path.resolve(__dirname, filepath));

  return filepath;
}
