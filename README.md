# Middy Env

Environment variable middleware for the [middy](https://github.com/middyjs/middy) framework

[![Build Status](https://travis-ci.org/chrisandrews7/middy-env.svg?branch=master)](https://travis-ci.org/chrisandrews7/middy-env) [![Coverage Status](https://coveralls.io/repos/github/chrisandrews7/middy-env/badge.svg?branch=master)](https://coveralls.io/github/chrisandrews7/middy-env?branch=master) [![npm version](https://img.shields.io/npm/v/middy-env.svg?style=flat)](https://www.npmjs.com/package/middy-env)

## Install

```bash
npm install middy-env
```

The specified environment variables will be parsed and passed into the handler. 

## Options

- `cache` (boolean) (optional): Set it to `true` to skip further lookups of environment variables. Defaults to `false`.
- `cacheExpiryInMillis` (int) (optional): Time in milliseconds for values to remain cached. Defaults to `undefined`.
- `setToContext` (boolean) (optional): This will assign the parsed values to the `context` object
  of the function handler rather than to `process.env`. Defaults to `true`.
- `names` (object) (required): Map of environment variables to parse, where the key is the destination.  
Either provide just the environment variable key. Or provide the key, type and fallback value e.g. `['KEY', 'string', 'fallbackValue']`.

By default parameters are assigned to the function handler's `context` object. They can instead be assigned to the Node.js `process.env` object by setting the `setToContext` flag to `false`.   
If no fallback value is provided a [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) will be thrown if an environment variable is undefined.

## Supported Types
- `string`
- `int`
- `float`
- `bool`

## Usage

```js
const middy = require('middy');
const env = require('middy-env');

const handler = (event, context, callback) => {
  callback(null, `Hello ${context.firstName} ${context.lastName}`);
};

module.exports = middy(handler)
  .use(env({ 
    names: {
      firstName: ['FIRST_NAME', 'string', 'World'],
      lastName: 'LAST_NAME'
    },
    cache: true,
    cacheExpiryInMillis: 3600000
  }));
```