import { executeAnimationOnElement } from '../../js/animations.js';
import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements } from '../../js/blockHelper.js';
import { createImageCarousel } from '../../js/imageCarouselHelper.js';
import { loadFragment } from '../fragment/fragment.js';

function getProps() {
  return [
    { name: 'fragment', attribute: 'href' },
  ];
}

function getItemsProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'eyebrow' },
    { name: 'verticalText' }
  ];
}

export default async function decorate(block) {
  let modelData = getBlockModel(block, getProps());

  if (modelData.fragment.value) {
    const fragment = await loadFragment(modelData.fragment.value);
    modelData.fragment.html = fragment.querySelector('& > div');
    if (modelData.fragment.html) {
      modelData.fragment.items = []
      for (let i = 0; i < modelData.fragment.html.children.length; i++) {
        const sponsorItem = modelData.fragment.html.children[i].querySelector('& > div');

        // Remove all child blocks so is possible to extract images for carousel without touching image for logo
        const otherBlocks = document.createElement('div');
        while (sponsorItem.children.length > getItemsProps().length) {
          otherBlocks.appendChild(sponsorItem.children[getItemsProps().length]);
        }
        const item = getBlockModel(sponsorItem, getItemsProps());
        const { otherBlocks: updatedBlock, images } = extractImageElements(otherBlocks);
        item.images = images;

        if (otherBlocks.children.length) {
          item.button = getButtonModel(otherBlocks.children[0]);
        }
        modelData.fragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';

  const firstElement = modelData.fragment.items[0];

  const container = document.createElement('div');
  container.classList.add('teaser-content-container');
  container.setAttribute('data-slide-index', 0);

  const leftSection = document.createElement('div');
  leftSection.classList.add('left-section');
  const leftSectionForMobile = document.createElement('div');
  leftSectionForMobile.classList.add('left-section-for-mobile');
  populateLeftSection(firstElement, leftSection, leftSectionForMobile);
  container.appendChild(leftSection);

  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'text-container');
  modelData.fragment.items.forEach((item, index) => {
    const carousel = createImageCarousel(item.images);
    if (carousel) {
      carousel.classList.add('carousel-for-teaser');
      rightSection.appendChild(carousel);
    }
  });
  container.appendChild(rightSection);

  container.appendChild(leftSectionForMobile);

  // TODO: AC - Remove mock
  const mockContainer = document.createElement('div');
  mockContainer.classList.add('mock-container');
  const buttonLeft = document.createElement('div');
  buttonLeft.textContent = "<";
  buttonLeft.addEventListener('click', function (event) {
    const index = +container.getAttribute('data-slide-index') - 1;
    if (index >= 0) {
      updateSlide(leftSection, modelData.fragment.items[index], container, index, rightSection, index + 1, leftSectionForMobile);
    }
  });
  const buttonRight = document.createElement('div');
  buttonRight.textContent = ">";
  buttonRight.addEventListener('click', function (event) {
    const index = +container.getAttribute('data-slide-index') + 1;
    if (index < modelData.fragment.items.length) {
      updateSlide(leftSection, modelData.fragment.items[index], container, index, rightSection, index, leftSectionForMobile);
    }
  });
  mockContainer.appendChild(buttonLeft);
  mockContainer.appendChild(buttonRight);
  container.appendChild(mockContainer);

  block.appendChild(container);
};

function populateLeftSection(item, leftSection, leftSectionForMobile) {
  if (item.eyebrow) {
    const eyebrowModel = {
      value: item.eyebrow
    };
    leftSection.appendChild(createTextElement(eyebrowModel, ['teaser-eyebrow']));
  }
  if (item.title.value) {
    leftSection.appendChild(createTextElement(item.title, ['teaser-title']));
  }
  if (item.subtitle.value) {
    leftSection.appendChild(createTextElement(item.subtitle, ['teaser-subtitle']));
  }
  if (item.button) {
    leftSection.appendChild(createButtonElement(item.button));
    leftSectionForMobile.appendChild(createButtonElement(item.button));
  }
  if (item.verticalText) {
    leftSection.setAttribute('data-vertical-text', item.verticalText);
  }
}

function updateSlide(leftSection, item, container, index, rightSection, carouselIndex, leftSectionForMobile) {
  const elementsVisible = leftSection.querySelectorAll('.visible');
  const elementsVisibleForMobile = leftSectionForMobile.querySelectorAll('.visible');
  for (let el of elementsVisible) {
    el.classList.remove('visible');
  }
  for (let el of elementsVisibleForMobile) {
    el.classList.remove('visible');
  }
  const timeAnimation = 200;
  setTimeout(() => {
    leftSection.innerHTML = '';
    leftSectionForMobile.innerHTML = '';
    populateLeftSection(item, leftSection, leftSectionForMobile);
    setTimeout(() => {
      const carousels = rightSection.querySelectorAll('.carousel');
      // If the carousel index is major is because is going to left, so I have to hide the image
      if (carousels.length > carouselIndex) {
        if (carouselIndex > index)
          carousels[carouselIndex].classList.remove('visible');
        else
          carousels[carouselIndex].classList.add('visible');
      }

      executeAnimationOnElement(leftSection);
      executeAnimationOnElement(leftSectionForMobile);
    }, timeAnimation);
    container.setAttribute('data-slide-index', index);
  }, timeAnimation);
}