/**
 * Food Gallery Block — Vitamix
 *
 * DA Authoring:
 * | Food Gallery               |                        |                    |
 * | [food image]               | Golden Turmeric Bowl   | Blend · 4 min      |
 * | [food image]               | Thai Green Curry Soup  | Hot Soup · 6 min   |
 * | [food image]               | Roasted Tomato Bisque  | Hot Soup · 8 min   |
 * | [food image]               | Acai Superfood Blend   | Smoothie · 2 min   |
 * | [food image]               | Fresh Cashew Butter    | Nut Butter · 5 min |
 *
 * Each row: image | recipe name | category/tag
 * First item spans 2 rows on desktop for editorial asymmetry.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const grid = document.createElement('div');
  grid.className = 'food-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'food-item';

    // Image
    const picture = cells[0] ? cells[0].querySelector('picture') : null;
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.position = 'absolute';
        img.style.inset = '0';
      }
      picture.style.position = 'absolute';
      picture.style.inset = '0';
      item.append(picture);
    }

    // Overlay with recipe name and tag
    const overlay = document.createElement('div');
    overlay.className = 'food-overlay';

    if (cells[1]) {
      const name = document.createElement('p');
      name.className = 'food-name';
      name.textContent = cells[1].textContent.trim();
      overlay.append(name);
    }

    if (cells[2]) {
      const tag = document.createElement('p');
      tag.className = 'food-tag';
      tag.textContent = cells[2].textContent.trim();
      overlay.append(tag);
    }

    item.append(overlay);
    grid.append(item);
  });

  block.textContent = '';
  block.append(grid);

  // Subtle parallax on food images (0.15 rate)
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const images = block.querySelectorAll('.food-item img');
    if (images.length > 0) {
      const handleScroll = () => {
        const rect = block.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
          const progress = (viewH - rect.top) / (viewH + rect.height);
          const offset = (progress - 0.5) * 0.15 * 100;
          images.forEach((img) => {
            img.style.transform = `translateY(${offset}px) scale(1.05)`;
          });
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }
}
