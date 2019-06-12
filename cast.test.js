const cast = require('./cast');

describe('Cast', () => {
  test('it throws when the type isnt supported', () => {
    expect(() => cast('test', 'notsupported')).toThrow('notsupported is not a supported type');
  });

  test('it returns a string when string is specified', () => {
    expect(cast('test', 'string')).toEqual('test');
  });

  test('it returns a string when no type is specified', () => {
    expect(cast('test')).toEqual('test');
  });

  test('it returns a number when int is specified', () => {
    expect(cast('123', 'int')).toEqual(123);
  });

  test('it throws when int is specified and it is not a valid number', () => {
    expect(() => cast('test', 'int')).toThrow(TypeError, 'test is not an integer');
  });

  test('it returns a float when float is specified', () => {
    expect(cast('99.9', 'float')).toEqual(99.9);
  });

  test('it throws when float is specified and it is not a valid float', () => {
    expect(() => cast('test', 'float')).toThrow(TypeError, 'test is not a number');
  });

  test('it returns a bool when bool is specified', () => {
    expect(cast('true', 'bool')).toEqual(true);
  });

  test('it throws when bool is specified and it is not a valid boolean', () => {
    expect(() => cast('test', 'bool')).toThrow(TypeError, 'test is not a boolean');
  });
});
