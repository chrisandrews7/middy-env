# Middy Env

Environment variable middleware for the [middy](https://github.com/middyjs/middy) framework

[![Build Status](https://travis-ci.org/chrisandrews7/middy-env.svg?branch=master)](https://travis-ci.org/chrisandrews7/middy-env)

## Install

```bash
npm install middy-env
```

The specified environment variables will be parsed and passed into the handler. If any of the values are missing this will cause a [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) to be thrown.  
By default parameters are assigned to the function handler's `context` object. They can instead be assigned to the Node.js `process.env` object by setting the `setToContext` flag to `false`.  

## Options

- `cache` (boolean) (optional): Defaults to `false`. Set it to `true` to skip further lookups to environment variables
- `cacheExpiryInMillis` (int) (optional): Defaults to `undefined`. Use this option to invalidate cached parameter values
- `names` (object) (required): Map of parameters to fetch from environment, where the key is the destination, and value is the environment variable name.
  Example: `{names: {importedKeyName: 'NAME_OF_VAR_IN_ENV'}}`
- `setToContext` (boolean) (optional): This will assign parameters to the `context` object
  of the function handler rather than to `process.env`. Defaults to `true`

## Sample Usage
```bash
$ export PERSON='Dave'
```

```js
const middy = require('middy');
const env = require('middy-env');

const handler = (event, context, callback) => {
  callback(null, `Hello ${context.person}`);
};

module.exports = middy(someHandler)
  .use(env({ 
    names: {
      person: 'PERSON'
    }
  });
```