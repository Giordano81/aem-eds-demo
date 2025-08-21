import { getBlockModel, createTextElement, createImageElement, createButtonElement, extractImageElements } from '../../scripts/blockHelper.js';
import { loadFragment } from '../fragment/fragment.js';
import { createBlock } from '../photo-gallery/photo-gallery.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle', },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle', },
    { name: 'subtitleSlowAnimation', isBoolean: true },
    { name: 'arrowText' },
    { name: 'contestTag' },
    { name: 'contestImage', attribute: 'src' },
    { name: 'contestAlt' },
    { name: 'contestText' },
    { name: 'contestTitle' },
    { name: 'card1Title' },
    { name: 'card1Subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'card2Title' },
    { name: 'card2Subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'card3Title' },
    { name: 'card3Subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'ctaText' },
    { name: 'fragment', attribute: 'href' },
  ];
}

function getItemsProps() {
  return [

  ];
}

export default async function decorate(block) {
  const otherBlocks = document.createElement('div');
  while (block.children.length > getProps().length) {
    otherBlocks.appendChild(block.children[getProps().length]);
  }
  let modelData = getBlockModel(block, getProps());

  if (modelData.fragment.value) {
    const fragment = await loadFragment(modelData.fragment.value);
    modelData.fragment.html = fragment.querySelector('& > div');
    if (modelData.fragment.html) {
      modelData.fragment.rendered = modelData.fragment.html.querySelector('.photo-gallery-wrapper>div');
      createBlock(modelData.fragment.rendered);
    }
  }

  block.innerHTML = '';

  const mainContainer = document.createElement('div');

  // Blocco 1
  const firstSection = document.createElement('div');
  firstSection.classList.add('main-section', 'first-section');
  if (modelData.title.value) {
    firstSection.appendChild(createTextElement(modelData.title, []));
  }
  if (modelData.subtitle.value) {
    firstSection.appendChild(createTextElement(modelData.subtitle, ['fade-in-animation'], true));
  }
  if (modelData.arrowText) {
    const arrowContainer = document.createElement('a');
    arrowContainer.classList.add('arrow-container', 'fade-in-animation');
    arrowContainer.setAttribute('data-delayed', 1000);
    arrowContainer.href = '#be-part-of-contest';
    const arrowText = document.createElement('div');
    arrowText.classList.add('arrow-text');
    arrowText.textContent = modelData.arrowText;
    const arrowImage = document.createElement('div');
    arrowImage.classList.add('arrow-image');
    arrowContainer.appendChild(arrowText);
    arrowContainer.appendChild(arrowImage);
    firstSection.appendChild(arrowContainer);
  }

  // Blocco 2
  const secondSection = document.createElement('div');
  secondSection.classList.add('main-section', 'second-section');
  secondSection.id = 'be-part-of-contest';
  if (modelData.contestTag) {
    secondSection.appendChild(createTextElement(modelData.contestTag, ['contest-tag']));
  }
  if (modelData.contestImage) {
    const imageModel = {
      image: modelData.contestImage.value,
      imageAlt: modelData.contestAlt
    }
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('fade-in-animation');
    imageContainer.appendChild(createImageElement(imageModel));
    secondSection.appendChild(imageContainer);
  }
  if (modelData.contestText) {
    secondSection.appendChild(createTextElement(modelData.contestText, ['contest-text', 'fade-in-animation'], true));
  }
  if (modelData.contestTitle) {
    secondSection.appendChild(createTextElement(modelData.contestTitle, ['contest-title', 'heading-h3-light']));
  }
  const cards = document.createElement('div');
  cards.classList.add('contest-cards-container');
  let counter = 0;
  if (modelData.card1Title || modelData.card1Subtitle) counter++;
  if (modelData.card2Title || modelData.card2Subtitle) counter++;
  if (modelData.card3Title || modelData.card3Subtitle) counter++;
  addCardToContainer(cards, modelData.card1Title, modelData.card1Subtitle, counter);
  addCardToContainer(cards, modelData.card2Title, modelData.card2Subtitle, counter);
  addCardToContainer(cards, modelData.card3Title, modelData.card3Subtitle, counter);
  secondSection.appendChild(cards);

  const buttonModel = {
    type: 'primary',
    text: modelData.ctaText
  }
  secondSection.appendChild(createButtonElement(buttonModel));

  // Blocco 3
  const thirdSection = document.createElement('div');
  thirdSection.classList.add('main-section', 'third-section');
  thirdSection.appendChild(modelData.fragment.rendered);

  mainContainer.appendChild(firstSection);
  mainContainer.appendChild(secondSection);
  mainContainer.appendChild(thirdSection);
  block.appendChild(mainContainer);
  /*
    Blocco 1
      titolo
      sottotitolo
      arrow
    Blocco 2
      tag contest
      immagine contest
      testo contest
      titolo contest
      cards
    Blocco 3
      fragment
  */
}

function addCardToContainer(container, title, text, counter) {
  if (title || text) {
    const card = document.createElement('div');
    card.classList.add('contest-card', 'fade-in-animation');
    let cardCounter = container.querySelectorAll('.contest-card').length + 1;
    card.setAttribute('data-delayed', cardCounter * 1000);
    if (title) {
      card.appendChild(createTextElement(title, ['contest-card-title', 'heading-h3-medium'], true));
    }
    if (text) {
      card.appendChild(createTextElement(text, ['contest-card-text', 'body-2-light'], true));
    }
    const labelCounter = document.createElement('div');
    labelCounter.classList.add('contest-card-counter', 'body-2-light');
    labelCounter.textContent = `${cardCounter}/${counter}`;
    card.appendChild(labelCounter);

    container.appendChild(card);
  }
}