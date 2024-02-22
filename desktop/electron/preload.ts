import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: ipcRenderer.on,
  off: ipcRenderer.off,
  once: ipcRenderer.once,
  send: ipcRenderer.send,
  invoke: ipcRenderer.invoke
});

contextBridge.exposeInMainWorld('ipcRequest', ipcRenderer.invoke)