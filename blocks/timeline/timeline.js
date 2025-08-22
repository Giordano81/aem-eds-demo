import { getBlockModel, createTextElement, createImageElement, createButtonElement, extractImageElements, crateBackgroundGallery } from '../../js/blockHelper.js';
import { createModal } from '../modal/modal.js';
import { loadFragment } from '../fragment/fragment.js';
import { createImageCarousel } from '../../js/imageCarouselHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'fragment', attribute: 'href' }
  ];
}

function getItemsProps() {
  return [
    { name: 'imageCarousel', attribute: 'src' },
    { name: 'imageAltCarousel' },
    { name: 'imageBackgound', attribute: 'src' },
    { name: 'imageAltBackground' },
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'modalTitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'modalTitleStyle' },
    { name: 'modalSubtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'modalSubtitleStyle' },
    { name: 'tagName' }
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
        const timelineItem = modelData.fragment.html.children[i].querySelector('& > div');

        const otherBlocks = document.createElement('div');
        while (timelineItem.children.length > getItemsProps().length) {
          otherBlocks.appendChild(timelineItem.children[getItemsProps().length]);
        }
        const item = getBlockModel(timelineItem, getItemsProps());
        item.images = extractImageElements(otherBlocks).images;

        modelData.fragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';
  block.parentElement.classList.add('double-content');

  const initialContainer = document.createElement('div');
  initialContainer.classList.add('initial-container');
  if (modelData.title.value) {
    const initialText = document.createElement('div');
    initialText.className = 'text-section';
    initialText.appendChild(createTextElement(modelData.title, ['timeline-title']));
    initialContainer.appendChild(initialText);
  }
  let images = (modelData.fragment?.items || []).map((item) => {
    return {
      image: item.imageCarousel.value,
      imageAlt: item.imageAltCarousel
    }
  });
  initialContainer.appendChild(crateBackgroundGallery(images));
  block.appendChild(initialContainer);

  // Create the main container
  const mainContainer = document.createElement('div');
  mainContainer.className = 'timeline-section';

  // Create the text section
  const textSection = document.createElement('div');
  textSection.className = 'text-section';
  if (modelData.title.value) {
    textSection.appendChild(createTextElement(modelData.title, ['timeline-title']));
  }
  if (modelData.subtitle.value) {
    textSection.appendChild(createTextElement(modelData.subtitle, ['timeline-subtitle']));
  }

  // Create the carousel section
  const carouselSection = document.createElement('div');
  carouselSection.className = 'carousel-section';

  // Create a list for images
  const imageList = document.createElement('div');
  imageList.className = 'image-list';

  // create the child's content
  const timelineContentItem = document.createElement('div');
  timelineContentItem.classList.add('timeline-content-item');
  timelineContentItem.classList.add('d-none');
  const timelineContentItemLeft = document.createElement('div');
  const timelineContentItemRight = document.createElement('div');
  timelineContentItem.appendChild(timelineContentItemLeft);
  timelineContentItem.appendChild(timelineContentItemRight);
  const buttonModel = {
    type: 'primary',
    text: 'Discover More',
    link: null
  };

  // Create image elements and append to the image list
  (modelData.fragment?.items || []).forEach(item => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    if (item.tagName) {
      const tag = document.createElement('div');
      tag.classList.add('tag-name');
      tag.textContent = item.tagName;
      imageContainer.appendChild(tag);
    }
    const model = {
      image: item.imageCarousel.value,
      imageAlt: item.imageAltCarousel,
    }
    const image = createImageElement(model);
    image.onclick = () => {
      [...imageList.children].forEach(child => {
        child.querySelector('picture').classList.remove('selected');
      });
      image.classList.add('selected');

      // Left content
      timelineContentItemLeft.innerHTML = '';
      timelineContentItemRight.innerHTML = '';
      if (item.title.value) {
        timelineContentItemLeft.appendChild(createTextElement(item.title, ['timeline-content-item__title'], true));
      }
      if (item.subtitle.value) {
        timelineContentItemLeft.appendChild(createTextElement(item.subtitle, ['timeline-content-item__subtitle'], true));
      }
      // Discover more button
      if (item.modalTitle.value || item.modalSubtitle.value) {
        const button = createButtonElement(buttonModel, true);
        button.onclick = async (event) => {
          event.stopPropagation();

          let dialogClasses = [];
          const modalBody = document.createElement('div');
          const textSection = document.createElement('div');
          textSection.classList.add('text-section');
          if (item.modalTitle.value) {
            textSection.appendChild(createTextElement(item.modalTitle, [], true));
          }
          if (item.modalSubtitle.value) {
            textSection.appendChild(createTextElement(item.modalSubtitle, [], true));
          }
          modalBody.appendChild(textSection);

          if (item.images.length) {
            textSection.classList.add('with-images');
            modalBody.appendChild(createImageCarousel(item.images));
          } else {
            dialogClasses.push('without-images');
          }

          const modal = await createModal(modalBody.childNodes, dialogClasses);
          modal.showModal();
        };
        timelineContentItemLeft.appendChild(button);
      }

      // Right image
      if (item.imageBackgound.value) {
        const imageModel = {
          image: item.imageBackgound.value,
          imageAlt: item.imageAltBackground,
        }
        timelineContentItemRight.appendChild(createImageElement(imageModel));
      }

      textSection.classList.add('d-none');
      timelineContentItem.classList.remove('d-none');
    };
    imageContainer.appendChild(image);
    imageList.appendChild(imageContainer);
  });

  carouselSection.appendChild(imageList);
  mainContainer.appendChild(textSection);
  mainContainer.appendChild(timelineContentItem);
  mainContainer.appendChild(carouselSection);
  block.appendChild(mainContainer);

  // window.addEventListener('scroll', () => {
  //   const testElement = document.getElementsByClassName('initial-container')[0];
  //   const rect = testElement.getBoundingClientRect();
  //   let isInView = false;
  //   if (rect.top <= window.innerHeight && rect.bottom >= 0) {
  //     isInView = true;
  //   }
  //   console.log(`Top: ${rect.top} - Bottom: ${rect.bottom} - Is in view: ${isInView}`);
  // });
}