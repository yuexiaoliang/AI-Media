export type EnvKeys = (typeof envKeys)[number];

export type EnvConstants = {
  [K in EnvKeys]: string;
};

export type Constants = typeof constants;

const envKeys = ['LIBRARIES_API_KEY', 'OPENAI_API_KEY', 'WX_APPID', 'WX_APP_SECRET'] as const;

const envConstants: EnvConstants = envKeys.reduce((obj, curr) => {
  obj[curr] = process.env[curr] as EnvKeys;
  return obj;
}, {} as EnvConstants);

const constants = {
  ...envConstants
};

export default constants;
