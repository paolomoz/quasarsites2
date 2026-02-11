import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * decorate the hero block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  if (rows.length === 0) return;

  // Extract content from rows
  const firstRow = rows[0];
  const secondRow = rows.length > 1 ? rows[1] : null;
  const thirdRow = rows.length > 2 ? rows[2] : null;

  // Get image from first row
  const picture = firstRow.querySelector('picture');
  const img = firstRow.querySelector('img');

  // Create wrapper structure
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  // Add background image
  if (picture || img) {
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'hero-background';

    if (picture) {
      backgroundContainer.append(picture);
    } else if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt || 'Hero background',
        false,
        [{ width: '1920' }, { width: '1200' }, { width: '768' }],
      );
      backgroundContainer.append(optimizedPicture);
    }

    wrapper.append(backgroundContainer);
  }

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'hero-content';

  // Add headline from second row
  if (secondRow) {
    const headline = secondRow.querySelector('h1, h2, h3, h4, h5, h6') || secondRow.querySelector('p');
    if (headline) {
      const headlineDiv = document.createElement('div');
      headlineDiv.className = 'hero-headline';
      headlineDiv.append(headline);
      contentContainer.append(headlineDiv);
    }
  }

  // Add description from third row
  if (thirdRow) {
    const description = thirdRow.querySelector('p');
    const cta = thirdRow.querySelector('a');

    if (description) {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'hero-description';
      descriptionDiv.append(description);
      contentContainer.append(descriptionDiv);
    }

    if (cta) {
      const ctaDiv = document.createElement('div');
      ctaDiv.className = 'hero-cta';
      cta.classList.add('button');
      ctaDiv.append(cta);
      contentContainer.append(ctaDiv);
    }
  }

  wrapper.append(contentContainer);

  // Check for variants
  const isDark = block.classList.contains('dark');
  const isLight = block.classList.contains('light');
  const isSmall = block.classList.contains('small');

  if (isDark) {
    wrapper.classList.add('hero-dark');
  }

  if (isLight) {
    wrapper.classList.add('hero-light');
  }

  if (isSmall) {
    wrapper.classList.add('hero-small');
  }

  // Replace block content with decorated structure
  block.replaceChildren(wrapper);
}