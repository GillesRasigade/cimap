export default {
  port: process.env.PORT || 3000,
  exitTimeout: parseInt(process.env.EXIT_TIMEOUT || '3000', 10), // Milliseconds
  tokens: (process.env.AUTHORIZED_TOKENS || 'dummy').split(','), // List of authorized tokens
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
