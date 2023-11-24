import createHttp from './http';

const http = createHttp('freepublish');

export const submitDraft = async (mediaId: string) => {
  const { data } = await http.post('submit', { media_id: mediaId });

  return data;
};

export async function pollPublishResult(publishId: string, mediaId: string): Promise<string> {
  const maxAttempts = 30; // 最大尝试次数
  const interval = 2000; // 轮询间隔（毫秒）

  let attempt = 0;

  while (attempt < maxAttempts) {
    const { data } = await http.post('get', { publish_id: publishId });

    const { publish_status } = data;

    if (publish_status === 0) {
      return `[${mediaId}] 文章发布成功！`;
    }
    if (publish_status > 1) throw new Error(`[${mediaId}] 文章发布失败`);

    attempt++;
    await sleep(interval);
  }

  return '超过最大轮询次数，发布结果未知~';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
