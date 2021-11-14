/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { exposeAppApiToRenderer } from './api/app/preload';
import { exposeRabbitmqApiToRenderer } from './api/rabbitmq/preload';

process.once('loaded', () => {
  exposeRabbitmqApiToRenderer();
  exposeAppApiToRenderer();
});
