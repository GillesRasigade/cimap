import bodyParser from 'body-parser';

import config from '../config';

/**
 * Express post swagger registration configuration
 *
 * @param {Express} app Express application instance
 * @return {void}
 */
function post(app) {
  /**
   * Note: the following `next` is important because if its not present, the function
   * will not be called at all.
   */
  app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
    if (typeof err !== 'object') {
      // If the object is not an Error, create a representation that appears to be
      err = { // eslint-disable-line no-param-reassign
        status: 500,
        message: String(err) // Coerce to string
      };
    } else {
      // Ensure that err.message is enumerable (It is not by default)
      Object.defineProperty(err, 'message', { enumerable: true });
      Object.defineProperty(err, 'status', {
        enumerable: true,
        value: err.status || 500
      });
    }

    return res.status(err.status).json({
      code: err.status,
      message: err.message
    });
  });

  return app;
}

/**
 * Configure the Express app with default configuration
 *
 * @export
 * @param {Express} Express application
 * @returns {Object} Configured Express application
 */
export function configure(app) {
  /**
   * Heartbeat activation
   */
  app.get('/heartbeat', (req, res) => res.status(200).json({
    status: true
  }));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  // Global token access
  app.use((req, res, next) => {
    const { token } = req.query;
    if (config.tokens.indexOf(token) === -1) {
      return res.status(403).send('Forbidden');
    }

    next();
  });

  app.set('port', config.port);

  app.postConfig = () => post(app);

  return app;
}
