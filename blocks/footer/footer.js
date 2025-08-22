import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { extractImagesWithLinkElements, createImageElement } from '../../js/blockHelper.js';

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

  // Logo wrapper
  const imagesWithLinkWrapped = footer.querySelectorAll('.image-with-link-wrapper');
  if (imagesWithLinkWrapped.length) {
    for (let child of imagesWithLinkWrapped) {
      const imageWithLinkModel = extractImagesWithLinkElements(child);
      if (imageWithLinkModel.length) {
        child.innerHTML = '';
        
        imageWithLinkModel.forEach(item => {
          const icon = document.createElement('a');
          icon.href = item.button?.link;
          const image = createImageElement(item.image);
          icon.appendChild(image);
          child.appendChild(icon);
        });
      }
    }
  }

  block.append(footer);
}
