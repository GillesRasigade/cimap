import logger from 'chpr-logger';

import builds from '../models/builds';

/**
 * Minimal heartbeat server initialization
 *
 * @returns {Promise}
 */
async function start() {
  logger.debug('Syncer worker creation');

  await builds.syncAll();
}

/**
 * Close the HTTP server
 *
 * @returns
 */
async function stop() {
  return Promise.resolve();
}

export default {
  start,
  stop
};
