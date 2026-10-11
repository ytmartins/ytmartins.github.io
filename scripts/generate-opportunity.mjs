import * as h3 from 'h3-js';
import {readFile,writeFile} from 'node:fs/promises';
// Arbitrary registration for a fictional watercolor town, not real parcel data.
const geo=([x,y])=>[-23.55+(300-y)*.00004,-46.63+(x-450)*.000044];
const xy=([lat,lng])=>[450+(lng+46.63)/.000044,300-(lat+23.55)/.00004];
const polygon=[[449,209],[500,216],[540,284],[509,329],[451,317],[416,282]];
const cells=h3.polygonToCells(polygon.map(geo),10).map(id=>{
 const [x,y]=xy(h3.cellToLatLng(id));
 const demand=Math.max(0,1-Math.hypot(x-490,y-280)/150);
 const access=Math.hypot(x-477,y-235);
 const revenue=Math.round(180+80*demand), operating=130, connection=Math.round(10+access*.35);
 return {id,x,y,revenue,operating,connection,margin:revenue-operating-connection,points:h3.cellToBoundary(id).map(p=>xy(p).map(n=>n.toFixed(2)).join(',')).join(' ')};
}).sort((a,b)=>b.margin-a.margin||a.id.localeCompare(b.id));
const best=cells[0];
// Individually placed illustrative premises follow rooftops in the original artwork.
const roofs=[[222.66,111.33],[246.09,125.98],[278.32,87.89],[304.69,73.24],[332.23,90.82],[361.52,97.27],[393.75,80.27],[424.22,82.03],[445.31,75.59],[478.13,75],[495.7,89.65],[471.68,106.05],[495.7,117.19],[516.21,133.59],[533.2,125.98],[488.09,151.17],[525,186.33],[527.34,210.94],[540.82,322.27],[512.11,336.33],[493.36,358.01],[462.89,376.17],[439.45,395.51],[457.03,414.84],[484.57,426.56],[498.05,400.2],[525.59,436.52],[550.2,436.52],[480.47,463.48],[454.1,448.83],[433.01,436.52],[398.44,377.34],[380.27,359.18],[393.16,338.09],[407.23,371.48],[377.93,418.95],[358.59,389.06],[343.36,386.72],[333.98,428.91],[316.41,413.09],[274.22,307.62],[296.48,269.53],[323.44,250.78],[333.4,284.77],[356.84,281.25],[361.52,257.81],[391.99,204.49],[389.65,233.2],[364.45,227.34],[334.57,199.8],[297.66,219.73],[277.73,226.17],[247.27,212.7],[250.78,238.48],[222.07,245.51],[198.05,233.79],[191.6,203.91],[192.19,174.61],[224.41,157.62],[251.37,170.51],[280.08,184.57],[247.85,189.84],[208.01,178.71],[171.68,151.76],[184.57,134.18],[281.25,147.66],[304.69,130.66],[343.95,111.91],[375,117.19],[407.23,127.73],[430.66,145.9],[477.54,231.45],[447.66,263.09],[429.49,299.41],[510.35,287.11],[489.26,284.18]];
const land=[[80,320],[130,180],[270,70],[430,55],[530,135],[550,250],[554,370],[605,505],[475,555],[300,510],[110,480]];
const farLand=[[715,175],[787,174],[825,230],[856,315],[790,327],[709,266]];
const registration=polygon=>h3.polygonToCells(polygon.map(geo),10);
const contains=(point,ring)=>{
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>point[1])!==(yj>point[1])&&point[0]<(xj-xi)*(point[1]-yi)/(yj-yi)+xi)inside=!inside;
 }
 return inside;
};
const inventory=roofs.map(([x,y],i)=>{
 const id=h3.latLngToCell(...geo([x,y]),10);
 const served=Math.hypot(x-196,y-363)<105||Math.hypot(x-330,y-176)<70;
 return {premiseId:'premise-'+(i+1),x,y,id,served};
});
const city=registration([[0,0],[900,0],[900,600],[0,600]]).map(id=>{
 const [x,y]=xy(h3.cellToLatLng(id));
 const demand=Math.max(0,1-Math.hypot(x-490,y-280)/150);
 const revenue=Math.round(180+80*demand),operating=130,connection=Math.round(10+Math.hypot(x-477,y-235)*.35);
 const premises=inventory.filter(p=>p.id===id);
 const served=Math.hypot(x-196,y-363)<105||Math.hypot(x-330,y-176)<70;
 const terrestrial=contains([x,y],land);
 const excluded=contains([x,y],farLand);
 const eligible=terrestrial&&!excluded&&revenue-operating-connection>0;
 const potentialPremises=eligible?premises.filter(p=>!p.served):[];
 return {id,x,y,revenue,operating,connection,margin:revenue-operating-connection,customers:potentialPremises.length,currentCustomers:premises.filter(p=>p.served).length,status:excluded?'excluded':potentialPremises.length?'potential':served?'established':terrestrial?'unqualified':'neutral',points:h3.cellToBoundary(id).map(p=>xy(p).map(n=>n.toFixed(2)).join(',')).join(' ')};
});
const opportunities=city.filter(c=>c.status==='potential');
// Synthetic annual contribution budgets: priority area is a subset of city total.
const priorityIds=new Set(cells.map(c=>c.id));
const priorityTotal=2700;
const allocate=(pool,target)=>{
 const weight=pool.reduce((s,c)=>s+c.margin,0);
 const original=pool.map(c=>c.margin);
 let assigned=0;
 pool.forEach((c,i)=>{c.margin=i===pool.length-1?target-assigned:Math.round(target*original[i]/weight);assigned+=c.margin;c.revenue=c.margin+c.operating+c.connection;});
};
allocate(opportunities.filter(c=>priorityIds.has(c.id)),priorityTotal);
allocate(opportunities.filter(c=>!priorityIds.has(c.id)),2800);
cells.forEach(c=>{const entry=city.find(p=>p.id===c.id);c.margin=entry.margin;c.revenue=entry.revenue;});
cells.sort((a,b)=>b.margin-a.margin||a.id.localeCompare(b.id));
const priorityCustomers=opportunities.filter(c=>priorityIds.has(c.id)).reduce((s,c)=>s+c.customers,0);
const total=opportunities.reduce((sum,c)=>sum+c.margin,0),customers=opportunities.reduce((sum,c)=>sum+c.customers,0);
const maxVolume=Math.max(...city.map(c=>c.customers),1);
const displayPremises=inventory.filter(p=>p.served||opportunities.some(c=>c.id===p.id)).map(p=>({...p,status:p.served?'current':'potential'}));
const citySvg=`<g class="city-potential" aria-label="Citywide synthetic customer volume"><g class="city-grid">${city.map(c=>`<polygon data-city-h3="${c.id}" data-volume="${c.customers}" class="city-cell ${c.status}" points="${c.points}" style="--volume:${c.customers/maxVolume};--cell-delay:${(Math.hypot(c.x-488,c.y-278)/350).toFixed(2)}s"><title>${c.customers} potential customers, ${c.currentCustomers} current customers</title></polygon>`).join('')}</g><g class="potential-roofs">${displayPremises.map((p,i)=>`<g class="customer-premise ${p.status==='potential'?'potential-roof':'current-roof'}" data-premise="${p.premiseId}" data-h3="${p.id}" transform="translate(${p.x} ${p.y})" style="--roof-delay:${(1.5+i*.025).toFixed(2)}s"><title>${p.status} customer</title><circle r="7"/><path d="m-5 0 5-4 5 4M-3-1v6h6v-6"/></g>`).join('')}</g><g class="retained-opportunity"><path d="M449 209 500 216 540 284 509 329 451 317 416 282Z"/><g transform="translate(${best.x.toFixed(2)} ${best.y.toFixed(2)})"><circle r="11"/><text text-anchor="middle" y="3.5">#1</text></g></g></g>`;
const svg=`<g class="h3-ranking" aria-label="Synthetic H3 profitability ranking">${cells.map((c,i)=>`<polygon class="h3-cell${i===0?' h3-best':''}" data-h3="${c.id}" points="${c.points}" style="--rank:${i};--potential:${(1-i/cells.length).toFixed(2)}"><title>Rank ${i+1}: ${c.id}. Illustrative annual contribution ${c.margin} thousand USD.</title></polygon>`).join('')}<g class="h3-winner" transform="translate(${best.x.toFixed(2)} ${best.y.toFixed(2)})"><circle r="19"/><text text-anchor="middle" y="5">#1</text></g></g>`;
let html=await readFile('index.html','utf8');
html=html.replace(/<!-- H3 START -->[\s\S]*?<!-- H3 END -->/,`<!-- H3 START -->${svg}<!-- H3 END -->`);
html=html.replace(/data-best-h3="[^"]*"/,`data-best-h3="${best.id}"`);
html=html.replace(/<!-- PROFIT -->.*?<!-- END PROFIT -->/,`<!-- PROFIT -->US$ ${(priorityTotal/1000).toFixed(1)}M / year<!-- END PROFIT -->`);
html=html.replace(/<!-- CITY START -->[\s\S]*?<!-- CITY END -->/,`<!-- CITY START -->${citySvg}<!-- CITY END -->`);
html=html.replace(/<!-- TOTAL -->[\s\S]*?<!-- END TOTAL -->/,`<!-- TOTAL -->US$ ${(total/1000).toFixed(1)}M / year<!-- END TOTAL -->`);
html=html.replace(/<!-- CUSTOMERS -->[\s\S]*?<!-- END CUSTOMERS -->/,`<!-- CUSTOMERS -->${customers} potential customers<!-- END CUSTOMERS -->`);
await writeFile('index.html',html);
await writeFile('docs/H3_SCENARIO.json',JSON.stringify({synthetic:true,resolution:10,units:'thousand USD / year',formula:'revenue - operating - annualized connection cost',registration:'Arbitrary affine registration to fictional artwork; no real-world location claim',priorityTotal,priorityCustomers,priorityIds:[...priorityIds],assumptions:'Illustrative business premises. Contribution budgets allocated by synthetic demand/access weights; not a forecast. Priority area is included in city total. H3 green intensity represents eligible customer volume, not contribution.',cells,city,total,customers,roofs,displayPremises,maxVolume,currencyBasis:"Synthetic assumptions denominated in USD; no FX conversion"},null,2));
console.log(`${cells.length} real H3 cells; best ${best.id}, contribution ${best.margin}k USD/year (synthetic).`);
