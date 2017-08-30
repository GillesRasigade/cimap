import { Router as createRouter } from 'express';

import builds from '../../../models/builds';

/**
 * Return a
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export async function getBuild(req, res, next) {
  try {
    const build = await builds.findByName(req.params.name);

    if (build === null) {
      return res.status(404).json({
        code: 404,
        message: 'Build not found'
      });
    }

    res.json(build);
  } catch (err) {
    next(err);
  }
}

/**
 * Controllers registration function
 *
 * @export
 * @returns {Object} The configured Router
 */
export default function register() {
  const router = createRouter();

  router.get('/:name', getBuild);

  return router;
}
