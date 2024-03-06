interface EnglishWords {
  getNotPublishedXhsWord: import('./controller/english-words').GetNotPublishedXhsWord;
  updateWordRecord: import('./controller/english-words').UpdateWordRecord;
}

type EnglishWordsReturnType<T extends keyof EnglishWords> = Awaited<ReturnType<EnglishWords[T]>>;

interface NPMPackages {
  getRandomNotPublishedPkg: import('./controller/npm-packages').GetRandomNotPublishedPkg;
  getPublishedPlatformsMap: import('./controller/npm-packages').GetPublishedPlatformsMap;
  getArticleFile: import('./controller/npm-packages').GetArticleFile;
  getCover: import('./controller/npm-packages').GetCover;
}

type NPMPackagesReturnType<T extends keyof NPMPackages> = Awaited<ReturnType<NPMPackages[T]>>;

type IpcRequest = {
  englishWords<T extends keyof EnglishWords>(channel: T, ...args: Parameters<EnglishWords[T]>): ReturnType<EnglishWords[T]>;

  npmPackages<T extends keyof NPMPackages>(channel: T, ...args: Parameters<NPMPackages[T]>): ReturnType<NPMPackages[T]>;
};

interface Window {
  ipcRenderer: Pick<import('electron').IpcRenderer, 'on' | 'once' | 'off' | 'send' | 'invoke'>;

  ipcRequest: IpcRequest;
}
