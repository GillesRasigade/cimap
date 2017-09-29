import request from 'supertest';
import { expect } from 'chai';

import web from '~/web';

describe('/api/examples/errors', () => {
  let app;
  beforeEach(async () => {
    app = await web.start();
  });

  afterEach(async () => {
    await web.stop();
  });

  describe('/throw', () => {
    it('returns a 500 response status with valid error object', async () => {
      const { body, status } = await request(app)
        .get('/api/examples/errors/throw')
        .query({ token: 'dummy' });

      expect(status).to.equal(500);
      expect(body).to.deep.equal({
        code: 500,
        message: 'Controlled throwed error'
      });
    });
  });

  describe('/next', () => {
    it('returns a 500 response status with valid error object', async () => {
      const { body, status } = await request(app)
        .get('/api/examples/errors/next')
        .query({ token: 'dummy' });

      expect(status).to.equal(500);
      expect(body).to.deep.equal({
        code: 500,
        message: 'Controlled next error'
      });
    });
  });

  describe('/async', () => {
    it('returns a 500 response status with valid error object', async () => {
      const { body, status } = await request(app)
        .get('/api/examples/errors/async')
        .query({ token: 'dummy' })
        .query({ timeout: 50 });

      expect(status).to.equal(500);
      expect(body).to.deep.equal({
        code: 500,
        message: 'Controlled async error'
      });
    });
  });

  describe('/unhandled_rejection', () => {
    it('crashes the server with the error code unhandledRejection', async () => {
      const promise = new Promise(resolve => {
        process.on('unhandledRejection', err => {
          process.removeAllListeners('unhandledRejection');
          resolve(err);
        });
      });

      try {
        await request(app)
          .get('/api/examples/errors/unhandled_rejection')
          .query({ token: 'dummy' })
          .timeout(50);
      } catch (error) {
        expect(error.message).to.equal('Timeout of 50ms exceeded');
      }

      const err = await promise;
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.equal('Unhandled rejection error');
    });
  });
});
