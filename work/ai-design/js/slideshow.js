/* Framework-free navigation; the original 1200 × 675 composition scales as a unit. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const stage = document.getElementById('stage');
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  let current = 0;

  function indexFromHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
  }

  function showSlide(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    });
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${current + 1} / ${slides.length}`;
    // replaceState keeps navigation from filling browser history. File URLs work too.
    if (updateHash) {
      try { history.replaceState(null, '', `#slide-${current + 1}`); }
      catch { location.hash = `slide-${current + 1}`; }
    }
  }

  function fitSlides() {
    const padding = window.innerWidth <= 800 ? 20 : 48;
    const availableHeight = Math.max(160, window.innerHeight - 100);
    const scale = Math.min((window.innerWidth - padding) / 1200, availableHeight / 675, 1600 / 1200);
    stage.style.width = `${1200 * scale}px`;
    stage.style.height = `${675 * scale}px`;
    deck.style.transform = `scale(${scale})`;
  }

  previous.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    const actions = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (event.key in actions) {
      event.preventDefault();
      showSlide(actions[event.key]);
    }
  });
  // A deliberate horizontal swipe supports tablet viewing without blocking taps.
  let touchStart = null;
  stage.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    else touchStart = null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  window.addEventListener('hashchange', () => showSlide(indexFromHash(), false));
  window.addEventListener('resize', fitSlides);
  showSlide(indexFromHash(), false);
  fitSlides();
})();
