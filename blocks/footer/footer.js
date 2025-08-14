import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const basePath = '/content/aem-eds-demo';
  const fallBackFooter = window.location.pathname.indexOf(basePath) > -1 ? `${basePath}/footer` : "/footer";
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : fallBackFooter;
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer-content');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const imageButton = footer.querySelector('&>div>div .button-container a');
  if (imageButton) {
    const image = footer.querySelector('&>div>div picture');
    imageButton.textContent = '';
    imageButton.appendChild(image);
    imageButton.classList.remove('button');
    footer.querySelector('&>div>div').innerHTML = '';
    footer.querySelector('&>div>div').appendChild(imageButton);
  }


  block.append(footer);
}
