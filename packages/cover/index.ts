import url from 'url';
import path from 'path';
import fs from 'fs-extra'
import puppeteer from 'puppeteer';
import queryString from 'query-string';
import { file } from '@auto-blog/utils';

export async function generateCover(pkgName: string) {
  const _cover = await file.getCover(pkgName)
  if (_cover) {
    return _cover
  }

  const urlQuery: Record<string, string> = {
    pkgName,
    bgImage: await file.getRandomCoverBgImage()
  };

  const entry = path.resolve(__dirname, `./html-templates/cover.html`);
  let gotoUrl = url.pathToFileURL(entry).href;
  gotoUrl += `?${queryString.stringify(urlQuery)}`;

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto(gotoUrl);

  // 等待元素加载完成
  await page.waitForSelector('.cover');

  // 获取元素的句柄
  const element = await page.$('.cover');
  if (!element) {
    throw new Error('没有找到元素');
  }

  // 等待页面内的 pkg-name 修改完成
  await page.waitForFunction(
    (expectedValue) => {
      const element = document.querySelector('.cover .pkg-name');
      return element && element.innerHTML === expectedValue;
    },
    {},
    pkgName
  );

  // 对元素进行截图
  const dir = path.resolve(__dirname, `./packages/${pkgName}/`);
  fs.ensureDirSync(dir);

  const coverPath = path.resolve(dir, `cover.png`);
  await element.screenshot({ path: coverPath });

  // 关闭浏览器
  await browser.close();

  return coverPath;
}
