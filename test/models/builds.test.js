import { expect } from 'chai';
import builds from '~/models/builds';

describe('models/builds', () => {
  beforeEach(async () => {
    await builds.collection().remove({}, { multi: true });
  });

  it('creates a new build', async () => {
    const build = await builds.insertOrUpdate({
      name: 'test'
    });

    expect(build).to.have.nested.property('result.n', 1);
    expect(build).to.have.nested.property('result.nModified', 0);

    expect(build).to.have.nested.property('result.upserted');
    const upserted = build.result.upserted.shift();
    expect(upserted).to.have.property('_id');
  });
});
