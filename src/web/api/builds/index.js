import { Router as createRouter } from 'express';

import builds from '~/models/builds';

/**
 * Return a specific build
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
 * Add a dependency to a build
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export async function addDependency(req, res, next) {
  try {
    const build = await builds.addDependency(req.params.node_name, req.params.dependency_name);

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
  router.post('/:node_name/depends/:dependency_name', addDependency);

  return router;
}
