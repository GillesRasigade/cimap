import { ObjectID } from 'mongodb';
import _ from 'lodash';
import logger from 'chpr-logger';

import { cimap as db } from '../helpers/mongodb';

import circleci from '../services/circleci';

const PLATFORMS = {
  circleci
};

/**
 * CONFIGURATION
 */
export const DATABASE = 'cimap';
export const COLLECTION = 'builds';
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
 * Insert or update an existing build
 *
 * @export
 * @param {Object} build
 * @returns {Promise}
 */
export async function insertOrUpdate(build) {
  return await collection().update(_.pick(build, 'name'), {
    $set: build
  }, { upsert: true });
}

/**
 * Compute the stability of the tests
 *
 * @export
 * @param {Object} branches
 * @returns {Number}
 */
export function stability(branches) {
  let count = 0;
  let failed = 0;
  for (const branch in branches) {
    const builds = branches[branch].recent_builds;
    if (!builds) {
      count = 1;
      failed = 0;
      continue;
    }

    count++;
    failed += _.get(builds, '0', { outcome: 'success' }).outcome === 'failed' ? 1 : 0;
  }

  return Math.round((count - failed) / count * 100);
}

/**
 * Sync builds from a given Continuous Integration platform.
 *
 * @static
 * @memberof Build
 */
export async function sync(ci, interval = 0) {
  logger.info({ ci, interval }, 'Builds synchronization');
  const projects = await PLATFORMS[ci].projects();

  for (const project of projects) {
    const builds = project.branches.master.recent_builds;

    const build = {
      name: project.reponame,
      ci,
      status: builds[0].outcome === 'success' ? 'success' : 'failed',
      stability: stability(project.branches),
      url: project.vcs_url
    };

    logger.debug({ build: build.name }, 'Update build');
    await insertOrUpdate(build);
  }

  if (interval) {
    setTimeout(sync, interval, ci, interval);
  }
}

/**
 * Sync all builds
 *
 * @export
 * @param {Number} [interval]
 */
export async function syncAll(interval) {
  await _.mapValues(PLATFORMS, (value, key) => sync(key, interval));
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
 * Return a build from its repository name
 *
 * @export
 * @param {String} name
 * @returns {Promise}
 */
export function findByName(name) {
  return collection().findOne({ name });
}

/**
 * Return deep dependencies
 *
 * @export
 * @param {Object} build
 * @param {Array} [dependencies=[]]
 * @returns {Promise<Array>}
 */
export async function getDependencies(build, dependencies = []) {
  if (!build.dependencies) {
    return dependencies;
  }

  // Retrieve current dependencies builds:
  const builds = await Promise.all(_.map(build.dependencies, findByName));

  // Retrieve builds dependencies:
  const deps = await Promise.all(_.map(builds, b => getDependencies(b)));

  return _.uniq([].concat(dependencies, _.map(builds, 'name'), ...deps));
}

/**
 * Add a build dependency
 *
 * @export
 * @param {any} _id
 * @param {any} name
 */
export async function addDependency(node, name) {
  const [build, dep] = await Promise.all([
    findByName(node),
    findByName(name)
  ]);

  if (name === build.name) {
    throw new Error('A build can not depends on itself');
  }

  const dependencies = await getDependencies(dep);

  if (dependencies.indexOf(build.name) !== -1) {
    throw new Error('Cyclic dependency detected');
  }

  build.dependencies = _.uniq([].concat(build.dependencies || [], name));

  await insertOrUpdate(build);

  return build;
}

export default {
  addDependency,
  collection,
  findByName,
  get,
  insertOrUpdate,
  sync,
  syncAll
};
