import fs from 'fs-extra';
import path from 'path';
import { DBPackage, setPackagePublished } from '@database';
import { images } from '@openai';
import { mdToWeixin } from '@md-renders';
import { addMaterial } from './material';
import createHttp from './http';

const http = createHttp('draft');

export interface Meta {
  title: string;
  desc: string;
  tags: string[];
  pkgName: string;
}

// 获取草稿
export const getDrafts = async () => {
  const { data } = await http.post('batchget', {
    offset: 0,
    count: 1000
  });
  return data;
};

// 更新草稿
export const updateDraft = async (mdStr: string, mediaId: string) => {
  const [{ html, meta }] = mdToWeixin<Meta>(mdStr);

  const { data } = await http.post('update', {
    media_id: mediaId,
    articles: {
      title: meta.title,
      digest: meta.desc,
      content: html,
      thumb_media_id: ''
    }
  });

  return { data };
};

// 新增草稿
export const addDraft = async (mdStr: string, pkg: DBPackage) => {
  const imgPath = await images.generateImages();

  const { media_id: thumb_media_id } = await addMaterial(imgPath);

  console.log('\n 正在新增草稿...');
  const [{ html, meta }] = mdToWeixin<Meta>(mdStr);
  const { data } = await http.post('add', {
    articles: [
      {
        title: meta.title,
        digest: meta.desc,
        content: html,
        thumb_media_id
      }
    ]
  });

  const dir = path.join(__dirname, '../articles');
  fs.ensureDirSync(dir);
  fs.writeFileSync(path.join(dir, `${meta.title}.md`), mdStr);

  return data;
};
