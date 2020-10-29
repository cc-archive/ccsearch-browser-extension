import { showNotification } from '../src/utils';

test('testing showNotification', () => {
  document.body.innerHTML = `<div class="notification-wrapper notification--extension-popup display-none">
    <div class="notification is-compact">
      <span class="notification-container">
        <p>This is a title of a message</p>
      </span>
    </div>
  </div>`;

  jest.useFakeTimers();
  showNotification('test', 'positive', 'notification--extension-popup');
  const notificationWrapperDiv = document.getElementsByClassName('notification--extension-popup')[0];
  const notificationContainer = notificationWrapperDiv.getElementsByClassName('notification-container')[0];
  const notificationPara = notificationContainer.getElementsByTagName('p')[0];
  expect(notificationPara.innerText).toBe('test');
  expect(notificationWrapperDiv.classList).not.toContain('display-none');
  expect(notificationContainer.classList).toContain('has-background-success-light');
  setTimeout(() => {
    expect(notificationWrapperDiv.classList).toContain('display-none');
  }, 1500);
  jest.runAllTimers();

  showNotification('test', 'negative', 'notification--extension-popup');
  expect(notificationContainer.classList).toContain('has-background-danger-light');
});
