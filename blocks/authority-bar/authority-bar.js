/**
 * Authority Bar Block — Vitamix
 *
 * DA Authoring:
 * | Authority Bar                      |
 * | Culinary Institute of America      |
 * | Michelin-Star Kitchens             |
 * | Le Cordon Bleu                     |
 * | 150,000+ Restaurants               |
 *
 * Each row = one trust item (text, or image + text).
 * Rendered as a horizontal strip with dot separators.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const label = document.createElement('span');
  label.className = 'authority-label';
  label.textContent = 'Trusted by';

  const logos = document.createElement('div');
  logos.className = 'authority-logos';

  rows.forEach((row, i) => {
    const cell = row.children[0];
    if (!cell) return;

    const item = document.createElement('span');
    item.className = 'authority-item';

    // Check for image (logo)
    const img = cell.querySelector('picture, img');
    if (img) {
      item.append(img);
    }

    // Add text
    const text = cell.textContent.trim();
    if (text) {
      const textNode = document.createTextNode(text);
      item.append(textNode);
    }

    // Add dot separator before items (except first)
    if (i > 0) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.setAttribute('aria-hidden', 'true');
      logos.append(dot);
    }

    logos.append(item);
  });

  const inner = document.createElement('div');
  inner.className = 'authority-inner';
  inner.append(label, logos);

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
