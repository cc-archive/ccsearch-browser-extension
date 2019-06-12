const inputField = document.getElementById('section-search-input');
const searchIcon = document.getElementById('search-icon');
const errorMessage = document.getElementById('error-message');

// Activate the click event on pressing enter.
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    searchIcon.click();
  }
});

searchIcon.addEventListener('click', () => {
  const inputText = inputField.value;

  if (inputText === '') {
    errorMessage.textContent = 'Please enter a search query';
  } else {
    errorMessage.textContent = '';
  }

  const url = `https://api.creativecommons.engineering/image/search?q=${inputText}&pagesize=50`;

  fetch(url)
    .then(data => data.json())
    .then((res) => {
      const resultArray = res.results;
      const thumbnails = [];
      resultArray.forEach((element) => {
        thumbnails.push(element.thumbnail);
      });
      console.log(thumbnails);
      console.log(resultArray);

      // remove old images for a new search
      const firstImgCol = document.querySelector('.section-content .first-col .images');
      const secondImgCol = document.querySelector('.section-content .second-col .images');
      const thirdImgCol = document.querySelector('.section-content .third-col .images');

      firstImgCol.innerHTML = '';
      secondImgCol.innerHTML = '';
      thirdImgCol.innerHTML = '';

      let count = 1;
      thumbnails.forEach((element) => {
        // remove initial content
        const sectionContentParagraph = document.querySelector('.section-content p');
        if (sectionContentParagraph) {
          sectionContentParagraph.parentNode.removeChild(sectionContentParagraph);
        }

        // make an image element
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', element);

        // fill the grid
        if (count === 1) {
          document.querySelector('.section-content .first-col .images').appendChild(imgElement);
          count += 1;
        } else if (count === 2) {
          document.querySelector('.section-content .second-col .images').appendChild(imgElement);
          count += 1;
        } else if (count === 3) {
          document.querySelector('.section-content .third-col .images').appendChild(imgElement);
          count = 1;
        }
      });
    });
});
