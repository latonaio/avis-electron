import { RabbitmqClient, RabbitmqMessage } from 'rabbitmq-client';
import { RabbitmqConnectionConfig } from '../../../types/rabbitmq';

export class RabbitmqManager {
  config: RabbitmqConnectionConfig;

  #handler: (msg: RabbitmqMessage) => void;
  #client?: RabbitmqClient;
  #isReceiving: boolean = false;

  constructor(config: RabbitmqConnectionConfig, handler: (msg: RabbitmqMessage) => void) {
    this.config = config;
    this.#handler = handler;
  }

  get #connectionString() {
    const e = encodeURIComponent;
    const c = this.config;
    return `amqp://${e(c.user)}:${e(c.passwd)}@${e(c.host)}:${e(c.port)}/${e(c.virtualHost)}`;
  }

  async #ensureClient() {
    if (this.#client) {
      return;
    }

    this.#client = await RabbitmqClient.create(
      this.#connectionString,
      [this.config.queueOrigin],
      []
    );
  }

  async startReceiving() {
    if (this.#isReceiving) {
      return;
    }
    this.#isReceiving = true;

    await this.#ensureClient();
    this.#client!.on('message', this.#handler);
    await this.#client!.startReceiving();
  }

  async stopReceiving() {
    if (!this.#isReceiving) {
      return;
    }
    this.#isReceiving = false;

    await this.#ensureClient();
    await this.#client!.stopReceiving();
    this.#client!.off('message', this.#handler);
  }

  async reconnect() {
    if (!this.#client) {
      return;
    }

    // 受信状態の保存
    const receiving = this.#isReceiving;

    // 一旦受信を止める
    await this.stopReceiving();
    await this.#client.close();

    // 再接続
    this.#client = undefined;
    await this.#ensureClient();

    // 受信状態だったときは、受信を再開
    if (receiving) {
      await this.startReceiving();
    }
  }
}
