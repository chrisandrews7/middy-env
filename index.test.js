const sleep = require('util').promisify(setTimeout);
const middy = require('@middy/core');
const middyv1 = require('@middy/core-v1');
const env = require('./');

describe('Env Middleware', () => {
  test('it throws when an env var is missing if no fallback is provided', async () => {
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

    await expect(handler({}, {})).rejects.toEqual(new ReferenceError('Environment variable TEST1 is missing'));
  });

  test('it passes the enviroment variable values into context by default', async () => {
    process.env.TEST2 = 'testvalue';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 'testvalue');
      },
    )
      .use(
        env({
          names: {
            test: 'TEST2',
          },
        }),
      );

    await handler({}, {});
  });

  test('it passes the enviroment variable values into process.env when setToContext is false', async () => {
    process.env.TEST3 = 'testvalue';

    const handler = middy(
      () => {
        expect(process.env).toHaveProperty('test', 'testvalue');
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

    await handler({}, {});
  });

  test('it does not throw when a falsy non undefined envionment value is provided', async () => {
    process.env.TEST4 = '';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', '');
      },
    )
      .use(
        env({
          names: {
            test: 'TEST4',
          },
        }),
      );

    await handler({}, {});
  });

  test('it type casts the environment variable value', async () => {
    process.env.TEST5 = '123';

    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 123);
      },
    )
      .use(
        env({
          names: {
            test: ['TEST5', 'int'],
          },
        }),
      );

    await handler({}, {});
  });

  test('it uses the fallback value when no environment variable value is found', async () => {
    const handler = middy(
      (_, context) => {
        expect(context).toHaveProperty('test', 'fallback');
      },
    )
      .use(
        env({
          names: {
            test: ['TEST6', 'string', 'fallback'],
          },
        }),
      );

    await handler({}, {});
  });

  test('it caches the environment variable values when cache is set to true', async () => {
    expect.assertions(2);
    process.env.TEST7 = 'oldvalue';

    const handler = middy(
      (_, context) => {
        process.env.TEST7 = 'newvalue';
        expect(context).toHaveProperty('test', 'oldvalue');
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

    await handler({}, {});
    await handler({}, {});
  });

  test('it gets the environment variable values again when the cache has expired', async () => {
    expect.assertions(1);

    let executionCount = 0;
    process.env.TEST8 = 'oldvalue';

    const handler = middy(
      (_, context) => {
        process.env.TEST8 = 'newvalue';

        executionCount += 1;
        if (executionCount === 2) {
          expect(context).toHaveProperty('test', 'newvalue');
        }
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

    await handler({}, {});
    // Let the cache expire
    await sleep(2);
    await handler({}, {});
  });

  test('it is backwards compatible with middy v1', async () => {
    process.env.TEST2 = 'testvalue';

    const handler = middyv1(
      (_, context, next) => {
        expect(context).toHaveProperty('test', 'testvalue');
        next();
      },
    )
      .use(
        env({
          names: {
            test: 'TEST2',
          },
        }),
      );

    await handler({}, {});
  });
});
