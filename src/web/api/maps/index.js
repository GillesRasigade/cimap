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
 * Find all maps
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function find(req, res, next) {
  try {
    const list = await maps.find();

    res.json(list);
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
 * Remove a map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function remove(req, res, next) {
  try {
    const map = await maps.remove(req.params.id);

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
 * Remove builds from the map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function removeBuilds(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        code: 400,
        message: 'Missing or invalid builds'
      });
    }
    const map = await maps.removeBuilds(req.params.id, req.body);

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
 * Update a build from a map
 *
 * @export
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function updateBuild(req, res, next) {
  try {
    const map = await maps.updateBuild(req.params.id, Object.assign(req.body, {
      name: req.params.name
    }));

    res.json(map);
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
  router.get('/', find);
  router.get('/:id', get);
  router.delete('/:id', remove);
  router.put('/:id/update-map', setMapUrl);
  router.post('/:id/builds', addBuilds);
  router.delete('/:id/builds', removeBuilds);
  router.put('/:id/builds/:name', updateBuild);
  router.get('/:id/builds', getBuilds);

  return router;
}
