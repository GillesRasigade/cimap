import { expect } from 'chai';
import db from '../../src/helpers/nedb';
import builds from '../../src/models/builds';

describe.only('models/builds', () => {
  afterEach(async () => {
    await builds.collection().remove({}, { multi: true });
  });

  it('creates a new build', async () => {
    const build = await builds.insertOrUpdate({
      name: 'test'
    });
  });
});
