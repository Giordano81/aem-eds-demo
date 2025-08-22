import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { extractImagesWithLinkElements, createImageElement } from '../../js/blockHelper.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const basePath = '/content/aem-eds-demo';
  const fallBackFooter = window.location.pathname.indexOf(basePath) > -1 ? `${basePath}/nav` : "/nav";
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : fallBackFooter;
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Logo wrapper
  const imagesWithLinkWrapped = nav.querySelectorAll('.image-with-link-wrapper');
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

  // Remove class to menu items
  const menuButtons = nav.querySelectorAll('&>div:nth-child(2)>div .button-container a');
  menuButtons.forEach(item => {
    item.classList.remove('button');
  });
  const menuItems = nav.querySelectorAll('&>div:nth-child(2)>div>div>div>div');
  menuItems.forEach(item => {
    item.classList.add('menu-item');
    const children = item.querySelectorAll('&>.button-container');
    children[0].classList.add('menu-first-level');
    if (children.length > 1) {
      const submenu = document.createElement('div');
      submenu.classList.add('submenu');

      for (let i = 1; i < children.length; i++) {
        submenu.appendChild(children[i]);
      }

      item.appendChild(submenu);
    }
  });

  // Add language selector
  nav.appendChild(createLanguageSelector());

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

function createLanguageSelector() {
  const languageContainer = document.createElement('div');
  languageContainer.classList.add('language-selector');
  const language = document.createElement('div');
  language.textContent = "EN"; // TODO: prendere la lingua corretta di navigazione
  languageContainer.appendChild(language);
  languageContainer.addEventListener('click', () => {
    if (languageContainer.classList.contains('opened')) {
      languageContainer.classList.remove('opened');
    } else {
      languageContainer.classList.add('opened');
    }
  });
  // Create the language options
  const optionsList = document.createElement('ul');
  optionsList.classList.add('options');
  // TODO: togliere mock
  const optionsData = [
    {
      href: 'https://www.pietroberetta.com/content/pbselection/it',
      imgSrc: '/content/dam/aem-eds-demo/logos/it.svg',
      imgAlt: 'it_flag',
      text: 'IT'
    },
    {
      href: 'https://www.pietroberetta.com/content/pbselection/en',
      imgSrc: '/content/dam/aem-eds-demo/logos/rowDark.svg',
      imgAlt: 'rowDark_flag',
      text: 'EN'
    }
  ];
  optionsData.forEach(option => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = option.href;
    const image = document.createElement('img');
    image.src = option.imgSrc;
    image.alt = option.imgAlt;
    const span = document.createElement('span');
    span.textContent = option.text;
    anchor.appendChild(image);
    anchor.appendChild(span);
    listItem.appendChild(anchor);
    optionsList.appendChild(listItem);
  });

  languageContainer.appendChild(optionsList);
  return languageContainer;
}