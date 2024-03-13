import path from 'path';
import { file } from '@auto-blog/utils';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 保存文章文件到本地
export function saveArticleFile(tsUtil: string, filename: string, content: string) {
  const filepath = path.join(__dirname, `./type-challenges/${tsUtil}/${filename}`);
  file.saveFile(filepath, content);
}
