/**
 * decorate the quote block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  // Extract quote text and optional attribution
  const quoteText = rows[0]?.textContent?.trim() || '';
  const attribution = rows[1]?.textContent?.trim() || '';

  // Create blockquote element
  const blockquote = document.createElement('blockquote');
  const quoteP = document.createElement('p');
  quoteP.textContent = quoteText;
  blockquote.append(quoteP);

  // Add attribution if present
  if (attribution) {
    const cite = document.createElement('cite');
    cite.textContent = attribution;
    blockquote.append(cite);
  }

  // Replace block content with structured quote
  block.replaceChildren(blockquote);
}