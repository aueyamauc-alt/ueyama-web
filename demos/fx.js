/* デモ共通の動き。GSAP・ScrollTrigger・Lenis があれば使い、なければ何もしない（静的表示のまま） */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FX = window.FX = { on: false, lenis: null };
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  FX.on = true;
  document.documentElement.classList.add('fx');

  if (window.Lenis) {
    var lenis = FX.lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function(e){
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: -70, duration: 1.3 });
    });
  }

  /* 1文字ずつ分割（<br> や <em> などのタグは残す） */
  FX.split = function(el){
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          /* 英単語は途中で改行されないよう、単語ごとにまとめる */
          n.textContent.split(/(\s+)/).forEach(function(tok){
            if (!tok) return;
            if (/^\s+$/.test(tok)) { f.appendChild(document.createTextNode(tok)); return; }
            var box = f;
            if (/^[\x21-\x7e–—’]+$/.test(tok)) { box = document.createElement('span'); box.style.cssText = 'display:inline-block;white-space:nowrap'; f.appendChild(box); }
            tok.split('').forEach(function(c){
              var o = document.createElement('span'), i = document.createElement('span');
              o.className = 'ch'; i.textContent = c; o.appendChild(i); box.appendChild(o);
            });
          });
          n.replaceWith(f);
        } else if (n.nodeType === 1 && n.nodeName !== 'BR') walk(n);
      });
    })(el);
    return el.querySelectorAll('.ch>span');
  };

  FX.init = function(root){
    root = root || document;
    root.querySelectorAll('[data-split]').forEach(function(el){
      var chars = FX.split(el);
      gsap.from(chars, { yPercent: 110, opacity: 0, duration: 1, stagger: .035, ease: 'expo.out',
        scrollTrigger: el.hasAttribute('data-now') ? null : { trigger: el, start: 'top 85%' }, delay: +(el.dataset.delay || 0) });
    });
    root.querySelectorAll('[data-r]').forEach(function(el){
      var k = el.dataset.r, v = { opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } };
      if (k === 'l') v.x = -50; else if (k === 'r') v.x = 50; else if (k === 's') { v.scale = .92; } else if (k === 'img') { delete v.opacity; v.clipPath = 'inset(100% 0 0 0)'; v.duration = 1.4; v.ease = 'expo.out'; } else v.y = 40;
      gsap.from(el, v);
    });
    root.querySelectorAll('[data-stagger]').forEach(function(el){
      gsap.from(el.children, { opacity: 0, y: 36, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    root.querySelectorAll('[data-par]').forEach(function(el){
      gsap.to(el, { yPercent: +el.dataset.par, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    root.querySelectorAll('[data-count]').forEach(function(el){
      var o = { v: 0 }, to = +el.dataset.count;
      gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function(){ el.textContent = Math.round(o.v).toLocaleString(); } });
    });
  };

  /* ページ上部の進捗バー */
  var bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:0;top:0;height:2px;width:100%;transform-origin:left;transform:scaleX(0);z-index:999;background:var(--accent,#999)';
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
