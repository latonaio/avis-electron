import { contextBridge, ipcRenderer } from 'electron';
import { AppApi, FullscreenReceiver } from '../../../types/app';
import { RendererEventManager } from '../renderer-event-manager';

const fullscreenManager = new RendererEventManager<FullscreenReceiver>(
  'App',
  'app:fullscreenEvent'
);

const addFullscreenReceiver = (receiver: FullscreenReceiver) => {
  return fullscreenManager.addReceiver(receiver);
};

const removeFullscreenReceiver = (receiverId: number) => {
  fullscreenManager.removeReceiver(receiverId);
};

const isFullscreen = async (): Promise<boolean> => {
  return await ipcRenderer.invoke('app:isFullscreen');
};

const close = () => {
  ipcRenderer.send('app:close');
};

const toggleMaximize = () => {
  ipcRenderer.send('app:toggleMaximize');
};

const minimize = () => {
  ipcRenderer.send('app:minimize');
};

export const exposeAppApiToRenderer = () => {
  contextBridge.exposeInMainWorld('app', {
    addFullscreenReceiver,
    removeFullscreenReceiver,
    isFullscreen,
    close,
    toggleMaximize,
    minimize,
  } as AppApi);
};
