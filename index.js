module.exports = opts => {
  const defaults = {
    setToContext: true,
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

const getEnvVars = ({
  names
}) => Object.keys(names).reduce((env, key) => {
  const value = process.env[names[key]];

  if (value === undefined) {
    throw new ReferenceError('Environment variable ' + names[key] + ' is missing');
  }

  env[key] = value;
  return env;
}, {});

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