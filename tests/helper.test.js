import { isObjectEmpty, unicodeToString } from '../src/popup/helper';

test('Testing isObjectEmpty', () => {
  const test1 = isObjectEmpty({});
  const test2 = isObjectEmpty({ foo: 'bar' });

  expect(test1).toBe(true);
  expect(test2).toBe(false);
});

test('Testing unicodeToString function', () => {
  const test1 = unicodeToString(undefined);
  const test2 = unicodeToString(null);
  const test3 = unicodeToString(42);
  const test4 = unicodeToString('good bye \u5c0f\u82d1');

  expect(test1).toBe('');
  expect(test2).toBe('');
  expect(test3).toBe('');
  expect(test4).toBe('good bye 小苑');
});
