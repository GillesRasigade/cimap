import { ObjectID } from 'mongodb';
import _ from 'lodash';

import { cimap as db } from '../helpers/mongodb';

import builds from './builds';

/**
 * CONFIGURATION
 */
export const DATABASE = 'cimap';
export const COLLECTION = 'maps';
export const COLLECTION_OPTIONS = {};
export const VALIDATOR_SCHEMA = null;
/**
 * @see http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#ensureIndex
 */
export const INDICES = null;

/**
 * Return the model collection
 *
 * @export
 * @returns {Object}
 */
export function collection() {
  return db.collection(COLLECTION);
}

/**
 * Create a new map
 *
 * @export
 * @param {String} name
 * @returns {Promise}
 */
export async function create() {
  const res = await collection().insert({
    map_url: null,
    builds: []
  });

  return res.ops[0];
}

/**
 * Get all
 *
 * @export
 * @returns {Promise}
 */
export async function find(query = {}) {
  return collection().find(query).toArray();
}

/**
 * Get map by `_id`
 *
 * @export
 * @param {String} _id
 * @returns {Promise}
 */
export function get(_id) {
  return collection().findOne({
    _id: new ObjectID(_id)
  });
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

  const res = await collection().remove({
    _id: new ObjectID(_id)
  });

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
export async function setMapUrl(_id, url, width, height) {
  await collection().update({
    _id: new ObjectID(_id)
  }, {
    $set: {
      map_url: url,
      width,
      height
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

    await collection().update({
      _id: new ObjectID(_id)
    }, {
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
 * Remove builds from the map
 *
 * @export
 * @param {String} _id
 * @param {String[]} names
 * @returns {Promise}
 */
export async function removeBuilds(_id, names) {
  const map = await get(_id);

  map.builds = map.builds.filter(build => names.indexOf(build.name) === -1);

  await collection().update({
    _id: new ObjectID(_id)
  }, {
    $set: {
      builds: map.builds
    }
  });

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

  await collection().update({
    _id: new ObjectID(_id)
  }, map);

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

  const list = await Promise.all(_.map(map.builds, ({ name }) => builds.findByName(name)));

  return _.filter(list);
}

export default {
  addBuilds,
  collection,
  create,
  get,
  getBuilds,
  find,
  remove,
  removeBuilds,
  setMapUrl,
  updateBuild
};
