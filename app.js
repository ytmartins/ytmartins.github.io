(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => [...root.querySelectorAll(q)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const emailButton = $('.email-copy');
  if (emailButton) {
    const address = emailButton.dataset.email;
    const status = $('.email-copy-status', emailButton);
    let attempt = 0;
    let feedbackTimer;

    const reset = () => {
      attempt++;
      clearTimeout(feedbackTimer);
      delete emailButton.dataset.state;
      status.textContent = '';
    };

    emailButton.addEventListener('click', async () => {
      reset();
      const current = attempt;
      const started = performance.now();
      emailButton.dataset.state = 'copying';
      try {
        await navigator.clipboard.writeText(address);
      } catch {
        if (attempt !== current) return;
        reset();
        location.href = `mailto:${address}`;
        return;
      }
      if (attempt !== current) return;
      feedbackTimer = setTimeout(() => {
        emailButton.dataset.state = 'copied';
        status.textContent = 'Email address copied';
        feedbackTimer = setTimeout(reset, 1800);
      }, Math.max(0, 220 - (performance.now() - started)));
    });
    addEventListener('pagehide', reset);
  }
  const menuButton = $('#menuButton');
  const nav = $('#siteNav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    $$('a',nav).forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Open navigation');
    }));
    document.addEventListener('keydown', e=>{
      if(e.key==='Escape' && nav.classList.contains('open')){
        nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); menuButton.focus();
      }
    });
  }
  const year = $('#copyrightYear');
  if (year) year.textContent = String(new Date().getFullYear());
  const updateVisibility = () => document.body.classList.toggle('page-hidden', document.hidden);
  document.addEventListener('visibilitychange', updateVisibility);
  updateVisibility();

  // Progressive reveal only when motion is allowed. Without JS/reduced motion all content is visible.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, {threshold:.12});
    $$('.reveal').forEach(el=>observer.observe(el));
  }

  // Labs interactive synthetic layer explorer
  const map=$('#labsMap');
  if(map){
    const labels={assets:'Infrastructure lines and nodes',demand:'Potential demand signals',constraints:'Land-use or operating constraints'};
    const reading=$('#mapInterpretation');
    const buttons=$$('.map-toggle');
    const update=()=>{
      const active=buttons.filter(btn=>btn.getAttribute('aria-pressed')==='true').map(btn=>btn.dataset.layer);
      if(active.length===3) reading.textContent='Infrastructure, demand and constraints are visible together. Their intersection suggests where to investigate, not what to conclude.';
      else if(active.length===0) reading.textContent='No layers selected. Spatial context needs more than an empty basemap.';
      else reading.textContent=`Viewing ${active.map(x=>labels[x].toLowerCase()).join(', ')}. Add other perspectives to understand the whole decision context.`;
    };
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      const next=btn.getAttribute('aria-pressed')!=='true';
      btn.setAttribute('aria-pressed',String(next));
      map.dataset[btn.dataset.layer]=String(next);
      update();
    }));
  }
})();
