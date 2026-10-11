import {mkdir, readdir, copyFile, writeFile, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const output = resolve('dist');
await mkdir(resolve(output,'assets'),{recursive:true});
// Labs source stays in the repository until real content is ready.
await rm(resolve(output,'labs.html'),{force:true});
const pages = ['index.html','styles.css','app.js'];
const assets = ['favicon.png','navigator-code-original.webp','portrait.webp','terrain.webp','infrastructure.webp','network.webp','map-ambient.webp','territory-watercolor-v1.webp'];
// Reject stale/unexpected output rather than accidentally publishing it.
for (const entry of await readdir(output)) {
  if (![...pages,'assets','.nojekyll'].includes(entry)) throw Error(`Unexpected dist entry: ${entry}`);
}
for (const entry of await readdir(resolve(output,'assets'))) {
  if (!assets.includes(entry)) throw Error(`Unexpected dist asset: ${entry}`);
}
for (const file of pages) await copyFile(file,resolve(output,file));
for (const file of assets) await copyFile(`assets/${file}`,resolve(output,'assets',file));
await writeFile(resolve(output,'.nojekyll'),'');
console.log('Static artifact: dist/ (Home only, eight approved assets; no reference material).');
