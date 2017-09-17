import logger from 'chpr-logger';

import config from '../config';
import mongodb from '../helpers/mongodb';
import builds from '../models/builds';

/**
 * Minimal heartbeat server initialization
 *
 * @returns {Promise}
 */
async function start() {
  logger.debug('Syncer worker creation');

  logger.info('Mongodb connection');
  await mongodb.connect();

  await builds.syncAll(config.defaultSynchronizationInterval * 1000);
}

/**
 * Close the HTTP server
 *
 * @returns
 */
async function stop() {
  await mongodb.disconnect();
  logger.info('Mongodb disconnected');

  return Promise.resolve();
}

export default {
  start,
  stop
};
