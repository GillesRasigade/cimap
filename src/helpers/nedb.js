import { promisify } from 'util';

import _ from 'lodash';
import Datastore from 'nedb';

import config from '../config';

/**
 * Database collections initialization
 */
const db = _.mapValues(config.nedb.collections, options => {
  const store = new Datastore(Object.assign({}, config.nedb.common, options));

  for (const prop in store) {
    if (typeof store[prop] === 'function') {
      store[`${prop}Async`] = promisify(store[prop].bind(store));
    }
  }

  return store;
});

module.exports = db;
