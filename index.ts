import 'reflect-metadata';
import 'dotenv/config';
import yargs from 'yargs-parser';
import sourceMapSupport from 'source-map-support';

import { start as typeChallengesStart } from '@auto-blog/type-challenges';
import { start as npmPackagesStart, setNpmPackageStatus } from '@auto-blog/npm-packages';
import { start as englishWordsStart, setEnglishWordStatus } from '@auto-blog/english-words';

sourceMapSupport.install();

type FunctionsNames = keyof typeof functions;

const functions = {
  npmPackagesStart,
  setNpmPackageStatus,

  englishWordsStart,
  setEnglishWordStatus,

  typeChallengesStart
};

const argv = yargs(process.argv.slice(2)) as Argv<FunctionsNames>;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * 通过命令行执行函数
 *
 * 无参数的
 * --fn setEnglishWordStatus
 * setEnglishWordStatus()
 *
 * 字符串参数
 * --fn setEnglishWordStatus --args able
 * setEnglishWordStatus('able')
 *
 * 多个字符串参数
 * --fn setEnglishWordStatus --args able --args weixin
 * setEnglishWordStatus('able', 'weixin)
 *
 * 对象参数
 * --fn setEnglishWordStatus --args.word=able --args.platform=weixin
 * setEnglishWordStatus({ word: 'able', platform: 'weixin' })
 */
async function main() {
  if (!argv?.fn) return;

  if (!functions[argv.fn]) {
    throw new Error(`Main.js: Function "${argv.fn}" not found`);
  }

  let _args = argv.args;

  if (Array.isArray(argv.args)) {
    // @ts-ignore
    await functions[argv.fn](...argv.args);
  } else {
    // @ts-ignore
    await functions[argv.fn](_args);
  }

  console.log('Done!');
}
