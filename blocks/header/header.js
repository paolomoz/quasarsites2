import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * decorate the header block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  
  // Extract logo section (first row)
  const logoSection = rows[0];
  const logoContainer = document.createElement('div');
  logoContainer.className = 'header-logo';
  
  // Find and preserve logo image
  const logoImage = logoSection?.querySelector('picture, img');
  if (logoImage) {
    const logoLink = logoSection.querySelector('a') || document.createElement('a');
    logoLink.href = logoLink.href || '/';
    logoLink.className = 'logo-link';
    logoLink.replaceChildren(logoImage);
    logoContainer.append(logoLink);
  }
  
  // Extract navigation items (typically second row onwards)
  const navContainer = document.createElement('nav');
  navContainer.className = 'header-nav';
  
  const navList = document.createElement('ul');
  navList.className = 'nav-list';
  
  // Process navigation rows
  for (let i = 1; i < rows.length; i++) {
    const navRow = rows[i];
    const links = navRow.querySelectorAll('a');
    
    links.forEach((link) => {
      const listItem = document.createElement('li');
      listItem.className = 'nav-item';
      listItem.append(link);
      navList.append(listItem);
    });
  }
  
  if (navList.querySelectorAll('li').length > 0) {
    navContainer.append(navList);
  }
  
  // Check for mobile menu toggle variant
  const hasMobileMenu = block.classList.contains('mobile-menu');
  if (hasMobileMenu) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'nav-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    menuToggle.addEventListener('click', () => {
      navContainer.classList.toggle('nav-open');
      menuToggle.classList.toggle('toggle-active');
      menuToggle.setAttribute('aria-expanded', navContainer.classList.contains('nav-open'));
    });
    
    logoContainer.append(menuToggle);
  }
  
  // Build header structure
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';
  headerWrapper.append(logoContainer, navContainer);
  
  // Check for sticky header variant
  if (block.classList.contains('sticky')) {
    block.classList.add('header-sticky');
  }
  
  // Check for dark theme variant
  if (block.classList.contains('dark')) {
    block.classList.add('header-dark');
  }
  
  block.replaceChildren(headerWrapper);
}