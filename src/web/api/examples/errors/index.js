import { Router as createRouter } from 'express';

/**
 * API controller example on throwed example
 *
 * @export
 */
export function throwController() {
  throw new Error('Controlled throwed error');
}

/**
 * API controller example on Error sent with next
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export function nextController(req, res, next) {
  next('Controlled next error');
}

/**
 * API controller example on Error throwed after async task
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns {Promise}
 */
export async function asyncController(req, res, next) {
  try {
    await new Promise(resolve => setTimeout(resolve, req.query.timeout || 2500));

    throw new Error('Controlled async error');
  } catch (err) {
    next(err);
  }
}

/**
 * API controller example on unhandled async Error
 *
 * @export
 * @returns {Promise}
 */
export async function unhandledRejectionController() {
  throw new Error('Unhandled rejection error');
}

/**
 * Controllers registration function
 *
 * @export
 * @returns {Object} The configured Router
 */
export default function register() {
  const router = createRouter();

  router.use('/throw', throwController);
  router.use('/next', nextController);
  router.use('/async', asyncController);
  router.use('/unhandled_rejection', unhandledRejectionController);

  return router;
}
