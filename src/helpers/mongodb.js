import { MongoClient } from 'mongodb';
import logger from 'chpr-logger';

import config from '../config';
import models from '../models';

const DATABASES = new Map();

/**
 * Initialize the different collections based on the models definitions.
 *
 * @export
 */
export async function init() {
  for (const name in models) {
    const model = models[name];
    if (!model.DATABASE) {
      continue;
    }

    // Retrieve the database for this model:
    const db = DATABASES.get(model.DATABASE);

    // Collection creation:
    if (model.COLLECTION) {
      await db.createCollection(model.COLLECTION, {
        ...(model.COLLECTION_OPTIONS || {})
      });
    }

    // Collection validation schema initialization:
    if (model.VALIDATOR_SCHEMA) {
      await db.command({ collMod: model.COLLECTION, validator: model.VALIDATOR_SCHEMA });
    }

    // Collection indices initialization:
    if (model.INDICES) {
      for (const index of model.INDICES) {
        const [definition, options = []] = index;
        await db.collection(model.COLLECTION).ensureIndex(definition, {
          ...options,
          background: config.mongodb.ensureIndexInBackground
        });
      }
    }

    logger.info({ collection: name }, '> Collection initialized');
  }
}

/**
 * Connect the database
 *
 * @export
 */
export async function connect() {
  const databases = config.mongodb.databases;
  for (const database of databases) {
    const db = await MongoClient.connect(database.url, database.options);
    DATABASES.set(database.name, db);

    logger.info({ db: database.name }, '> Database connected');
  }

  await init();
}

/**
 * Disconnect the database
 *
 * @export
 */
export async function disconnect() {
  for (const [name, db] of DATABASES) {
    db.close();
    DATABASES.delete(name);
    logger.info({ db: name }, '> Mongodb disconnected');
  }
}

/**
 * Export the database getter
 *
 * @export
 * @param {string} name
 * @param {string} [alias=name]
 */
export function exportDatabase(name, alias = name) {
  Object.defineProperty(module.exports, alias, {
    get: () => {
      return DATABASES.get(name);
    }
  });
}

for (const database of config.mongodb.databases) {
  exportDatabase(database.name);
}

export default {
  connect,
  db: name => DATABASES.get(name),
  disconnect
};
