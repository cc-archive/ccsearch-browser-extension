import { getRichTextAttribution } from '../src/firefox/popup/infoPopupModule';

// sample image response used for testing
const image = {
  title: 'Megi - Lutka Moja',
  id: 'bafff537-0c74-4fa6-9867-401e440e97f5',
  creator: 'cipovic',
  creator_url: 'https://www.flickr.com/photos/46586088@N05',
  tags: [
    {
      name: 'dog',
      provider: 'flickr',
    },
    {
      name: 'happy',
      provider: 'flickr',
    },
  ],
  url: 'https://farm5.staticflickr.com/4036/4696290733_5f8794441e_b.jpg',
  thumbnail: 'https://farm5.staticflickr.com/4036/4696290733_5f8794441e_m.jpg',
  provider: 'Flickr',
  source: 'flickr',
  license: 'by-nc-nd',
  license_version: '2.0',
  foreign_landing_url: 'https://www.flickr.com/photos/46586088@N05/4696290733',
  meta_data: null,
  view_count: 0,
  provider_url: 'https://www.flickr.com',
  license_url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/',
  attribution:
    '"Megi - Lutka Moja" by cipovic is licensed under CC-BY-NC-ND 2.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-nd/2.0/.',
  provider_code: 'flickr',
};

test('Testing getRichTextAttribution', () => {
  const richTextAttribution = getRichTextAttribution(image);

  const correctAttribution = '<a href="https://www.flickr.com/photos/46586088@N05/4696290733" target="_blank">"Megi - Lutka Moja"</a><span> by <a href="https://www.flickr.com/photos/46586088@N05" target="_blank">cipovic</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" target="_blank">CC BY-NC-ND 2.0</a>';

  expect(richTextAttribution).toBe(correctAttribution);
});
