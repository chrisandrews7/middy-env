const cast = require('./cast');

const shouldFetchFromEnv = ({
  paramsLoaded,
  paramsLoadedAt,
  cache,
  cacheExpiryInMillis,
}) => {
  if (!cache || !paramsLoaded) {
    return true;
  }

  const millisSinceLastLoad = new Date().getTime() - paramsLoadedAt.getTime();
  if (cacheExpiryInMillis && millisSinceLastLoad > cacheExpiryInMillis) {
    return true;
  }

  return false;
};

const getEnvVar = (key, type, fallback) => {
  const value = process.env[key];

  if (value !== undefined) {
    return cast(value, type);
  }

  if (fallback) {
    return fallback;
  }

  throw new ReferenceError(`Environment variable ${key} is missing`);
};

const getEnvVars = ({
  names,
}) => Object.keys(names).reduce((env, key) => {
  const config = names[key];

  if (Array.isArray(config)) {
    return Object.assign(env, {
      [key]: getEnvVar(config[0], config[1], config[2]),
    });
  }

  return Object.assign(env, {
    [key]: getEnvVar(config),
  });
}, {});


module.exports = (opts) => {
  const defaults = {
    setToContext: true,
    names: {},
    cache: false,
    cacheExpiryInMillis: undefined,
    paramsLoaded: false,
    paramsCache: {},
    paramsLoadedAt: new Date(0),
  };
  const options = Object.assign({}, defaults, opts);

  return {
    before: (handler, next) => {
      const variables = shouldFetchFromEnv(options) ? getEnvVars(options) : options.paramsCache;

      const targetParamsObject = options.setToContext ? handler.context : process.env;
      Object.assign(targetParamsObject, variables);

      options.paramsLoaded = true;
      options.paramsCache = variables;
      options.paramsLoadedAt = new Date();

      // middy v2 removed the next function in favour of simply returning from the function
      if (next) {
        next();
      }
    },
  };
};
