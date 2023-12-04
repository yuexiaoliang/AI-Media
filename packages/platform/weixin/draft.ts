import createHttp from './http';
import * as database from '@auto-blog/database';

const http = createHttp('draft');

// 获取草稿
export const getDrafts = async () => {
  const { data } = await http.post('batchget', {
    offset: 0,
    count: 1000
  });
  return data;
};

// 新增草稿
export const addDraft = async (pkgName: string, article: any) => {
  const { data } = await http.post('add', {
    articles: [article]
  });

  await database.setPackagePublishedWeixinDraftStatus(pkgName, true);

  return data;
};
