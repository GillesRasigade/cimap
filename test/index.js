import mongodb from '../src/helpers/mongodb';

before(async () => {
  await mongodb.connect();
  // Write before all tests hooks here
});

beforeEach(async () => {
  // Write before each tests hooks here
});

afterEach(async () => {
  // Write after each all tests hooks here
});

after(async () => {
  // Write after all tests hooks here
});
