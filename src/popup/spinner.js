export function getSpinnerMarkup() {
  return `<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`;
}

export function addSpinner(spinnerPlaceholder) {
  // eslint-disable-next-line no-param-reassign
  spinnerPlaceholder.innerHTML = getSpinnerMarkup();
}

export function removeSpinner(spinnerPlaceholder) {
  // eslint-disable-next-line no-param-reassign
  spinnerPlaceholder.innerHTML = '';
}
