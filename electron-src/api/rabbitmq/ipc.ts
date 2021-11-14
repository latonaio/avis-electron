import { BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';

import { RabbitmqMessage } from 'rabbitmq-client';
import { RabbitmqConnectionConfig } from '../../../types/rabbitmq';
import { RabbitmqManager } from './manager';

let targetWindow: BrowserWindow | null = null;

const store = new Store<RabbitmqConnectionConfig>({
  name: 'rabbitmq-connection',
});

const getDefaultConfig = () => {
  return {
    host: '192.168.xxx.xxx',
    port: 32094,
    user: 'username',
    passwd: 'password',
    virtualHost: 'virtualhost',
    queueOrigin: 'queue-origin',
  } as RabbitmqConnectionConfig;
};

const loadRabbitmqConnectionConfig = () => {
  const def = getDefaultConfig();
  return {
    host: store.get('host', def.host),
    port: store.get('port', def.port),
    user: store.get('user', def.user),
    passwd: store.get('passwd', def.passwd),
    virtualHost: store.get('virtualHost', def.virtualHost),
    queueOrigin: store.get('queueOrigin', def.queueOrigin),
  } as RabbitmqConnectionConfig;
};

const saveRabbitmqConnectionConfig = (conf: RabbitmqConnectionConfig) => {
  const def = getDefaultConfig();
  store.set('host', conf.host || def.host);
  store.set('port', conf.port || def.port);
  store.set('user', conf.user || def.user);
  store.set('passwd', conf.passwd || def.passwd);
  store.set('virtualHost', conf.virtualHost || def.virtualHost);
  store.set('queueOrigin', conf.queueOrigin || def.queueOrigin);
};

const sendToRenderer = async (msg: RabbitmqMessage) => {
  console.log('[RabbitmqIpc] sendToRenderer called:', msg.data);
  targetWindow!.webContents.send('rabbitmq:message', msg.data);
  msg.success();
};

const manager = new RabbitmqManager(loadRabbitmqConnectionConfig(), sendToRenderer);

// Renderer プロセスに公開された API が Main プロセス宛に行う IPC を定義する
export const initRabbitmqIpc = (window: BrowserWindow) => {
  targetWindow = window;
  ipcMain.handle('rabbitmq:getConnectionConfig', () => {
    return loadRabbitmqConnectionConfig();
  });
  ipcMain.on('rabbitmq:setConnectionConfig', async (_, conf: RabbitmqConnectionConfig) => {
    saveRabbitmqConnectionConfig(conf);
    manager.config = conf;
    await manager.reconnect();
  });
  ipcMain.on('rabbitmq:reconnect', async () => {
    await manager.reconnect();
  });
  ipcMain.on('rabbitmq:startReceiving', async () => {
    await manager.startReceiving();
  });
  ipcMain.on('rabbitmq:stopReceiving', async () => {
    await manager.stopReceiving();
  });
};
