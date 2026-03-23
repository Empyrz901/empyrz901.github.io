/* ═══════════════════════════════════════════════════════════════
   PHOTO GALLERY — Add your photos here
   ───────────────────────────────────────────────────────────────
   1. Drop your image file in the "photos/" folder next to this file
   2. Add a new line below following the same format:
      { src: "photos/your-photo.jpg", caption: "Title", sub: "Description" },
   ═══════════════════════════════════════════════════════════════ */
const photos = [
  // ── EXAMPLE ENTRIES — replace or add below ──
   { src: "photos/4.jpg", caption: "Céramique Pro",        sub: "Audi Q3 SportBack 2025 · Revêtement céramique" },
   { src: "photos/5.jpg", caption: "Céramique Pro",         sub: "Audi Q3 SportBack 2025 · Revêtement céramique" },
   { src: "photos/6.jpg", caption: "Céramique Pro",              sub: "Audi Q3 SportBack 2025 · Revêtement céramique" },
   { src: "photos/7.jpg", caption: "Céramique Pro",              sub: "Audi Q3 SportBack 2025 · Revêtement céramique" },
];

/* ─── Carousel ──────────────────────────────────────────────── */
(function () {
  const track   = document.querySelector('.carousel-track');
  const dotsWrap = document.querySelector('.carousel-dots');
  const counter  = document.querySelector('.carousel-counter');
  const prevBtn  = document.querySelector('.carousel-btn.prev');
  const nextBtn  = document.querySelector('.carousel-btn.next');
  const emptyMsg = document.getElementById('gallery-empty');
  const carouselEl = document.querySelector('.carousel');

  if (!track) return; // not on gallery page

  let current = 0;

  if (photos.length === 0) {
    // Show "no photos yet" state
    if (emptyMsg)   emptyMsg.style.display = 'block';
    if (carouselEl) carouselEl.style.display = 'none';
    if (prevBtn)    prevBtn.style.display = 'none';
    if (nextBtn)    nextBtn.style.display = 'none';
    if (counter)    counter.style.display = 'none';
    if (dotsWrap)   dotsWrap.style.display = 'none';
    return;
  }

  // Build slides
  photos.forEach((photo, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    // Blurred background layer (fills empty space for portrait photos)
    const bg = document.createElement('div');
    bg.className = 'slide-bg';
    bg.style.backgroundImage = `url('${photo.src}')`;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || '';
    img.loading = i === 0 ? 'eager' : 'lazy';

    // Fallback for missing images
    img.onerror = () => {
      img.style.display = 'none';
      bg.style.display = 'none';
      const ph = document.createElement('div');
      ph.className = 'slide-placeholder';
      ph.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span>${photo.caption || 'Photo à venir'}</span>`;
      slide.prepend(ph);
    };

    const caption = document.createElement('div');
    caption.className = 'slide-caption';
    caption.innerHTML = photo.caption
      ? `<strong>${photo.caption}</strong>${photo.sub ? `<span>${photo.sub}</span>` : ''}`
      : '';

    // Open lightbox on click
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(i));

    slide.appendChild(bg);
    slide.appendChild(img);
    slide.appendChild(caption);
    track.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(n) {
    const dots = dotsWrap.querySelectorAll('.dot');
    dots[current].classList.remove('active');
    current = (n + photos.length) % photos.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${photos.length}`;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  // Auto-play (pause on hover)
  let timer = setInterval(() => goTo(current + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });

  // Init counter
  if (counter) counter.textContent = `1 / ${photos.length}`;
  goTo(0);
})();

/* ─── Lightbox ──────────────────────────────────────────────── */
(function () {
  if (!photos.length) return;

  // Build overlay
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <button class="lightbox-close" aria-label="Fermer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <button class="lightbox-btn lightbox-prev" aria-label="Photo précédente">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <div class="lightbox-img-wrap">
      <img class="lightbox-img" src="" alt="" />
    </div>
    <button class="lightbox-btn lightbox-next" aria-label="Photo suivante">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
    <div class="lightbox-caption">
      <strong class="lightbox-title"></strong>
      <span class="lightbox-sub"></span>
    </div>
    <div class="lightbox-counter"></div>`;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lightbox-img');
  const lbTitle   = lb.querySelector('.lightbox-title');
  const lbSub     = lb.querySelector('.lightbox-sub');
  const lbCounter = lb.querySelector('.lightbox-counter');
  let lbIndex = 0;

  function lbGoTo(n) {
    lbIndex = (n + photos.length) % photos.length;
    const p = photos[lbIndex];
    lbImg.src = p.src;
    lbImg.alt = p.caption || '';
    lbTitle.textContent = p.caption || '';
    lbSub.textContent   = p.sub     || '';
    lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;
  }

  window.openLightbox = function (i) {
    lbGoTo(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-prev').addEventListener('click', () => lbGoTo(lbIndex - 1));
  lb.querySelector('.lightbox-next').addEventListener('click', () => lbGoTo(lbIndex + 1));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGoTo(lbIndex - 1);
    if (e.key === 'ArrowRight') lbGoTo(lbIndex + 1);
  });

  // Swipe on lightbox
  let lbStartX = 0;
  lbImg.addEventListener('touchstart', e => { lbStartX = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - lbStartX;
    if (Math.abs(dx) > 40) lbGoTo(lbIndex + (dx < 0 ? 1 : -1));
  });
})();

/* ─── Mobile nav burger ─────────────────────────────────────── */
(function () {
  const burger = document.querySelector('.nav-burger');
  const links  = document.querySelector('.nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.setAttribute('aria-expanded', links.classList.contains('open'));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ─── Contact form — client-side thank-you ──────────────────── */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

/* ─── Active nav link on scroll ─────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();
