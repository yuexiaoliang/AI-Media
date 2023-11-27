import createHttp from './http';
import { file, getRandomItem } from '@utils';
import * as chat from './chat';

const http = createHttp('images');

export async function genAndSaveImage(pkgName: string) {
  const cover = file.getCover(pkgName);
  if (cover) return cover;

  const prompt = await chat.genImagePrompt();

  const res = await http.post(`generations`, {
    model: 'dall-e-3',
    size: '1792x1024',
    style: getRandomItem(['vivid', 'natural']),
    // model: 'dall-e-2',
    // size: '256x256',
    response_format: 'b64_json',
    prompt,
    n: 1
  });

  const { data } = res;
  const [{ b64_json }] = data;

  const filepath = await file.saveImageByB64(pkgName, b64_json);

  return filepath;
}
