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
      ['DISCOVER','Start with the business question.','A living territory. Many signals. One intent.','Complex challenges start with people and context.'],
      ['CONNECT','Give the question a shared context.','Bring business intent, spatial evidence and systems together.','Connect what the organization already knows.'],
      ['REVEAL','Close does not always mean connected.','Access and infrastructure change the meaning of proximity.','Compare relationships, not just locations.'],
      ['FOCUS','Turn context into a working hypothesis.','The connected cluster deserves a closer investigation.','Explore growth using existing connections.'],
      ['INSIGHT','A stronger place to grow.','Compare estimated contribution. Validate the winning hypothesis.','Rank opportunities. Understand the trade-offs.'],
      ['DECISION','You decide the next move.','Approve the recommended project. Turn spatial intelligence into action.','Your decision activates the opportunity.']
    ];
    const durations = [3000,3500,4000,3500,16000,24000];
    const stageButtons = $$('.stage-button',story);
    const play = $('#storyPlay');
    let stage = reducedMotion.matches ? 5 : 0;
    let playing = !reducedMotion.matches;
    let onScreen = false;
    let timer = null;
    let remaining = durations[stage];
    let started = 0;
    let approvalRun=0;
    let cinematic=[];
    const decisionHolds=new Set();
    const setStage = (s, announce = false) => {
      stage = s;
      decisionHolds.clear();
      delete story.dataset.zoom;
      delete story.dataset.insight;
      approvalRun++;
      cinematic.forEach(a=>a.cancel());cinematic=[];
      delete story.dataset.approval;
      $('.approval-result',story).hidden=true;
      $('.story-visual',story).style.minHeight='';
      $('.opportunity-note text',story).textContent='A connected opportunity';
      story.dataset.stage=String(stage);
      $('#calloutKicker').textContent=`0${stage+1} · ${descriptions[stage][0]}`;
      $('#calloutHeading').textContent=descriptions[stage][1];
      $('#calloutText').textContent=descriptions[stage][2];

      stageButtons.forEach((btn,i)=>{
        if(i===stage) btn.setAttribute('aria-current','step');
        else btn.removeAttribute('aria-current');
        btn.classList.toggle('completed',i<stage);
      });
      if(announce) $('#storyAnnouncement').textContent=descriptions[stage].slice(0,3).join('. ');
    };
    const sync = () => {
      if(timer !== null) {
        clearTimeout(timer); timer = null;
        remaining = Math.max(0,remaining-(performance.now()-started));
      }
      cinematic.forEach(a=>{if(a.playState==='finished'||a.playState==='idle')return;if(onScreen&&!document.hidden)a.play();else a.pause();});
      const running = playing && !(stage===5&&decisionHolds.size) && onScreen && !document.hidden && !reducedMotion.matches;
      story.classList.toggle('motion-paused',!running);
      story.classList.toggle('effects-paused',!onScreen||document.hidden||reducedMotion.matches);
      if(play) play.textContent = playing ? 'Pause' : 'Play';
      play?.setAttribute('aria-label',playing ? 'Pause spatial story' : 'Play spatial story');
      if(play) play.disabled = reducedMotion.matches;
      if(running) {
        started = performance.now();
        timer = setTimeout(()=>{
          timer = null;
          if(stage===4 && !story.dataset.insight){
            story.dataset.insight="city";
            $("#calloutHeading").textContent="See the bigger opportunity.";
            $("#calloutText").textContent="One recommended project. A wider citywide growth potential.";
            remaining=9000; sync(); return;
          }
          setStage((stage+1)%descriptions.length);
          remaining = durations[stage];
          sync();
        },stage===4 && !story.dataset.insight ? Math.max(0,remaining-9000) : remaining);
      }
    };
    stageButtons.forEach(btn=>btn.addEventListener('click',()=>{
      playing = false; sync(); story.dataset.manual = 'true'; setStage(Number(btn.dataset.step),true); remaining = durations[stage];
    }));
    $('#askLocation').addEventListener('click',()=>{
      playing=false; sync(); story.dataset.manual='true'; setStage(4,true);
      story.dataset.explained='true'; story.dataset.zoom='in';
      $('#storyAnnouncement').textContent='Highest estimated contribution: demand within reach, existing access and lower connection cost. Synthetic scenario. Validate capacity, demand and constraints.';
    });
    $('#askPotential').addEventListener('click',()=>{
      playing=false;sync();story.dataset.manual='true';
      if(stage!==5){setStage(4,true);story.dataset.insight='city';}
      $('#storyAnnouncement').textContent=$('#potentialAnswer').textContent;
    });
    $('#explorePotential').addEventListener('click',()=>{
      playing=false;sync();story.dataset.manual='true';setStage(4);
      story.dataset.insight='city';
      $('#calloutHeading').textContent='See the bigger opportunity.';
      $('#calloutText').textContent='One recommended project. A wider citywide growth potential.';
      $('#storyAnnouncement').textContent=$('#potentialAnswer').textContent;
      $('#askPotential').focus({preventScroll:true});
    });
    const decision=$('.decision-card',story);
    decision.addEventListener('pointerenter',()=>{decisionHolds.add('pointer');sync();});
    decision.addEventListener('pointerleave',()=>{decisionHolds.delete('pointer');sync();});
    decision.addEventListener('focusin',()=>{decisionHolds.add('focus');sync();});
    decision.addEventListener('focusout',e=>{if(!decision.contains(e.relatedTarget)){decisionHolds.delete('focus');sync();}});
    $('#validateExpansion').addEventListener('click',async()=>{
      const visual=$('.story-visual',story), button=$('#validateExpansion');
      const origin=$('.launch-arrow',button).getBoundingClientRect();
      const height=visual.getBoundingClientRect().height;
      const priorCamera=getComputedStyle($('.territory-camera',story)).transform;
      playing=false;sync();story.dataset.manual='true';setStage(3);
      const run=approvalRun;
      story.dataset.approval='flying';
      visual.style.minHeight=height+'px';
      $('#storyAnnouncement').textContent='You approved the recommended project. Activating the connected opportunity in this demonstration.';
      const frame=visual.getBoundingClientRect();
      const destination=new DOMPoint(488.29,277.58).matrixTransform($('.territory-camera',story).getScreenCTM());
      const sx=origin.left-frame.left+origin.width/2,sy=origin.top-frame.top+origin.height/2;
      const ex=destination.x-frame.left,ey=destination.y-frame.top;
      const flyer=$('.approval-flight',story);
      try{
        if(!reducedMotion.matches){
          const frames=[
            {transform:'translate('+(sx-22)+'px,'+(sy-22)+'px) rotate(-45deg) scale(1.3)',opacity:1,offset:0},
            {transform:'translate('+(sx-22)+'px,'+(sy-18)+'px) rotate(-48deg) scale(.85, 1)',opacity:1,offset:.09}
          ];
          const p1={x:sx+(ex-sx)*.32,y:sy+(ey-sy)*.32-35},p2={x:sx+(ex-sx)*.75,y:sy+(ey-sy)*.75-25};
          let previousAngle=-48;
          for(let i=0;i<=40;i++){
            const t=i/40,u=1-t;
            const x=u*u*u*sx+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*ex;
            const y=u*u*u*sy+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*ey;
            const dx=3*u*u*(p1.x-sx)+6*u*t*(p2.x-p1.x)+3*t*t*(ex-p2.x);
            const dy=3*u*u*(p1.y-sy)+6*u*t*(p2.y-p1.y)+3*t*t*(ey-p2.y);
            let angle=Math.atan2(dy,dx)*180/Math.PI;
            while(angle-previousAngle>180)angle-=360;
            while(angle-previousAngle< -180)angle+=360;
            previousAngle=angle;
            const scale=.82+Math.sin(Math.PI*t)*1.05-t*.6;
            frames.push({transform:'translate('+(x-22)+'px,'+(y-22)+'px) rotate('+angle+'deg) scale('+scale+')',opacity:t>.95?(1-t)/.05:1,offset:.1+t*.9});
          }
          const flight=flyer.animate(frames,{duration:1250,easing:'linear',fill:'both'});
          const camera=$('.territory-camera',story);
          const cameraMove=camera.animate([{transform:priorCamera},{transform:getComputedStyle(camera).transform}],{duration:1200,easing:'cubic-bezier(.2,.65,.2,1)'});
          // Begin pigment at contact, before the arrow finishes disappearing.
          const splash=$('.splash-pigment',story).animate([
            {transform:'scale(.3)',opacity:.75},
            {transform:'scale(1.3)',opacity:1,offset:.22},
            {transform:'scale(1.8)',opacity:0}
          ],{duration:950,delay:1210,easing:'ease-out'});
          const material=$('.watercolor-painting',story).animate([{filter:'blur(0px)'},{filter:'blur(.55px)',offset:.3},{filter:'blur(0px)'}],{duration:1200,easing:'ease-in-out'});
          const trail=$('.rocket-trail',story).animate([{opacity:0},{opacity:0,offset:.1},{opacity:.8,offset:.25},{opacity:.55,offset:.8},{opacity:0}],{duration:1250,fill:'both'});
          const impactPulses=Array.from(story.querySelectorAll('.connection-flow path')).map(path=>path.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:950,delay:1210,easing:'linear'}));
          cinematic=[flight,cameraMove,splash,material,trail,...impactPulses];sync();await flight.finished;
          flight.cancel();

        }
        if(run!==approvalRun)return;
        story.dataset.approval='approved';
        $('.opportunity-note text',story).textContent='Project approved';
        $('.approval-result',story).hidden=false;
        $('#calloutKicker').textContent='YOUR DECISION · PROJECT ACTIVATED';
        $('#calloutHeading').textContent='From spatial insight to a human decision.';
        $('#calloutText').textContent='GIS + AI reveal the opportunity. You choose the next move.';
        if(!reducedMotion.matches) await cinematic[2].finished;
        if(run!==approvalRun)return;
        cinematic.forEach(a=>a.cancel());cinematic=[];visual.style.minHeight='';
        $('#storyAnnouncement').textContent='Project approved. Next: let’s talk about your business question. Talk with Yuri Martins on LinkedIn, or explore the opportunity again.';
        $('#repeatApproval').focus({preventScroll:true});
      }catch(error){if(error.name!=='AbortError')throw error;}
    });
    $('#repeatApproval').addEventListener('click',()=>{
      playing=false;sync();story.dataset.manual='true';setStage(5,true);
      $('#validateExpansion').focus({preventScroll:true});
    });
    play?.addEventListener('click',()=>{playing = !playing; if(playing) delete story.dataset.manual; sync();});
    $('#storyReplay')?.addEventListener('click',()=>{
      playing = false; sync();
      delete story.dataset.manual;
      setStage(reducedMotion.matches ? 5 : 0,true);
      story.querySelectorAll('.paint-dab').forEach(el=>el.getAnimations?.().forEach(animation=>{animation.currentTime=0;}));
      remaining = durations[stage]; playing = !reducedMotion.matches; sync();
    });
    document.addEventListener('visibilitychange',sync);
    reducedMotion.addEventListener('change',()=>{
      if(reducedMotion.matches) {playing = false; sync(); setStage(5); remaining = durations[5];}
      sync();
    });
    if('IntersectionObserver' in window) {
      new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;sync();},{threshold:.15}).observe(story);
    } else {onScreen = true;}
    setStage(stage); sync();
    requestAnimationFrame(()=>requestAnimationFrame(()=>story.classList.add('story-ready')));
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
