import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import sharp from 'sharp';
import createHttp from './http';
import { genImagePrompt } from './chat';
import { randomItem } from '@utils';

const http = createHttp('images');

export async function generateImages() {
  const prompt = await genImagePrompt();

  console.log('\n 正在生成图片...');

  const res = await http.post(`generations`, {
    model: 'dall-e-3',
    size: '1792x1024',
    response_format: 'b64_json',
    prompt,
    style: randomItem(['vivid', 'natural']),
    n: 1
  });

  const { data } = res;
  const [{ b64_json }] = data;

  const buffer = Buffer.from(b64_json, 'base64');

  // 将 buffer 转换为 md5
  const hash = crypto.createHash('md5').update(buffer);
  const md5 = hash.digest('hex');

  // 将图片保存到本地
  const dir = path.join(__dirname, '../images');
  const file = path.join(dir, `${md5}.png`);
  fs.ensureDirSync(dir);
  await sharp(buffer).withMetadata().toFile(path.resolve(dir, file));

  return file;
}
