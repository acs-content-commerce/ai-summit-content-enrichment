import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Decorate footer rows
  const rows = footer.querySelectorAll(':scope > div');
  rows.forEach((row, index) => {
    if (index === 0) {
      // First row: QR code
      row.classList.add('footer-qr');
      const link = row.querySelector('a');
      if (link) {
        link.href = '/';
        link.title = 'Scan to visit homepage';
      }
    } else if (index === 1) {
      // Second row: Demo recording
      row.classList.add('footer-demo');
      const link = row.querySelector('a');
      if (link) {
        link.classList.add('footer-link', 'footer-demo-link');
        link.target = '_blank';
      }
    } else if (index === 2) {
      // Third row: PDF presentation
      row.classList.add('footer-pdf');
      const link = row.querySelector('a');
      if (link) {
        link.classList.add('footer-link', 'footer-pdf-link');
        link.target = '_blank';
      }
    }
  });

  block.append(footer);
}
