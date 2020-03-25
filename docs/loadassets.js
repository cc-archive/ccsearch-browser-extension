const ajax = new XMLHttpRequest();
ajax.open('GET', 'https://unpkg.com/@creativecommons/vocabulary@1.0.0-beta.6/assets/github_corner.svg', true);
ajax.send();
ajax.onload = () => {
  const div = document.createElement('div');
  div.innerHTML = ajax.responseText;
  div.style.display = 'none';
  document.body.insertBefore(div, document.body.childNodes[0]);
};

const ajax1 = new XMLHttpRequest();
ajax1.open('GET', 'https://unpkg.com/@creativecommons/vocabulary@1.0.0-beta.6/assets/logos/cc/logomark.svg', true);
ajax1.send();
ajax1.onreadystatechange = () => {
  const div = document.createElement('div');
  div.innerHTML = ajax1.responseText;
  div.style.display = 'none';
  document.body.insertBefore(div, document.body.childNodes[0]);
};
