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
  expect(utils.showNotification).toHaveBeenCalledWith('No search query provided', 'negative', 'snackbar-bookmarks');

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
  const userSelectedFileTypeList = ['jpeg', 'gif'];
  let userSelectedImageTypeList = ['illustration'];
  const userSelectedImageSizeList = ['small'];
  const userSelectedAspectRatioList = ['square'];
  const page = 2;

  const urlTest1 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedSourcesList,
    userSelectedFileTypeList,
    userSelectedImageTypeList,
    userSelectedImageSizeList,
    userSelectedAspectRatioList,
    page,
    true, // enableMatureContent
  );
  expect(urlTest1).toMatch(/\?q=dogs&page=2&page_size=20/);
  expect(urlTest1).toMatch(/license_type=commercial/);
  expect(urlTest1).toMatch(/extension=jpeg,gif&categories=illustration&size=small&aspect_ratio=square&mature=true/);

  userSelectedUseCaseList = [];
  userSelectedImageTypeList = ['illustration', 'digitized_artworks'];

  const urlTest2 = getRequestUrl(
    inputText,
    userSelectedUseCaseList,
    userSelectedLicensesList,
    userSelectedSourcesList,
    userSelectedFileTypeList,
    userSelectedImageTypeList,
    userSelectedImageSizeList,
    userSelectedAspectRatioList,
    page,
    false, // enableMatureContent
  );
  expect(urlTest2).toMatch(/\?q=dogs&page=2&page_size=20/);
  expect(urlTest2).toMatch(/license=CC0/);
  expect(urlTest2).toMatch(
    /extension=jpeg,gif&categories=illustration,digitized_artworks&size=small&aspect_ratio=square&mature=false/,
  );
});
