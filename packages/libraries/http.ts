import axios from 'axios';
import constants from '@auto-blog/constants';

type Serve = 'npm' | 'github';

const createHttp = (serve: Serve = 'npm') => {
  const http = axios.create({
    baseURL: `https://libraries.io/api/${serve}/`
  });

  http.interceptors.request.use((config) => {
    config.params = {
      ...config.params,
      api_key: constants.LIBRARIES_API_KEY
    };
    return config;
  });

  http.interceptors.response.use((response) => {
    return response.data;
  });

  return http
};

export default createHttp();
