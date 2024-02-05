import https from 'https';
import path from 'path';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';
import { defineLogStr, file, getRandomItem, renderTemplate } from '@auto-blog/utils';
import { AIModel, chat, images } from '@auto-blog/openai';

import genDataPrompt from './prompts/genData.txt';
import { AigcListItem, CompletionInfo } from '@auto-blog/database/aigc-records';
import { openDatabase } from '@auto-blog/database/aigc-records';

type Word = string;

const logStr = defineLogStr('english-words');

export async function publisher() {
  const word = await getWord();

  await genData({
    word,
    etymology: await fetchEtymologyMD(word),
    meaning: await fetchWordMeaning(word)
  });
}

/**
 * 生成数据
 */
async function genData({ word, etymology, meaning }: { word: Word; etymology: string; meaning: string }) {
  const dir = path.resolve(__dirname, 'english-words', word);
  const dataPath = path.resolve(dir, 'data.json');

  const data = file.getFile(dataPath);
  if (data) return data;

  try {
    const completions = chat.defineCompletions({ model: AIModel.GPT4, response_format: { type: 'json_object' } });

    const { content, completionInfo } = await completions([
      {
        role: 'user',
        content: renderTemplate(genDataPrompt, {
          word,
          etymology,
          meaning,
          example: JSON.stringify({
            data: [
              { title: '单词', content: 'hello' },
              {
                title: '发音',
                content: [
                  ['英式', '/həˈləʊ/'],
                  ['美式', '/hɛˈloʊ/']
                ]
              },
              {
                title: '词义简析',
                content: [
                  ['名词(n.)', '问候，招呼'],
                  ['动词(v.)', '打招呼'],
                  ['感叹词(int.)', '用于迎接、引起注意或表达惊讶']
                ]
              },
              {
                title: '场景例句',
                content: [
                  ['遇见时的问候', 'Hello, everyone.', '大家好。'],
                  ['电话中的开场', 'Hello? How may I help you?', '你好？我能帮你做些什么？'],
                  ['寻求回应时', 'Hello? Is anyone there?', '你好？有人在吗？']
                ]
              },
              {
                title: '词源探秘',
                content: [
                  ['来源时期', '1848年'],
                  ['词典引述', '用于接近住所或吸引他人注意'],
                  ['词根演变', '- 最初：美国边境的“hello, the house” - 演变：hallo → holla/hollo → hello'],
                  ['相关词形', '- 古英语动词“halouen” - 古高地德语的“hala”(取回)、“hola”'],
                  ['文化连接', '电话发明与“hello”普及同期，改变了传统的问候方式']
                ]
              },
              { title: '提炼思考', content: ['“hello”如何成为全球通用的招呼语？', '“hello”与“hi”有何异同？', '使用“hello”时，身体语言如何更佳传达友好？'] },
              { title: '使用小贴士', content: ['电话中首选hello，体现礼貌。', '见面时，可配合微笑，增强亲切感。', '在寻求注意时加强语气，但避免喊叫。', '调侃时轻松语气，避免冒犯。'] },
              { title: '今日鼓励', content: '学习新单词是打开世界大门的钥匙。每一个你掌握的词汇，都是你向知识深渊迈进的一步。继续前行，你的努力会开花结果。加油！' }
            ]
          })
        })
      }
    ]);

    file.saveFile(dataPath, JSON.stringify(JSON.parse(content).data));
    await saveRecord(word, completionInfo);
  } catch (error) {
    throw new Error(logStr('AI 生成内容出错'));
  }
}

/**
 * 保存记录
 */
async function saveRecord(word: Word, completionInfo: CompletionInfo) {
  const [db, data] = await openDatabase();
  const index = data.list.findIndex((item) => item.info.word === word);

  const item = {
    project: 'english-words',
    info: { word },
    completionInfo
  } as AigcListItem<any>;

  if (index > -1) {
    data.list[index] = item;
  } else {
    data.list.push(item);
  }

  db.write();
}

/**
 * 获取单词
 */
function getWord(): Word {
  const words = ['person', 'time', 'year', 'good', 'now', 'I', 'you', 'this', 'is', 'want'];
  return getRandomItem(words);
}

/**
 * 获取单词的词源
 */
async function fetchEtymologyMD(word: Word) {
  try {
    let soundCode = (await http(`https://www.etymonline.com/word/${word}`)) as string;

    const $ = cheerio.load(soundCode);
    const $projects = $('.main div > div').filter(function () {
      return this.attribs.class && this.attribs.class.match(/^word--/);
    });

    const html = $projects.eq(0).html();
    if (!html) {
      console.error(logStr('词源信息 HTML 为空'));
      return '';
    }

    const md = html2md(html, { skipTags: ['a', 'img', 'canvas', 'svg'] });
    if (!md) {
      console.error(logStr('词源信息 Markdown 为空'));
      return '';
    }

    return md;
  } catch (error) {
    throw new Error(logStr('获取词源信息出错'));
  }
}

/**
 * 获取单词词义
 */
async function fetchWordMeaning(word: Word) {
  try {
    const res = (await http(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)) as string;
    const list = (JSON.parse(res) || []) as { license: any; sourceUrls: any; word: any; phonetics: any; meanings: any }[];

    if (!list.length) {
      console.error(logStr('词义信息为空'));
      return '';
    }

    const { license, sourceUrls, phonetics, ...rest } = list[0];

    return JSON.stringify(rest);
  } catch (error) {
    throw new Error(logStr('获取词义信息出错'));
  }
}

function http(url: string) {
  const get = new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = '';

        // 接收数据片段
        response.on('data', (chunk) => {
          data += chunk;
        });

        // 数据接收完成
        response.on('end', () => {
          resolve(data);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  return get;
}
