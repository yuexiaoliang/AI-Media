import { merge } from 'lodash';
import { file } from '@auto-blog/utils';
import createHttp from './http';

const http = createHttp('images');

export const defineImagesGenerations = (config: Record<string, any> = {}) => {
  const _config = merge(
    {
      model: 'dall-e-2',
      size: '256x256',
      response_format: 'b64_json',
      n: 1
    },
    config
  );

  return async (prompt: string) => {
    const res = await http.post(`generations`, {
      ..._config,
      prompt
    });

    const { data } = res;
    const [{ b64_json }] = data;

    const filepath = await file.saveImageByB64(b64_json);

    return { b64_json, res, filepath };
  };
};
