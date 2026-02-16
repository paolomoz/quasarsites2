export default function decorate(block) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Counter animation for the hero number
          const numberEl = entry.target.querySelector('.proof-number, [data-count-to]');
          if (numberEl) {
            const target = parseInt(numberEl.dataset.countTo || numberEl.textContent, 10);
            if (!Number.isNaN(target)) {
              animateCounter(numberEl, target);
            }
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(block);
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quart
    const eased = 1 - (1 - progress) ** 4;
    const current = Math.round(eased * target);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
