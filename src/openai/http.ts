import axios from 'axios';
import constants from '@constants';

type Serve = 'audio' | 'chat' | 'images';

const createHttp = (serve: Serve, version = 'v1') => {
  const http = axios.create({
    baseURL: `http://38.165.7.164:3870/${version}/${serve}/`
  });

  http.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${constants.OPENAI_API_KEY}`;

    return config;
  });

  http.interceptors.response.use((response) => {
    return response.data;
  });

  return http;
};

export default createHttp
