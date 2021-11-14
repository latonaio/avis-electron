import { app, BrowserWindow, ipcMain } from 'electron';

let targetWindow: BrowserWindow | null = null;

const toggleMaximize = () => {
  if (process.platform === 'darwin') {
    // macOS の場合は最大化ボタンでフルスクリーンになる挙動が一般的
    targetWindow!.setFullScreen(!targetWindow!.fullScreen);
  } else if (targetWindow!.isMaximized()) {
    targetWindow!.unmaximize();
  } else {
    targetWindow!.maximize();
  }
};

export const initAppIpc = (window: BrowserWindow) => {
  targetWindow = window;
  ipcMain.handle('app:isFullscreen', () => {
    return targetWindow!.fullScreen;
  });
  ipcMain.on('app:close', () => {
    app.quit();
  });
  ipcMain.on('app:toggleMaximize', toggleMaximize);
  ipcMain.on('app:minimize', () => {
    targetWindow!.minimize();
  });

  targetWindow.on('enter-full-screen', () => {
    targetWindow!.webContents.send('app:fullscreenEvent', true);
  });
  targetWindow.on('leave-full-screen', () => {
    targetWindow!.webContents.send('app:fullscreenEvent', false);
  });
};
