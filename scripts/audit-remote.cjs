// Read-only repository/Pages and public DNS audit. Credentials stay in memory.
const {execFileSync} = require('node:child_process');
const dns = require('node:dns').promises;
(async () => {
  let headers = {'User-Agent':'portfolio-preflight','Accept':'application/vnd.github+json'};
  try {
    const credential = execFileSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',stdio:['pipe','pipe','ignore']});
    const password = credential.split('\n').find(x=>x.startsWith('password='))?.slice(9);
    if(password) headers.Authorization = `Bearer ${password}`;
  } catch {}
  const response = await fetch('https://api.github.com/repos/ytmartins/ytmartins.github.io/pages',{headers});
  console.log('Pages HTTP',response.status);
  const data = await response.json();
  console.log(JSON.stringify(Object.fromEntries(['status','cname','build_type','source','https_enforced','html_url','message'].filter(k=>k in data).map(k=>[k,data[k]])),null,2));
  for(const name of ['yurimartins.dev','www.yurimartins.dev','_dmarc.yurimartins.dev']) {
    for(const type of (name==='yurimartins.dev'?['NS','A','AAAA','MX','TXT','CAA']:name.startsWith('_')?['TXT']:['CNAME','A'])) {
      try {console.log(name,type,JSON.stringify(await dns.resolve(name,type)));} catch(e){console.log(name,type,e.code);}
    }
  }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
