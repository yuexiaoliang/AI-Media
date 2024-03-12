import { Status } from './types';

export function dataToStatus<T>(data: T & Status) {
  const { generatedData, publishedJuejin, publishedWeixin, publishedXiaohongshu, publishedZhihu, ...rest } = data;

  return {
    ...rest,

    status: {
      generated: {
        data: !!generatedData
      },

      published: {
        juejin: !!publishedJuejin,
        weixin: !!publishedWeixin,
        xiaohongshu: !!publishedXiaohongshu,
        zhihu: !!publishedZhihu
      }
    }
  };
}
