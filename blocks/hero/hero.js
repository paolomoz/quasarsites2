/**
 * Hero Block — Vitamix
 *
 * DA Authoring:
 * | Hero                  |                                              |
 * | [product image]       | Heading (h1/h2) + paragraph + CTA link      |
 * | 2.2                   | Peak Horsepower                              |
 * | 10                    | Year Warranty                                |
 * | <2%                   | Repair Rate                                  |
 * | 1921                  | Founded                                      |
 *
 * Row 1: image in col 1, text content in col 2
 * Rows 2+: spec value | spec label → rendered as bottom spec strip
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const firstRow = rows[0];
  const cells = [...firstRow.children];

  // Build hero layout
  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  const content = document.createElement('div');
  content.className = 'hero-content';

  const product = document.createElement('div');
  product.className = 'hero-product';

  if (cells.length >= 2) {
    // Two-column layout: image | content
    const imageCell = cells[0];
    const contentCell = cells[1];

    const picture = imageCell.querySelector('picture');
    if (picture) {
      product.append(picture);
    }

    // Move all content elements (headings, paragraphs, buttons)
    while (contentCell.firstChild) {
      content.append(contentCell.firstChild);
    }
  } else {
    // Single-column fallback (auto-hero pattern)
    const cell = cells[0];
    const picture = cell.querySelector('picture');
    if (picture) product.append(picture);

    while (cell.firstChild) {
      content.append(cell.firstChild);
    }
  }

  inner.append(content);
  inner.append(product);

  // Build spec strip from remaining rows
  if (rows.length > 1) {
    const specs = document.createElement('div');
    specs.className = 'hero-specs';

    for (let i = 1; i < rows.length; i += 1) {
      const specCells = [...rows[i].children];
      if (specCells.length >= 2) {
        const item = document.createElement('div');
        item.className = 'spec-item';

        const num = document.createElement('span');
        num.className = 'num';
        num.textContent = specCells[0].textContent.trim();

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = specCells[1].textContent.trim();

        item.append(num, label);
        specs.append(item);
      }
    }

    if (specs.children.length > 0) {
      inner.append(specs);
    }
  }

  // Replace block content
  block.textContent = '';
  block.append(inner);

  // Staggered entrance animation
  const animateEls = [content, product, inner.querySelector('.hero-specs')].filter(Boolean);
  animateEls.forEach((el, i) => {
    el.classList.add('reveal');
    setTimeout(() => {
      el.classList.add('revealed');
    }, 300 + i * 300);
  });
}
