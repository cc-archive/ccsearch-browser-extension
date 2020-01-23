export function getSpinnerMarkup(context) {
  if (context === 'for-bottom') {
    return `<div class="spinner spinner-for-bottom">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`;
  }
  // if context != 'for-bottom' (==original)
  return `<div class="spinner spinner-original">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`;
}

export function addSpinner(spinnerPlaceholder, context) {
  spinnerPlaceholder.insertAdjacentHTML('afterbegin', getSpinnerMarkup(context));
}

export function removeSpinner(spinnerPlaceholder) {
  // eslint-disable-next-line no-param-reassign
  spinnerPlaceholder.innerHTML = '';
}
