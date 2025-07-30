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
      modelData[propertyName] = findAttributeByAttr(block.children[index], obj.attribute) || textContent;
    } else if (obj.tags) {
      let valueFound;
      for (let i = 0; i < obj.tags.length; i++) {
        valueFound = findAttributeByTag(block.children[index], obj.tags[i]);
        if (valueFound) break;
      }
      modelData[propertyName] = valueFound || textContent;
    } else if(obj.isBoolean === true) {
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