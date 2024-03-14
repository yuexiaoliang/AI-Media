import * as cheerio from 'cheerio';
import constants from '@auto-blog/constants';
import httpsGet from '@auto-blog/utils/httpsGet';
import { NpmPackagesServices } from '@auto-blog/orm';

// 采集包列表
export const collectPackages = async () => {
  const params = {
    page: 13,
    platforms: 'npm',
    sort: 'dependent_repos_count',
    order: 'desc'
  };
  console.log(`🚀 > collectPackages > params:`, params);

  try {
    const html = await httpsGet('https://libraries.io/search', { params });

    const packages: NpmPackagesServices.NpmPackage[] = [];

    const $ = cheerio.load(html);
    const $projects = $('.project');
    if ($projects.length) {
      $projects.each((_, item) => {
        const name = $(item).find('h5 a').text();

        packages.push({ pkg: name });
      });

      return await NpmPackagesServices.saveNpmPackages(packages);
    }
  } catch (err: any) {
    if (err?.isAxiosError) {
      throw new Error(`@auto-blog/libraries: Request [${err!.request.res.responseUrl}] returned a status code of ${err.response.status}.`);
    }
    throw new Error(`@auto-blog/libraries: ${err}`);
  }
};

// 获取包的基本信息
export async function getPackageInfo(pkgName: string) {
  const { repository_url, homepage } = (await httpsGet(`https://libraries.io/api/npm/${pkgName}`, { params: { api_key: constants.LIBRARIES_API_KEY } })) as Record<string, any>;

  if (!repository_url) {
    throw new Error(`@auto-blog/libraries: package [${pkgName}] not found`);
  }

  const pkg: NpmPackagesServices.NpmPackage = {
    pkg: pkgName,
    homepage,
    repositoryUrl: repository_url
  };

  return await NpmPackagesServices.saveNpmPackage(pkg);
}
