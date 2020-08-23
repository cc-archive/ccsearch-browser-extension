import { elements } from './base';
import { loadFilterCheckboxesFromStorage } from '../utils';

export default function loadUserDefaults() {
  loadFilterCheckboxesFromStorage(elements.useCaseCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.licenseCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.fileTypeCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.imageTypeCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.imageSizeCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.aspectRatioCheckboxesWrapper);
  loadFilterCheckboxesFromStorage(elements.showMatureContentCheckboxWrapper);
}
