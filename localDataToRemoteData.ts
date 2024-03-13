import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import html2md from 'html-to-md';
import { NpmPackagesServices, EnglishWordsServices } from '@auto-blog/orm';
import { mdToWeixin } from '@auto-blog/md-render';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function localDataToRemoteDataOfEnglishWords() {
  const words = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db/english-words.json'), 'utf-8')).list;
  const data = words.map((item: any) => {
    const { word, xhsPublished, dataGenerated } = item;

    const result: EnglishWordsServices.EnglishWord = {
      word,
      publishedXiaohongshu: xhsPublished
    };

    getDetails(word, result);

    result.generatedData = !!dataGenerated || !!result.content;

    return result;
  });

  const [successRes, errorRes] = await EnglishWordsServices.saveEnglishWords(data);
  console.log(`共 ${data.length} 条数据，成功 ${successRes.length} 条，失败 ${errorRes.length} 条`);

  function getDetails(word: string, result: EnglishWordsServices.EnglishWord) {
    const mdPath = path.resolve(__dirname, `./english-words/${word}/data.json`);
    if (!fs.existsSync(mdPath)) return;

    result.content = JSON.parse(fs.readFileSync(mdPath, 'utf-8'));
  }
}

export async function localDataToRemoteDataOfNpmPackages() {
  const packages = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db/npm-packages.json'), 'utf-8')).packages;
  const data = packages.map((item: any) => {
    const { name, homepage, repository_url, stepsStatus } = item;
    const { generatedArticle, publishedWeixinDraft, publishedJuejin } = stepsStatus || {};

    const result: NpmPackagesServices.NpmPackage = {
      pkg: name,
      homepage,
      repositoryUrl: repository_url,
      publishedWeixin: publishedWeixinDraft,
      publishedJuejin
    };

    getDetails(name, result);

    result.generatedData = !!generatedArticle || !!result.content;

    return result;
  });

  const [successRes, errorRes] = await NpmPackagesServices.saveNpmPackages(data);
  console.log(`共 ${data.length} 条数据，成功 ${successRes.length} 条，失败 ${errorRes.length} 条`);

  function getDetails(pkg: string, result: NpmPackagesServices.NpmPackage) {
    const aigcRecords = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db/aigc-records.json'), 'utf-8')).list;
    const record = aigcRecords.find((item: any) => item?.info?.pkgName === pkg);
    if (!record) return;

    const { title } = record.info;

    const pkgMdPath = path.resolve(__dirname, `./packages/${pkg}/${title}.md`);
    if (!fs.existsSync(pkgMdPath)) return;

    const [{ meta, html }] = mdToWeixin(fs.readFileSync(pkgMdPath, 'utf-8'));

    // @ts-ignore
    const { tags, desc } = meta || {};
    const md = html2md(html);

    result.title = title;
    result.tags = tags;
    result.description = desc;
    result.content = md;
  }
}
