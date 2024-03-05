import { ipcMain } from 'electron';
import * as common from './common';
import * as englishWords from './english-words';
import * as npmPackages from './npm-packages';

export const register = () => {
  registerModule('common', common);
  registerModule('english-words', englishWords);
  registerModule('npm-packages', npmPackages);
};

function registerModule(name: string, module: Record<string, any>) {
  const keys = Object.keys(module);

  keys.forEach((key) => {
    if (typeof module[key] !== 'function') return;
    const f = module[key];

    ipcMain.handle(`${name}/${key}`, async (_, ...args) => {
      return f(...args);
    });
  });
}
