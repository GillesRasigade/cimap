import { Router as createRouter } from 'express';

import maps from '../../../models/maps';

/**
 * Create a new map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function create(req, res, next) {
  try {
    const map = await maps.create();

    res.json(map);
  } catch (err) {
    next(err);
  }
}

/**
 * Get a map definition
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function get(req, res, next) {
  try {
    const map = await maps.get(req.params.id);

    if (map === null) {
      return res.status(404).json({
        code: 404,
        message: 'Map not found'
      });
    }

    res.json(map);
  } catch (err) {
    next(err);
  }
}

/**
 * Update the map URL
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function setMapUrl(req, res, next) {
  try {
    if (!req.body.map_url) {
      return res.status(400).json({
        code: 400,
        message: 'Missing map URL'
      });
    }

    const map = await maps.setMapUrl(req.params.id, req.body.map_url);

    res.json(map);
  } catch (err) {
    next(err);
  }
}

/**
 * Add builds to the map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function addBuilds(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        code: 400,
        message: 'Missing or invalid builds'
      });
    }
    const map = await maps.addBuilds(req.params.id, req.body);

    res.json(map);
  } catch (err) {
    next(err);
  }
}

/**
 * Get builds from a map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function getBuilds(req, res, next) {
  try {
    const builds = await maps.getBuilds(req.params.id);

    res.json(builds);
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

  router.post('/', create);
  router.get('/:id', get);
  router.put('/:id/update-map', setMapUrl);
  router.post('/:id/builds', addBuilds);
  router.get('/:id/builds', getBuilds);

  return router;
}
