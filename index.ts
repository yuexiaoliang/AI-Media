import 'dotenv/config';
import yargs from 'yargs-parser';

import { publisher as npmPackagesWeixinPublisher } from '@auto-blog/npm-packages';
import { publisher as typeChallengesPublisher } from '@auto-blog/type-challenges';
import { publisher as englishWordsPublisher } from '@auto-blog/english-words';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const argv = yargs(process.argv.slice(2));
  const platform = argv?.p;

  const platformMap = {
    'npm-packages': npmPackagesWeixinPublisher,
    'type-challenges': typeChallengesPublisher,
    'english-words': englishWordsPublisher
  };

  if (!platform || !platformMap[platform]) {
    throw new Error('❌ > platform not found');
  }

  try {
    await platformMap[platform](argv);
  } catch (error) {
    throw new Error(error);
  }
}
