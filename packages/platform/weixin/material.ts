import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import createHttp from './http';
import { weixinMaterialsDB } from '@auto-blog/database';

type MaterialType = 'image' | 'video' | 'voice' | 'thumb';

const http = createHttp('material');

export const addMaterial = async (pkgName: string, filepath: string, type: MaterialType = 'image') => {
  const material = await weixinMaterialsDB.getWeixinMaterial(pkgName);
  if (material) return material.materialInfo;

  const formData = new FormData();
  formData.append('media', fs.createReadStream(path.resolve(__dirname, filepath)));

  const {
    data: { item, ...rest }
  } = await http.post('/add_material', formData, {
    params: { type }
  });

  await weixinMaterialsDB.setWeixinMaterial(pkgName, rest);

  return rest as weixinMaterialsDB.WeixinMaterialItemMaterialInfo;
};
