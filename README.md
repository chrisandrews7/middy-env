# Middy Env

Environment variable middleware for the [middy](https://github.com/middyjs/middy) framework

## Install

```bash
npm install middy-env
```

## Usage
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