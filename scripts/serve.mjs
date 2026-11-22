import {createServer} from 'node:http';
import {access, readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const root=resolve(process.argv[2] || 'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.pdf':'application/pdf','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    if(pathname==='/resume'){
      await access(resolve(root,'resume','index.html'));
      res.writeHead(301,{Location:'/resume/'+url.search});
      res.end();
      return;
    }
    const file=resolve(root,`.${pathname.endsWith('/')?pathname+'index.html':pathname}`);
    if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
});
const port=Number(process.argv[3] ?? 4173);
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:' + server.address().port));
