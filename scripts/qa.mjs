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
const server=spawn(process.execPath,['scripts/serve.mjs','.'],{stdio:['ignore','pipe','pipe']});
await new Promise((ok,fail)=>{server.stdout.once('data',ok);server.once('error',fail);server.once('exit',code=>{if(code)fail(Error(`Server exit ${code}`));});});
const base='http://127.0.0.1:4173';
let browser;
const settle=async page=>{
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}scrollTo(0,0);});
  await page.waitForTimeout(800);
};
try {
  browser=await chromium.launch({headless:true});
  for(const route of ['index.html','labs.html']) {
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
        // Render untouched baseline through the same HTTP server/browser/viewport.
        const baseline=await context.newPage();await baseline.goto(`${base}/codex_handoff/reference_v6_1/${route}`);await settle(baseline);
        // Apply only the owner-requested removals to the immutable V6.1 comparison.
        if(route==='index.html') await baseline.evaluate(()=>{
          document.querySelectorAll('.hero-aside,.timeline-actions,.scenario-disclaimer,.contact-footer p,.footer-links').forEach(e=>e.remove());
          const footer=document.querySelector('.footer-inner');footer.replaceChildren(footer.querySelector('strong'));
        });
        await baseline.screenshot({path:`${out}/baseline-${filename}`,fullPage:true});
        // Exclude only the additive credential when comparing the rest to approved V6.1.
        let credential;
        if(route==='index.html') {
          credential=await page.locator('.learning-credential').evaluate(e=>{const html=e.outerHTML;e.remove();return html;});
        }
        const unchanged=await page.screenshot({fullPage:true});
        const text=async p=>p.locator('main').innerText();
        check(`${route} copy fidelity ${width}`,await text(page)===await text(baseline));
        check(`${route} same-browser pixel fidelity ${width}`,unchanged.equals(await readFile(`${out}/baseline-${filename}`)));
        if(credential) await page.locator('#contact .footer-inner').evaluate((e,html)=>e.insertAdjacentHTML('beforeend',html),credential);
        await baseline.close();
      }
      if([390,1440].includes(width)) {
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
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});const page=await ctx.newPage();
  await page.clock.install();await page.goto(`${base}/dist/`);
  check('initial Understand',await page.locator('#spatialStory').getAttribute('data-stage')==='4');
  check('story motion paused',await page.locator('#spatialStory').evaluate(e=>e.classList.contains('motion-paused')));
  await page.clock.runFor(15000);check('scene remains static',await page.locator('#spatialStory').getAttribute('data-stage')==='4');
  for(let stage=0;stage<5;stage++) {
    await page.locator(`[data-step="${stage}"]`).click();
    check(`manual stage ${stage}`,await page.locator(`[data-step="${stage}"]`).getAttribute('aria-current')==='step');
    await page.clock.runFor(8000);check(`stage ${stage} holds`,await page.locator('#spatialStory').getAttribute('data-stage')===String(stage));
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-step="0"]').click();await page.clock.runFor(8000);check('reduced motion manual selection holds',await page.locator('#spatialStory').getAttribute('data-stage')==='0');
  await page.goto(`${base}/dist/labs.html`);
  for(let mask=0;mask<8;mask++) {
    for(const [i,layer] of ['assets','demand','constraints'].entries()) {
      const button=page.locator(`[data-layer="${layer}"]`);const wanted=String(Boolean(mask&(1<<i)));
      if(await button.getAttribute('aria-pressed')!==wanted)await button.click();
      check(`Labs mask ${mask} ${layer}`,await page.locator('#labsMap').getAttribute(`data-${layer}`)===wanted);
    }
    check(`Labs mask ${mask} feedback`,(await page.locator('#mapInterpretation').innerText()).length>30);
  }
  await ctx.close();
  for(const route of ['index.html','labs.html']) {
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
  for(const route of ['index.html','labs.html']) {
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(`${base}/dist/${route}`);
    check(`${route} no-JS content`,await p.locator('h1').isVisible()&&await p.locator('.contact-footer').isVisible());
    check(`${route} no-JS mobile Labs navigation`,await p.locator('#siteNav').isVisible());await nojs.close();
  }
  for(const [name,engine] of Object.entries({firefox,webkit})) {
    try {const b=await engine.launch();const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});for(const route of ['index.html','labs.html']){await p.goto(`${base}/dist/${route}`);check(`${name} ${route} smoke`,await p.locator('h1').isVisible()&&await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}await b.close();report.browserMatrix.push({name,status:'PASS'});}catch(e){report.browserMatrix.push({name,status:'NOT RUN',reason:e.message});}
  }
  check('no runtime/network errors',report.runtime.length===0,report.runtime.join('\n'));
} finally {
  if(browser)await browser.close();server.kill();
  await writeFile(`${out}/results.json`,JSON.stringify(report,null,2));
}
const failures=report.checks.filter(x=>!x.pass);console.log(`${report.checks.length} checks; ${failures.length} failures. Evidence: ${out}`);if(failures.length)process.exitCode=1;
