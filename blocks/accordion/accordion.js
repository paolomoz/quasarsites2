import { toClassName } from '../../scripts/aem.js';

/**
 * decorate the accordion block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const items = block.querySelectorAll(':scope > div');

  // Convert rows to accordion items
  items.forEach((item, index) => {
    const children = item.querySelectorAll(':scope > div');

    if (children.length >= 2) {
      // First div is the title/header
      const titleDiv = children[0];
      const title = titleDiv.textContent.trim();

      // Remaining divs are the content
      const contentDivs = Array.from(children).slice(1);

      // Create header button
      const button = document.createElement('button');
      button.className = 'accordion-header';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `accordion-panel-${index}`);
      button.textContent = title;

      // Create content panel
      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.id = `accordion-panel-${index}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', `accordion-header-${index}`);
      panel.hidden = true;

      // Move content divs into panel
      contentDivs.forEach((contentDiv) => {
        panel.append(...contentDiv.children);
      });

      // Create wrapper for header and panel
      const wrapper = document.createElement('div');
      wrapper.className = 'accordion-item';

      button.id = `accordion-header-${index}`;
      wrapper.append(button, panel);

      // Replace original item with new structure
      item.replaceWith(wrapper);

      // Add click handler
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const isActive = button.classList.contains('active');

        // Check if multiple expansion is allowed (default is single)
        const allowMultiple = block.classList.contains('multiple');

        if (!allowMultiple && !isActive) {
          // Close all other panels
          block.querySelectorAll('.accordion-header.active').forEach((otherButton) => {
            otherButton.classList.remove('active');
            otherButton.setAttribute('aria-expanded', 'false');
            const otherPanel = block.querySelector(
              `#${otherButton.getAttribute('aria-controls')}`
            );
            if (otherPanel) {
              otherPanel.hidden = true;
            }
          });
        }

        // Toggle current panel
        button.classList.toggle('active');
        button.setAttribute('aria-expanded', !isExpanded);
        panel.hidden = isExpanded;
      });
    }
  });
}