import { getSpinnerDiv } from '../src/popup/spinner';

test('Checking spinner markup', () => {
  const spinnerMarkupForBottom = getSpinnerDiv('for-bottom');

  expect(spinnerMarkupForBottom.classList).toContain('spinner');
  expect(spinnerMarkupForBottom.classList).toContain('spinner-for-bottom');
  expect(spinnerMarkupForBottom.childElementCount).toBe(3);
  const spinnerForBottomChildNodes = spinnerMarkupForBottom.childNodes;
  for (let i = 0; i < 3; i += 1) {
    expect(spinnerForBottomChildNodes[i].classList).toContain(`bounce${i + 1}`);
  }

  const spinnerMarkupOriginal = getSpinnerDiv('original');
  expect(spinnerMarkupOriginal.classList).toContain('spinner');
  expect(spinnerMarkupOriginal.classList).toContain('spinner-original');
  expect(spinnerMarkupOriginal.childElementCount).toBe(3);
  const spinnerOriginalChildNodes = spinnerMarkupOriginal.childNodes;
  for (let i = 0; i < 3; i += 1) {
    expect(spinnerOriginalChildNodes[i].classList).toContain(`bounce${i + 1}`);
  }
});
