console.log('hello from the extension!');

const inputField = document.getElementById('section-search-input');
const searchIcon = document.getElementById('search-icon');
const errorMessage = document.getElementById('error-message');

inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
});

searchIcon.addEventListener('click', () => {
  const inputText = inputField.value;
  if (inputText === '') {
    errorMessage.textContent = 'Please enter a search query';
  }
  console.log(inputText);
});
