import 'reflect-metadata';
import 'dotenv/config';
import yargs from 'yargs-parser';
import sourceMapSupport from 'source-map-support';

import { start as startType } from '@auto-blog/type-challenges';
import { start as startNpm, setNpmPackageStatus as setNpmStatus, setNpmPackagePlatformStatus as setNpmPlatformStatus } from '@auto-blog/npm-packages';
import { start as startWord, setEnglishWordStatus as setWordStatus, setEnglishWordPlatformStatus as setWordPlatformStatus } from '@auto-blog/english-words';
import { start as startHoroscope } from '@auto-blog/horoscopes';

import { qianwen, moonshot , Types as AiTypes } from '@auto-blog/ai';

sourceMapSupport.install();

type MethodsNames = keyof typeof methods;
type MethodsParams = Parameters<(typeof methods)[MethodsNames]>;

const dev = async () => {
  const completions = moonshot.defineCompletions();

  const { content } = await completions([
    {
      role: 'system',
      content: '你是一个翻译家，尤其擅长英文和中文的相互翻译。你需要将用户发你的内容进行中英互译。'
    },
    {
      role: 'user',
      content: 'projects'
    }
  ]);

  console.log(`🚀 > dev > content:`, content);
};

const methods = {
  dev,
  startNpm,
  setNpmStatus,
  setNpmPlatformStatus,

  startWord,
  setWordStatus,
  setWordPlatformStatus,

  startHoroscope,

  startType
};

const argv = (yargs(process.argv.slice(2)) as Argv<MethodsNames, MethodsParams>) || {};

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
  const { fn: fnName, args } = argv;
  if (!fnName) return;

  const method = methods[fnName];

  if (!method) {
    throw new Error(`Main.js: Method "${fnName}" not found`);
  }

  if (Array.isArray(args)) {
    // @ts-ignore
    await method(...args);
  } else {
    // @ts-ignore
    await method(args);
  }

  process.exit(0);
}
