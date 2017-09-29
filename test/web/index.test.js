import request from 'supertest';
import { expect } from 'chai';

import web from '~/web';

describe('/heartbeat', () => {
  afterEach(async () => {
    await web.stop();
  });

  it('starts a web server on default port', async () => {
    const app = await web.start();

    const { body, status } = await request(app).get('/heartbeat');

    expect(status).to.equal(200);
    expect(body).to.deep.equal({ status: true });
  });
});
