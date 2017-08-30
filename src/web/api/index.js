import { Router as createRouter } from 'express';

import examples from './examples';

/**
 * API level Router configuration
 *
 * @export
 * @returns {Object} The configured Router
 */
export default function register() {
  const router = createRouter();

  router.use('/examples', examples());

  return router;
}
