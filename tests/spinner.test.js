import { getSpinnerMarkup } from '../src/popup/spinner';

test('Checking spinner markup', () => {
  const spinnerMarkup = getSpinnerMarkup();

  expect(spinnerMarkup).toBe(`<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
});
