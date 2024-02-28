import * as cheerio from 'cheerio';
import constants from '@auto-blog/constants';
import { npmPackagesDB } from '@auto-blog/database';
import httpsGet from '@auto-blog/utils/httpsGet';

// 采集包列表
export const collectPackages = async () => {
  const [db, data] = await npmPackagesDB.openDatabase();

  const notPublished = await npmPackagesDB.getNotGottenBaseInfoPackages();

  if (data.pageNumber && notPublished.length >= 30) return data.packages;

  const params = {
    page: data.pageNumber + 1,
    platforms: 'npm',
    sort: 'dependent_repos_count',
    order: 'desc'
  };

  try {
    const html = await httpsGet('https://libraries.io/search', { params });

    const projects: npmPackagesDB.DBPackages = [];

    const $ = cheerio.load(html);
    const $projects = $('.project');
    if ($projects.length) {
      $projects.each((_, item) => {
        const name = $(item).find('h5 a').text();
        const finded = data.packages.find(({ name: _name }) => _name === name);
        if (finded) return;

        projects.push({
          name,
          stepsStatus: {
            gottenBaseInfo: false,
            collectedGuide: false,
            generatedArticle: false,
            publishedWeixinDraft: false,
            publishedGithub: false
          }
        });
      });
      data.packages = [...data.packages, ...projects];
      data.pageNumber += 1;

      db.write();
    }
  } catch (err: any) {
    if (err?.isAxiosError) {
      console.error(`@auto-blog/libraries: Request [${err!.request.res.responseUrl}] returned a status code of ${err.response.status}.`);
    }
  }

  return data.packages;
};

// 获取包的基本信息
export async function getPackageInfo(pkgName: string) {
  const { repository_url, homepage } = (await httpsGet(`https://libraries.io/api/npm/${pkgName}`, { params: { api_key: constants.LIBRARIES_API_KEY } })) as Record<string, any>;

  if (!repository_url) {
    throw new Error(`@auto-blog/libraries: package [${pkgName}] not found`);
  }

  const pkg: npmPackagesDB.Package = {
    name: pkgName,
    homepage,
    repository_url,
    stepsStatus: {
      gottenBaseInfo: true,
      collectedGuide: false,
      generatedArticle: false,
      publishedWeixinDraft: false,
      publishedGithub: false
    }
  };

  await npmPackagesDB.replaceOrInsertPackage(pkg);

  return pkg;
}
