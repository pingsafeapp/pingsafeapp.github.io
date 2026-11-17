/* PingSafe download page: phones, version line, and motion (GSAP + ScrollTrigger + Lenis). */
(function () {
  // ── Phones and blobs ───────────────────────────────────────────────
  document.querySelectorAll('[data-phone]').forEach((el) => {
    el.outerHTML = PS.phone(el.dataset.phone, { s: Number(el.dataset.s || 0.7), attrs: el.dataset.in ? `data-in="${el.dataset.in}"` : '' });
  });
  document.querySelectorAll('.sv[data-v]').forEach((el) => { el.innerHTML = PS.screen(el.dataset.v); });
  PS.hydrateBlobs();

  // ── Version and size of the newest release (GitHub's API allows this from the browser) ──
  fetch('https://api.github.com/repos/ramanujdodiya22/pingsafe-releases/releases/latest')
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel) return;
      const apk = (rel.assets || []).find((a) => a.name === 'PingSafe.apk');
      document.querySelectorAll('[data-version]').forEach((el) => { el.textContent = `Version ${rel.tag_name.replace(/^v/, '')}`; });
      if (apk) document.querySelectorAll('[data-size]').forEach((el) => { el.textContent = ` · ${Math.round(apk.size / 1048576)} MB`; });
    })
    .catch(() => {});

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Everything in place; the story becomes three readable lines under the phones.
    document.querySelectorAll('.beat').forEach((b) => { b.style.position = 'static'; b.style.opacity = 1; b.style.marginBottom = '12px'; });
    const beats = document.querySelector('.beats');
    if (beats) beats.style.height = 'auto';
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Smooth wheel scrolling, driven by GSAP's clock so scrubbed scenes stay even.
    const lenis = window.Lenis ? new Lenis({ lerp: 0.12 }) : null;
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
      }));
    }

    // Hero, once: the words first, then the phone arrives and the notes are stuck on.
    const hero = gsap.timeline({ defaults: { ease: 'expo.out' } });
    hero.fromTo('.hero [data-in="note"]', { y: -18, opacity: 0, rotation: -6 }, { y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)' })
      .fromTo('.hero [data-in="title"]', { y: 34, opacity: 0, letterSpacing: '0.01em' }, { y: 0, opacity: 1, letterSpacing: '-0.035em', duration: 0.9 }, '-=0.45')
      .fromTo('.hero [data-in="text"]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, '-=0.6')
      .fromTo('.hero-art .phone', { y: 70, opacity: 0, rotation: 6 }, { y: 0, opacity: 1, rotation: 0, duration: 1.1 }, 0.25)
      .fromTo('.hero-art [data-in="drop"]', { y: -50, opacity: 0, rotation: (i) => (i ? 10 : -10) }, { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.12 }, 0.8)
      .fromTo('.hero-art [data-in="pop"]', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'elastic.out(1,0.55)' }, 1.0);

    // Sections below the fold enter once, each like what it is.
    const enter = (sel, from, to) => ScrollTrigger.batch(sel, {
      start: 'top 86%', once: true,
      onEnter: (els) => gsap.fromTo(els, from, { ...to, overwrite: true }),
    });
    // Sticky notes: dropped on the desk, a small tilt, then settled.
    enter('main > section [data-in="drop"]', { y: -46, opacity: 0, rotation: (i) => (i % 2 ? 7 : -7) }, { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.07 });
    // Steps unfold in reading order.
    enter('[data-in="step"]', { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
    enter('[data-in="tile"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.05 });
    enter('main section [data-in="text"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    enter('main section [data-in="rise"]', { y: 80, opacity: 0, rotation: 4 }, { y: 0, opacity: 1, rotation: 0, duration: 1.0, ease: 'expo.out' });
    enter('.final [data-in="pop"]', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: 'elastic.out(1,0.5)' });

    // ── The story: one ping travels to Maa's phone and the answer comes back (scrubbed) ──
    const stage = document.querySelector('.stage');
    if (!stage) return;
    const A = document.getElementById('ph-a'), B = document.getElementById('ph-b');
    const sv = (ph, v) => ph.querySelector(`.sv[data-v="${v}"]`);
    const pulse = stage.querySelector('.pulse'), card = stage.querySelector('.answer-card');
    const beats = gsap.utils.toArray('.beat');
    // Points in the stage's own coordinates, measured again on every refresh (resize, font load).
    const pt = (el, fx = 0.5, fy = 0.5) => {
      const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * fy };
    };
    const ping = () => pt(sv(A, 'checkerHome').querySelector('[data-part="ping"]'));
    const bTop = () => pt(B, 0.5, 0.36);
    const aMid = () => pt(A, 0.5, 0.4);
    const arc = (p, q) => Math.min(p.y, q.y) - stage.offsetHeight * 0.18;
    const swap = (tl, from, to, at) => tl.to(from, { opacity: 0, duration: 0.35 }, at).fromTo(to, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, at);
    const beat = (tl, i, at) => tl.to(beats[i - 1], { opacity: 0, y: -10, duration: 0.3 }, at).fromTo(beats[i], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, at + 0.15);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: '.story', start: 'top top', end: () => `+=${innerHeight * (innerWidth < 720 ? 1.8 : 2.6)}`, pin: '.story-pin', scrub: 0.6, invalidateOnRefresh: true },
    });
    tl.set(pulse, { x: () => ping().x, y: () => ping().y, opacity: 0, scale: 0.6 })
      .set(card, { x: () => bTop().x, y: () => bTop().y, opacity: 0, scale: 0.6 })
      .to({}, { duration: 0.4 }) // hold: read beat 1
      .to(sv(A, 'checkerHome').querySelector('[data-part="ping"]'), { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.4)
      .to(pulse, { opacity: 1, scale: 1, duration: 0.2 }, 0.6)
      .to(pulse, { keyframes: { x: [() => ping().x, () => (ping().x + bTop().x) / 2, () => bTop().x], y: [() => ping().y, () => arc(ping(), bTop()), () => bTop().y] }, duration: 1.4, ease: 'power1.inOut' }, 0.6);
    swap(tl, sv(A, 'checkerHome'), sv(A, 'checkerWaiting'), 1.0);
    tl.to(pulse, { scale: 2.6, opacity: 0, duration: 0.45, ease: 'power2.out' }, 2.0);
    swap(tl, sv(B, 'sharerHome'), sv(B, 'sharerAnswer'), 2.0);
    beat(tl, 1, 2.05);
    tl.to({}, { duration: 0.5 }, 2.5) // hold: read beat 2
      .to(sv(B, 'sharerAnswer').querySelector('[data-part="answer"]'), { scale: 0.95, duration: 0.15, yoyo: true, repeat: 1 }, 2.9);
    swap(tl, sv(B, 'sharerAnswer'), sv(B, 'sharerSent'), 3.2);
    tl.to(card, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, 3.3)
      .to(card, { keyframes: { x: [() => bTop().x, () => (bTop().x + aMid().x) / 2, () => aMid().x], y: [() => bTop().y, () => arc(bTop(), aMid()), () => aMid().y] }, duration: 1.2, ease: 'power1.inOut' }, 3.4)
      .to(card, { scale: 0.5, opacity: 0, duration: 0.3 }, 4.55);
    swap(tl, sv(A, 'checkerWaiting'), sv(A, 'checkerResult'), 4.5);
    beat(tl, 2, 4.6);
    swap(tl, sv(B, 'sharerSent'), sv(B, 'sharerHome'), 5.2);
    tl.to({}, { duration: 0.6 }, 5.6); // hold: read beat 3

    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => lenis && lenis.destroy();
  });
})();
