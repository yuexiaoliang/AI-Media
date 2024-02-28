import https from 'https';
import url from 'url';
import path from 'path';
import html2md from 'html-to-md';
import * as cheerio from 'cheerio';
import wait from 'wait'
import { defineLogStr, file, renderTemplate } from '@auto-blog/utils';
import { AIModel, chat, images } from '@auto-blog/openai';

import genDataSystemPrompt from './prompts/genDataSystem.txt';
import genDataUserPrompt from './prompts/genDataUser.txt';
import { saveAigcRecord } from '@auto-blog/database/aigc-records';
import { Word, getRandomNotGeneratedWord, updateWordRecord } from '@auto-blog/database/english-words';
import { defineCoverGeneration } from '@auto-blog/cover';

type Data = typeof dataExample;

type DataItem = (typeof dataExample)[0];

const dataExample = [
  {
    word: 'hello',
    content: [
      ['英式', '/həˈləʊ/'],
      ['美式', '/hɛˈloʊ/']
    ]
  },
  {
    title: '词义简析',
    content: [
      ['名词(n.)', '一种问候语，用于见面打招呼'],
      ['动词(v.)', '表达通过说‘hello’来问候'],
      ['感叹词(int.)', '在会面、接电话或发现新事物时表达问候、注意或惊奇']
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
      ['greeting', '问候', 'Greetings, everyone here tonight.', '今晚在此的各位，大家好。'],
      ['bye', '告别', 'Bye, see you tomorrow.', '再见，明天见。'],
      ['goodbye', '辞别', "It's hard to say goodbye.", '说再见总是很难。']
    ]
  },
  { title: '用法小贴士', content: ['接听电话时先说hello，然后礼貌询问对方需求。', '见面时说hello并微笑，营造友好的氛围。', '若有人做出滑稽行为，可以用略带讽刺的语气轻声说hello。'] },
  { title: '今日鼓励', content: '探索英语世界是一段精彩的旅程，每一个单词都充满魔力。📖 持之以恒，你将在语言的海洋中自由航行。 🌟 加油！' }
];

const logStr = defineLogStr('english-words');

export async function start() {
  console.log(logStr('正在获取单词...'));
  const word = await getRandomNotGeneratedWord();
  if (!word) return;
  console.log(logStr(`单词为：${word}`));

  console.log(logStr('正在生成单词数据...'));
  await genData(word);

  console.log(logStr('正在生成单词卡片...'));
  await genCards(word);

  // console.log(logStr('正在生成单词图片...'));
  // await genWordImage(word);

  console.log(logStr(`单词“${word}”生成完成！`, 'success'));

  await wait(2000)
}

/**
 * 生成数据
 */
async function genData(word: Word) {
  const data = readDataFile(word);
  if (data) return data;

  console.log(logStr('正在获取词义信息...'));
  const meaning = await fetchWordMeaning(word);

  // 暂时去掉
  // console.log(logStr('正在获取词源信息...'));
  // const etymology = await fetchEtymologyMD(word);

  try {
    const completions = chat.defineCompletions({ model: AIModel.GPT4, response_format: { type: 'json_object' } });

    const { content, completionInfo } = await completions([
      {
        role: 'system',
        content: renderTemplate(genDataSystemPrompt, {
          example: JSON.stringify({
            data: dataExample
          })
        })
      },
      {
        role: 'user',
        content: renderTemplate(genDataUserPrompt, {
          word,
          meaning
        })
      }
    ]);

    const data = JSON.parse(content).data as Data;
    saveDataFile(word, JSON.stringify(data));
    await saveAigcRecord(word, completionInfo);
    await updateWordRecord(word, { dataGenerated: true });

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

  const [wordInfo, ..._data] = data;

  const cards = file.getFiles(cardsDir(word));
  if (cards?.length === _data.length) return cards.map((item) => cardPath(word, item));

  try {
    return await Promise.all(_data.map((item, index) => genCard(cardPath(word, `${index}.png`), item)));
  } catch (error) {
    removeCardsDir(word);
    console.error(error);
    throw new Error(logStr('生成卡片出错', 'error'));
  }

  async function genCard(savePath: string, item: DataItem) {
    const entry = path.resolve(__dirname, `./html-templates/word-card.html`);
    const gotoUrl = url.pathToFileURL(entry).href;
    const generator = defineCoverGeneration(savePath);

    await generator(gotoUrl, {
      async pageOpened(page) {
        // @ts-ignore
        await page.waitForFunction(() => typeof window.render === 'function');

        await page.evaluate(
          async (itemData, wordInfo) => {
            window.sessionStorage.setItem('card-data', JSON.stringify(itemData));
            window.sessionStorage.setItem('word-info', JSON.stringify(wordInfo));

            // 为了保证数据正确，这里主动在 sessionStorage 设置完成后调用页面内定义的 render 函数
            // @ts-ignore
            window.render();
          },
          item,
          wordInfo
        );
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

function cardPath(word: Word, name: string) {
  return path.resolve(cardsDir(word), `${name}`);
}

function dataPath(word: Word) {
  return path.resolve(dir(word), 'data.json');
}

function removeCardsDir(word: Word) {
  file.removeDir(cardsDir(word));
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
