import createHttp from './http';
import { getRandomItem, file } from '@utils';

const http = createHttp('images');

export async function genAndSaveImage(prompt: string) {
  const res = await http.post(`generations`, {
    model: 'dall-e-3',
    size: '1792x1024',
    response_format: 'b64_json',
    prompt,
    style: getRandomItem(['vivid', 'natural']),
    n: 1
  });

  const { data } = res;
  const [{ b64_json }] = data;

  const filepath = await file.saveImageByB64(b64_json);

  return filepath;
}
