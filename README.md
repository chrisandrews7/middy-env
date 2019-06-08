# Middy Env

Environment variable middleware for the [middy](https://github.com/middyjs/middy) framework

[![Build Status](https://travis-ci.org/chrisandrews7/middy-env.svg?branch=master)](https://travis-ci.org/chrisandrews7/middy-env) [![Coverage Status](https://coveralls.io/repos/github/chrisandrews7/middy-env/badge.svg?branch=master)](https://coveralls.io/github/chrisandrews7/middy-env?branch=master) [![npm version](https://img.shields.io/npm/v/middy-env.svg?style=flat)](https://www.npmjs.com/package/middy-env)

## Install

```bash
npm install middy-env
```

The specified environment variables will be parsed and passed into the handler. 
By default parameters are assigned to the function handler's `context` object. They can instead be assigned to the Node.js `process.env` object by setting the `setToContext` flag to `false`.  

## Options

- `cache` (boolean) (optional): Defaults to `false`. Set it to `true` to skip further lookups of environment variables
- `cacheExpiryInMillis` (int) (optional): Defaults to `undefined`. Use this option to invalidate cached values
- `setToContext` (boolean) (optional): This will assign the parsed values to the `context` object
  of the function handler rather than to `process.env`. Defaults to `true`
- `values` (object) (required): Map of environment variables to parse, where the key is the destination.  
Either provide just the environment variable key. Or provide the key, type and fallback value e.g. `['KEY', 'string', 'fallbackValue']`.  
The following types are supported: `string`, `int`, `float`, `bool`.  
If no fallback value is provided a [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) will be thrown.  

## Usage

```js
const middy = require('middy');
const env = require('middy-env');

const handler = (event, context, callback) => {
  callback(null, `Hello ${context.firstName} ${context.lastName}`);
};

module.exports = middy(handler)
  .use(env({ 
    values: {
      firstName: ['FIRST_NAME', 'string', 'World'],
      lastName: 'LAST_NAME'
    },
    cache: true,
    cacheExpiryInMillis: 3600000
  });
```