import { weixin } from '@auto-blog/platform';
import * as cover from './cover';
import { npm, github } from './libraries';
import * as aigc from './aigc';
import { NpmPackagesServices, CommonTypes, CommonTransforms } from '@auto-blog/orm';
import { mdToHtml } from '@auto-blog/utils';

export async function start(argv: Argv) {
  const platform: CommonTypes.PublishedPlatforms = argv?.platform || 'weixin';
  const pkgName: string = argv?.pkg || '';

  try {
    let data: NpmPackagesServices.NpmPackage | null = null;

    if (pkgName) {
      data = await NpmPackagesServices.getNpmPackage(pkgName);
    }

    if (!data) {
      console.log('\n 正在获取 npm 包列表...');
      await npm.collectPackages();

      console.log(`\n 正在获取未发布到 ${platform} 的包...`);
      data = await NpmPackagesServices.getNpmPackageByStatus({ [CommonTransforms.platformToPublishedPlatformStatus(platform)]: false });
    }
    if (!data) {
      throw new Error('没有找到未发布的包');
    }

    console.log(`\n 已选择包名：${data.pkg}`);

    if (!data.generatedData) {
      console.log(`\n 正在获取包的基本信息...`);
      data = await npm.getPackageInfo(data.pkg);

      console.log('\n 正在采集包的 README...');
      const readme = await github.collectPackageReadme(data.pkg);

      console.log('\n 正在生成文章内容...');
      data = await aigc.genArticle(readme, data.pkg, data.repositoryUrl!);
    }

    console.log('\n 正在生成缩略图...');
    const coverPath = await cover.generateCover(data.pkg);

    if (platform === 'weixin') {
      console.log('\n 正在上传图片到公众号素材库...');
      const { media_id: thumb_media_id } = await weixin.material.addMaterial(coverPath);

      console.log('\n 正在新增公众号草稿...');
      await weixin.draft.addDraft(data.pkg, { title: data.title, digest: data.description, content: mdToHtml(data.content!), thumb_media_id });
    }

    console.log('\n 完成了！');

    console.log(`###运行完成${JSON.stringify({ name: data.pkg, title: data.title, desc: data.description, cover: coverPath, md: data.content })}###运行完成`);
  } catch (error: any) {
    throw error;
  }
}

export async function setNpmPackageStatus(pkg: string, status: CommonTypes.PublishedPlatforms) {
  return await NpmPackagesServices.saveNpmPackage({
    pkg,
    [CommonTransforms.platformToPublishedPlatformStatus(status)]: true
  });
}
