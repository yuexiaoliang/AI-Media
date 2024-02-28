import https from 'https';
import queryString from 'query-string';

export type HttpsGetOptions = {
  params: Record<string, any>;
} & https.RequestOptions;

export default function httpsGet(url: string, options?: HttpsGetOptions) {
  const { params, ...rest } = options || {};

  const paramsStr = params ? `?${queryString.stringify(params)}` : '';
  const _url = url + paramsStr;

  return new Promise<any>((resolve, reject) => {
    https
      .get(_url, rest, (response) => {
        let data = '';

        // 接收数据片段
        response.on('data', (chunk) => {
          data += chunk;
        });

        // 数据接收完成
        response.on('end', () => {
          let result;

          try {
            result = JSON.parse(data);
          } catch (_err) {
            result = data;
          }

          resolve(result);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
