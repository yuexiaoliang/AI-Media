import path from 'path';
import fs from 'fs-extra';
import { getRandomNotPublishXhsWord, updateWordRecord as _updateWordRecord } from '@auto-blog/database/english-words';

const root = path.normalize('/Projects/auto-blog');
const dist = path.resolve(root, 'dist');

export const getNotPublishedXhsWord = async () => {
  const word = await getRandomNotPublishXhsWord();
  if (!word) return;

  const dir = path.resolve(dist, `english-words/${word}`);
  const cardsDir = path.resolve(dir, 'cards');
  const data = await fs.readJson(path.resolve(dir, 'data.json'));
  return { word, cardsDir, data };
};

export type GetNotPublishedXhsWord = typeof getNotPublishedXhsWord;

export const updateWordRecord = _updateWordRecord;
export type UpdateWordRecord = typeof _updateWordRecord;
