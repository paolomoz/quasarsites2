export default function decorate(block) {
  const children = [...block.children];

  // Process each row as a spec panel
  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      row.classList.add('spec-panel', 'blueprint-line');
    }
  });

  // Intersection observer for staggered reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const panels = entry.target.querySelectorAll('.spec-panel');
          panels.forEach((panel, i) => {
            setTimeout(() => {
              panel.classList.add('revealed');
            }, i * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(block);
}
