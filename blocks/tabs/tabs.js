/**
 * decorate the tabs block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  
  if (rows.length === 0) return;

  // Create tab list container
  const tabList = document.createElement('ul');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  // Create tab panels container
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-panels';

  let firstTab = true;

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');
    
    if (cells.length < 2) return;

    // Extract tab title from first cell
    const titleCell = cells[0];
    const titleText = titleCell.textContent.trim();
    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Create tab button
    const tabItem = document.createElement('li');
    tabItem.className = 'tabs-item';
    
    const tabButton = document.createElement('button');
    tabButton.className = 'tabs-button';
    tabButton.setAttribute('id', tabId);
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', firstTab ? 'true' : 'false');
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.setAttribute('tabindex', firstTab ? '0' : '-1');
    tabButton.textContent = titleText;

    tabItem.append(tabButton);
    tabList.append(tabItem);

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.setAttribute('id', panelId);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('hidden', firstTab ? '' : null);

    // Add content from remaining cells to panel
    for (let i = 1; i < cells.length; i += 1) {
      const contentCell = cells[i];
      const content = contentCell.querySelectorAll(':scope > *');
      panel.append(...content);
    }

    panelsContainer.append(panel);
    firstTab = false;
  });

  // Add click handlers to tabs
  const tabButtons = tabList.querySelectorAll('.tabs-button');
  const panels = panelsContainer.querySelectorAll('.tabs-panel');

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Remove active state from all tabs
      tabButtons.forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });

      // Hide all panels
      panels.forEach((p) => {
        p.setAttribute('hidden', '');
      });

      // Set active state on clicked tab
      button.setAttribute('aria-selected', 'true');
      button.setAttribute('tabindex', '0');
      button.focus();

      // Show corresponding panel
      panels[index].removeAttribute('hidden');
    });

    // Add keyboard navigation
    button.addEventListener('keydown', (e) => {
      let targetIndex = index;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = tabButtons.length - 1;
      }

      if (targetIndex !== index) {
        tabButtons[targetIndex].click();
      }
    });
  });

  // Clear existing block content and add new structure
  block.replaceChildren(tabList, panelsContainer);
}