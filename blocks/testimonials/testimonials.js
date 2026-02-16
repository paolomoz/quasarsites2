/**
 * Testimonials Block — Vitamix (Editorial Interview Format)
 *
 * DA Authoring:
 * | Testimonials        |                                                        |                              |
 * | [chef photo]        | I've run three restaurants. The Vitamix is the only...  | Marcus Devlin                |
 * |                     |                                                        | Executive Chef, The Brass Tack, Portland |
 * | [chef photo]        | We run it 14 hours a day, six days a week...            | Ana Lucia Reyes              |
 * |                     |                                                        | Pastry Chef, Marisol, Chicago |
 *
 * Each row: photo | quote | name + role (name on first line, role on second)
 *
 * Alternative (name and role in same cell as separate paragraphs):
 * | [chef photo]        | Quote text...                                          | Marcus Devlin \n Executive Chef, The Brass Tack |
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const inner = document.createElement('div');
  inner.className = 'testimonials-inner';

  // Section label
  const label = document.createElement('div');
  label.className = 'testimonials-label';
  label.textContent = 'From the Kitchen';
  inner.append(label);

  // Section heading
  const heading = document.createElement('h2');
  heading.textContent = 'The chefs don\u2019t endorse. They document.';
  inner.append(heading);

  // Check if first row is a heading row (has h2/h3 but no image)
  const firstRow = rows[0];
  const firstCells = [...firstRow.children];
  const firstHeading = firstCells[0].querySelector('h2, h3');
  let startIndex = 0;

  if (firstHeading && !firstCells[0].querySelector('picture')) {
    // First row is a custom heading — use it instead of default
    heading.textContent = firstHeading.textContent;

    // Check if there's also a label in this row
    const labelText = firstCells[1] ? firstCells[1].textContent.trim() : '';
    if (labelText) label.textContent = labelText;

    startIndex = 1;
  }

  // Build testimonial grid
  const grid = document.createElement('div');
  grid.className = 'testimonials-grid reveal-stagger';

  for (let i = startIndex; i < rows.length; i += 1) {
    const cells = [...rows[i].children];
    if (cells.length < 2) continue;

    const testimonial = document.createElement('div');
    testimonial.className = 'testimonial';

    // Photo (col 1)
    const photoWrap = document.createElement('div');
    photoWrap.className = 'testimonial-photo';
    const picture = cells[0].querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
      }
      photoWrap.append(picture);
    }
    testimonial.append(photoWrap);

    // Content (quote + name + role)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'testimonial-content';

    // Quote (col 2)
    const quoteText = cells[1] ? cells[1].textContent.trim() : '';
    if (quoteText) {
      const quote = document.createElement('p');
      quote.className = 'testimonial-quote';
      quote.textContent = quoteText;
      contentDiv.append(quote);
    }

    // Name + Role (col 3 — may contain multiple paragraphs)
    if (cells[2]) {
      const paragraphs = cells[2].querySelectorAll('p');
      if (paragraphs.length >= 2) {
        // First paragraph = name, second = role
        const name = document.createElement('p');
        name.className = 'testimonial-name';
        name.textContent = paragraphs[0].textContent.trim();
        contentDiv.append(name);

        const role = document.createElement('p');
        role.className = 'testimonial-role';
        role.textContent = paragraphs[1].textContent.trim();
        contentDiv.append(role);
      } else {
        // Single text — try splitting by line break or comma
        const fullText = cells[2].textContent.trim();
        const parts = fullText.split('\n').map((s) => s.trim()).filter(Boolean);

        if (parts.length >= 2) {
          const name = document.createElement('p');
          name.className = 'testimonial-name';
          name.textContent = parts[0];
          contentDiv.append(name);

          const role = document.createElement('p');
          role.className = 'testimonial-role';
          role.textContent = parts.slice(1).join(', ');
          contentDiv.append(role);
        } else {
          const name = document.createElement('p');
          name.className = 'testimonial-name';
          name.textContent = fullText;
          contentDiv.append(name);
        }
      }
    }

    testimonial.append(contentDiv);
    grid.append(testimonial);
  }

  inner.append(grid);

  // Replace block content
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
