const types = {
  string: value => '' + value,
  int: value => {
    if (!value.match(/^-?\d+$/)) {
      throw new TypeError(`${value} is not an integer`);
    }
    return +value;
  },
  float: value => {
    if (isNaN(value) || value === '') {
      throw new TypeError(`${value} is not a number`);
    }
    return +value;
  },
  bool: value => {
    if (!(value === 'true' || value === 'false')) {
      throw new TypeError(`${value} is not a boolean`);
    }
    return value === 'true';
  }
}

module.exports = (value, type = 'string') => {
  const castFn = types[type];

  if (!castFn) {
    throw new TypeError(`${type} is not a supported type`);
  }

  return castFn(value);
}