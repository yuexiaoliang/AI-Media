import { defineDatabase } from './common';
import { Project } from './types';

export interface WeixinMaterialItemMaterialInfo {
  media_id: string;
  url: string;
}

export interface WeixinMaterialItemItemInfo {
  pkgName: string;
}

export interface WeixinMaterialItem {
  project: Project;
  info: WeixinMaterialItemItemInfo;
  materialInfo: WeixinMaterialItemMaterialInfo;
}

export interface WeixinMaterialDB {
  list: WeixinMaterialItem[];
}

const openDatabase = defineDatabase<WeixinMaterialDB>('weixin-materials', {
  list: []
});

// 设置微信素材
export const setWeixinMaterial = async (pkgName: string, material: WeixinMaterialItemMaterialInfo) => {
  const [db, data] = await openDatabase();

  const index = data.list.findIndex((item) => item.info.pkgName === pkgName);

  const item = {
    project: 'npm-packages',
    info: {
      pkgName
    },
    materialInfo: material
  } as WeixinMaterialItem;

  if (index > -1) {
    data.list[index] = item;
  } else {
    data.list.push(item);
  }

  db.write();
};

// 获取微信素材
export const getWeixinMaterial = async (pkgName: string) => {
  const [_, data] = await openDatabase();

  return data.list.find((item) => item.info.pkgName === pkgName);
};
