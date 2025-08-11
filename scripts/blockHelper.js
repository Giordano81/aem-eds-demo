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

  console.log(modelData);
  return modelData;
}

function findAttributeByAttr(element, attribute) {
  // Check if the current element has the attribute "asd"
  if (element.hasAttribute(attribute)) {
    const value = element.getAttribute(attribute);
    return value; // Exit and return the value
  }

  // If not found, check all children recursively
  for (let child of element.children) {
    const result = findAttributeByAttr(child, attribute);
    if (result) {
      return result; // Return if found in any descendant
    }
  }

  // If not found in any children or descendants
  return null; // Return null if the attribute is not found
}

function findAttributeByTag(element, tag) {
  // Check if the current element has the attribute "asd"
  if (element.tagName.toLowerCase() == tag) {
    const value = element.innerHTML;
    return value; // Exit and return the value
  }

  // If not found, check all children recursively
  for (let child of element.children) {
    const result = findAttributeByTag(child, tag);
    if (result) {
      return result; // Return if found in any descendant
    }
  }

  // If not found in any children or descendants
  return null; // Return null if the attribute is not found
}

export function getButtonModel(element) {
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
    return {
      link: elementFound.getAttribute('href'),
      text: elementFound.textContent.trim(),
      title: elementFound.getAttribute('title'),
      type: type,
    };
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

export function createButtonElement(buttonModel) {
  const button = document.createElement('a');
  button.classList.add('button');
  button.classList.add('cta-light');
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
  // button.style.setProperty('--link-color', '#fff');
  return button;
}

export function createTextElement(prop, classes) {
  const text = document.createElement(prop.tag || 'p');
  // const text = document.createElement('p');
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

  return text;
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