import path from 'path';
import fs from 'fs-extra';
import { file, getRandomItem } from '@auto-blog/utils';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 随机获取一张封面背景图片
export async function getRandomCoverBgImage() {
  const dir = path.join(__dirname, `./html-templates/images/cover-bgs/`);
  return file.getRandomFile(dir);
}

// 获取封面图片
export function getCover(pkgName: string) {
  const dir = path.join(__dirname, `./packages/${pkgName}/`);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  const cover = files.find((file) => /^cover\.(jpg|png|jpeg|webp|gif)$/.test(file));

  if (!cover) return;

  return path.resolve(__dirname, dir, cover);
}
