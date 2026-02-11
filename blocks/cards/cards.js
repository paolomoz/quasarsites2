import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * decorate the cards block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row) => {
    row.classList.add('card');

    const columns = row.querySelectorAll(':scope > div');

    if (columns.length >= 1) {
      // First column: image
      const imageCol = columns[0];
      const picture = imageCol.querySelector('picture');
      const img = imageCol.querySelector('img');

      if (picture || img) {
        const figure = document.createElement('figure');
        figure.classList.add('card-image');

        if (picture) {
          figure.append(picture);
        } else if (img) {
          figure.append(img);
        }

        imageCol.replaceChildren(figure);
      }
    }

    if (columns.length >= 2) {
      // Second column: title
      const titleCol = columns[1];
      const heading = titleCol.querySelector('h1, h2, h3, h4, h5, h6');

      if (heading) {
        heading.classList.add('card-title');
      } else {
        const paragraphs = titleCol.querySelectorAll('p');
        if (paragraphs.length > 0) {
          const title = document.createElement('h3');
          title.classList.add('card-title');
          title.textContent = paragraphs[0].textContent;
          paragraphs[0].replaceWith(title);
        }
      }
    }

    if (columns.length >= 3) {
      // Third column: description
      const descCol = columns[2];
      const paragraphs = descCol.querySelectorAll('p');

      paragraphs.forEach((p) => {
        p.classList.add('card-description');
      });
    }

    if (columns.length >= 4) {
      // Fourth column: CTA/link
      const ctaCol = columns[3];
      const link = ctaCol.querySelector('a');

      if (link) {
        link.classList.add('card-cta');
      }
    }

    // Wrap all columns in a card-body div for better structure
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const contentCols = Array.from(columns).slice(1);
    cardBody.append(...contentCols);

    row.append(cardBody);
  });
}