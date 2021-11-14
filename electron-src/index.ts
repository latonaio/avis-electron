// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

import { initRabbitmqIpc } from './api/rabbitmq/ipc';
import { initAppIpc } from './api/app/ipc';

const getProductionUrl = () => {
  const url = new URL('file:');
  url.pathname = join(__dirname, '../renderer/out/index.html');
  return url.href;
};

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      // セキュリティ確保のため contextIsolation は false にしない
      // contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  const url = isDev ? 'http://localhost:8000/' : getProductionUrl();

  // RabbitMQ の API の登録
  initRabbitmqIpc(mainWindow);
  // アプリスクリーン関連の API の登録・初期化
  initAppIpc(mainWindow);

  // macOS: フルスクリーン時のみ OS 標準のウィンドウボタンを有効にする
  if (mainWindow.setWindowButtonVisibility) {
    mainWindow.on('enter-full-screen', () => {
      mainWindow.setWindowButtonVisibility(true);
    });
    mainWindow.on('leave-full-screen', () => {
      mainWindow.setWindowButtonVisibility(false);
    });
  }

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);
