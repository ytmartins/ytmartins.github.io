import {spawn} from 'node:child_process';
import {mkdir,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import lighthouse from 'lighthouse';
if(!process.env.PLAYWRIGHT_BROWSERS_PATH){try{await access('.cache/browsers');process.env.PLAYWRIGHT_BROWSERS_PATH=resolve('.cache/browsers');}catch{}}
const {chromium}=await import('playwright');
const output='docs/qa/generated';await mkdir(output,{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','pipe']});
await new Promise((ok,fail)=>{server.stdout.once('data',ok);server.once('error',fail);server.once('exit',code=>{if(code)fail(Error(`Server exit ${code}`));});});
const chrome=await chromium.launch({args:['--remote-debugging-port=9222']});
try {
  const summary=[];
  for(const route of ['index.html','labs.html']) {
    const result=await lighthouse(`http://127.0.0.1:4173/${route}`,{port:9222,output:'html',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
    await writeFile(`${output}/lighthouse-${route}.html`,result.report);
    await writeFile(`${output}/lighthouse-${route}.json`,JSON.stringify(result.lhr,null,2));
    const audits=result.lhr.audits;
    summary.push({route,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','first-contentful-paint','speed-index'].map(k=>[k,audits[k]?.displayValue])),failed:Object.values(audits).filter(x=>x.score!==null&&x.score<1).map(x=>({id:x.id,title:x.title,displayValue:x.displayValue}))});
  }
  await writeFile(`${output}/performance-summary.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
}finally{await chrome.close();server.kill();}
