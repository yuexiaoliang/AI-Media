export type EnvKeys = (typeof envKeys)[number];

export type EnvConstants = {
  [K in EnvKeys]: any;
};

const envKeys = ['LIBRARIES_API_KEY', 'OPENAI_API_KEY', 'WX_APPID', 'WX_APP_SECRET', 'MYSQL_HOST', 'MYSQL_DATABASE', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASSWORD'] as const;

const envConstants: EnvConstants = envKeys.reduce((obj, curr) => {
  obj[curr] = process.env[curr] as EnvKeys;
  return obj;
}, {} as EnvConstants);

const constants = {
  ...envConstants
};

export default constants;
