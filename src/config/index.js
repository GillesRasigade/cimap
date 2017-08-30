export default {
  port: process.env.PORT || 3000,
  exitTimeout: parseInt(process.env.EXIT_TIMEOUT || '3000', 10), // Milliseconds
  nedb: {
    common: {
      autoload: true
    },
    collections: {
      maps: {
        filename: './maps.db'
      },
      builds: {
        filename: './builds.db'
      }
    }
  },
  ci: {
    circleci: {
      token: process.env.CIRCLECI_TOKEN || ''
    },
    travisci: {
      token: process.env.TRAVISCI_TOKEN || ''
    }
  }
};
