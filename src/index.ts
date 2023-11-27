import 'dotenv/config';
import { npm, github } from '@libraries';
import fs from 'fs-extra';
import path from 'path';
import { images, chat, AIModel } from '@openai';
import * as database from '@database';
import { weixin } from '@publishers';
import { mdToWeixin } from '@md-renders';
import { file } from '@utils';

(async () => {
  weixinPublisher();
})();

async function weixinPublisher() {
  try {
    console.log('\n 正在获取 npm 包列表...');
    // await npm.collectPackages('weixin');

    // 获取未发布到微信公众号的包
    console.log('\n 正在获取未发布到微信公众号的包...');
    // let pkg = await database.getRandomNotPublishedWeixinDraft();
    const pkg = {
      name: 'har-schema',
      stepsStatus: {
        gottenBaseInfo: true
      }
    }

    if (!pkg.stepsStatus?.gottenBaseInfo) {
      console.log(`\n 正在获取包的基本信息...`);
      // pkg = await npm.getPackageInfo(pkg.name);
    }

    console.log('\n 正在采集包的 README...');
    const readme = await github.collectPackageReadme(pkg.name);

    console.log('\n 正在生成文章内容...');
    const { md: article, html, meta } = await chat.genArticleV2(readme, pkg.name);

    // --------------
    // return;
    // console.log('\n 正在生成文章内容...');
    // const content = await chat.genAndSaveArticle(pkg, AIModel.GPT3);
    // if (!content) return;
    // // 解析 Markdown
    // const [{ html, meta }] = mdToWeixin<{
    //   title: string;
    //   desc: string;
    //   tags: string[];
    //   pkgName: string;
    // }>(content);
    // console.log('\n 正在保存文章文件...');
    // saveArticleFile(`${meta.title}.md`, content);
    // saveArticleFile(`${meta.title}.html`, html);
    // console.log('\n 正在生成图片 Prompt...');
    // const imgPrompt = await chat.genImagePrompt();
    // console.log('\n 正在生成图片...');
    // const imgPath = await images.genAndSaveImage(imgPrompt);
    // console.log('\n 正在上传图片到公众号素材库...');
    // const { media_id: thumb_media_id } = await weixin.material.addMaterial(imgPath);
    // console.log('\n 正在新增公众号草稿...');
    // const { media_id } = await weixin.draft.addDraft([{ title: meta.title, digest: meta.desc, content: html, thumb_media_id }]);
    // // 设置包的发布状态
    // await database.setPackagePublished(pkg.name);
    // if (whetherPublish) {
    //   console.log('\n 正在发布公众号文章...');
    //   const { publish_id } = await weixin.freepublish.submitDraft(media_id);
    //   // 轮询获取发布结果
    //   const result = await weixin.freepublish.pollPublishResult(publish_id, media_id);
    //   console.log(`\n ${result}`);
    // }
    // console.log('\n 完成了！');
  } catch (error: any) {
    console.log(`Error:`, error.message);
  }
}
