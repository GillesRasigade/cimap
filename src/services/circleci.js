import request from 'superagent';

import config from '../config';

// API Entry point
const CIRCLECI_API_URL = 'https://circleci.com/api/v1.1';

/**
 * Retrieve the CircleCi projects
 *
 * @export
 * @returns
 */
export async function projects() {
  const { body } = await request.get(`${CIRCLECI_API_URL}/projects`)
    .set('Accept', 'application/json')
    .query({ 'circle-token': config.ci.circleci.token });

    return body;
}

export default {
  projects
};
