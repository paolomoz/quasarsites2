export default function decorate(block) {
  // Subtle parallax on food images (0.15 rate as specified)
  const images = block.querySelectorAll('img');

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && images.length > 0) {
    block.classList.add('parallax-active');

    const handleScroll = () => {
      const rect = block.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        const offset = (progress - 0.5) * 0.15 * 100;

        images.forEach((img) => {
          img.style.transform = `translateY(${offset}px) scale(1.05)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}
