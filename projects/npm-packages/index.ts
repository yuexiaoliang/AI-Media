import { npmPackagesDB } from '@auto-blog/database';
import { weixin } from '@auto-blog/platform';
import * as cover from './cover';
import { npm, github } from './libraries';
import * as aigc from './aigc';
import { PublishedPlatforms } from '@auto-blog/database/npm-packages';

export async function publisher(argv: { platform?: PublishedPlatforms; pkg?: string }) {
  const platform: PublishedPlatforms = argv?.platform || 'weixin';
  const pkgName: string = argv?.pkg || '';

  try {
    let pkg: npmPackagesDB.Package | undefined;
    if (pkgName) {
      pkg = await npmPackagesDB.getPackageByName(pkgName);
    }

    if (!pkg) {
      console.log('\n 正在获取 npm 包列表...');
      await npm.collectPackages();

      console.log(`\n 正在获取未发布到 ${platform} 的包...`);
      pkg = await npmPackagesDB.getRandomNotPublishedPkg(platform);
    }
    console.log(`\n 已选择包名：${pkg.name}`);

    if (!pkg.stepsStatus?.gottenBaseInfo) {
      console.log(`\n 正在获取包的基本信息...`);
      pkg = await npm.getPackageInfo(pkg.name);
    }

    console.log('\n 正在采集包的 README...');
    const readme = await github.collectPackageReadme(pkg.name);

    console.log('\n 正在生成文章内容...');
    const { html, meta, md } = await aigc.genArticle(readme, pkg.name, pkg.repository_url!);

    console.log('\n 正在生成缩略图...');
    const coverPath = await cover.generateCover(pkg.name);

    if (platform === 'weixin') {
      console.log('\n 正在上传图片到公众号素材库...');
      const { media_id: thumb_media_id } = await weixin.material.addMaterial(pkg.name, coverPath);

      console.log('\n 正在新增公众号草稿...');
      await weixin.draft.addDraft(pkg.name, { title: meta.title, digest: meta.desc, content: html, thumb_media_id });
    }

    console.log('\n 完成了！');
    return { pkg, html, meta, coverPath, md };
  } catch (error: any) {
    console.log(`Error:`, error);
  }
}
