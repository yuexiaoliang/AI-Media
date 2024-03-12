import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

import html2md from 'html-to-md';

import yargs from 'yargs-parser';

// import { publisher as npmPackagesWeixinPublisher } from '@auto-blog/npm-packages';
// import { publisher as typeChallengesPublisher } from '@auto-blog/type-challenges';
// import { start as englishWordsStart } from '@auto-blog/english-words';
// import { setPackageStatus } from '@auto-blog/database/npm-packages';

import { mdToWeixin } from '@auto-blog/md-render';

import { saveNpmPackages } from '@auto-blog/orm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function localDataToRemoteDataOfNpmPackages() {
  const packages = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db/npm-packages.json'), 'utf-8')).packages;
  const data = packages.map((item: any) => {
    const { name, homepage, repository_url, stepsStatus } = item;
    const { generatedArticle, publishedWeixinDraft, publishedJuejin } = stepsStatus || {};

    const result = {
      pkg: name,
      homepage,
      repositoryUrl: repository_url,
      generatedData: generatedArticle,
      publishedWeixin: publishedWeixinDraft,
      publishedJuejin
    };

    getDetails(name, result);

    return result;
  });

  const [successRes, errorRes] = await saveNpmPackages(data);
  console.log(`共 ${data.length} 条数据，成功 ${successRes.length} 条，失败 ${errorRes.length} 条`);

  function getDetails(pkg: string, result: any) {
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
localDataToRemoteDataOfNpmPackages();

// saveNpmPackages([
//   {
//     pkg: 'isarray',
//     title: '阿珂就不看就不看就',
//     tags: ['abc', 'array']
//   },
//   {
//     pkg: 'isarray1',
//     tags: ['def', 'array']
//   },
//   {
//     pkg: 'isarray2',
//     tags: ['array']
//   }
// ]).then(([success, error]) => {
//   console.log('success:', success);
//   console.log('error:', error);
// });

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });

// async function main() {
//   const argv = yargs(process.argv.slice(2));
//   const { setPublished, p: project, pkg } = argv;

//   // 设置包的发布状态
//   if (project === 'npm-packages' && setPublished && pkg) {
//     const key = {
//       juejin: 'publishedJuejin',
//       weixin: 'publishedWeixinDraft',
//       github: 'publishedGithub',
//       xiaohongshu: 'publishedXiaohongshu',
//       zhihu: 'publishedZhihu'
//     }[setPublished];
//     await setPackageStatus(pkg, key, true);
//     return;
//   }

//   const projectsMap = {
//     'npm-packages': npmPackagesWeixinPublisher,
//     'type-challenges': typeChallengesPublisher,
//     'english-words': englishWordsStart
//   };

//   if (!project || !projectsMap[project]) {
//     throw new Error('❌ > project not found');
//   }

//   try {
//     await projectsMap[project](argv);
//   } catch (error) {
//     throw new Error(error);
//   }
// }
