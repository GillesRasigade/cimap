import { Router as createRouter } from 'express';

import examples from './examples';
import maps from './maps';
import builds from './builds';

/**
 * API level Router configuration
 *
 * @export
 * @returns {Object} The configured Router
 */
export default function register() {
  const router = createRouter();

  router.use('/builds', builds());
  router.use('/examples', examples());
  router.use('/maps', maps());

  return router;
}
