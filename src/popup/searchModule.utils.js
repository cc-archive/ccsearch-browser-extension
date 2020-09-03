import { elements } from './base';

const Masonry = require('masonry-layout');

const primaryGridMasonryObject = new Masonry(elements.gridPrimary, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
  gutter: '.gutter-sizer',
  percentPosition: true,
  transitionDuration: '0',
});

export default primaryGridMasonryObject;
