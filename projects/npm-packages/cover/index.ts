import path from 'path';
import url from 'url';
import { defineCoverGeneration } from '@auto-blog/cover';
import { file } from '@auto-blog/utils';
import queryString from 'query-string';

export const generateCover = async (pkgName: string) => {
  const _cover = await file.getCover(pkgName);
  if (_cover) return _cover;

  const savePath = path.resolve(__dirname, `./packages/${pkgName}/cover.png`);

  const generator = defineCoverGeneration(savePath);

  const urlQuery: Record<string, string> = {
    pkgName,
    bgImage: await file.getRandomCoverBgImage()
  };

  const entry = path.resolve(__dirname, `./html-templates/cover.html`);
  let gotoUrl = url.pathToFileURL(entry).href;
  gotoUrl += `?${queryString.stringify(urlQuery)}`;

  await generator(gotoUrl, {
    async pageOpened(page) {
      // 等待页面内的 pkg-name 修改完成
      await page.waitForFunction(
        (expectedValue) => {
          const element = document.querySelector('#cover .pkg-name');
          return element && element.innerHTML === expectedValue;
        },
        {},
        pkgName
      );
    }
  });

  return savePath
};
