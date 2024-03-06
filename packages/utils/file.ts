import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { getRandomItem } from './index';

export function getRootDir(isDist = true) {
  const cwd = process.cwd();
  const root = path.resolve(cwd.split('auto-blog')[0], 'auto-blog');

  if (isDist) return path.resolve(root, 'dist');

  return root;
}

// 保存文件到本地
export function saveFile(filepath: string, content: string | NodeJS.ArrayBufferView) {
  const dir = path.dirname(filepath);
  fs.ensureDirSync(dir);

  fs.writeFileSync(filepath, content);
}

// 保存 b64json 文件到本地
export async function saveFileByB64(dirpath: string, b64Json: string, filename?: string) {
  const buffer = Buffer.from(b64Json, 'base64');

  // 获取文件类型
  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    throw new Error('保存文件到本地时，获取文件类型失败');
  }

  const name = filename || crypto.createHash('md5').update(buffer).digest('hex');
  const filepath = path.resolve(dirpath, `${name}.${type.ext}`);

  saveFile(filepath, buffer);

  return filepath;
}

// 获取文件
export function getFile(filepath: string) {
  if (!fs.existsSync(filepath)) return;
  return fs.readFileSync(filepath, 'utf-8');
}

// 获取文件夹下的所有文件
export function getFiles(dirpath: string) {
  if (!fs.existsSync(dirpath)) return;
  return fs.readdirSync(dirpath);
}

// 随机文件夹下的一个文件
export function getRandomFile(dirpath: string) {
  const files = getFiles(dirpath);
  if (!files) return;

  return getRandomItem(files);
}

// 删除文件夹
export function removeDir(dirpath: string) {
  if (!fs.existsSync(dirpath)) return;
  fs.removeSync(dirpath);
}
