module.exports = opts => {
  const defaults = {
    setToContext: true,
  }
  const options = Object.assign({}, defaults, opts)

  return {
    before: (handler, next) => {
      let env = {};

      for (const key in options.names) {
        const value = process.env[options.names[key]];
        if (value === undefined) {
          throw new ReferenceError('Environment variable ' + options.names[key] + ' is missing');
        }
        env[key] = value;
      }

      const targetParamsObject = options.setToContext ? handler.context : process.env;
      Object.assign(targetParamsObject, env);
      next();
    },
  }
};