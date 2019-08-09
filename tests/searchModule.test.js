import { checkInputError } from '../src/firefox/popup/searchModule';

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
