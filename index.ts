import 'dotenv/config';
import yargs from 'yargs-parser';

import { publisher as npmPackagesWeixinPublisher } from '@auto-blog/npm-packages';
import { publisher as typeChallengesPublisher } from '@auto-blog/type-challenges';
import { start as englishWordsStart } from '@auto-blog/english-words';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const argv = yargs(process.argv.slice(2));
  const project = argv?.p;

  const projectsMap = {
    'npm-packages': npmPackagesWeixinPublisher,
    'type-challenges': typeChallengesPublisher,
    'english-words': englishWordsStart
  };

  if (!project || !projectsMap[project]) {
    throw new Error('❌ > project not found');
  }

  try {
    await projectsMap[project](argv);
  } catch (error) {
    throw new Error(error);
  }
}
