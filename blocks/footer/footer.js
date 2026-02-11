/**
 * decorate the footer block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  // Structure: rows contain sections like branding, links, social, copyright
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    // First row typically contains branding/logo
    if (index === 0) {
      row.classList.add('footer-brand');
      cells.forEach((cell) => {
        cell.classList.add('footer-brand-cell');
      });
    }

    // Middle rows typically contain link columns
    if (index > 0 && index < rows.length - 1) {
      row.classList.add('footer-links');
      cells.forEach((cell) => {
        cell.classList.add('footer-links-column');

        // Convert direct text to proper list structure if needed
        const headings = cell.querySelectorAll(':scope > h3, :scope > h4, :scope > h5');
        headings.forEach((heading) => {
          heading.classList.add('footer-column-title');
        });

        const lists = cell.querySelectorAll(':scope > ul');
        lists.forEach((list) => {
          list.classList.add('footer-link-list');
          list.querySelectorAll('li').forEach((item) => {
            item.classList.add('footer-link-item');
          });
        });
      });
    }

    // Last row typically contains social/copyright
    if (index === rows.length - 1) {
      row.classList.add('footer-bottom');
      cells.forEach((cell) => {
        const content = cell.textContent.toLowerCase();

        if (content.includes('copyright') || content.includes('©') || content.includes('legal')) {
          cell.classList.add('footer-copyright');
        } else if (content.includes('social') || cell.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]')) {
          cell.classList.add('footer-social');
          const links = cell.querySelectorAll('a');
          links.forEach((link) => {
            link.classList.add('social-link');
          });
        } else {
          cell.classList.add('footer-bottom-cell');
        }
      });
    }
  });

  // Decorate all links
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    link.classList.add('footer-link');
  });

  // Add footer class for styling hooks
  block.classList.add('footer-decorated');
}