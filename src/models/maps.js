import _ from 'lodash';

import db from '../helpers/nedb';

import builds from './builds';

/**
 * Create a new map
 *
 * @export
 * @param {String} name
 * @returns {Promise}
 */
export async function create() {
  const map = await db.maps.insertAsync({
    map_url: null,
    builds: []
  });

  return map;
}

/**
 * Get all
 *
 * @export
 * @returns {Promise}
 */
export async function find(query = {}) {
  return db.maps.findAsync(query);
}

/**
 * Get map by `_id`
 *
 * @export
 * @param {String} _id
 * @returns {Promise}
 */
export function get(_id) {
  return db.maps.findOneAsync({ _id });
}

/**
 * Delete a map
 *
 * @export
 * @param {String} _id
 * @returns {Promise}
 */
export async function remove(_id) {
  const map = await get(_id);

  if (map === null) {
    return null;
  }

  const res = await db.maps.removeAsync({ _id });

  if (res === 1) {
    return map;
  }

  throw new Error('Failed to remove the map');
}

/**
 * Set the map URL
 *
 * @export
 * @param {String} _id
 * @param {String} url
 * @returns {Promise}
 */
export async function setMapUrl(_id, url) {
  await db.maps.updateAsync({ _id }, {
    $set: {
      map_url: url
    }
  });

  return get(_id);
}

/**
 * Add builds to the map
 *
 * @export
 * @param {String} _id
 * @param {String[]} names
 * @returns {Promise}
 */
export async function addBuilds(_id, names) {
  const list = await Promise.all(_.map(names, name => builds.findByName(name)));

  const map = await get(_id);

  for (const build of list) {
    if (!build || _.find(map.builds, { name: build.name })) {
      continue;
    }

    await db.maps.updateAsync({ _id }, {
      $addToSet: {
        builds: {
          name: build.name
        }
      }
    });
  }

  return get(_id);
}

/**
 * Update build information for a map
 *
 * @export
 * @param {String} _id
 * @param {String} build
 * @returns {Promise}
 */
export async function updateBuild(_id, build) {
  const map = await get(_id);

  map.builds = _.map(map.builds, b => {
    if (b.name === build.name) {
      return build;
    }

    return b;
  });

  await db.maps.updateAsync({ _id }, map);

  return get(_id);
}

/**
 * Get builds of a map
 *
 * @export
 * @param {String} _id
 * @returns {Promise}
 */
export async function getBuilds(_id) {
  const map = await get(_id);

  const list = await Promise.all(_.map(map.builds, name => builds.findByName(name)));

  return _.filter(list);
}

export default {
  addBuilds,
  create,
  get,
  getBuilds,
  find,
  remove,
  setMapUrl,
  updateBuild
};
