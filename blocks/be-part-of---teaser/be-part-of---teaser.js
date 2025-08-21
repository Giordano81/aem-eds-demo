import { getBlockModel, extractButtonElements, findAttributeByTag, createTextElement, createImageElement, createButtonElement, extractImageElements, setDataSet } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle', },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle', },
    { name: 'subtitleSlowAnimation', isBoolean: true },
    { name: 'eyebrow' }
  ];
}

export default function decorate(block) {
  const otherBlocks = document.createElement('div');
  while (block.children.length > getProps().length) {
    otherBlocks.appendChild(block.children[getProps().length]);
  }
  let modelData = getBlockModel(block, getProps());
  modelData.images = extractImageElements(otherBlocks).images;
  modelData.buttons = extractButtonElements(otherBlocks);

  const textOnTheRight = [];
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
  for (const child of [...otherBlocks.children]) {
    for (let i = 0; i < tags.length; i++) {
      const valueFound = findAttributeByTag(child, tags[i]);
      if (valueFound) {
        const item = {
          value: valueFound,
          dataset: {}
        };
        setDataSet(item, child);
        textOnTheRight.push(item);
        break;
      };
    }
  }
  modelData.textOnTheRight = textOnTheRight;

  block.innerHTML = '';

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main-section');

  const leftSection = document.createElement('div');
  leftSection.classList.add('left-section');

  if (modelData.eyebrow) {
    const eyebrowModel = {
      value: modelData.eyebrow
    };
    leftSection.appendChild(createTextElement(eyebrowModel, ['be-part-of-teaser-eyebrow']));
  }
  if (modelData.title.value) {
    leftSection.appendChild(createTextElement(modelData.title, ['be-part-of-teaser-title']));
  }
  if (modelData.subtitle.value) {
    leftSection.appendChild(createTextElement(modelData.subtitle, ['be-part-of-teaser-subtitle']));
  }
  if (modelData.buttons.length) {
    const buttonsSection = document.createElement('div');
    buttonsSection.classList.add('buttons-section');
    modelData.buttons.forEach(button => {
      buttonsSection.appendChild(createButtonElement(button));
    });
    leftSection.appendChild(buttonsSection);
  }

  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section');

  if (modelData.images.length) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('fade-in-animation');
    imageContainer.appendChild(createImageElement(modelData.images[0]));
    rightSection.appendChild(imageContainer);
  } else {
    const textOnTheRightSection = document.createElement('div');
    textOnTheRightSection.classList.add('text-on-the-right-section', 'fade-in-animation');
    const listOfText = [];
    for (let i = 0; i < modelData.textOnTheRight.length; i++) {
      const element = modelData.textOnTheRight[i];
      if (i % 2 == 0) {
        const textOnTheRight = document.createElement('div');
        setDataSet(textOnTheRight, element);
        textOnTheRight.classList.add('text-on-the-right');
        const title = document.createElement('h3');
        title.classList.add('heading-h3-medium');
        title.innerHTML = element.value;
        textOnTheRight.appendChild(title);
        listOfText.push(textOnTheRight);
      } else {
        const text = document.createElement('h3');
        setDataSet(text, element);
        text.classList.add('body-2-light');
        text.innerHTML = element.value;
        listOfText[listOfText.length - 1].appendChild(text);
      }
    }
    listOfText.forEach(item => {
      textOnTheRightSection.appendChild(item);
    });
    rightSection.appendChild(textOnTheRightSection);
  }

  /*
    Divisione in 2 colonne
    A sinistra
      Tag
      Title
      Text
      Lista buttton sulla stessa riga
    A destra
      Se c'è l'immagine mostro quella
      Altrimenti blocco con lista dei testi
  */

  mainContainer.appendChild(leftSection);
  mainContainer.appendChild(rightSection);
  block.appendChild(mainContainer);
}