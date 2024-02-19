import { merge } from 'lodash';
import { getRandomItem } from '@auto-blog/utils';
import { defineDatabase } from './common';

export type Word = string;

export interface EnglishWordsListItem {
  word: Word;

  /**
   * 数据生成状态
   */
  dataGenerated?: boolean;

  /**
   * 小红书发布状态
   */
  xhsPublished?: boolean;
}
export type EnglishWordsList = EnglishWordsListItem[];

export interface EnglishWordsDB {
  list: EnglishWordsList;
}

const openDatabase = defineDatabase<EnglishWordsDB>('english-words', {
  list: []
});

export const hasWord = async (word: Word) => {
  const [_db, data] = await openDatabase();

  return data.list.some((item) => item.word === word);
};

export const insertMultipleWords = async (words: Word[]) => {
  const [db, data] = await openDatabase();

  const _words = words.map((word) => word.toLocaleLowerCase()).filter((word) => data.list.every((item) => item.word !== word));

  data.list.push(..._words.map((word) => ({ word, dataGenerated: false })));

  db.write();
};

export const getRandomNotGeneratedWord = async () => {
  const [_db, data] = await openDatabase();

  // 生成了数据但是没有发布的单词
  const notPublishedWords = data.list.filter((item) => item.dataGenerated && !item.xhsPublished);
  if (notPublishedWords.length > 0) return getRandomItem(notPublishedWords).word;

  // 所有没生成数据的单词
  const notGeneratedWords = data.list.filter((item) => !item.dataGenerated);
  if (notGeneratedWords.length === 0) return;

  return getRandomItem(notGeneratedWords).word;
};

export const updateWordRecord = async (word: Word, record: Partial<EnglishWordsListItem>) => {
  const [db, data] = await openDatabase();

  const index = data.list.findIndex((item) => item.word === word);
  if (index === -1) return;

  merge(data.list[index], record);

  db.write();
};
