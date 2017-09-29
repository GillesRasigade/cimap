import 'babel-core/register';
import 'babel-polyfill';

import logger from 'chpr-logger';
import metric from 'chpr-metrics';

import config from '~/config';
import PROCESSES from '~/processes';

/**
 * Main application stopping process
 *
 * @param {string} code
 * @param {Error} [err]
 */
export const stop = (proc, code, err) => {
  if (err) {
    logger.error({ err, code }, 'Application error');
  }

  logger.info({ proc, code }, 'Application stopping');
  if (!PROCESSES[proc]) {
    return setTimeout(() => {
        logger.info(`[${code}] Application stopped`);
        process.exit(1);
      }, config.exitTimeout);
  }

  return PROCESSES[proc].stop()
    .then(() => {
      logger.info({ code }, 'Application stopped');
      setTimeout(() => {
        // @metric `stopped.${err ? 'error' : 'success'}` Error or success app
        metric.increment(`stopped.${err ? 'error' : 'success'}`);
        process.exit(err ? 1 : 0);
      }, config.exitTimeout);
    })
    .catch(err => {
      logger.error({ err, code }, 'Application crashed');
      // @metric crashed App crashed
      metric.increment('crashed');
      setTimeout(() => {
        process.exit(1);
      }, config.exitTimeout);
    });
};

/**
 * Main application entry point
 *
 * @param {string} proc   Process to start
 * @param {string[]} args Process execution arguments
 * @returns {Promise}
 */
export const start = async (proc, ...args) => {
  if (!PROCESSES[proc]) {
    throw new Error('Invalid process');
  }

  process.on('SIGTERM', () => stop(proc, 'SIGTERM'));
  process.on('SIGINT', () => stop(proc, 'SIGINT'));
  process.on('uncaughtException', err => stop(proc, 'uncaughtException', err));
  process.on('unhandledRejection', err => stop(proc, 'unhandledRejection', err));

  await PROCESSES[proc].start.apply(null, args);

  logger.info({ proc, args }, 'Application started');
  // @metric started App started
  metric.increment('started');
};

if (!module.parent) {
  start(process.argv[2], ...process.argv.slice(3))
  .catch(err => stop(process.argv[2], 'uncaughtException', err));
}
