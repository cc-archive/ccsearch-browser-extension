import { elements } from './base';

function showConfirmationMessage() {
  console.log('image bookmarked');
}
export default function bookmarkImage(e) {
  console.log('save bookmark');
  console.log(e.target);
  console.log(e.target.dataset.imageid);
  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ bookmarks: [] }, (items) => {
    const bookmarksArray = items.bookmarks;
    bookmarksArray.push(e.target.dataset.imageid);
    console.log(bookmarksArray);
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ bookmarks: bookmarksArray }, () => {
      console.log('bookmarks updated');
      showConfirmationMessage();
    });
  });
}

elements.showBookmarksIcon.addEventListener('click', () => {
  elements.primarySection.style.display = 'none';
  elements.bookmarksSection.style.display = 'block';
  elements.homeIcon.style.visibility = 'visible';
});

elements.homeIcon.addEventListener('click', (e) => {
  elements.primarySection.style.display = 'block';
  elements.bookmarksSection.style.display = 'none';
  e.target.style.visibility = 'hidden';
});
