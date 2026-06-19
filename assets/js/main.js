(function () {
  document.documentElement.classList.add('js-ready');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. TYPEWRITER ── */
  const termCmd = document.querySelector('.term-cmd');
  if (termCmd) {
    const full = termCmd.textContent.trim();
    termCmd.textContent = '';
    let idx = 0;
    const type = () => {
      if (idx < full.length) {
        termCmd.textContent += full[idx++];
        setTimeout(type, reduce ? 0 : 28 + Math.random() * 40);
      }
    };
    setTimeout(type, reduce ? 0 : 350);
  }

  /* ── 2. HERO GLITCH ── */
  const heroName = document.querySelector('.hero-name');
  if (heroName && !reduce) {
    const clone = (cls) => {
      const el = document.createElement('span');
      el.className = 'glitch-layer ' + cls;
      el.innerHTML = heroName.innerHTML;
      heroName.appendChild(el);
    };
    clone('glitch-r'); clone('glitch-b');

    const glitch = () => {
      heroName.classList.remove('do-glitch');
      void heroName.offsetWidth;
      heroName.classList.add('do-glitch');
      setTimeout(() => heroName.classList.remove('do-glitch'), 600);
    };
    setTimeout(glitch, 1400);
    const heroCard = document.querySelector('.card.hero');
    if (heroCard) {
      let tid;
      heroCard.addEventListener('mouseenter', () => { tid = setTimeout(glitch, 200); });
      heroCard.addEventListener('mouseleave', () => clearTimeout(tid));
    }
  }

  /* ── 3. BUTTON RIPPLE ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = document.createElement('span');
      r.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top  = (e.clientY - rect.top)  + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  /* ── 4. 3D CARD TILT ── */
  if (!reduce && window.innerWidth > 900) {
    document.querySelectorAll('.card').forEach(card => {
      const mag = card.classList.contains('hero') ? 4 : 7;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transition = 'border-color .3s,background .3s,transform .08s';
        card.style.transform  =
          `perspective(700px) rotateY(${x*mag*2}deg) rotateX(${-y*mag*2}deg) scale(1.008)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition =
          'border-color .3s,background .3s,transform .55s cubic-bezier(.34,1.56,.64,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 650);
      });
    });
  }

  /* ── 5. STAT COUNTER + GLOW ── */
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const dur = reduce ? 0 : 1200;
    const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      if (reduce) { el.textContent = target; el.classList.add('counted'); return; }
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.floor(ease(p) * target);
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = target; el.classList.add('counted'); }
      };
      requestAnimationFrame(tick);
    }, { threshold: .5 });
    obs.observe(el);
  });

  /* ── 6. SERVICE ITEMS STAGGER ── */
  const svcCard = document.querySelector('.card.svc');
  if (svcCard) {
    const items = svcCard.querySelectorAll('.svc-item');
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('svc-vis'), reduce ? 0 : i * 65);
      });
    }, { threshold: 0 });
    obs.observe(svcCard);
  }

  /* ── 7. FLOATING NAV — SECTION TRACKING ── */
  const fnItems = document.querySelectorAll('.fn-item');
  const sectionIds = ['s-hero','s-exp','s-svc','s-skills','s-certs','s-contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const setActive = id => {
    fnItems.forEach(item =>
      item.classList.toggle('fn-active', item.getAttribute('href') === '#' + id)
    );
  };

  if (sections.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }

  /* ── 8. SMOOTH SCROLL FOR NAV ── */
  document.querySelectorAll('.fn-item[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const el = document.getElementById(link.getAttribute('href').slice(1));
      if (el) el.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'center' });
    });
  });


  /* ui events */
  /* Triggers: (1) term dots r→y→g in sequence  (2) Konami code */
  (function () {
    const _ov  = document.getElementById('_v');
    const _vid = document.getElementById('_vv');
    const _esc = document.querySelector('._vesc');
    const _ldr = document.getElementById('_vload');
    if (!_ov || !_vid) return;

    let _ul = false;
    let _onPlaying = null;
    let _onError   = null;

    /* ── glitter particle system ──────────────────────────── */
    const _gc   = document.getElementById('_vglit');
    const _gCtx = _gc ? _gc.getContext('2d') : null;
    let   _gRaf = null;
    let   _gPts = [];
    let   _gW   = 0, _gH = 0;

    const _gCols = ['#f5d678','#c6a04b','#e8c05a','#ffeebb','#e0b84a','#d49d3a'];

    const _gMk = () => {
      if (!_gc) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      _gW = innerWidth; _gH = innerHeight;
      _gc.width  = Math.round(_gW * dpr);
      _gc.height = Math.round(_gH * dpr);
      _gCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset + scale; safe on resize
      _gPts = [];
      const W = _gW, H = _gH;
      for (let i = 0; i < 90; i++) {
        let x, y;
        const r = Math.random();
        if (r < 0.35) {
          x = Math.random() < .5 ? Math.random() * W * .28 : W - Math.random() * W * .28;
          y = Math.random() < .5 ? Math.random() * H * .28 : H - Math.random() * H * .28;
        } else if (r < 0.6) {
          if (Math.random() < .5) {
            x = Math.random() * W;
            y = Math.random() < .5 ? Math.random() * H * .1 : H - Math.random() * H * .1;
          } else {
            x = Math.random() < .5 ? Math.random() * W * .1 : W - Math.random() * W * .1;
            y = Math.random() * H;
          }
        } else {
          x = Math.random() * W; y = Math.random() * H;
        }
        _gPts.push({
          x, y,
          sz: 0.4 + Math.random() * 1.1,
          ph: Math.random() * Math.PI * 2,
          sp: .25 + Math.random() * .7,
          col: _gCols[Math.floor(Math.random() * _gCols.length)],
          mx: (Math.random() - .5) * .06,
          my: -(Math.random() * .04 + .005),
        });
      }
    };

    const _gFrame = (ts) => {
      if (!_gCtx) return;
      const W = _gW, H = _gH;
      _gCtx.clearRect(0, 0, W, H);
      const now = ts * .001;
      for (const p of _gPts) {
        const op = (1 + Math.sin(now * p.sp + p.ph)) / 2;
        p.x += p.mx; p.y += p.my;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (op < .03) continue;
        _gCtx.save();
        _gCtx.globalAlpha = op * .55;
        _gCtx.shadowColor = p.col;
        _gCtx.shadowBlur  = p.sz * 4;
        _gCtx.fillStyle   = p.col;
        _gCtx.beginPath();
        _gCtx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        _gCtx.fill();
        _gCtx.restore();
      }
      _gRaf = requestAnimationFrame(_gFrame);
    };

    const _gStart = () => {
      if (!_gCtx || reduce) return;
      _gMk();
      _gRaf = requestAnimationFrame(_gFrame);
    };
    const _gStop = () => {
      if (_gRaf) { cancelAnimationFrame(_gRaf); _gRaf = null; }
      if (_gCtx) _gCtx.clearRect(0, 0, _gW, _gH);
    };
    window.addEventListener('resize', () => { if (_gRaf) { _gStop(); _gStart(); } });
    /* ──────────────────────────────────────────────────────── */

    const _show = () => {
      if (_ul) return;
      _ul = true;
      _ov.setAttribute('aria-hidden', 'false');
      _ov.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (_ldr) { _ldr.textContent = 'loading'; _ldr.style.display = 'block'; }

      // Reveal only when video is genuinely rendering frames
      _onPlaying = () => {
        _onPlaying = null;
        if (_ldr) _ldr.style.display = 'none';
        _ov.classList.add('playing');
        _gStart();
      };
      _onError = () => {
        _onError = null;
        if (_ldr && _ul) { _ldr.textContent = 'video unavailable'; }
      };
      _vid.addEventListener('playing', _onPlaying, { once: true });
      _vid.addEventListener('error',   _onError,   { once: true });

      _vid.play().catch(() => {});
    };

    const _hide = () => {
      if (!_ul) return;
      // Remove any pending one-shot listeners to prevent stale callbacks
      if (_onPlaying) { _vid.removeEventListener('playing', _onPlaying); _onPlaying = null; }
      if (_onError)   { _vid.removeEventListener('error',   _onError);   _onError   = null; }
      _gStop();
      _ov.classList.remove('active', 'playing');
      _ov.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        _ul = false;
        _vid.pause();
        _vid.currentTime = 0;
        if (_ldr) _ldr.style.display = 'none';
      }, reduce ? 0 : 950);
    };

    /* dot sequence r→y→g */
    const dots = [
      document.querySelector('.term-dot.r'),
      document.querySelector('.term-dot.y'),
      document.querySelector('.term-dot.g'),
    ];
    let _sq = [], _st = null;

    dots.forEach((dot, idx) => {
      if (!dot) return;
      dot.addEventListener('click', () => {
        dot.classList.remove('_sl');
        void dot.offsetWidth;
        dot.classList.add('_sl');
        setTimeout(() => dot.classList.remove('_sl'), 380);

        clearTimeout(_st);
        _sq.push(idx);

        if (_sq.length === 3) {
          if (_sq[0] === 0 && _sq[1] === 1 && _sq[2] === 2) {
            _show();
          } else {
            const hdr = document.querySelector('.terminal-header');
            if (hdr) {
              hdr.style.transition = 'opacity 0.05s';
              hdr.style.opacity = '0.3';
              setTimeout(() => { hdr.style.opacity = ''; }, 120);
            }
          }
          _sq = [];
        } else {
          _st = setTimeout(() => { _sq = []; }, 2800);
        }
      });
    });

    /* Konami code */
    const _k = [38,38,40,40,37,39,37,39,66,65];
    let _ki = 0;
    document.addEventListener('keydown', e => {
      if (e.keyCode === _k[_ki]) {
        _ki++;
        if (_ki === _k.length) { _ki = 0; _show(); }
      } else {
        _ki = (e.keyCode === _k[0]) ? 1 : 0;
        if (e.key === 'Escape') _hide();
      }
    });

    _esc?.addEventListener('click', _hide);
    _ov.addEventListener('click', e => { if (e.target === _ov) _hide(); });
  })();

})();
