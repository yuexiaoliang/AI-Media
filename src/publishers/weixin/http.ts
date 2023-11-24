import axios from 'axios';
import { getTokenInfo } from './token';

function createHttp(serve = '') {
  const http = axios.create({
    baseURL: `https://api.weixin.qq.com/cgi-bin/${serve}`
  });

  http.interceptors.request.use(async (config) => {
    if (!config.skipAuth) {
      const { access_token } = await getTokenInfo();

      config.params = {
        ...config.params,
        access_token
      };
    }
    return config;
  });

  http.interceptors.response.use((response) => {
    const { data } = response;

    if (data.errcode) {
      return Promise.reject(data);
    }

    return response;
  })

  return http;
}

export default createHttp;
