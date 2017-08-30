import { Router as createRouter } from 'express';

import errors from './errors';

/**
 * API level Router configuration
 *
 * @export
 * @returns {Object} The configured Router
 */
export default function register() {
  const router = createRouter();

  router.use('/errors', errors());

  return router;
}
