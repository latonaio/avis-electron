export type FullscreenReceiver = (isFullscreen: boolean) => void;

export interface AppApi {
  addFullscreenReceiver: (receiver: FullscreenReceiver) => number;
  removeFullscreenReceiver: (id: number) => void;
  isFullscreen: () => Promise<boolean>;
  close: () => void;
  toggleMaximize: () => void;
  minimize: () => void;
}

declare global {
  interface Window {
    app: AppApi;
  }
}
