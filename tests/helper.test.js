import { isObjectEmpty } from '../src/firefox/popup/helper';

test('Testing isObjectEmpty', () => {
  const test1 = isObjectEmpty({});
  const test2 = isObjectEmpty({ foo: 'bar' });

  expect(test1).toBe(true);
  expect(test2).toBe(false);
});
