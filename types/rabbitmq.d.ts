export type RabbitmqReceiver = (msg: unknown) => void;

export interface RabbitmqConnectionConfig {
  host: string;
  port: number;
  user: string;
  passwd: string;
  virtualHost: string;
  queueOrigin: string;
}

export interface RabbitmqApi {
  addReceiver: (receiver: RabbitmqReceiver) => number;
  removeReceiver: (id: number) => void;
  getConnectionConfig: () => Promise<RabbitmqConnectionConfig>;
  setConnectionConfig: (conf: RabbitmqConnectionConfig) => void;
  reconnect: () => void;
}

declare global {
  interface Window {
    rabbitmq: RabbitmqApi;
  }
}
