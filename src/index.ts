import 'dotenv/config';
import { npm, github } from '@libraries';
import { chat } from '@openai';
import * as database from '@database';
import { weixin } from '@publishers';
import * as cover from '@cover';

(async () => {
  weixinPublisher();
})();

async function weixinPublisher() {
  try {
    console.log('\n 正在获取 npm 包列表...');
    await npm.collectPackages();

    // 获取未发布到微信公众号的包
    console.log('\n 正在获取未发布到微信公众号的包...');
    let pkg = await database.getRandomNotPublishedWeixinDraft();

    console.log(`\n 已选择包名：${pkg.name}`);

    if (!pkg.stepsStatus?.gottenBaseInfo) {
      console.log(`\n 正在获取包的基本信息...`);
      pkg = await npm.getPackageInfo(pkg.name);
    }

    console.log('\n 正在采集包的 README...');
    const readme = await github.collectPackageReadme(pkg.name);

    console.log('\n 正在生成文章内容...');
    const { html, meta } = await chat.genArticle(readme, pkg.name);

    console.log('\n 正在生成缩略图...');
    const coverPath = await cover.generateCover(pkg.name);

    console.log('\n 正在上传图片到公众号素材库...');
    const { media_id: thumb_media_id } = await weixin.material.addMaterial(pkg.name, coverPath);

    console.log('\n 正在新增公众号草稿...');
    await weixin.draft.addDraft(pkg.name, { title: meta.title, digest: meta.desc, content: html, thumb_media_id });

    console.log('\n 完成了！');
  } catch (error: any) {
    console.log(`Error:`, error);
  }
}
