(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => [...root.querySelectorAll(q)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  const story = $('#spatialStory');
  if (story) {
    const descriptions = [
      ['DISCOVER','Signals are scattered','Assets, terrain, demand and risk are separate pieces of the puzzle.','Discover the pieces of a complex spatial problem.'],
      ['CONNECT','Context joins the dots','Link infrastructure and people to a common spatial frame of reference.','Connect distributed datasets and enterprise networks.'],
      ['REVEAL','Relationships become visible','Patterns emerge across proximity, connectivity and competing constraints.','Reveal how location and relationships change the interpretation.'],
      ['FOCUS','Find where to investigate','A priority zone becomes visible when spatial signals are considered together.','Focus attention on a meaningful area of interest.'],
      ['UNDERSTAND','Turn insight into a next step','Translate spatial evidence into a question worth validating with people.','Understand the context before proposing an action.']
    ];
    const stageButtons = $$('.stage-button',story);
    let stage = 4;
    story.classList.add('motion-paused');
    const setStage = (s) => {
      stage = Math.max(0,Math.min(s,4));
      story.dataset.stage=String(stage);
      $('#calloutKicker').textContent=`0${stage+1} · ${descriptions[stage][0]}`;
      $('#calloutHeading').textContent=descriptions[stage][1];
      $('#calloutText').textContent=descriptions[stage][2];
      $('#stageDescription').textContent=descriptions[stage][3];
      stageButtons.forEach((btn,i)=>{
        if(i===stage) btn.setAttribute('aria-current','step');
        else btn.removeAttribute('aria-current');
        btn.classList.toggle('completed',i<stage);
      });
    };
    stageButtons.forEach(btn=>btn.addEventListener('click',()=>setStage(Number(btn.dataset.step))));
    setStage(stage);
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
