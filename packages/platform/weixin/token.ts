import { readFileSync, writeFileSync } from 'jsonfile';
import fs from 'fs-extra';
import path from 'path';
import createHttp from './http';
import constants from '@auto-blog/constants';
import { getTimestamp } from '@auto-blog/utils';

const http = createHttp();

export const getTokenInfo = async () => {
  let tokenInfo: { access_token: string; timestamp: number };
  const tokenFilePath = path.resolve(__dirname, './token.json');

  if (fs.existsSync(tokenFilePath)) {
    tokenInfo = readFileSync(tokenFilePath);

    // token 的过期时间大于 2 分钟，则直接返回
    if (tokenInfo.access_token && tokenInfo.timestamp >= getTimestamp() - 60 * 2) {
      return tokenInfo;
    }
  }

  const { data } = await http.post(
    '/stable_token',
    {
      grant_type: 'client_credential',
      appid: constants.WX_APPID,
      secret: constants.WX_APP_SECRET,
      force_refresh: false
    },
    {
      skipAuth: true
    }
  );

  const { access_token, expires_in } = data;

  tokenInfo = {
    access_token,
    timestamp: getTimestamp() + expires_in
  };

  writeFileSync(tokenFilePath, tokenInfo, { spaces: 2 });

  return tokenInfo;
};
