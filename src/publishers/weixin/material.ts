import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import createHttp from './http';
import * as database from '@database'

type MaterialType = 'image' | 'video' | 'voice' | 'thumb';

const http = createHttp('material');

export const getMaterials = async (type: string = 'image', offset: number = 0, count: number = 10) => {
  const { data } = await http.post('/batchget_material', {
    type,
    offset,
    count
  });
  return data;
};

export const addMaterial = async (pkgName: string, filepath: string, type: MaterialType = 'image') => {
  if (await database.hasWeixinMaterial(pkgName)) return await database.getWeixinMaterial(pkgName);

  const formData = new FormData();
  formData.append('media', fs.createReadStream(path.resolve(__dirname, filepath)));

  const {
    data: { item, ...rest }
  } = await http.post('/add_material', formData, {
    params: { type }
  });

  await database.setWeixinMaterial(pkgName, rest);

  return rest as database.DBWeixinMaterial;
};
