import http from 'http';

import express from 'express';
import logger from 'chpr-logger';

import config from '../config';
import { configure } from '../config/express';

import api from './api';

let server;

/**
 * Minimal heartbeat server initialization
 *
 * @returns {Promise}
 */
async function start() {
  if (server) {
    return Promise.resolve(server);
  }

  logger.info('Express web server creation');
  const app = configure(express());
  server = http.createServer(app);

  // Register the API
  app.use('/api', api());

  // After all middlewares definition:
  app.postConfig();

  await server.listen(config.port);

  return app;
}

/**
 * Close the HTTP server
 *
 * @returns
 */
async function stop() {
  if (server) {
    return new Promise(resolve => server.close(resolve));
  }

  return Promise.resolve();
}

export default {
  start,
  stop
};
