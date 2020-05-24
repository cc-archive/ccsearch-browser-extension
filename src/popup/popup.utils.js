import { elements } from './base';
import { removeNode } from '../utils';
import { addThumbnailsToDOM } from './searchModule';

export default function loadStoredContentToUI() {
  window.appObject.inputText = localStorage.getItem('title');
  elements.inputField.value = window.appObject.inputText;
  elements.sourceChooser.value = localStorage.getItem('sourceDropdownValues');
  elements.useCaseChooser.value = localStorage.getItem('usecaseDropdownValues');
  elements.licenseChooser.value = localStorage.getItem('licenseDropdownValues');

  window.appObject.pageNo = 1;
  if (localStorage.getItem(window.appObject.pageNo)) {
    removeNode('primary__initial-info');
    const pageData = Object.values(JSON.parse(localStorage.getItem(window.appObject.pageNo)));
    addThumbnailsToDOM(pageData);
    window.appObject.pageNo = Number(window.appObject.pageNo) + 1;
  }
  elements.clearSearchButton[0].classList.remove('display-none');
}
