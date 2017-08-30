# cimap

> Continuous Integration Mapping Service

## [Configuration](./src/config/index.js)

Key | Default | Unit | Comment |
---: | --- | --- | --- |
`PORT` | 3000 |  | Configuration path
`EXIT_TIMEOUT` | 3000 | ms | Delay before gracefully stop the process

## [Metrics](./docs/metrics.md)

Metric | Type | Comment |
---: | --- | --- |
`start` | increment | Incremented each time the application start

## Installation

```bash
nvm i
npm install
```

## Tests

```bash
# Run the mocha tests only
npm run mocha

# Run the eslint only
npm run eslint

# Run the coverage withuut eslint
npm run mocha

# Run all the tests
npm test
```