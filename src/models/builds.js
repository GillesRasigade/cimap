import _ from 'lodash';
import logger from 'chpr-logger';

import db from '../helpers/nedb';

import circleci from '../services/circleci';

const PLATFORMS = {
  circleci
};

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
      status: builds[0].status === 'success' ? 'success' : 'failed'
    };

    logger.debug({ build: build.name }, 'Update build');
    await db.builds.updateAsync(_.pick(build, 'name'), {
      $set: build
    }, { upsert: true });
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
 * Return a build from its repository name
 *
 * @export
 * @param {String} name
 * @returns {Promise}
 */
export function findByName(name) {
  return db.builds.findOneAsync({ name });
}

export default {
  findByName,
  sync,
  syncAll
};
