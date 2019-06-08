const cast = require('./cast');

module.exports = opts => {
  const defaults = {
    setToContext: true,
    values: {},
    cache: false,
    cacheExpiryInMillis: undefined,
    paramsLoaded: false,
    paramsCache: {},
    paramsLoadedAt: new Date(0)
  };
  const options = Object.assign({}, defaults, opts)

  return {
    before: (handler, next) => {
      const variables = shouldFetchFromEnv(options) ? getEnvVars(options) : options.paramsCache;

      const targetParamsObject = options.setToContext ? handler.context : process.env;
      Object.assign(targetParamsObject, variables);

      options.paramsLoaded = true;
      options.paramsCache = variables;
      options.paramsLoadedAt = new Date();
      next();
    },
  }
};

const shouldFetchFromEnv = ({
  paramsLoaded,
  paramsLoadedAt,
  cache,
  cacheExpiryInMillis
}) => {
  if (!cache || !paramsLoaded) {
    return true;
  }

  const millisSinceLastLoad = new Date().getTime() - paramsLoadedAt.getTime();
  if (cacheExpiryInMillis && millisSinceLastLoad > cacheExpiryInMillis) {
    return true;
  }

  return false;
}

const getEnvVars = ({
  values
}) => Object.keys(values).reduce((env, key) => {
  const config = values[key];

  if (Array.isArray(config)) {
    env[key] = getEnvVar(config[0], config[1], config[2]);
  } else {
    env[key] = getEnvVar(config);
  }

  return env;
}, {});

const getEnvVar = (key, type, fallback) => {
  const value = process.env[key];

  if (value !== undefined) {
    return cast(value, type);
  }

  if (fallback) {
    return fallback;
  }

  throw new ReferenceError(`Environment variable ${key} is missing`);
}
