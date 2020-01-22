import { getSpinnerMarkup } from '../src/popup/spinner';

test('Checking spinner markup', () => {
  const spinnerMarkupForBottom = getSpinnerMarkup('for-bottom');

  expect(spinnerMarkupForBottom).toBe(`<div class="spinner spinner-for-bottom">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`);

  const spinnerMarkupOriginal = getSpinnerMarkup('original');

  expect(spinnerMarkupOriginal).toBe(`<div class="spinner spinner-original">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`);
});
