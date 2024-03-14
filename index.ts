import 'reflect-metadata';
import 'dotenv/config';
import yargs from 'yargs-parser';
import sourceMapSupport from 'source-map-support';

import { start as startType } from '@auto-blog/type-challenges';
import { start as startNpm, setNpmPackageStatus as setNpmStatus } from '@auto-blog/npm-packages';
import { start as startWord, setEnglishWordStatus as setWordStatus } from '@auto-blog/english-words';

sourceMapSupport.install();

type MethodsNames = keyof typeof methods;

const methods = {
  startNpm,
  setNpmStatus,

  startWord,
  setWordStatus,

  startType
};

const argv = yargs(process.argv.slice(2)) as Argv<MethodsNames>;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * 通过命令行执行函数
 *
 * 无参数的
 * --fn setNpmStatus
 * setNpmStatus()
 *
 * 字符串参数
 * --fn setNpmStatus --args able
 * setNpmStatus('able')
 *
 * 多个字符串参数
 * --fn setNpmStatus --args able --args weixin
 * setNpmStatus('able', 'weixin)
 *
 * 对象参数
 * --fn setNpmStatus --args.word=able --args.platform=weixin
 * setNpmStatus({ word: 'able', platform: 'weixin' })
 */
async function main() {
  if (!argv?.fn) return;

  if (!methods[argv.fn]) {
    throw new Error(`Main.js: Function "${argv.fn}" not found`);
  }

  let _args = argv.args;

  if (Array.isArray(argv.args)) {
    // @ts-ignore
    await methods[argv.fn](...argv.args);
  } else {
    // @ts-ignore
    await methods[argv.fn](_args);
  }

  console.log('Done!');
}
