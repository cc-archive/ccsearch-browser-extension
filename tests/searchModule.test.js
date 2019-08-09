import { checkInputError, getRequestUrl } from '../src/firefox/popup/searchModule';

test('testing checkInputError', () => {
  // error message placeholder
  document.body.innerHTML = `<div>
      <span id="error-message"></span>
    </div>`;

  // testing empty inputText
  expect(() => {
    checkInputError('', 'error-message');
  }).toThrow('Please enter a search query');

  expect(document.getElementById('error-message').textContent).toEqual(
    'Please enter a search query',
  );

  // testing non-empty inputText
  checkInputError('hello', 'error-message');
  expect(document.getElementById('error-message').textContent).toEqual('');
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
