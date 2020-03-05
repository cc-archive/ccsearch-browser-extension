import { showNotification, removeNode } from '../src/utils';

test('testing showNotification', () => {
  document.body.innerHTML = '<div id="snackbar-bookmarks" class="snackbar"></div>';

  jest.useFakeTimers();
  showNotification('test', 'positive', 'snackbar-bookmarks');
  const snackbar = document.getElementById('snackbar-bookmarks');
  expect(snackbar.innerText).toBe('test');
  expect(snackbar.classList).toContain('snackbar-positive');
  expect(snackbar.classList).toContain('show');
  setTimeout(() => {
    expect(snackbar.classList).not.toContain('show');
  }, 1200);
  jest.runAllTimers();

  showNotification('test', 'negative', 'snackbar-bookmarks');
  expect(snackbar.classList).toContain('snackbar-negative');
});

test('testing removeNode', () => {
  document.body.innerHTML = '<div><p class="initial-info primary__initial-info">Some content</p></div>';

  const className = 'primary__initial-info';
  removeNode(className);
  const targetNode = document.querySelector(`.${className}`);
  expect(targetNode).toBeNull();
});
