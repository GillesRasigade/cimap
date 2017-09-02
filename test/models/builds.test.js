import { expect } from 'chai';
import db from '../../src/helpers/nedb';
import builds from '../../src/models/builds';

describe.only('models/builds', () => {
  afterEach(async () => {
    await db.builds.removeAsync({}, { multi: true });
  });

  it('creates a new build', async () => {
    const build = await builds.insertOrUpdate({
      name: 'test'
    });

    console.log(build);
  });
});
