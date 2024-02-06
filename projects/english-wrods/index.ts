import https from 'https';
import url from 'url';
import path from 'path';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';
import { defineLogStr, file, getRandomItem, renderTemplate } from '@auto-blog/utils';
import { AIModel, chat, images } from '@auto-blog/openai';

import genDataPrompt from './prompts/genData.txt';
import { AigcListItem, CompletionInfo } from '@auto-blog/database/aigc-records';
import { openDatabase } from '@auto-blog/database/aigc-records';
import { defineCoverGeneration } from '@auto-blog/cover';

type Word = string;

type Data = typeof dataExample;

type DataItem = (typeof dataExample)[0];

const dataExample = [
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
    title: '相关单词',
    content: [
      ['单词一', '例句', '翻译'],
      ['单词二', '例句', '翻译'],
      ['单词三', '例句', '翻译']
    ]
  },
  { title: '使用小贴士', content: ['电话中首选hello，体现礼貌。', '见面时，可配合微笑，增强亲切感。', '在寻求注意时加强语气，但避免喊叫。', '调侃时轻松语气，避免冒犯。'] },
  { title: '今日鼓励', content: '学习新单词是打开世界大门的钥匙。每一个你掌握的词汇，都是你向知识深渊迈进的一步。继续前行，你的努力会开花结果。加油！' }
];

const logStr = defineLogStr('english-words');

export async function start() {
  console.log(logStr('正在获取单词...'));
  const word = await getWord();

  // 暂时去掉
  // console.log(logStr('正在获取词源信息...'));
  // const etymology = await fetchEtymologyMD(word);

  console.log(logStr('正在获取词义信息...'));
  const meaning = await fetchWordMeaning(word);

  console.log(logStr('正在生成单词数据...'));
  await genData({
    word,
    etymology: '',
    meaning
  });

  console.log(logStr('正在生成单词卡片...'));
  await genCards(word);

  // console.log(logStr('正在生成单词图片...'));
  // await genWordImage(word);

  console.log(logStr(`单词“${word}”生成完成！`, 'success'));
}

/**
 * 生成数据
 */
async function genData({ word, etymology, meaning }: { word: Word; etymology: string; meaning: string }) {
  const data = readDataFile(word);
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
            data: dataExample
          })
        })
      }
    ]);

    const data = JSON.parse(content).data as Data;
    saveDataFile(word, JSON.stringify(data));
    await saveAigcRecord(word, completionInfo);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(logStr('AI 生成内容出错', 'error'));
  }
}

export async function genWordImage(word: Word) {
  const files = file.getFiles(dir(word));
  let filepath = files?.find((file) => file.startsWith('cover.'));
  if (filepath) return filepath;

  const generator = images.defineImagesGenerations({
    model: 'dall-e-3',
    size: '1024x1024'
  });

  const { b64_json } = await generator(`Create a hand-drawn style illustration that visually represents the word "${word}".`);

  return file.saveFileByB64(dir(word), b64_json, 'cover');
}

/**
 * 保存 AIGC 记录
 */
async function saveAigcRecord(word: Word, completionInfo: CompletionInfo) {
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
  const words = ['import', 'export', 'auto', 'usage', 'constants', 'good', 'you', 'this'];
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
      console.error(logStr('词源信息 HTML 为空', 'error'));
      return '';
    }

    const md = html2md(html, { skipTags: ['a', 'img', 'canvas', 'svg'] });
    if (!md) {
      console.error(logStr('词源信息 Markdown 为空', 'error'));
      return '';
    }

    return md;
  } catch (error) {
    console.error(error);
    throw new Error(logStr('获取词源信息出错', 'error'));
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
      console.error(logStr('词义信息为空', 'error'));
      return '';
    }

    const { license, sourceUrls, phonetics, ...rest } = list[0];

    return JSON.stringify(rest);
  } catch (error) {
    console.error(error);
    throw new Error(logStr('获取词义信息出错', 'error'));
  }
}

/**
 * 生成单词卡片
 */
const genCards = async (word: Word) => {
  const data = readDataFile(word);
  if (!data) throw new Error(logStr('生成卡片时，数据文件不存在', 'error'));

  try {
    return await Promise.all(
      data.map((item, index) => {
        return genCard(path.resolve(cardsDir(word), `${index}.png`), item);
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error(logStr('生成卡片出错', 'error'));
  }

  async function genCard(savePath: string, item: DataItem) {
    const entry = path.resolve(__dirname, `./html-templates/word-card.html`);
    const gotoUrl = url.pathToFileURL(entry).href;
    const generator = defineCoverGeneration(savePath);

    await generator(gotoUrl, {
      async pageOpened(page) {
        await page.evaluate((itemData) => {
          window.sessionStorage.setItem('card-data', JSON.stringify(itemData));

          // 为了保证数据正确，这里主动在 sessionStorage 设置完成后调用页面内定义的 render 函数
          // @ts-ignore
          window.render();
        }, item);

        // 等待页面内的数据渲染完成
        await page.waitForFunction(() => {
          const element = document.querySelector('#cover .content');
          return !!element;
        });
      }
    });

    return savePath;
  }
};

function dir(word: Word) {
  return path.resolve(__dirname, 'english-words', word);
}

function cardsDir(word: Word) {
  return path.resolve(dir(word), 'cards');
}

function dataPath(word: Word) {
  return path.resolve(dir(word), 'data.json');
}

function saveDataFile(word: Word, content: string) {
  file.saveFile(dataPath(word), content);
}

function readDataFile(word: Word) {
  const str = file.getFile(dataPath(word));
  if (!str) return;

  return JSON.parse(str) as Data;
}

function http(url: string) {
  return new Promise((resolve, reject) => {
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
}
