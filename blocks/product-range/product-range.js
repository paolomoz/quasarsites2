/**
 * Product Range Block — Vitamix
 *
 * DA Authoring:
 * | Product Range   |                                                |
 * | [product image] | **Vitamix A3500** \n 2.2 HP · Touchscreen \n From $649 \n [View Details](link) |
 * | [product image] | **Vitamix E310** \n 2.0 HP · 10 Variable Speeds \n From $349 \n [View Details](link) |
 * | [product image] | **Vitamix V1200** \n 2.2 HP · Self-Detect \n From $549 \n [View Details](link) |
 *
 * Each row: image | content cell with heading (h3) + paragraphs + link
 * The content cell contains: product name (as bold/heading), spec line, price, and optional link.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const inner = document.createElement('div');
  inner.className = 'product-inner';

  // Grid
  const grid = document.createElement('div');
  grid.className = 'product-grid reveal-stagger';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 0) return;

    const card = document.createElement('div');
    card.className = 'product-card';

    // Image (col 1)
    const imageWrap = document.createElement('div');
    imageWrap.className = 'product-image';

    const imgCell = cells[0];
    const picture = imgCell ? imgCell.querySelector('picture') : null;
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.style.maxWidth = '80%';
        img.style.maxHeight = '80%';
        img.style.objectFit = 'contain';
      }
      imageWrap.append(picture);
    }
    card.append(imageWrap);

    // Content (col 2)
    const contentCell = cells[1] || cells[0];
    if (contentCell) {
      // Extract heading → product name
      const heading = contentCell.querySelector('h2, h3, h4, strong');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        card.append(h3);
      }

      // Extract paragraphs → spec line, price, etc.
      const paragraphs = contentCell.querySelectorAll('p');
      let foundPrice = false;

      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (!text) return;

        // Skip if this paragraph contains the heading we already extracted
        if (heading && p.contains(heading)) return;

        // Check if this is a link/button
        const link = p.querySelector('a');
        if (link) {
          const productLink = document.createElement('a');
          productLink.className = 'product-link';
          productLink.href = link.href;
          productLink.textContent = link.textContent.trim();
          card.append(productLink);
          return;
        }

        // Check if this looks like a price (contains $ or currency)
        if (text.match(/[$€£]\d/) || text.toLowerCase().startsWith('from')) {
          foundPrice = true;
          const priceEl = document.createElement('p');
          priceEl.className = 'product-price';

          // Split "From $649" into label + amount
          const priceMatch = text.match(/(from\s*)?([£$€]\d[\d,.]*)/i);
          if (priceMatch) {
            if (priceMatch[1]) {
              const fromSpan = document.createElement('span');
              fromSpan.className = 'from';
              fromSpan.textContent = 'From';
              priceEl.append(fromSpan);
            }
            const amountSpan = document.createElement('span');
            amountSpan.className = 'amount';
            amountSpan.textContent = priceMatch[2];
            priceEl.append(amountSpan);
          } else {
            priceEl.textContent = text;
          }

          card.append(priceEl);
          return;
        }

        // Otherwise treat as spec line
        if (!foundPrice) {
          const spec = document.createElement('p');
          spec.className = 'product-spec';
          spec.textContent = text;
          card.append(spec);
        }
      });
    }

    grid.append(card);
  });

  inner.append(grid);

  block.textContent = '';
  block.append(inner);

  // Reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('.reveal-stagger')?.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  observer.observe(block);
}
