const rightSlide = document.getElementsByClassName('left-slide');
const leftSlide = document.getElementsByClassName('right-slide');
function rightSlideAnimation() {
  this.classList.add('slide-in-right');
  // remove the listener, no longer needed
  this.removeEventListener('mouseover', rightSlideAnimation);
}
function leftSlideAnimation() {
  this.classList.add('slide-in-left');
  // remove the listener, no longer needed
  this.removeEventListener('mouseover', leftSlideAnimation);
}
for (let i = 0; i < rightSlide.length; i += 1) {
  rightSlide[i].addEventListener('mouseover', rightSlideAnimation, false);
}
for (let i = 0; i < leftSlide.length; i += 1) {
  leftSlide[i].addEventListener('mouseover', leftSlideAnimation, false);
}
