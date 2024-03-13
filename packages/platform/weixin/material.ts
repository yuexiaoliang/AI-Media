import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import createHttp from './http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type MaterialType = 'image' | 'video' | 'voice' | 'thumb';

const http = createHttp('material');

export const addMaterial = async (filepath: string, type: MaterialType = 'image') => {
  const formData = new FormData();
  formData.append('media', fs.createReadStream(path.resolve(__dirname, filepath)));

  const {
    data: { item, ...rest }
  } = await http.post('/add_material', formData, {
    params: { type }
  });

  return rest as {
    media_id: string;
    url: string;
  };
};
