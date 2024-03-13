import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { localDataToRemoteDataOfNpmPackages, localDataToRemoteDataOfEnglishWords } from './localDataToRemoteData';
import { NpmPackagesServices, EnglishWordsServices } from '@auto-blog/orm';

import yargs from 'yargs-parser';

import { publisher as npmPackagesWeixinPublisher } from '@auto-blog/npm-packages';
import { publisher as typeChallengesPublisher } from '@auto-blog/type-challenges';
import { start as englishWordsStart } from '@auto-blog/english-words';
import { platformToPublishedPlatformStatus } from '@auto-blog/orm/common/transforms';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const argv = yargs(process.argv.slice(2)) as Argv;
  const { setPublished, p: project, pkg } = argv;

  // 设置包的发布状态
  if (project === 'npm-packages' && setPublished && pkg) {
    await NpmPackagesServices.saveNpmPackage({
      pkg,
      [platformToPublishedPlatformStatus(setPublished)]: true
    });
    return;
  }

  const projectsMap = {
    'npm-packages': npmPackagesWeixinPublisher,
    'type-challenges': typeChallengesPublisher,
    'english-words': englishWordsStart
  };

  if (!project || !projectsMap[project]) {
    throw new Error('❌ > project not found');
  }

  await projectsMap[project](argv);
}
