// import { JestEnvironment } from '@jest/environment';
import { checkInputError } from '../src/popup/searchModule';
import * as utils from '../src/utils';

test('testing checkInputError', () => {
  utils.showNotification = jest.fn();

  // testing checkInputError with empty search query
  expect(() => {
    checkInputError('');
  }).toThrow('No search query provided');

  expect(utils.showNotification).toHaveBeenCalled();
  expect(utils.showNotification).toHaveBeenCalledWith(
    'No search query provided',
    'negative',
    'notification--extension-popup',
  );

  // testing checkInputError with a non-empty search
  expect(() => {
    checkInputError('dogs');
  }).not.toThrow('No search query provided');

  // showNotification should be called only in case of empty search query
  expect(utils.showNotification).toHaveBeenCalledTimes(1);
});
