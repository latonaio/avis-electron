import { ipcRenderer } from 'electron';

type ReceiverType = (...args: any[]) => void;

export class RendererEventManager<T extends ReceiverType> {
  #instanceName: string;
  #eventName: string;
  #receiverCount: number = 0;
  #receivers: { [counter: number]: T } = {};
  #callReceivers: (event: Electron.IpcRendererEvent, ...args: any[]) => void;
  #enableHook?: () => Promise<void> | void;
  #disableHook?: () => Promise<void> | void;

  constructor(
    instanceName: string,
    eventName: string,
    enableHook?: () => Promise<void> | void,
    disableHook?: () => Promise<void> | void
  ) {
    this.#instanceName = instanceName;
    this.#eventName = eventName;
    this.#callReceivers = (event, ...args) => {
      this.#callReceiversImpl(event, ...(args as any));
    };
    this.#enableHook = enableHook;
    this.#disableHook = disableHook;
  }

  async #callReceiversImpl(event: Electron.IpcRendererEvent, ...args: Parameters<T>) {
    console.log(`[Preload] [${this.#instanceName}] callReceivers called:`, ...args);
    for (const receiver of Object.values(this.#receivers)) {
      try {
        receiver(...args);
      } catch (e) {
        console.error(`[Preload] [${this.#instanceName}] failed to call receiver:`, e);
      }
    }
  }

  addReceiver(receiver: T) {
    console.log(`[Preload] [${this.#instanceName}] addReceiver:`);
    const id = this.#receiverCount++;
    this.#receivers[id] = receiver;
    if (Object.keys(this.#receivers).length === 1) {
      setImmediate(async () => {
        ipcRenderer.on(this.#eventName, this.#callReceivers);
        this.#enableHook && (await this.#enableHook());
      });
    }

    console.log(`[Preload] [${this.#instanceName}] receivers:`, this.#receivers);
    return id;
  }

  removeReceiver(receiverId: number) {
    console.log(`[Preload] [${this.#instanceName}] removeReceiver`);
    delete this.#receivers[receiverId];
    if (Object.keys(this.#receivers).length === 0) {
      setImmediate(async () => {
        this.#disableHook && (await this.#disableHook());
        ipcRenderer.off(this.#eventName, this.#callReceivers);
      });
    }

    console.log(`[Preload] [${this.#instanceName}] receivers:`, this.#receivers);
  }
}
