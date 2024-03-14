import { weixin } from '@auto-blog/platform';
import { NpmPackagesServices, CommonTypes, CommonTransforms } from '@auto-blog/orm';
import { mdToHtml } from '@auto-blog/utils';
import { npm, github } from './libraries';
import * as cover from './cover';
import * as aigc from './aigc';

export async function start(args?: { platform?: CommonTypes.PublishedPlatforms; pkg?: string }) {
  const { platform = 'weixin', pkg: _pkg } = args || {};

  let data: NpmPackagesServices.NpmPackage | null = null;

  // 如果指定了包名，则只会获取该包的数据
  // 如果获取不到，则会抛出异常
  if (_pkg) {
    console.log(`\n 正在获取【${platform}】数据...`);
    data = await NpmPackagesServices.getNpmPackage(_pkg);

    if (!data) {
      throw new Error(`没有找到指定包【${_pkg}】的数据！`);
    }
  }

  // 否则，获取未发布到指定平台的包，默认微信
  // 如果获取不到，则会抛出异常
  else {
    console.log(`\n 正在获取未发布到【${platform}】的包...`);
    data = await NpmPackagesServices.getNpmPackageByStatus({ [CommonTransforms.platformToPublishedPlatformStatus(platform)]: false });

    if (!data) {
      throw new Error(`没有找到未发布到【${platform}】的包`);
    }
  }

  const { generatedData, title, pkg, description, content } = data;

  if (!generatedData) {
    data = await generating(pkg);
  }

  console.log('\n 正在生成缩略图...');
  const coverPath = await cover.generateCover(pkg);

  if (platform === 'weixin') {
    console.log('\n 正在上传图片到公众号素材库...');
    const { media_id: thumb_media_id } = await weixin.material.addMaterial(coverPath);

    console.log('\n 正在新增公众号草稿...');
    await weixin.draft.addDraft(pkg, { title, digest: description, content: mdToHtml(content!), thumb_media_id });
  }

  console.log(`###运行完成${JSON.stringify({ name: pkg, title: title, desc: description, cover: coverPath, md: content })}###运行完成`);

  async function generating(pkg: string) {
    console.log(`\n 正在生成【${pkg}】的数据...`);

    console.log(`\n 正在获取包的基本信息...`);
    const data = await npm.getPackageInfo(pkg);

    console.log('\n 正在采集包的 README...');
    const readme = await github.collectPackageReadme(pkg);

    console.log('\n 正在生成文章内容...');
    return await aigc.genArticle(readme, data.pkg, data.repositoryUrl!);
  }
}

export async function setNpmPackageStatus(pkg: string, status: CommonTypes.PublishedPlatforms) {
  return await NpmPackagesServices.saveNpmPackage({
    pkg,
    [CommonTransforms.platformToPublishedPlatformStatus(status)]: true
  });
}
