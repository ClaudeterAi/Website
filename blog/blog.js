/* Claudeter blog - shared behaviour. Nav, drawer, reveal, specular tracking
   and magnetic buttons are the homepage's own code; the filter is blog-only. */
(() => {
  const hdr = document.querySelector('header');
  addEventListener('scroll', () => hdr.classList.toggle('stuck', scrollY > 40), { passive: true });

  const burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth >= 920) setMenu(false); });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasVT = CSS.supports('animation-timeline: view()');

  if (!reduced && matchMedia('(pointer:fine)').matches) {
    const panels = document.querySelectorAll('.glass, .btn');
    addEventListener('pointermove', e => {
      for (const p of panels) {
        const r = p.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        p.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        p.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }
    }, { passive: true });

    document.querySelectorAll('.btn').forEach(b => {
      b.classList.add('mag');
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* cards: if view timelines exist, CSS owns the settle; otherwise the IO reveal above */
  if (hasVT && !reduced) {
    document.querySelectorAll('.pillar').forEach(el => { el.classList.remove('rv'); el.classList.add('in'); });
  }

  /* index filter */
  const filters = document.querySelectorAll('.filter');
  if (filters.length) {
    const cards = document.querySelectorAll('.card'), empty = document.getElementById('empty');
    filters.forEach(btn => btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
      let shown = 0;
      cards.forEach(c => { const on = cat === 'all' || c.dataset.cat === cat; c.hidden = !on; if (on) shown++; });
      if (empty) empty.hidden = shown > 0;
    }));
  }
})();
