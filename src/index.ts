import 'dotenv/config';
import path from 'path';
import { npm } from '@libraries';
import { images, chat, AIModel } from '@openai';
import { setPackagePublished } from '@database';
import { weixin } from '@publishers';

(async () => {
  try {
    // 获取包信息
    const pkg = await npm.getPackage();
    if (!pkg) return;

    // 生成文章
    const content = await chat.genArticle(pkg, AIModel.GPT3);
    if (!content) return;

    // 发布公众号草稿
    const { media_id } = await weixin.draft.addDraft(content, pkg);

    // 发布公众号文章
    // await weixin.freepublish.submitDraft(media_id);

    // 设置包的发布状态
    await setPackagePublished(pkg.name);
  } catch (error) {
    console.log(`🚀 > file: index.ts:18 > error:`, error);
  }
})();
