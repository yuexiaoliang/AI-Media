import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { localDataToRemoteDataOfNpmPackages, localDataToRemoteDataOfEnglishWords } from './localDataToRemoteData';

import yargs from 'yargs-parser';

// import { publisher as npmPackagesWeixinPublisher } from '@auto-blog/npm-packages';
// import { publisher as typeChallengesPublisher } from '@auto-blog/type-challenges';
// import { start as englishWordsStart } from '@auto-blog/english-words';
// import { setPackageStatus } from '@auto-blog/database/npm-packages';

// localDataToRemoteDataOfNpmPackages();
localDataToRemoteDataOfEnglishWords()

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
