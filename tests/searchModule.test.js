// import { JestEnvironment } from '@jest/environment';
import { checkInputError, getRequestUrl } from '../src/popup/searchModule';
import * as utils from '../src/utils';

utils.showNotification = jest.fn();

test('testing checkInputError', () => {
  // testing checkInputError with empty search query
  checkInputError('');
  expect(utils.showNotification).toHaveBeenCalled();
  expect(utils.showNotification).toHaveBeenCalledWith(
    'No search query provided',
    'negative',
    'snackbar-bookmarks',
  );

  checkInputError('dogs');
  // showNotification should be called only in case of empty search query
  expect(utils.showNotification).toHaveBeenCalledTimes(1);
});

test('testing getRequestUrl', () => {
  const inputText = 'dogs';
  let userSelectedUseCaseList = ['commercial'];
  const userSelectedLicensesList = ['CC0'];
  const userSelectedProvidersList = ['sciencemuseum'];
  const page = 2;

  const test1 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    page,
  );
  expect(test1).toMatch(/\?q=dogs&page=2&pagesize=20/);
  expect(test1).toMatch(/lt=commercial/);

  userSelectedUseCaseList = [];

  const test2 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedProvidersList,
    page,
  );
  expect(test1).toMatch(/\?q=dogs&page=2&pagesize=20/);
  expect(test2).toMatch(/li=CC0/);
});
