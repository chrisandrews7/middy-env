const types = {
  string: value => `${value}`,
  int: (value) => {
    if (!parseInt(value, 10)) {
      throw new TypeError(`${value} is not an integer`);
    }
    return parseInt(value, 10);
  },
  float: (value) => {
    if (!parseFloat(value)) {
      throw new TypeError(`${value} is not a number`);
    }
    return parseFloat(value);
  },
  bool: (value) => {
    if (!(value === 'true' || value === 'false')) {
      throw new TypeError(`${value} is not a boolean`);
    }
    return value === 'true';
  },
};

module.exports = (value, type = 'string') => {
  const castFn = types[type];

  if (!castFn) {
    throw new TypeError(`${type} is not a supported type`);
  }

  return castFn(value);
};
