// Dusk-to-dawn background: build one continuous gradient across the whole
// page, with a stop at the vertical centre of each section holding that
// section's intended colour — so text always sits on the right background,
// no matter how tall a section renders at a given viewport width.
function updateDuskToDawnGradient() {
  const sectionColors = [
    ['hero', '--c-night-1'],
    ['problem', '--c-night-2'],
    ['how', '--c-night-1'],
    ['spectrum', '--c-night-2'],
    ['technology', '--c-transition'],
    ['impact', '--c-dawn-1'],
    ['team', '--c-dawn-2'],
    ['contact', '--c-dawn-2'],
    ['footer', '--c-dawn-2'],
  ];
  const rootStyles = getComputedStyle(document.documentElement);
  const totalHeight = document.documentElement.scrollHeight;
  const scrollY = window.scrollY || window.pageYOffset;

  const stops = sectionColors.map(([id, varName]) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const midPct = ((top + el.offsetHeight / 2) / totalHeight) * 100;
    const color = rootStyles.getPropertyValue(varName).trim();
    return `${color} ${midPct.toFixed(2)}%`;
  }).filter(Boolean);

  if (stops.length) {
    document.body.style.background = `linear-gradient(to bottom, ${stops.join(', ')})`;
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

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (no backend wired up yet — placeholder confirmation only)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thanks — this form is not yet connected to an inbox. Please use the email above for now.';
  contactForm.reset();
});
