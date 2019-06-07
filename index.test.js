const { promisify } = require('util');
const middy = require('middy');
const env = require('./');

describe('Env Middleware', () => {
  test('it throws when an env var is missing', done => {
    const handler = middy(
      (_, __, callback) => callback()
    )
      .use(
        env({
          names: {
            test: 'TEST',
          }
        })
      );

    handler({}, {}, (err) => {
      expect(err).toEqual(new ReferenceError('Environment variable TEST is missing'));
      done();
    })
  });

  test('it passes the enviroment variable values into context by default', done => {
    process.env.TEST2 = 'testvalue';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 'testvalue');
        done();
      })
      .use(
        env({
          names: {
            test: 'TEST2',
          }
        })
      );

    handler({}, {}, (err) => err && done.fail(err));
  });

  test('it passes the enviroment variable values into process.env when setToContext is false', done => {
    process.env.TEST3 = 'testvalue';

    const handler = middy(
      () => {
        expect(process.env).toHaveProperty('test', 'testvalue');
        done();
      })
      .use(
        env({
          names: {
            test: 'TEST3',
          },
          setToContext: false
        })
      );

    handler({}, {}, (err) => err && done.fail(err));
  });

  test('it caches the environment variable values when cache is set to true', async () => {
    expect.assertions(2);
    process.env.TEST4 = 'oldvalue';

    const handler = middy(
      (_, context, callback) => {
        process.env.TEST4 = 'newvalue';
        expect(context).toHaveProperty('test', 'oldvalue');
        callback();
      })
      .use(
        env({
          names: {
            test: 'TEST4',
          },
          cache: true,
        })
      );
      
      await promisify(handler)({}, {});
      await promisify(handler)({}, {});
  });

  test('it gets the environment variable values again when the cache has expired', async () => {
    expect.assertions(1);

    let executionCount = 0;
    process.env.TEST5 = 'oldvalue';

    const handler = middy(
      (_, context, callback) => {
        process.env.TEST5 = 'newvalue';

        if(++executionCount === 2) {
          expect(context).toHaveProperty('test', 'newvalue');
        }

        callback();
      })
      .use(
        env({
          names: {
            test: 'TEST5',
          },
          cacheExpiryInMillis: 1,
          cache: true,
        })
      );
      
      await promisify(handler)({}, {});
      await new Promise(resolve => setTimeout(resolve, 2)); // Let the cache expire
      await promisify(handler)({}, {});
  });
});