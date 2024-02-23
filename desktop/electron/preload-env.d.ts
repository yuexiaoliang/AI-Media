interface EnglishWords {
  getNotPublishedXhsWord: import('./controller/english-words').GetNotPublishedXhsWord;
  getNotPublishedXhsWords: import('./controller/english-words').GetNotPublishedXhsWords;
}

type EnglishWordsReturnType<T> = T extends keyof EnglishWords ? Awaited<ReturnType<EnglishWords[T]>> : never;

type IpcRequest = {
  englishWords<T extends keyof EnglishWords>(channel: T, ...args: Parameters<EnglishWords[T]>): ReturnType<EnglishWords[T]>;
};

interface Window {
  ipcRenderer: Pick<import('electron').IpcRenderer, 'on' | 'once' | 'off' | 'send' | 'invoke'>;

  ipcRequest: IpcRequest;
}
