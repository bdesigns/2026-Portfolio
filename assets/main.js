// Brad Earnhardt Portfolio — JS
(function () {
  'use strict';

  // ── Dark / Light mode toggle ──────────────────────────────────────────
  var STORAGE_KEY = 'brad-theme-mode';
  var html = document.documentElement;
  var emailAddressParts = ['uxbrad', 'bdesigns.net'];

  function buildEmailAddress() {
    return emailAddressParts[0] + '@' + emailAddressParts[1];
  }

  function attachEmailLinks() {
    document.querySelectorAll('.email-link').forEach(function (link) {
      var label = link.getAttribute('data-email-label') || 'Email me';
      if (link.textContent.trim() === '' || link.textContent.trim() === 'uxbrad@bdesigns.net') {
        link.textContent = label;
      }
      var href = 'mailto:' + buildEmailAddress() + '?subject=UX%20Design%20Opportunity';
      link.setAttribute('href', href);
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = href;
      });
    });
  }

  function attachGalleryLightbox() {
    var galleryImages = document.querySelectorAll('.gallery-section img');
    if (!galleryImages.length) return;

    var dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.setAttribute('aria-labelledby', 'image-lightbox-title');
    dialog.innerHTML = '' +
      '<div class="image-lightbox__frame">' +
      '<button class="image-lightbox__close" type="button" aria-label="Close image preview">&times;</button>' +
      '<p class="sr-only" id="image-lightbox-title">Expanded image preview</p>' +
      '<img class="image-lightbox__image" alt="">' +
      '<p class="image-lightbox__caption"></p>' +
      '</div>';
    document.body.appendChild(dialog);

    var preview = dialog.querySelector('.image-lightbox__image');
    var caption = dialog.querySelector('.image-lightbox__caption');
    var closeButton = dialog.querySelector('.image-lightbox__close');
    var lastTrigger = null;

    function closeLightbox() {
      if (dialog.open) dialog.close();
      document.body.classList.remove('lightbox-open');
      if (lastTrigger) lastTrigger.focus();
    }

    function openLightbox(image) {
      var figure = image.closest('figure');
      var figureCaption = figure ? figure.querySelector('figcaption') : null;
      lastTrigger = image;
      preview.src = image.currentSrc || image.src;
      preview.alt = image.alt;
      caption.textContent = figureCaption ? figureCaption.textContent.trim() : image.alt;
      dialog.showModal();
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    }

    galleryImages.forEach(function (image) {
      image.classList.add('gallery-image');
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', 'Expand image: ' + image.alt);
      image.addEventListener('click', function () { openLightbox(image); });
      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeLightbox();
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeLightbox();
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('lightbox-open');
    });
  }

  function getPreferred() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}
    // Fall back to initial class on <html> (set at export time)
    return html.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyMode(mode) {
    html.classList.toggle('dark', mode === 'dark');
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    // Show the action the toggle will take next.
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var sunIcon = btn.querySelector('.icon-sun');
      var moonIcon = btn.querySelector('.icon-moon');
      var nextMode = mode === 'light' ? 'dark' : 'light';
      if (sunIcon) sunIcon.style.display = nextMode === 'light' ? 'block' : 'none';
      if (moonIcon) moonIcon.style.display = nextMode === 'dark' ? 'block' : 'none';
      btn.setAttribute('aria-label', 'Switch to ' + nextMode + ' mode');
      btn.setAttribute('title', 'Switch to ' + nextMode + ' mode');
    }
  }

  // Apply on load
  applyMode(getPreferred());
  attachEmailLinks();
  attachGalleryLightbox();

  // Keep the mode control with the desktop header navigation.
  var headerActions = document.querySelector('header .flex.items-center.justify-between');
  var themeControl = document.getElementById('theme-toggle');
  if (headerActions && themeControl && !headerActions.contains(themeControl)) {
    themeControl.removeAttribute('style');
    headerActions.insertBefore(themeControl, headerActions.querySelector('button[aria-label="Toggle menu"]'));
  }

  // Toggle button
  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var current = html.classList.contains('dark') ? 'dark' : 'light';
      applyMode(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Header scroll effect ──────────────────────────────────────────────
  var header = document.querySelector('header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.remove('bg-transparent', 'py-5');
        header.classList.add('bg-bg-alt/95', 'backdrop-blur-sm', 'shadow-sm', 'py-3');
      } else {
        header.classList.remove('bg-bg-alt/95', 'backdrop-blur-sm', 'shadow-sm', 'py-3');
        header.classList.add('bg-transparent', 'py-5');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile menu toggle ────────────────────────────────────────────────
  var menuBtn = document.querySelector('button[aria-label="Toggle menu"]');
  var overlay = document.querySelector('.mobile-menu-overlay');
  var drawer  = document.querySelector('.mobile-menu-drawer');
  var closeBtn = drawer ? drawer.querySelector('button[aria-label="Close menu"]') : null;
  var hamburgerSpans = menuBtn ? menuBtn.querySelectorAll('span') : [];

  function openMenu() {
    if (overlay) overlay.classList.add('active');
    if (drawer) { drawer.classList.add('active'); drawer.inert = false; }
    document.body.style.overflow = 'hidden';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (hamburgerSpans.length === 3) {
      hamburgerSpans[0].classList.add('rotate-45', 'translate-y-2');
      hamburgerSpans[1].classList.add('opacity-0');
      hamburgerSpans[2].classList.add('-rotate-45', '-translate-y-2');
    }
  }

  function closeMenu() {
    if (overlay) overlay.classList.remove('active');
    if (drawer) { drawer.classList.remove('active'); drawer.inert = true; }
    document.body.style.overflow = ''; 
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (hamburgerSpans.length === 3) {
      hamburgerSpans[0].classList.remove('rotate-45', 'translate-y-2');
      hamburgerSpans[1].classList.remove('opacity-0');
      hamburgerSpans[2].classList.remove('-rotate-45', '-translate-y-2');
    }
  }

  if (drawer) drawer.inert = true;
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { closeMenu(); menuBtn.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 768) closeMenu(); });

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ── Smooth scroll for anchor links ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
