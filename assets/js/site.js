// ===== smooth in-page navigation (avoids hash-URL quirks in embedded previews) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navEl = document.getElementById('nav');
    const navHeight = navEl ? navEl.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight + 10);
    window.scrollTo({ top, behavior: 'smooth' });
    const mm = document.getElementById('mobileMenu');
    if (mm) mm.classList.remove('is-open');
  });
});

// ===== nav scroll state =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive:true });
}

// ===== mobile menu =====
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
  });
}

// ===== gallery filter =====
const chips = document.querySelectorAll('.filter-chip');
const items = document.querySelectorAll('.masonry-item');
if (chips.length && items.length) {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });
}

// ===== lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  });
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('is-open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('is-open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('is-open'); });
}

// ===== booking form -> whatsapp handoff =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(bookingForm);
    const services = data.getAll('services').join(', ') || 'Not specified';
    const lines = [
      'New booking request from the FUNTREND website:',
      `Name: ${data.get('name') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Event type: ${data.get('eventType') || ''}`,
      `Event date: ${data.get('date') || ''}`,
      `Guests: ${data.get('guests') || ''}`,
      `Location: ${data.get('location') || ''}`,
      `Services required: ${services}`,
      `Message: ${data.get('message') || ''}`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/2348132493245?text=${text}`, '_blank');
  });
}

// ===== footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== reveal on scroll =====
const revealTargets = document.querySelectorAll('.section, .service-card, .type-card, .why-card, .work-block, .testimonial-card, .price-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold:0.08 });
revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  io.observe(el);
});
