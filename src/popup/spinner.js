export function getSpinnerDiv(context) {
  let divWrapper = document.createElement('div');
  divWrapper.classList.add('spinner');

  if (context === 'for-bottom') {
    divWrapper.classList.add('spinner-for-bottom');
  }
  else {
    // if context != 'for-bottom' (==original)
    divWrapper.classList.add('spinner-original');
  }

  for (let i = 1; i <= 3; i++) {
    let divBounce = document.createElement('div');
    divBounce.classList.add(`bounce${i}`);
    divWrapper.appendChild(divBounce);
  }

  return divWrapper
}


export function addSpinner(spinnerPlaceholder, context) {
  spinnerPlaceholder.appendChild(getSpinnerDiv(context));
}

export function removeSpinner(spinnerPlaceholder) {
  while (spinnerPlaceholder.firstChild) {
    spinnerPlaceholder.removeChild(spinnerPlaceholder.firstChild);
  }
}
