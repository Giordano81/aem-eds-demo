import { createOptimizedPicture } from './aem.js';

export function getBlockModel(block, props) {
  let modelData = {};

  props.forEach((obj, index) => {
    const propertyName = obj.name;
    let textContent;
    try {
      textContent = block.children[index].textContent.trim();
    } catch (error) {
      console.log(error);
    }
    if (obj.attribute) {
      modelData[propertyName] = {
        value: findAttributeByAttr(block.children[index], obj.attribute) || textContent,
        attribute: obj.attribute
      };
    } else if (obj.tags) {
      let valueFound, tagFound;
      for (let i = 0; i < obj.tags.length; i++) {
        valueFound = findAttributeByTag(block.children[index], obj.tags[i]);
        if (valueFound) {
          tagFound = obj.tags[i];
          break
        };
      }
      modelData[propertyName] = {
        value: valueFound || textContent,
        tag: tagFound
      };
    } else if (obj.isBoolean === true) {
      modelData[propertyName] = textContent === 'true';
    } else if (obj.isNumber) {
      modelData[propertyName] = Number(textContent) || textContent;
    } else {
      modelData[propertyName] = textContent;
    }
  });

  if (modelData.hasOwnProperty('title') && modelData.hasOwnProperty('titleStyle')) {
    modelData.title.style = modelData.titleStyle;
  }
  if (modelData.hasOwnProperty('subtitle') && modelData.hasOwnProperty('subtitleStyle')) {
    modelData.subtitle.style = modelData.subtitleStyle;
  }
  if (modelData.hasOwnProperty('subtitle') && modelData.hasOwnProperty('subtitleSlowAnimation')) {
    modelData.subtitle.slowAnimation = modelData.subtitleSlowAnimation;
  }
  if (modelData.hasOwnProperty('secondSubtitle') && modelData.hasOwnProperty('secondSubtitleStyle')) {
    modelData.secondSubtitle.style = modelData.secondSubtitleStyle;
  }
  if (modelData.hasOwnProperty('modalTitle') && modelData.hasOwnProperty('modalTitleStyle')) {
    modelData.modalTitle.style = modelData.modalTitleStyle;
  }
  if (modelData.hasOwnProperty('modalSubtitle') && modelData.hasOwnProperty('modalSubtitleStyle')) {
    modelData.modalSubtitle.style = modelData.modalSubtitleStyle;
  }

  return modelData;
}

function findAttributeByAttr(element, attribute) {
  if (element.hasAttribute(attribute)) {
    const value = element.getAttribute(attribute);
    return value;
  }

  for (let child of element.children) {
    const result = findAttributeByAttr(child, attribute);
    if (result) {
      return result;
    }
  }

  return null;
}

function findAttributeByTag(element, tag) {
  if (element.tagName.toLowerCase() == tag) {
    if (element.nextSibling) {
      let value = [];
      [...element.parentElement.children].forEach(child => {
        value.push(child.innerHTML);
      });
      return value.join('<br>');
    } else {
      return element.innerHTML;
    }
  }

  for (let child of element.children) {
    const result = findAttributeByTag(child, tag);
    if (result) {
      return result;
    }
  }

  return null;
}

export function getButtonModel(element) {
  const props = [
    { name: 'slowAnimation', isBoolean: true }
  ];

  let elementFound = element.querySelector('a');
  if (elementFound) {
    let type = '';
    if (elementFound.classList.contains('primary')) {
      type = 'primary';
    } else if (elementFound.classList.contains('secondary')) {
      type = 'secondary';
    } else {
      type = 'default';
    }

    let result = {
      link: elementFound.getAttribute('href'),
      text: elementFound.textContent.trim(),
      title: elementFound.getAttribute('title'),
      type: type
    }

    const otherBlocks = document.createElement('div');
    while (element.children.length > props.length) {
      otherBlocks.appendChild(element.children[props.length]);
    }
    let modelData;
    if (otherBlocks.children.length) {
      modelData = getBlockModel(otherBlocks, props);
    }

    for (const key in modelData) {
      result[key] = modelData[key];
    }

    return result;
  }

  return null;
}

export function getImageModel(element) {
  let elementFound = element.querySelector('img');
  if (elementFound) {
    return {
      image: elementFound.getAttribute('src'),
      imageAlt: elementFound.getAttribute('alt')
    };
  }
  return null;
}

export function createButtonElement(buttonModel, avoidAnimation = false) {
  const button = document.createElement('a');
  button.classList.add('button', 'cta-light');
  if (!avoidAnimation)
    button.classList.add('button-animation');
  if (buttonModel.delayed) {
    button.setAttribute('data-delayed', 'true')
  }
  switch (buttonModel.type) {
    case "primary":
      button.classList.add('cta-primary');
      break;
    case "secondary":
      button.classList.add('cta-secondary');
      break;
    case "tertiary":
      button.classList.add('cta-tertiary');
      break;
    default:
      button.classList.add('cta-primary');
      break;
  }
  button.textContent = buttonModel.text;
  if (buttonModel.link) {
    button.href = buttonModel.link;
  }
  if (buttonModel.title) {
    button.setAttribute('title', buttonModel.title);
  }
  if (buttonModel.slowAnimation) {
    button.setAttribute('data-delayed', 'true');
  }
  return button;
}

export function createTextElement(prop, classes, avoidAnimation = false) {
  if (typeof prop === 'string') {
    prop = {
      value: prop
    }
  }
  const text = document.createElement(prop.tag || 'p');
  if (classes)
    text.classList.add(...classes);
  if (prop.style) {
    switch (prop.style) {
      case 'main-title':
        text.classList.add('main-title');
        break;
      case 'h1':
        text.classList.add('heading-h1-light');
        break;
      case 'h2':
        text.classList.add('heading-h2-light');
        break;
      case 'h3':
        text.classList.add('heading-h3-light');
        break;
      case 'body-1':
        text.classList.add('body-1-light');
        break;
      case 'body-2':
        text.classList.add('body-2-light');
        break;
      case 'body-3':
        text.classList.add('body-3-light');
        break;
      default:
        break;
    }
  }
  text.innerHTML = prop.value;
  if (prop.slowAnimation) {
    text.setAttribute('data-delayed', 'true');
  }
  if (avoidAnimation)
    return text;

  const container = document.createElement('div');
  container.classList.add('text-container');
  container.appendChild(text);
  return container;
}

export function createImageElement(element) {
  return createOptimizedPicture(element.image, element.imageAlt, false);;
}

export function extractImageElements(block) {
  const images = [];

  for (const child of [...block.children]) {
    if (child.querySelector('picture')) {
      images.push(getImageModel(child));
      block.removeChild(child);
    }
  }

  return {
    updatedBlock: block,
    images: images
  }
}

export function crateBackgroundGallery(images) {
  const list1 = [];
  const list2 = [];
  const list3 = [];
  const list4 = [];

  images.forEach((item, index) => {
    if (index % 4 === 0) {
      list1.push(item);
    } else if (index % 4 === 1) {
      list2.push(item);
    } else if (index % 4 === 2) {
      list3.push(item);
    } else {
      list4.push(item);
    }
  });
  const listsImages = [list1, list2, list3, list4];

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('background-gallery-container');
  for (let i = 0; i < 4; i++) {
    const backgroundGalleryItem = document.createElement('div');
    backgroundGalleryItem.classList.add('background-gallery-item');

    for (let j = 0; j < listsImages[i].length; j++) {
      backgroundGalleryItem.appendChild(createImageElement(listsImages[i][j]));
    }

    mainDiv.appendChild(backgroundGalleryItem);
  }
  return mainDiv;
}