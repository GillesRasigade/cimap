export default {
  port: process.env.PORT || 3000,
  exitTimeout: parseInt(process.env.EXIT_TIMEOUT || '3000', 10), // Milliseconds
  tokens: (process.env.AUTHORIZED_TOKENS || 'dummy').split(','), // List of authorized tokens
  defaultSynchronizationInterval: parseInt(process.env.DEFAULT_SYNCHRONIZATION_INTERVAL || '60', 10), // seconds
  mongodb: {
    databases: [
      {
        name: 'cimap',
        url: process.env.MONGO_CIMAP_URL || 'mongodb://localhost:27017/cimap',
        options: {
          ssl: process.env.MONGO_CIMAP_SSL === 'true',
          sslValidate: process.env.MONGO_CIMAP_SSL_VALIDATE === 'true',
          sslCA: [new Buffer(process.env.MONGO_CIMAP_SSL_CERT || '', 'utf-8')]
        }
      }
    ]
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
