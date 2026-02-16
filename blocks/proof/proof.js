/**
 * Proof Block — Vitamix (Warranty as Design Statement)
 *
 * DA Authoring:
 * | Proof                   |                      |
 * | 10                      | Year Full Warranty   |
 * | The warranty isn't fine print. It's a design statement... | |
 * | <2%                     | Repair Rate          |
 * | 150K+                   | Restaurant Partners  |
 * | 103                     | Years in Business    |
 * | Vitamix Warranty        | 10 years             | 95    |
 * | Industry Average        | 1-3 years            | 40    |
 *
 * Row 1: hero number | unit label
 * Row 2: statement text (col 2 empty) — paragraph description
 * Rows with 2 populated cols: value | label → data points
 * Rows with 3 populated cols: brand | value text | width% → comparison bars
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const inner = document.createElement('div');
  inner.className = 'proof-inner';

  let heroNumber = '';
  let heroUnit = '';
  let statement = '';
  const dataPoints = [];
  const comparisons = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const col1 = cells[0] ? cells[0].textContent.trim() : '';
    const col2 = cells[1] ? cells[1].textContent.trim() : '';
    const col3 = cells[2] ? cells[2].textContent.trim() : '';

    if (i === 0) {
      // First row = hero number + unit
      heroNumber = col1;
      heroUnit = col2;
    } else if (col1 && !col2) {
      // Statement row (only col 1 has content)
      statement = col1;
    } else if (col1 && col2 && col3) {
      // Comparison bar row (3 columns)
      comparisons.push({ brand: col1, value: col2, width: parseInt(col3, 10) || 50 });
    } else if (col1 && col2) {
      // Data point row (2 columns)
      dataPoints.push({ value: col1, label: col2 });
    }
  });

  // Hero number — the typographic monument
  const numericValue = parseInt(heroNumber, 10);
  const numberEl = document.createElement('p');
  numberEl.className = 'proof-number';
  numberEl.textContent = heroNumber;
  if (!Number.isNaN(numericValue)) {
    numberEl.dataset.countTo = numericValue;
  }
  inner.append(numberEl);

  // Unit text
  if (heroUnit) {
    const unitEl = document.createElement('p');
    unitEl.className = 'proof-unit';
    unitEl.textContent = heroUnit;
    inner.append(unitEl);
  }

  // Statement
  if (statement) {
    const stmtEl = document.createElement('p');
    stmtEl.className = 'proof-statement';
    stmtEl.textContent = statement;
    inner.append(stmtEl);
  }

  // Data points
  if (dataPoints.length > 0) {
    const dataRow = document.createElement('div');
    dataRow.className = 'proof-data reveal-stagger';

    dataPoints.forEach((dp) => {
      const point = document.createElement('div');
      point.className = 'data-point';

      const val = document.createElement('p');
      val.className = 'data-value';
      val.textContent = dp.value;

      const lab = document.createElement('p');
      lab.className = 'data-label';
      lab.textContent = dp.label;

      point.append(val, lab);
      dataRow.append(point);
    });

    inner.append(dataRow);
  }

  // Comparison bars
  if (comparisons.length > 0) {
    const comp = document.createElement('div');
    comp.className = 'comparison reveal';

    comparisons.forEach((c, i) => {
      const barRow = document.createElement('div');
      barRow.className = 'bar-row';

      const header = document.createElement('div');
      header.className = 'bar-header';

      const brand = document.createElement('span');
      brand.className = 'bar-brand';
      brand.textContent = c.brand;
      if (i > 0) brand.style.color = 'var(--color-gray)';

      const pct = document.createElement('span');
      pct.className = 'bar-percentage';
      pct.textContent = c.value;

      header.append(brand, pct);

      const track = document.createElement('div');
      track.className = 'bar-track';

      const fill = document.createElement('div');
      fill.className = `bar-fill ${i === 0 ? 'vitamix' : 'industry'}`;
      fill.style.width = `${c.width}%`;

      track.append(fill);
      barRow.append(header, track);
      comp.append(barRow);
    });

    inner.append(comp);
  }

  // Replace block content
  block.textContent = '';
  block.append(inner);

  // Intersection observer — counter animation + reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Trigger stagger reveals
          entry.target.querySelectorAll('.reveal-stagger').forEach((el) => {
            el.classList.add('revealed');
          });
          entry.target.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('revealed');
          });

          // Counter animation for the hero number
          const numEl = entry.target.querySelector('.proof-number[data-count-to]');
          if (numEl) {
            const target = parseInt(numEl.dataset.countTo, 10);
            if (!Number.isNaN(target)) {
              animateCounter(numEl, target);
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
    // Ease-out quart for smooth deceleration
    const eased = 1 - (1 - progress) ** 4;
    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
