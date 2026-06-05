document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

/* ---------- Scroll reveals ---------- */
const targets = document.querySelectorAll(
  '.hero-text, .hero-photo, .about-body, .section-head, .work-card, .member, .contact-card, .stat'
);
targets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = Math.min(i * 40, 240);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
targets.forEach(el => io.observe(el));

/* ---------- Marquee ---------- */
const track = document.querySelector('.marquee-track');
if (track) {
  track.innerHTML += track.innerHTML;
}

/* ---------- Custom cursor ---------- */
const isCoarse = window.matchMedia('(pointer: coarse)').matches;
if (!isCoarse) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const hoverables = 'a, button, .work-card, .member, .stat, .skills li, [role="button"]';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });
}

/* ---------- Magnetic spotlight on work cards ---------- */
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

/* ---------- Hero photo 3D tilt ---------- */
const frame = document.querySelector('.photo-frame');
if (frame && !isCoarse) {
  const wrap = frame.parentElement;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    frame.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
  });
  wrap.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
}

/* ---------- Header scroll state ---------- */
const header = document.querySelector('.site-header');
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.style.top = (y > lastY && y > 200) ? '-80px' : '16px';
  }
  lastY = y;
}, { passive: true });

/* ---------- Modal ---------- */
const modal = document.getElementById('projectModal');
const modalThumb = modal.querySelector('.modal-thumb');
const modalBody = modal.querySelector('.modal-body');

function openModal(card) {
  const thumb = card.querySelector('.work-thumb');
  const meta = card.querySelector('.work-meta');
  modalThumb.className = 'modal-thumb ' + (thumb ? thumb.className.replace('work-thumb', '').trim() : '');
  modalThumb.innerHTML = thumb ? thumb.innerHTML : '';
  modalBody.innerHTML = meta ? meta.innerHTML : '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.work-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

modal.querySelectorAll('[data-close]').forEach(el =>
  el.addEventListener('click', closeModal)
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
