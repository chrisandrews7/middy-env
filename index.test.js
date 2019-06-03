const middy = require('middy');
const env = require('./');

describe('Env Middleware', () => {
  test('throws when an env var is missing', done => {
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

  test('passes the enviroment variable values into context by default', done => {
    process.env.TEST2 = 'testvalue'

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

  test('passes the enviroment variable values into process.env when setToContext is false', done => {
    process.env.TEST3 = 'testvalue'

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
});