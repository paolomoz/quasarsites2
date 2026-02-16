/**
 * CTA Banner Block — Vitamix (Radical Restraint)
 *
 * DA Authoring:
 * | CTA Banner                                        |
 * | The blender you pass down, _not throw away._      |
 * | [Shop Vitamix](https://vitamix.com)               |
 *
 * Or single cell with heading + italic + link:
 * | CTA Banner                                        |
 * | ## The blender you pass down, \n _not throw away._ \n [Shop Vitamix](link) |
 *
 * Supports: heading, italic/em text (rendered in serif), and a CTA link/button.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const inner = document.createElement('div');
  inner.className = 'final-cta-inner';

  // Collect all content from all rows into a flat list
  const elements = [];
  rows.forEach((row) => {
    const cell = row.children[0] || row;
    [...cell.children].forEach((el) => elements.push(el));
  });

  // If no child elements, treat row text content as paragraphs
  if (elements.length === 0) {
    rows.forEach((row) => {
      const text = row.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        elements.push(p);
      }
    });
  }

  elements.forEach((el) => {
    // Headings → CTA heading
    if (el.tagName && el.tagName.match(/^H[1-6]$/)) {
      const h2 = document.createElement('h2');
      h2.textContent = el.textContent;
      inner.append(h2);
      return;
    }

    // Links/buttons → CTA button
    const link = el.querySelector ? el.querySelector('a') : null;
    if (link) {
      const btn = document.createElement('a');
      btn.className = 'cta-button';
      btn.href = link.href;
      btn.textContent = link.textContent.trim();
      inner.append(btn);
      return;
    }

    // Paragraphs with emphasis → serif subtext
    if (el.tagName === 'P') {
      const em = el.querySelector('em, i');
      if (em) {
        const serif = document.createElement('p');
        serif.className = 'cta-serif';
        serif.textContent = em.textContent;
        inner.append(serif);
        return;
      }

      // Regular paragraph → treat as heading if no heading found yet
      if (!inner.querySelector('h2')) {
        const h2 = document.createElement('h2');
        h2.textContent = el.textContent;
        inner.append(h2);
      } else {
        const serif = document.createElement('p');
        serif.className = 'cta-serif';
        serif.textContent = el.textContent;
        inner.append(serif);
      }
    }
  });

  block.textContent = '';
  block.append(inner);

  // Reveal animation
  block.classList.add('reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  observer.observe(block);
}
