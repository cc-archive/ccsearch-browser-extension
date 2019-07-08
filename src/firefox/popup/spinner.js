function getSpinnerMarkup() {
  return `<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`;
}

export function addSpinner(spinnerPlaceholder) {
  spinnerPlaceholder.insertAdjacentHTML('afterbegin', getSpinnerMarkup());
}

export function removeSpinner(spinnerPlaceholder) {
  while (spinnerPlaceholder.firstChild) {
    spinnerPlaceholder.removeChild(spinnerPlaceholder.firstChild);
  }
}
