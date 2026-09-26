// Dusk-to-dawn background: build one continuous gradient across the whole
// page, with a stop at the horizontal centre of each panel holding that
// panel's intended colour — so text always sits on the right background,
// no matter how wide a panel renders at a given viewport size. The page
// scrolls sideways, so the gradient runs left to right.
function updateDuskToDawnGradient() {
  // 'leading' anchors a stop to a panel's left edge (used for the sunrise
  // flash, so it lands right at the horizon illustration); 'mid' anchors to
  // its horizontal centre (used for a panel's own resting colour).
  const sectionColors = [
    ['hero', '--c-night-1', 'mid'],
    ['problem', '--c-night-2', 'mid'],
    ['how', '--c-night-1', 'mid'],
    ['spectrum', '--c-night-2', 'mid'],
    ['technology', '--c-transition', 'mid'],
    ['impact', '--c-sunrise-glow', 'leading'],
    ['impact', '--c-dawn-1', 'mid'],
  ];
  const rootStyles = getComputedStyle(document.documentElement);
  const totalWidth = document.documentElement.scrollWidth;
  const scrollX = window.scrollX || window.pageXOffset;

  const stops = sectionColors.map(([id, varName, anchor]) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const left = rect.left + scrollX;
    const anchorPos = anchor === 'leading' ? left : left + el.offsetWidth / 2;
    const pct = (anchorPos / totalWidth) * 100;
    const color = rootStyles.getPropertyValue(varName).trim();
    return `${color} ${pct.toFixed(2)}%`;
  }).filter(Boolean);

  if (stops.length) {
    document.body.style.background = `linear-gradient(to right, ${stops.join(', ')})`;
  }
}

let gradientResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(gradientResizeTimer);
  gradientResizeTimer = setTimeout(updateDuskToDawnGradient, 150);
});
window.addEventListener('load', updateDuskToDawnGradient);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateDuskToDawnGradient);
}
updateDuskToDawnGradient();

// Turn vertical wheel/trackpad input into horizontal scrolling, since the
// page's own scroll axis is sideways (mice and trackpads report vertical
// intent far more often than horizontal). Every section is sized to fit
// the screen height on its own (fluid, vh-based typography and spacing),
// so there is no vertical scroll to chain to — all wheel input maps to
// horizontal movement.
window.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal input
  e.preventDefault();
  window.scrollBy({ left: e.deltaY, behavior: 'auto' });
}, { passive: false });

// Walking elephant mascot: its horizontal position tracks how far through
// the page you've scrolled, so it treks from one side of the screen to the
// other as you move from the night side of the site to the dawn side. The
// leg/body walk-cycle animation is separate (pure CSS, always looping).
const scrollElephant = document.getElementById('scrollElephant');
function updateElephantPosition() {
  if (!scrollElephant) return;
  const maxScroll = document.documentElement.scrollWidth - window.innerWidth;
  const scrollX = window.scrollX || window.pageXOffset;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollX / maxScroll)) : 0;
  const travel = Math.max(0, window.innerWidth - scrollElephant.offsetWidth - 28);
  scrollElephant.style.transform = `translateX(${14 + progress * travel}px)`;
}
window.addEventListener('scroll', updateElephantPosition);
window.addEventListener('resize', updateElephantPosition);
updateElephantPosition();

// Nav background once scrolled off the first panel
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', (window.scrollX || window.pageXOffset) > 40);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Every in-page anchor (nav brand, nav links, hero buttons) scrolls
// horizontally to its target panel instead of relying on the browser's
// default vertical anchor jump.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

