import { createOptimizedPicture } from './aem.js';

export function getBlockModel(block, props) {
  let modelData = {};

  // const booleanProps = ['subtitleQuotes', 'imageOpacity'];
  // const imageProps = ['image'];
  // const properties = block.querySelectorAll('[data-aue-prop]');
  // properties.forEach((prop) => {
  //   console.log(prop);
  //   const propName = prop.getAttribute('data-aue-prop');
  //   modelData[propName] = prop.textContent.trim();
  //   if (booleanProps.includes(propName)) {
  //     modelData[propName] = modelData[propName] === 'true';
  //   }
  //   if (imageProps.includes(propName)) {
  //     modelData[propName] = prop.getAttribute('src');
  //   }
  // });

  props.forEach((obj, index) => {
    const propertyName = obj.name;
    // if (!modelData.hasOwnProperty(propertyName) || modelData[propertyName] == null || modelData[propertyName] == undefined) {
    const textContent = block.children[index].textContent.trim();
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
    // }
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
  button.href = buttonModel.link;
  if (buttonModel.title) {
    button.setAttribute('title', buttonModel.title);
  }
  // button.style.setProperty('--link-color', '#fff');
  return button;
}

export function createTextElement(prop, classes) {
  const text = document.createElement(prop.tag || 'span');
  text.classList.add(...classes);
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
      images.push(child);
      block.removeChild(child);
    }
  }

  return {
    updatedBlock: block,
    images: images
  }
}