import {
  // getRichTextAttribution,
  getHtmlAttribution,
  getPlainAttribution,
} from '../src/popup/infoPopupModule';

// sample image response used for testing
const image = {
  title: 'Megi - Lutka Moja',
  id: 'bafff537-0c74-4fa6-9867-401e440e97f5',
  creator: 'cipovic',
  creator_url: 'https://www.flickr.com/photos/46586088@N05',
  tags: [
    {
      name: 'dog',
    },
    {
      name: 'happy',
    },
  ],
  url: 'https://farm5.staticflickr.com/4036/4696290733_5f8794441e_b.jpg',
  thumbnail: 'https://farm5.staticflickr.com/4036/4696290733_5f8794441e_m.jpg',
  source: 'flickr',
  license: 'by-nc-nd',
  license_version: '2.0',
  license_url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/',
  foreign_landing_url: 'https://www.flickr.com/photos/46586088@N05/4696290733',
  detail_url: 'https://api.creativecommons.engineering/v1/images/bafff537-0c74-4fa6-9867-401e440e97f5',
  related_url: 'https://api.creativecommons.engineering/v1/recommendations/images/bafff537-0c74-4fa6-9867-401e440e97f5',
  height: 1000,
  width: 667,
  attribution:
    '"Megi - Lutka Moja" by cipovic is licensed under CC-BY-NC-ND 2.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-nd/2.0/.',
};

// test('Testing getRichTextAttribution', () => {
//   const testRichTextAttribution = getRichTextAttribution(image);

//   const correctAttribution = '<a href="https://www.flickr.com/photos/46586088@N05/4696290733" target="_blank">"Megi - Lutka Moja"</a><span> by <a href="https://www.flickr.com/photos/46586088@N05" target="_blank">cipovic</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" target="_blank">CC BY-NC-ND 2.0</a>';

//   expect(testRichTextAttribution).toBe(correctAttribution);
// });

test('Testing getHtmlAttribution', () => {
  const testHtmlAttribution = getHtmlAttribution(image);

  const correctAttribution =
    '<p style="font-size: 0.9rem;font-style: italic;"><a href="https://www.flickr.com/photos/46586088@N05/4696290733">"Megi - Lutka Moja"</a><span> by <a href="https://www.flickr.com/photos/46586088@N05">cipovic</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" style="margin-right: 5px;">CC BY-NC-ND 2.0</a><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;"><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-by_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nd_icon.svg" /></a></p>';

  expect(testHtmlAttribution).toBe(correctAttribution);
});

test('Testing getPlainAttribution', () => {
  const testPlainAttribution = getPlainAttribution(image);

  const correctAttribution = `"Megi - Lutka Moja" by cipovic is licensed under CC BY-NC-ND 2.0


Image Link: https://www.flickr.com/photos/46586088@N05/4696290733

Creator Link: https://www.flickr.com/photos/46586088@N05

License Link: https://creativecommons.org/licenses/by-nc-nd/2.0/


**********************HTML Attribution**********************
<p style="font-size: 0.9rem;font-style: italic;"><a href="https://www.flickr.com/photos/46586088@N05/4696290733">"Megi - Lutka Moja"</a><span> by <a href="https://www.flickr.com/photos/46586088@N05">cipovic</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" style="margin-right: 5px;">CC BY-NC-ND 2.0</a><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;"><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-by_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nd_icon.svg" /></a></p>`;

  expect(testPlainAttribution).toBe(correctAttribution);
});
