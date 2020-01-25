import { getSpinnerDiv } from '../src/popup/spinner';

test('Checking spinner markup', () => {
  const spinnerMarkupForBottom = getSpinnerDiv('for-bottom');

  expect(spinnerMarkupForBottom.classList).toContain('spinner')
  expect(spinnerMarkupForBottom.classList).toContain('spinner-for-bottom')
  expect(spinnerMarkupForBottom.childElementCount).toBe(3)
  let spinnerForBottomChildNodes = spinnerMarkupForBottom.childNodes
  for (let i = 0; i < 3; i++) {
    expect(spinnerForBottomChildNodes[i].classList).toContain(`bounce${i + 1}`);
  }

  const spinnerMarkupOriginal = getSpinnerDiv('original');
  expect(spinnerMarkupOriginal.classList).toContain('spinner')
  expect(spinnerMarkupOriginal.classList).toContain('spinner-original')
  expect(spinnerMarkupOriginal.childElementCount).toBe(3)
  let spinnerOriginalChildNodes = spinnerMarkupOriginal.childNodes
  for (let i = 0; i < 3; i++) {
    expect(spinnerOriginalChildNodes[i].classList).toContain(`bounce${i + 1}`);
  }
});
