import {normalizeLayout} from './camp-layout.js';
const hash=text=>[...String(text)].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
// All templates stay on the dry, open side of every scenery preset.
const templates=[
 {tent:{x:-3,z:2,rotation:.15},fire:{x:3,z:1.5},meal:{x:-2,z:7},tarp:{x:4,z:6.5,rotation:.1},car:{x:8,z:9,rotation:-.35}},
 {tent:{x:-2,z:1.7,rotation:-.25},fire:{x:4,z:1.5},meal:{x:-2.5,z:7.5},tarp:{x:4,z:6.8,rotation:-.15},car:{x:8.3,z:9.5,rotation:-.2}},
 {tent:{x:-3.5,z:3,rotation:.35},fire:{x:3,z:1},meal:{x:-2.8,z:8.5},tarp:{x:4.5,z:6.5,rotation:.2},car:{x:8,z:10,rotation:-.45}},
 {tent:{x:-2.4,z:2.6,rotation:-.1},fire:{x:4,z:1.2},meal:{x:-2.5,z:8},tarp:{x:4,z:7,rotation:-.25},car:{x:8.5,z:9.5,rotation:-.3}}
];
export function visitLayout(campId,visitNumber){return normalizeLayout(templates[(hash(campId)+visitNumber)%templates.length]);}
export function normalizeActivityCounts(value={}){return Object.fromEntries(['car','tent','tarp','fire','meal','sleep','play','swim','fish','sing','walk','bath'].filter(k=>Number.isInteger(value?.[k])&&value[k]>0).map(k=>[k,Math.min(10000,value[k])]));}
const radii={tent:2.8,fire:1,meal:1.7,tarp:3,car:2};
export function safeTentCandidate(p,visit){return p.z>=1.7&&p.x>=-3.6&&Math.hypot(p.x,p.z)<6&&Object.keys(radii).every(k=>k==='tent'||!visit.actions?.[k]||Math.hypot(p.x-visit.layout[k].x,p.z-visit.layout[k].z)>=radii.tent+radii[k]+.2);}
export function nextActivityPlan(visit,id,{manual=null,land='forest'}={}){const count=visit.activityCounts?.[id]||0,variant=(hash(visit.id)+count)%4,layout=normalizeLayout(visit.layout);let placement=null;if(id==='tent'){for(let n=0;n<4;n++){const p=templates[(variant+n)%4].tent;if(Math.hypot(p.x-layout.tent.x,p.z-layout.tent.z)>.3&&safeTentCandidate(p,{...visit,layout})){placement={...p};break;}}}
 const candidates=[{x:9.5,z:1},{x:10,z:2.5},{x:9.8,z:4.5},{x:10.5,z:0}],radius=['swim','bath'].includes(id)?3.3:id==='walk'?2.8:1.8;
 const clearance=p=>Math.min(...Object.keys(radii).filter(k=>visit.actions?.[k]).map(k=>Math.hypot(p.x-layout[k].x,p.z-layout[k].z)-radii[k]-radius),100);
 const ordered=candidates.map((_,i)=>candidates[(variant+i)%4]);for(const z of [5,7,9,11])for(const x of [-4,-2,0,2,4,6,8,10])if(Math.hypot(x,z)+radius<14.5&&!(Math.abs(x)<3&&z>8))ordered.push({x,z});let location=ordered.filter(p=>!['highlake','lakefuji','cabins'].includes(land)||p.z-radius>1.1).filter(p=>!visit.actions?.tent||Math.hypot(p.x-layout.tent.x,p.z-layout.tent.z)>7).find(p=>clearance(p)>.6)||null;const useManual=!!manual&&!(id==='sleep'&&visit.actions?.tent);if(useManual){const r=radii[id]||radius;const dry=manual.z-r> (land==='sea'?-3.2:-12)&&(!['river','genshi'].includes(land)||manual.x-r> -8)&&(!['highlake','lakefuji','cabins'].includes(land)||manual.z-r>1.1);const gap=Object.keys(radii).filter(k=>k!==id&&visit.actions?.[k]).every(k=>Math.hypot(manual.x-layout[k].x,manual.z-layout[k].z)>r+radii[k]+.3);if(Math.hypot(manual.x,manual.z)+r>14.5||!dry||!gap)return {blocked:true};location={x:manual.x,z:manual.z};if(radii[id])placement={...location,rotation:layout[id].rotation};}
 const poses={tent:['wave','stretch','look','wave'],tarp:['stretch','wave','look','stretch'],fire:['sit','look','stretch','sit'],meal:['sit','wave','look','sit'],sleep:['stretch','wave','look','stretch'],play:['hop','wave','stretch','hop'],swim:['swim','swim','swim','swim'],fish:['sit','look','stretch','sit'],sing:['wave','hop','stretch','wave'],walk:['walk','walk','walk','walk'],bath:['sit','stretch','look','sit']};
 return {variant,placement,location,manual:useManual,pose:poses[id]?.[variant]||'wave',speed:[1,1.2,.85,1.1][variant],duration:[1.5,1.9,1.7,2.1][variant]};}
export function normalizedOutdoorLocation(p){return Number.isFinite(p?.x)&&Number.isFinite(p?.z)&&Math.hypot(p.x,p.z)<=14?{x:p.x,z:p.z}:null;}
