import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import { addThumbnailsToDOM } from './searchModule';

export default function loadStoredContentToUI() {
  elements.inputField.value = window.appObject.inputText;
  elements.sourceChooser.value = localStorage.getItem('sourceDropdownValues');
  elements.useCaseChooser.value = localStorage.getItem('usecaseDropdownValues');
  elements.licenseChooser.value = localStorage.getItem('licenseDropdownValues');
  elements.fileTypeChooser.value = localStorage.getItem('fileTypeDropdownValues');
  elements.imageTypeChooser.value = localStorage.getItem('imageTypeDropdownValues');
  elements.imageSizeChooser.value = localStorage.getItem('imageSizeDropdownValues');
  elements.aspectRatioChooser.value = localStorage.getItem('aspectRatioDropdownValues');

  window.appObject.pageNo = 1;
  if (localStorage.getItem(window.appObject.pageNo)) {
    const pageData = Object.values(JSON.parse(localStorage.getItem(window.appObject.pageNo)));
    addThumbnailsToDOM(pageData);
    window.appObject.pageNo = Number(window.appObject.pageNo) + 1;
  }
  elements.clearSearchButton[0].classList.remove('display-none');
}
