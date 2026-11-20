import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
if(!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  try {await access('.cache/browsers');process.env.PLAYWRIGHT_BROWSERS_PATH=resolve('.cache/browsers');}catch{}
}
const out='docs/qa/generated';await mkdir(out,{recursive:true});
const {chromium,firefox,webkit}=await import('playwright');
const report={checks:[],screenshots:[],axe:[],runtime:[],metrics:[],browserMatrix:[]};
const check=(name,pass,detail='')=>{report.checks.push({name,pass,detail});if(!pass)console.error('FAIL',name,detail);};
const server=spawn(process.execPath,['scripts/serve.mjs','.','0'],{stdio:['ignore','pipe','pipe']});
const readiness=await new Promise((ok,fail)=>{server.stdout.once('data',ok);server.once('error',fail);server.once('exit',code=>{if(code)fail(Error(`Server exit ${code}`));});});
const base=readiness.toString().trim().replace('Local: ','');
let browser;
const settle=async page=>{
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}scrollTo(0,0);});
  await page.waitForTimeout(800);
};
try {
  browser=await chromium.launch({headless:true});
  for(const route of ['index.html']) {
    for(const width of [320,360,390,768,1024,1280,1440,1920]) {
      const context=await browser.newContext({viewport:{width,height:width<640?844:900},reducedMotion:'reduce'});
      const page=await context.newPage();
      page.on('pageerror',e=>report.runtime.push(e.message));
      page.on('console',m=>{if(m.type()==='error')report.runtime.push(m.text());});
      page.on('response',r=>{if(r.status()>=400)report.runtime.push(`${r.status()} ${r.url()}`);});
      await page.goto(`${base}/dist/${route}`);await settle(page);
      check(`${route} overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      check(`${route} images ${width}`,await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
      check(`${route} canonical ${width}`,await page.locator('link[rel="canonical"]').getAttribute('href')===`https://yurimartins.dev/${route==='index.html'?'':route}`);
      if([320,390,768,1440,1920].includes(width)) {
        const filename=`${route==='index.html'?'home':'labs'}-${width}.png`;
        await page.screenshot({path:`${out}/${filename}`,fullPage:true});report.screenshots.push(filename);
        check(`${route} hero positioning ${width}`,(await page.locator('h1').innerText()).replace(/\s+/g,' ').trim()==='Spatial Thinking. Business Value. GeoAI Solutions.');
        check(`${route} single hero CTA ${width}`,await page.locator('.hero-actions a').count()===1);

      }
      if([390,1440].includes(width)) {
        check(`${route} is indexable ${width}`,await page.locator('meta[name="robots"][content*="noindex"]').count()===0);
        await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
        const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return {violations:r.violations,incomplete:r.incomplete};});
        report.axe.push({route,width,...result});check(`${route} axe ${width}`,result.violations.length===0,result.violations.map(x=>x.id).join(','));
      }
      if(width===390) {
        await page.locator('#menuButton').click();check(`${route} menu open`,await page.locator('#menuButton').getAttribute('aria-expanded')==='true');
        await page.keyboard.press('Escape');check(`${route} menu Escape`,await page.locator('#menuButton').getAttribute('aria-expanded')==='false'&&await page.locator('#menuButton').evaluate(e=>e===document.activeElement));
        await page.keyboard.press('Control+Home');await page.keyboard.press('Tab');
      }
      if(width===1440) {
        const links=await page.locator('a').evaluateAll(as=>as.map(a=>({href:a.getAttribute('href'),target:a.target,rel:a.rel})));
        for(const link of links) {
          if(link.target==='_blank')check(`${route} external security ${link.href}`,link.rel.includes('noopener')&&link.rel.includes('noreferrer'));
          if(!link.href.startsWith('http')) {
            const url=new URL(link.href,page.url());const response=await page.request.get(url.href.split('#')[0]);check(`${route} internal ${link.href}`,response.ok());
            if(url.hash){const target=await context.newPage();await target.goto(url.href);check(`${route} anchor ${link.href}`,await target.locator(`[id="${url.hash.slice(1)}"]`).count()===1);await target.close();}
          }
        }
        check(`${route} no email activation`,!links.some(x=>x.href.startsWith('mailto:')));
        report.metrics.push({route,...await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation')[0].toJSON(),resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration}))}))});
      }
      await context.close();
    }
  }
  const ctx = await browser.newContext({viewport:{width:1159,height:883}});
  const page = await ctx.newPage();
  page.on('pageerror', error => report.runtime.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.runtime.push(response.url()); });

  // Observe the painted geometry without adding test-only state to the homepage.
  await page.addInitScript(() => {
    window.orbitPaint = {centers:new Set(), anchors:[], particles:[], particleEdge:0};
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.id === 'orbit-canvas') {
        window.orbitPaint.centers.clear();
        window.orbitPaint.anchors.length = 0;
        window.orbitPaint.particles.length = 0;
        window.orbitPaint.particleEdge = 0;
      }
      return clear.apply(this, args);
    };
    const arc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (...args) {
      if (this.canvas.id === 'orbit-canvas' && args[2] < .07) {
        const {a, d, e, f} = this.getTransform();
        window.orbitPaint.centers.add(e + ',' + f);
        const [x, y] = args;
        window.orbitPaint.particleEdge = Math.max(window.orbitPaint.particleEdge, Math.hypot(x, y));
        if (this.globalAlpha >= .34 && args[2] > .006) window.orbitPaint.particles.push([a * x + e, d * y + f]);
      }
      return arc.apply(this, args);
    };
    const curve = CanvasRenderingContext2D.prototype.quadraticCurveTo;
    CanvasRenderingContext2D.prototype.quadraticCurveTo = function (cx, cy, x, y) {
      if (this.canvas.id === 'orbit-canvas') {
        const {a, d, e, f} = this.getTransform();
        window.orbitPaint.anchors.push([a * x + e, d * y + f]);
      }
      return curve.call(this, cx, cy, x, y);
    };
  });
  const start = new Date();
  await page.clock.install({time:start});
  await page.clock.pauseAt(new Date(+start + 1000));
  await page.goto(base + '/dist/');
  const orbitState = () => page.evaluate(() => {
    const {centers, anchors, particles, particleEdge} = window.orbitPaint;
    return {
      centers: [...centers].map(center => center.split(',').map(Number)),
      anchors,
      particles,
      particleEdge,
      opening: document.documentElement.classList.contains('orbit-opening')
    };
  });
  await page.clock.runFor(64);
  const first = await orbitState();
  check('opening begins with one centered sphere', first.opening && first.centers.length === 1 &&
    Math.abs(first.centers[0][0] - 1159 / 2) < 18);
  await page.clock.runFor(800);
  check('copy waits for orbital handoff', (await orbitState()).opening);
  await page.clock.runFor(300);
  const ready = await orbitState();
  check('one sphere settles to the right and reveals copy', !ready.opening && ready.centers.length === 1 &&
    ready.centers[0][0] > 795);
  const art = await page.locator('.spatial-orbit').boundingBox();
  const cursor = [Math.round(art.x + art.width / 2 - 31), Math.round(art.y + art.height / 2 - 32)];
  const tethersReach = (state, point, max) => state.centers.length === 1 &&
    state.anchors.length > 0 && state.anchors.length <= max &&
    state.anchors.every(([x, y]) => Math.hypot(x - point[0], y - point[1]) < 2);
  const nearbyParticles = (state, point, inner, outer) => state.particles.filter(([x, y]) => {
    const distance = Math.hypot(x - point[0], y - point[1]);
    return distance > inner && distance < outer;
  });
  await page.mouse.move(...cursor);
  await page.clock.runFor(540);
  const active = await orbitState();
  check('nearby particles connect directly to the pointer within one sphere', tethersReach(active, cursor, 5));
  const globeRadius = art.height * .35;
  const restCore = nearbyParticles(ready, cursor, 1, globeRadius * .145);
  const activeCore = nearbyParticles(active, cursor, 1, globeRadius * .145);
  check('particles clear a shallow opening around the cursor through the center',
    restCore.length > 1 && activeCore.length < restCore.length && active.particleEdge < 1.12);
  await page.screenshot({path:out + '/orbit-pointer.png'});
  report.screenshots.push('orbit-pointer.png');
  const [sphereX, sphereY] = active.centers[0];
  const rimCursor = [Math.round(sphereX + art.height * .34), Math.round(sphereY - art.height * .07)];
  await page.mouse.move(...rimCursor);
  await page.clock.runFor(230);
  const extended = await orbitState();
  check('the particle surface stretches beyond the resting silhouette at the rim', extended.particleEdge > 1.14);
  await page.screenshot({path:out + '/orbit-rim-stretch.png'});
  report.screenshots.push('orbit-rim-stretch.png');
  await page.clock.runFor(270);
  const held = await orbitState();
  const lipAt = state => JSON.stringify(nearbyParticles(state, rimCursor, globeRadius * .16, globeRadius * .42));
  check('the rim stays open and particles keep circulating under a still cursor',
    held.particleEdge > 1.14 && lipAt(held) !== lipAt(extended));
  await page.mouse.move(6, 6);
  await page.clock.runFor(64);
  check('connections persist briefly when the pointer leaves', (await orbitState()).anchors.length > 0);
  await page.screenshot({path:out + '/orbit-pointer-release.png'});
  report.screenshots.push('orbit-pointer-release.png');
  await page.clock.runFor(610);
  const settled = await orbitState();
  check('nearby connections fade when the pointer leaves', settled.anchors.length === 0);
  check('the stretched particles settle into the original silhouette', settled.particleEdge < 1.06);
  const about = await page.locator('#about').evaluate(element => element.getBoundingClientRect().top + scrollY);
  await page.evaluate(top => scrollTo({top, behavior:'instant'}), about);
  await page.clock.runFor(1000);
  const linksArrived = await page.evaluate(() => {
    const canvas = document.querySelector('#orbit-canvas');
    const canvasContext = canvas.getContext('2d');
    const ratio = canvas.width / document.documentElement.clientWidth;
    return [...document.querySelectorAll('.orbit-hub .expertise-item')].map(card => {
      const rect = card.getBoundingClientRect();
      const x = Math.round((rect.left + parseFloat(getComputedStyle(card).paddingLeft) + 15) * ratio);
      const y = Math.round((rect.top + 3) * ratio);
      return canvasContext.getImageData(x - 2, y - 2, 4, 4).data.some((value, index) => index % 4 === 3 && value > 110);
    });
  });
  check('orbital paths reach all four areas of expertise', linksArrived.length === 4 && linksArrived.every(Boolean));
  const compactCenter = (await orbitState()).centers[0];
  check('a single compact sphere is available in About', (await orbitState()).centers.length === 1);
  if (compactCenter) {
    const compactCursor = compactCenter.map(Math.round);
    await page.mouse.move(...compactCursor);
    await page.clock.runFor(320);
    check('the compact sphere connects nearby particles to the pointer', tethersReach(await orbitState(), compactCursor, 3));
    await page.screenshot({path:out + '/orbit-about-pointer.png'});
    report.screenshots.push('orbit-about-pointer.png');
  }
  const reducedPage = await browser.newPage({viewport:{width:1159,height:883},reducedMotion:'reduce'});
  await reducedPage.goto(base + '/dist/');
  await reducedPage.waitForFunction(() => document.querySelector('#orbit-still').width > 500);
  check('reduced motion uses document-anchored artwork', await reducedPage.locator('#orbit-still').evaluate(canvas =>
    getComputedStyle(canvas).position === 'absolute' && canvas.width > 500
    && getComputedStyle(document.querySelector('#orbit-canvas')).display === 'none'
  ));
  await reducedPage.close();
  check('Labs absent from Home',await page.locator('a[href="labs.html"],.lab-strip').count()===0);
  check('Labs not published',(await page.request.get(base + '/dist/labs.html')).status()===404);
  await ctx.close();
  for(const route of ['index.html']) {
    const keyboard=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await keyboard.newPage();await p.goto(`${base}/dist/${route}`);
    await p.keyboard.press('Tab');check(`${route} skip link first`,await p.locator('.skip').evaluate(e=>e===document.activeElement));
    await p.keyboard.press('Enter');check(`${route} skip link focuses main`,await p.locator('main').evaluate(e=>e===document.activeElement));
    await p.locator('#menuButton').focus();await p.keyboard.press('Enter');check(`${route} keyboard opens menu`,await p.locator('#menuButton').getAttribute('aria-expanded')==='true');
    await p.keyboard.press('Escape');
    // 1440px desktop at 200% has a 720 CSS px layout viewport.
    // This checks equivalent reflow, not native browser zoom UI.
    await p.setViewportSize({width:720,height:450});
    check(`${route} 200% equivalent desktop reflow`,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await p.screenshot({path:`${out}/${route}-zoom-200.png`,fullPage:true});
    await keyboard.close();
  }
  for(const route of ['index.html']) {
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(`${base}/dist/${route}`);
    check(`${route} no-JS content`,await p.locator('h1').isVisible()&&await p.locator('.contact-footer').isVisible());
    check(`${route} no-JS mobile navigation`,await p.locator('#siteNav').isVisible());await nojs.close();
  }
  for(const [name,engine] of Object.entries({firefox,webkit})) {
    try {const b=await engine.launch();const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});for(const route of ['index.html']){await p.goto(`${base}/dist/${route}`);check(`${name} ${route} smoke`,await p.locator('h1').isVisible()&&await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}await b.close();report.browserMatrix.push({name,status:'PASS'});}catch(e){report.browserMatrix.push({name,status:'NOT RUN',reason:e.message});}
  }
  check('no runtime/network errors',report.runtime.length===0,report.runtime.join('\n'));
} finally {
  if(browser)await browser.close();server.kill();
  await writeFile(`${out}/results.json`,JSON.stringify(report,null,2));
}
const failures=report.checks.filter(x=>!x.pass);console.log(`${report.checks.length} checks; ${failures.length} failures. Evidence: ${out}`);if(failures.length)process.exitCode=1;
