import { fileURLToPath } from 'url';
import path from 'path';
import httpsGet from '@auto-blog/utils/httpsGet';
import { defineLogStr, extractJsonFromMarkdown, file, renderTemplate } from '@auto-blog/utils';
import * as cheerio from 'cheerio';
import { capitalize } from 'lodash-es';
import { moonshot, Types as AiTypes } from '@auto-blog/ai';
import genDataSystemPrompt from './prompts/genDataSystem.txt';

type HoroscopesNames = keyof typeof horoscopes;

type HoroscopesType = (typeof horoscopesTypes)[number];

type RelativeDate = (typeof relativeDates)[number];

interface CollectFortuneOptions {
  horoscopeName: HoroscopesNames;
  laDate: string;
  type?: HoroscopesType;
}
interface CollectAllFortunesOptions {
  horoscopeName: HoroscopesNames;
  laDate: string;
  prevResult?: CollectFortuneFulfilledResult[];
  types?: HoroscopesType[];
  retryCount?: number;
}
type CollectFortuneReturnType = ReturnType<typeof collectFortune>;
type CollectFortuneFulfilledResult = Awaited<CollectFortuneReturnType>;

interface CollectStarRatingsOptions {
  relativeDate: RelativeDate;
  horoscopeName: HoroscopesNames;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logStr = defineLogStr('Horoscopes');

// 采集数据重试次数
const COLLECT_RETRY_COUNT = 5;
// 采集数据 base url
const COLLECT_BASE_URL = 'https://www.horoscope.com';

const horoscopes = {
  aries: { name: '白羊座', sign: 1 },
  taurus: { name: '金牛座', sign: 2 },
  gemini: { name: '双子座', sign: 3 },
  cancer: { name: '巨蟹座', sign: 4 },
  leo: { name: '狮子座', sign: 5 },
  virgo: { name: '处女座', sign: 6 },
  libra: { name: '天秤座', sign: 7 },
  scorpio: { name: '天蝎座', sign: 8 },
  sagittarius: { name: '射手座', sign: 9 },
  capricorn: { name: '摩羯座', sign: 10 },
  aquarius: { name: '水瓶座', sign: 11 },
  pisces: { name: '双鱼座', sign: 12 }
} as const;
const horoscopesTypes = ['general', 'love', 'career', 'wellness', 'weekly-money'] as const;
const relativeDates = ['yesterday', 'today', 'tomorrow'] as const;
const dataExample = {
  mood: { stars: 2.5, title: '情绪指数', content: 'xxxx' },
  general: { stars: 4, title: '综合运势', content: 'xxxx' },
  love: { stars: 2, title: '爱情', content: 'xxxx' },
  money: { stars: 5, title: '财富', content: 'xxxx' },
  career: { stars: 3, title: '事业', content: 'xxxx' },
  wellness: { stars: 3, title: '健康', content: 'xxxx' }
};

type GeneratedData = typeof dataExample;

export async function start() {
  const name = 'aquarius';

  console.log(logStr(`正在采集 ${name} 的数据...`));
  const md = await collectDataToMarkdown(name);

  console.log(logStr(`正在 AI 生成...`));
  const res = await generateData(md);

  console.log(`🚀 > start > res:`, res);
  file.saveFile(path.resolve(__dirname, 'star-ratings.json'), JSON.stringify(res));
}

/**
 * 数据生成
 */
export async function generateData(data: string) {
  let result: string | GeneratedData;

  try {
    const completions = moonshot.defineCompletions({
      model: AiTypes.AIModel.MOONSHOT_V1_8K
    });

    const { content } = await completions([
      {
        role: 'system',
        content: renderTemplate(genDataSystemPrompt, {
          example: JSON.stringify(dataExample)
        })
      },
      {
        role: 'user',
        content: data
      }
    ]);

    if (!content) {
      throw new Error(logStr('AI 生成内容为空', 'error'));
    }

    result = content;
  } catch (error) {
    throw new Error(logStr(`AI 生成内容出错：${error}`, 'error'));
  }

  try {
    result = extractJsonFromMarkdown(result);
  } catch (error) {
    throw new Error(logStr(`AI 生成内容 JSON 解析出错：${error}`, 'error'));
  }

  try {
    // return await EnglishWordsServices.saveEnglishWord({});
  } catch (error) {
    throw new Error(logStr(`保存数据出错：${error}`, 'error'));
  }

  return result;
}

/**
 * 将采集到的数据转换为 Markdown 格式
 */
export async function collectDataToMarkdown(horoscopeName: HoroscopesNames) {
  const starRatings = await collectStarRatings({ horoscopeName: horoscopeName, relativeDate: 'today' });
  const fortunes = await collectAllFortunes({ horoscopeName: horoscopeName, laDate: '20240322' });

  // const starRatingsStr = starRatings.data
  //   .map((item) => {
  //     return `### ${item.title}\n\n**Grade:** ${item.grade} Stars\n\n${item.text}`;
  //   })
  //   .join('\n\n');

  const fortunesStr = fortunes
    .map((item) => {
      return `### ${item.type}\n\n${item.text}`;
    })
    .join('\n\n');

  let result = `# ${capitalize(horoscopeName)} horoscopes for today\n\n`;

  // 今日心情
  result += `**Today emoji:** ${starRatings.emoji}\n\n`;

  // 运势数据
  result += `## Horoscopes\n\n${fortunesStr}\n\n`;

  return result;
}

/**
 * 采集某个星座的所有运势数据
 */
export async function collectAllFortunes({ horoscopeName, laDate, prevResult = [], types = [...horoscopesTypes], retryCount = COLLECT_RETRY_COUNT }: CollectAllFortunesOptions): Promise<CollectFortuneFulfilledResult[]> {
  const allRes = await Promise.allSettled<CollectFortuneFulfilledResult>(
    types.map((type) => {
      return collectFortune({ horoscopeName, laDate, type });
    })
  );

  // 所有成功的请求
  const result = allRes
    .filter((item): item is PromiseFulfilledResult<CollectFortuneFulfilledResult> => item.status === 'fulfilled')
    .map((item) => item.value)
    .concat(prevResult);

  // 所有失败的请求
  const errors = allRes.filter((item): item is PromiseRejectedResult => item.status === 'rejected').map((item) => item.reason);
  if (errors.length) {
    const errTypes = types.filter((type) => result.every((item) => item.type !== type));

    if (retryCount > 0) {
      console.log(errors.map((err) => `${err?.message || err?.toString() || err}， 第 ${COLLECT_RETRY_COUNT - retryCount + 1} 次重试...`).join('\n'));

      return await collectAllFortunes({ horoscopeName, laDate, prevResult: result, types: errTypes, retryCount: retryCount - 1 });
    }

    throw new Error(logStr(`采集 ${horoscopeName} 的所有运势数据，重试次数已用完，还有 ${errTypes.join('、')} 未完成...`));
  }

  return result;
}

/**
 * 采集运势数据
 */
async function collectFortune({ horoscopeName, laDate, type = 'general' }: CollectFortuneOptions) {
  const sign = horoscopes[horoscopeName].sign;
  const logPrefix = `采集运势数据 -> ${horoscopes[horoscopeName].name} -> ${type}：`;

  const url = type === 'weekly-money' ? `${COLLECT_BASE_URL}/us/horoscopes/money/horoscope-money-weekly.aspx?sign=${sign}` : `${COLLECT_BASE_URL}/us/horoscopes/${type}/horoscope-archive.aspx?sign=${sign}&laDate=${laDate}`;

  const html = await httpsGet(url);
  const $ = cheerio.load(html!);

  const $strong = $('.main-horoscope > .switcher ~ p > strong');

  if (!$strong.html()) {
    throw new Error(logStr(`${logPrefix}未找到数据元素`, 'error'));
  }

  const $parent = $strong.parent();
  $strong.remove();

  const parentText = $parent.text();
  if (!parentText) {
    throw new Error(logStr(`${logPrefix}运势数据为空`, 'error'));
  }

  const text = parentText.replace(/^\s?-\s?/, '');
  if (!text) {
    throw new Error(logStr(`${logPrefix}运势数据为空`, 'error'));
  }

  return { type: type === 'weekly-money' ? 'money' : type, text };
}

/**
 * 采集运势评级
 */
async function collectStarRatings({ relativeDate, horoscopeName }: CollectStarRatingsOptions) {
  const logPrefix = logStr(`采集运势评级 -> ${[horoscopeName]} -> ${relativeDate}：`);

  const url = `${COLLECT_BASE_URL}/star-ratings/${relativeDate}/${horoscopeName}`;
  const html = await httpsGet(url);

  const $ = cheerio.load(html!);
  const $content = $('.switcher ~ .module-skin');

  const emoji = $content.find('.general-mood img[alt~="emoji"]').attr('alt')?.split(' ')[0];
  if (!emoji) {
    console.log(logStr(`${logPrefix}未找到 emoji`));
  }

  const data = Array.from($content.find('h3')).map((el) => {
    const $el = $(el);
    const grade = $el.children('i.highlight').length;
    const title = $el.text().replace(/\s/g, '');
    const text = $el.next('p').text();

    return {
      title,
      grade,
      text
    };
  });

  if (!data.length) {
    throw new Error(logStr(`${logPrefix}未找到数据`, 'error'));
  }

  return {
    emoji,
    data
  };
}
