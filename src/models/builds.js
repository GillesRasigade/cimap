import _ from 'lodash';
import logger from 'chpr-logger';

import db from '../helpers/nedb';

import circleci from '../services/circleci';

const PLATFORMS = {
  circleci
};

/**
 * Insert or update an existing build
 *
 * @export
 * @param {Object} build
 * @returns {Promise}
 */
export async function insertOrUpdate(build) {
  return await db.builds.updateAsync(_.pick(build, 'name'), {
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
      failed = 1;
      continue;
    }

    count += builds.length;
    failed += _.filter(builds, { outcome: 'failed'}).length;
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
  return db.builds.findOneAsync({ _id });
}

/**
 * Return a build from its repository name
 *
 * @export
 * @param {String} name
 * @returns {Promise}
 */
export function findByName(name) {
  return db.builds.findOneAsync({ name });
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
  findByName,
  get,
  insertOrUpdate,
  sync,
  syncAll
};
