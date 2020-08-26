import { elements } from './base';
import { removeSpinner } from './spinner';
import { showNotification } from '../utils';

const Masonry = require('masonry-layout');

export function checkInternetConnection() {
  if (!navigator.onLine) {
    removeSpinner(elements.spinnerPlaceholderPopup);
    showNotification('No Internet Connection', 'negative', 'notification--extension-popup');
    throw new Error('No Internet Connection');
  }
}
export const primaryGridMasonryObject = new Masonry(elements.gridPrimary, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});
