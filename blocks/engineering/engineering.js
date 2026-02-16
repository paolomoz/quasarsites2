/**
 * Engineering Block — Vitamix
 *
 * DA Authoring:
 * | Engineering                                                  |        |                              |
 * | ## The specs aren't hidden in a tab. They're the reason you buy. |   |                              |
 * |   While competitors hide specifications, Vitamix surfaces... |        |                              |
 * | 2.2                                                          | Peak Horsepower | Commercial-grade motor... |
 * | 240                                                          | MPH Blade Tip Speed | Hardened stainless... |
 * | 10                                                           | Year Full Warranty  | Every component...    |
 * | 0                                                            | Plastic Gears       | Metal-to-metal...     |
 * | 64                                                           | oz Container Volume | Self-cleaning...      |
 * | 103                                                          | Years of Making     | Founded in 1921...    |
 *
 * Row with content only in col 1 (cols 2-3 empty) = heading/subtitle content.
 * Row with all 3 cols populated = tech spec card.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const inner = document.createElement('div');
  inner.className = 'engineering-inner';

  // Section label — derived from block name
  const labelEl = document.createElement('div');
  labelEl.className = 'engineering-label reveal';
  labelEl.textContent = 'Engineering';
  inner.append(labelEl);

  // Separate header rows from spec card rows
  const headerEls = [];
  const specRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const hasCol2Content = cells[1] && cells[1].textContent.trim().length > 0;
    const hasCol3Content = cells[2] && cells[2].textContent.trim().length > 0;

    if (!hasCol2Content && !hasCol3Content) {
      // Header row — content only in first cell
      headerEls.push(cells[0]);
    } else if (hasCol2Content) {
      // Spec card row
      specRows.push(cells);
    }
  });

  // Process header content (heading + subtitle)
  headerEls.forEach((cell) => {
    const heading = cell.querySelector('h1, h2, h3, h4');
    if (heading) {
      heading.classList.add('reveal');
      inner.append(heading);
    }

    const paragraphs = cell.querySelectorAll('p');
    paragraphs.forEach((p) => {
      p.className = 'engineering-subtitle reveal';
      inner.append(p);
    });
  });

  // Build spec poetry line from first 3 spec cards
  if (specRows.length >= 3) {
    const poetry = document.createElement('div');
    poetry.className = 'spec-poetry reveal';

    for (let i = 0; i < Math.min(3, specRows.length); i += 1) {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.innerHTML = '&middot;';
        poetry.append(sep);
      }
      const specText = document.createElement('span');
      const value = specRows[i][0].textContent.trim();
      const unit = specRows[i][1].textContent.trim();
      specText.textContent = `${value} ${unit}`;
      poetry.append(specText);
    }

    inner.append(poetry);
  }

  // Build tech card grid
  if (specRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'tech-grid reveal-stagger';

    specRows.forEach((cells) => {
      const card = document.createElement('div');
      card.className = 'tech-card';

      const number = document.createElement('div');
      number.className = 'card-number';
      number.textContent = cells[0].textContent.trim();

      const unit = document.createElement('div');
      unit.className = 'card-unit';
      unit.textContent = cells[1].textContent.trim();

      const desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = cells[2] ? cells[2].textContent.trim() : '';

      card.append(number, unit, desc);
      grid.append(card);
    });

    inner.append(grid);
  }

  // Replace block content
  block.textContent = '';
  block.append(inner);

  // Intersection observer for reveals and blueprint line draws
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reveal all .reveal elements within
          entry.target.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('revealed');
          });

          // Stagger tech card line draws
          const cards = entry.target.querySelectorAll('.tech-card');
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 200);
          });

          // Reveal stagger container
          const stagger = entry.target.querySelector('.reveal-stagger');
          if (stagger) stagger.classList.add('revealed');

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(block);
}
