import { contextBridge, ipcRenderer } from 'electron';
import { RabbitmqApi, RabbitmqConnectionConfig, RabbitmqReceiver } from '../../../types/rabbitmq';
import { RendererEventManager } from '../renderer-event-manager';

const manager = new RendererEventManager<RabbitmqReceiver>(
  'Rabbitmq',
  'rabbitmq:message',
  () => {
    ipcRenderer.send('rabbitmq:startReceiving');
  },
  () => {
    ipcRenderer.send('rabbitmq:stopReceiving');
  }
);

const addReceiver = (receiver: RabbitmqReceiver) => {
  return manager.addReceiver(receiver);
};

const removeReceiver = (receiverId: number) => {
  return manager.removeReceiver(receiverId);
};

const getConnectionConfig = async () => {
  return (await ipcRenderer.invoke('rabbitmq:getConnectionConfig')) as RabbitmqConnectionConfig;
};

const setConnectionConfig = (config: RabbitmqConnectionConfig) => {
  ipcRenderer.send('rabbitmq:setConnectionConfig', config);
};

const reconnect = () => {
  ipcRenderer.send('rabbitmq:reconnect');
};

// Renderer プロセスに公開する API を定義する
export const exposeRabbitmqApiToRenderer = () => {
  contextBridge.exposeInMainWorld('rabbitmq', {
    addReceiver,
    removeReceiver,
    getConnectionConfig,
    setConnectionConfig,
    reconnect,
  } as RabbitmqApi);
};
