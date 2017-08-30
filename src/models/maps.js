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

  for (const build of list) {
    if (!build) {
      continue;
    }

    await db.maps.updateAsync({ _id }, {
      $addToSet: {
        builds: build.name
      }
    });
  }

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
  setMapUrl
};
