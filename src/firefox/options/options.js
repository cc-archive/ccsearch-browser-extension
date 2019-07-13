console.log('options page');

// Saves options to chrome.storage
function saveOptions() {
  const color = document.getElementById('color').value;
  const likesColor = document.getElementById('like').checked;
  // eslint-disable-next-line no-undef
  chrome.storage.local.set(
    {
      favoriteColor: color,
      likesColor,
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    },
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value color = 'red' and likesColor = true.
  // eslint-disable-next-line no-undef
  chrome.storage.local.get(
    {
      favoriteColor: 'red',
      likesColor: true,
    },
    (items) => {
      // document.getElementById('color').value = items.favoriteColor;
      // document.getElementById('like').checked = items.likesColor;
      document.getElementById('showdiv').textContent = items.favoriteColor;
    },
  );
}
// document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('show').addEventListener('click', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
