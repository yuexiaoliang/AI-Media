import path from 'path';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';

export interface CoverGenerationOptions {
  pageOpened?: (page: Page) => void | Promise<void>;
}

export function defineCoverGeneration(savePath: string) {
  return async (gotoUrl: string, options: CoverGenerationOptions = {}) => {
    const { pageOpened } = options;

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(gotoUrl);

    if (typeof pageOpened === 'function') {
      await pageOpened(page);
    }

    // 等待元素加载完成
    await page.waitForSelector('#cover');

    // 获取元素的句柄
    const element = await page.$('#cover');
    if (!element) {
      throw new Error('没有找到元素');
    }

    fs.ensureDirSync(path.dirname(savePath));
    // 对元素进行截图
    await element.screenshot({ path: savePath });

    // 关闭浏览器
    await browser.close();

    return savePath;
  };
}
