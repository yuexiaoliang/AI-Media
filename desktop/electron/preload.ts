import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: ipcRenderer.on,
  off: ipcRenderer.off,
  once: ipcRenderer.once,
  send: ipcRenderer.send,
  invoke: ipcRenderer.invoke
});

contextBridge.exposeInMainWorld('ipcRequest', {
  englishWords: async (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(`english-words/${channel}`, ...args);
  },

  npmPackages: async (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(`npm-packages/${channel}`, ...args);
  }
});
