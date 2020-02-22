// import { JestEnvironment } from '@jest/environment';
import { checkInputError, getRequestUrl } from '../src/popup/searchModule';
import * as utils from '../src/utils';

utils.showNotification = jest.fn();

test('testing checkInputError', () => {
  // testing checkInputError with empty search query
  expect(() => {
    checkInputError('');
  }).toThrow('No search query provided');

  expect(utils.showNotification).toHaveBeenCalled();
  expect(utils.showNotification).toHaveBeenCalledWith(
    'No search query provided',
    'negative',
    'snackbar-bookmarks',
  );

  // testing checkInputError with a non-empty search
  expect(() => {
    checkInputError('dogs');
  }).not.toThrow('No search query provided');

  // showNotification should be called only in case of empty search query
  expect(utils.showNotification).toHaveBeenCalledTimes(1);
});

test('testing getRequestUrl', () => {
  const inputText = 'dogs';
  let userSelectedUseCaseList = ['commercial'];
  const userSelectedLicensesList = ['CC0'];
  const userSelectedSourcesList = ['sciencemuseum'];
  const page = 2;

  const test1 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedSourcesList,
    page,
  );
  expect(test1).toMatch(/\?q=dogs&page=2&page_size=20/);
  expect(test1).toMatch(/license_type=commercial/);

  userSelectedUseCaseList = [];

  const test2 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedSourcesList,
    page,
  );
  expect(test1).toMatch(/\?q=dogs&page=2&page_size=20/);
  expect(test2).toMatch(/license=CC0/);
});
