import path from 'path';
import fs from 'fs-extra';
import { EnglishWordsList } from '@auto-blog/database/english-words';
import { getRandomItem } from '@auto-blog/utils';

const root = path.normalize('/Projects/auto-blog');
const dist = path.resolve(root, 'dist');

export const getAllWords = async () => {
  const file = fs.readFileSync(path.resolve(dist, 'db/english-words.json'), 'utf-8');
  const list = JSON.parse(file).list;
  return list as EnglishWordsList;
};

export const getNotPublishedXhsWords = async () => {
  const words = await getAllWords();

  return words.filter((word) => word.dataGenerated && !word.xhsPublished);
};
export type GetNotPublishedXhsWords = typeof getNotPublishedXhsWords;

export const getNotPublishedXhsWord = async (name?: string) => {
  console.log(name)
  const words = await getNotPublishedXhsWords();
  const { word } = getRandomItem(words);
  const dir = path.resolve(dist, `english-words/${word}/cards`);
  return { word, dir };
};

export type GetNotPublishedXhsWord = typeof getNotPublishedXhsWord;