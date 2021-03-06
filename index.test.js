const middy = require('middy');
const env = require('./');

describe('Env Middleware', () => {
  test('it throws when an env var is missing if no fallback is provided', (done) => {
    const handler = middy(
      (_, __, callback) => callback(),
    )
      .use(
        env({
          names: {
            test: 'TEST1',
          },
        }),
      );

    handler({}, {}, (err) => {
      expect(err).toEqual(new ReferenceError('Environment variable TEST1 is missing'));
      done();
    });
  });

  test('it passes the enviroment variable values into context by default', (done) => {
    process.env.TEST2 = 'testvalue';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 'testvalue');
        done();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST2',
          },
        }),
      );

    handler({}, {}, err => err && done.fail(err));
  });

  test('it passes the enviroment variable values into process.env when setToContext is false', (done) => {
    process.env.TEST3 = 'testvalue';

    const handler = middy(
      () => {
        expect(process.env).toHaveProperty('test', 'testvalue');
        done();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST3',
          },
          setToContext: false,
        }),
      );

    handler({}, {}, err => err && done.fail(err));
  });

  test('it does not throw when a falsy non undefined envionment value is provided', (done) => {
    process.env.TEST4 = '';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', '');
        done();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST4',
          },
        }),
      );

    handler({}, {}, err => err && done.fail(err));
  });

  test('it type casts the environment variable value', (done) => {
    process.env.TEST5 = '123';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 123);
        done();
      },
    )
      .use(
        env({
          names: {
            test: ['TEST5', 'int'],
          },
        }),
      );

    handler({}, {}, err => err && done.fail(err));
  });

  test('it uses the fallback value when no environment variable value is found', (done) => {
    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 'fallback');
        done();
      },
    )
      .use(
        env({
          names: {
            test: ['TEST6', 'string', 'fallback'],
          },
        }),
      );

    handler({}, {}, err => err && done.fail(err));
  });

  test('it caches the environment variable values when cache is set to true', (done) => {
    expect.assertions(2);
    process.env.TEST7 = 'oldvalue';

    const handler = middy(
      (_, context, callback) => {
        process.env.TEST7 = 'newvalue';
        expect(context).toHaveProperty('test', 'oldvalue');
        callback();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST7',
          },
          cache: true,
        }),
      );

    handler({}, {}, () => {
      handler({}, {}, () => {
        done();
      });
    });
  });

  test('it gets the environment variable values again when the cache has expired', (done) => {
    expect.assertions(1);

    let executionCount = 0;
    process.env.TEST8 = 'oldvalue';

    const handler = middy(
      (_, context, callback) => {
        process.env.TEST8 = 'newvalue';

        executionCount += 1;
        if (executionCount === 2) {
          expect(context).toHaveProperty('test', 'newvalue');
        }

        callback();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST8',
          },
          cacheExpiryInMillis: 1,
          cache: true,
        }),
      );

    handler({}, {}, () => {
      // Let the cache expire
      setTimeout(() => {
        handler({}, {}, () => {
          done();
        });
      }, 2);
    });
  });
});
