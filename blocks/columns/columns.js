/**
 * decorate the columns block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  // Determine number of columns from the first row
  const columnCount = rows[0]?.children.length || 2;

  // Add column count class for CSS layout (e.g., 'columns-2', 'columns-3')
  block.classList.add(`columns-${Math.min(columnCount, 3)}`);

  // Process each row
  rows.forEach((row) => {
    row.classList.add('columns-row');

    // Process each column
    Array.from(row.children).forEach((col, index) => {
      col.classList.add('columns-col');
      col.setAttribute('data-column', index + 1);
    });
  });

  // Handle images within columns
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    // Wrap images in figure for semantic HTML
    const figure = document.createElement('figure');
    img.replaceWith(figure);
    figure.append(img);
  });
}