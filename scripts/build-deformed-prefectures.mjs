// Offline partition of the displayed Natural Earth land, using N03 prefectures for ownership.
// Subdivision never changes the land outline. Shared edges cancel before runtime export.
import {writeFileSync} from 'node:fs';
import {Vector2,ShapeUtils} from '../public/camp/vendor/three.module.js';
import {japanIslands} from '../public/camp/japan-geometry.js';
import {prefectureBoundaries} from '../public/camp/prefecture-boundaries.js';
const points=[],ids=new Map(),id=p=>{const key=p.map(v=>v.toFixed(12)).join(',');if(!ids.has(key)){ids.set(key,points.length);points.push(p);}return ids.get(key);};
let triangles=[];
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
for(const [ring] of japanIslands){const vertices=ring.slice(0,-1).map(p=>new Vector2(...p));for(const face of ShapeUtils.triangulateShape(vertices,[])){const p=face.map(i=>[vertices[i].x,vertices[i].y]);if(cross(...p)<0)[p[1],p[2]]=[p[2],p[1]];triangles.push(p.map(id));}}
const edge=(a,b)=>a<b?a+':'+b:b+':'+a;
for(let pass=0;pass<20;pass++){const mids=new Map();for(const face of triangles)for(let i=0;i<3;i++){const a=face[i],b=face[(i+1)%3],pa=points[a],pb=points[b];if(Math.hypot(pa[0]-pb[0],pa[1]-pb[1])>.12){const key=edge(a,b);if(!mids.has(key))mids.set(key,id([(pa[0]+pb[0])/2,(pa[1]+pb[1])/2]));}}if(!mids.size)break;const next=[];for(const [a,b,c] of triangles){const ab=mids.get(edge(a,b)),bc=mids.get(edge(b,c)),ca=mids.get(edge(c,a)),mask=(ab!==undefined?1:0)|(bc!==undefined?2:0)|(ca!==undefined?4:0);next.push(...([[[a,b,c]],[[a,ab,c],[ab,b,c]],[[b,bc,a],[bc,c,a]],[[b,bc,ab],[a,ab,c],[ab,bc,c]],[[c,ca,b],[ca,a,b]],[[a,ab,ca],[ab,b,c],[ca,ab,c]],[[c,ca,bc],[a,b,ca],[b,bc,ca]],[[a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]]][mask]));}triangles=next;}
const inside=(p,ring)=>{let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
const pref=Object.entries(prefectureBoundaries).map(([name,rings])=>({name,rings:rings.map(r=>({r,b:[Math.min(...r.map(p=>p[0])),Math.min(...r.map(p=>p[1])),Math.max(...r.map(p=>p[0])),Math.max(...r.map(p=>p[1]))]}))}));
const owner=p=>{for(const {name,rings} of pref)if(rings.some(({r,b})=>p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3]&&inside(p,r)))return name;let distance=Infinity,name;for(const prefItem of pref)for(const {r} of prefItem.rings)for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1))),d=(p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2;if(d<distance){distance=d;name=prefItem.name;}}return name;};
const boundaries=new Map(pref.map(p=>[p.name,new Map()]));
for(const face of triangles){const center=[0,1].map(axis=>face.reduce((n,i)=>n+points[i][axis],0)/3),edges=boundaries.get(owner(center));for(let i=0;i<3;i++){const a=face[i],b=face[(i+1)%3],key=edge(a,b);if(edges.has(key))edges.delete(key);else edges.set(key,[a,b]);}}
const area=ring=>ring.reduce((n,p,i)=>{const q=ring[(i+1)%ring.length];return n+p[0]*q[1]-q[0]*p[1];},0)/2;
const simplify=ring=>ring.filter((p,i)=>Math.abs(cross(ring[(i+ring.length-1)%ring.length],p,ring[(i+1)%ring.length]))>1e-11);
const result={};
for(const [name,edgeMap] of boundaries){const outgoing=new Map();for(const [a,b] of edgeMap.values()){if(!outgoing.has(a))outgoing.set(a,new Set());outgoing.get(a).add(b);}const loops=[];for(const [start] of outgoing){while(outgoing.get(start)?.size){const ring=[],initial=start;let current=start,previous=null;do{ring.push(points[current]);const options=[...(outgoing.get(current)||[])];if(!options.length)throw Error('Open boundary '+name);const next=previous===null?options[0]:options.sort((a,b)=>{const p=points[previous],c=points[current],angle=i=>Math.atan2((c[0]-p[0])*(points[i][1]-c[1])-(c[1]-p[1])*(points[i][0]-c[0]),(c[0]-p[0])*(points[i][0]-c[0])+(c[1]-p[1])*(points[i][1]-c[1]));return angle(b)-angle(a);})[0];outgoing.get(current).delete(next);previous=current;current=next;if(ring.length>edgeMap.size+1)throw Error('Boundary cycle');}while(current!==initial);const clean=ring;if(clean.length>=3)loops.push(clean);}}
 const outer=loops.filter(r=>area(r)>0).map(r=>({outer:r,holes:[]}));for(const hole of loops.filter(r=>area(r)<0)){const parent=outer.filter(p=>inside(hole[0],p.outer)).sort((a,b)=>area(a.outer)-area(b.outer))[0];if(!parent)throw Error('Orphan hole '+name);parent.holes.push(hole);}result[name]=outer;
}
// Fair shared inland chains as one graph. Coastal vertices and three-way junctions
// stay fixed, so the existing stylized coast and a gap-free partition are retained.
const rings=Object.values(result).flatMap(ps=>ps.flatMap(p=>[p.outer,...p.holes])),graph=new Map(),uses=new Map();
for(const ring of rings)for(let i=0;i<ring.length;i++){const a=id(ring[i]),b=id(ring[(i+1)%ring.length]),key=edge(a,b);uses.set(key,(uses.get(key)||0)+1);if(!graph.has(a))graph.set(a,new Set());if(!graph.has(b))graph.set(b,new Set());graph.get(a).add(b);graph.get(b).add(a);}
const fixed=new Set();for(const [key,count] of uses)if(count===1)for(const i of key.split(':'))fixed.add(+i);
const original=points.map(p=>[...p]);let fair=points.map(p=>[...p]);
for(let pass=0;pass<30;pass++){const next=fair.map(p=>[...p]);for(const [i,neighbors] of graph){if(fixed.has(i)||neighbors.size!==2)continue;const ns=[...neighbors],p=[0,1].map(k=>fair[i][k]*.5+(fair[ns[0]][k]+fair[ns[1]][k])*.25),d=Math.hypot(p[0]-original[i][0],p[1]-original[i][1]),scale=Math.min(1,.09/(d||1));next[i]=p.map((v,k)=>original[i][k]+(v-original[i][k])*scale);}fair=next;}
for(const ring of rings)for(let i=0;i<ring.length;i++)ring[i]=fair[id(ring[i])];
for(const ps of Object.values(result))for(const p of ps){p.outer=simplify(p.outer);p.holes=p.holes.map(simplify);}
writeFileSync(new URL('../public/camp/deformed-prefectures.js',import.meta.url),'// Generated by scripts/build-deformed-prefectures.mjs.\n// Natural Earth display coast; N03-2019 determines approximate inland ownership.\nexport const deformedPrefectures='+JSON.stringify(result)+';\n');
console.log({triangles:triangles.length,tiles:Object.values(result).flat().length,vertices:Object.values(result).flat().reduce((n,p)=>n+p.outer.length+p.holes.flat().length,0)});
