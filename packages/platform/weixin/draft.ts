import { NpmPackagesServices } from '@auto-blog/orm';
import createHttp from './http';

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

  await NpmPackagesServices.saveNpmPackage({ pkg: pkgName, publishedWeixin: true });

  return data;
};
