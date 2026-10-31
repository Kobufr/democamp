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
 const ordered=candidates.map((_,i)=>candidates[(variant+i)%4]);for(const z of [5,7,9,11])for(const x of [-4,-2,0,2,4,6,8,10])if(Math.hypot(x,z)+radius<14.5&&!(Math.abs(x)<3&&z>8))ordered.push({x,z});let location=ordered.filter(p=>!['highlake','lakefuji','cabins'].includes(land)||p.z-radius>1.1).filter(p=>!visit.actions?.tent||Math.hypot(p.x-layout.tent.x,p.z-layout.tent.z)>7).find(p=>clearance(p)>.6)||null;const useManual=!!manual&&!(id==='sleep'&&visit.actions?.tent);if(useManual){const r=radii[id]||radius;const dry=manual.z-r> (land==='sea'?-3.2:-12)&&(!['river','genshi'].includes(land)||manual.x-r> -8)&&(!['highlake','lakefuji','cabins'].includes(land)||manual.z-r>1.1);const gap=Object.keys(radii).filter(k=>k!==id&&visit.actions?.[k]).every(k=>Math.hypot(manual.x-layout[k].x,manual.z-layout[k].z)>r+radii[k]+.3);if((Object.hasOwn(radii,id)?Math.hypot(manual.x,manual.z)+r>14.5||!dry:Math.hypot(manual.x,manual.z)>17)||!gap)return {blocked:true};location={x:manual.x,z:manual.z};if(radii[id])placement={...location,rotation:layout[id].rotation};}
 const poses={tent:['wave','stretch','look','wave'],tarp:['stretch','wave','look','stretch'],fire:['sit','look','stretch','sit'],meal:['sit','wave','look','sit'],sleep:['stretch','wave','look','stretch'],play:['hop','wave','stretch','hop'],swim:['swim','swim','swim','swim'],fish:['sit','look','stretch','sit'],sing:['wave','hop','stretch','wave'],walk:['walk','walk','walk','walk'],bath:['sit','stretch','look','sit']};
 return {variant,placement,location,manual:useManual,pose:poses[id]?.[variant]||'wave',speed:[1,1.2,.85,1.1][variant],duration:[1.5,1.9,1.7,2.1][variant]};}
export function normalizedOutdoorLocation(p){return Number.isFinite(p?.x)&&Number.isFinite(p?.z)&&Math.hypot(p.x,p.z)<=17?{x:p.x,z:p.z}:null;}

// Retry invalid requested positions in a dry clearing, without interrupting the activity.
export function resolveActivityPlan(visit,id,options={}){
 let plan=nextActivityPlan(visit,id,options),relocated=!!plan.blocked;
 if(plan.blocked&&options.manual){const near=nearestActivitySpot(visit,id,options.manual,options.land);if(near){plan=nextActivityPlan(visit,id,{...options,manual:near});if(!plan.blocked)return {...plan,relocated:true,spaceScale:1};}}
 if(plan.blocked)plan=nextActivityPlan(visit,id,{land:options.land});
 const outdoor=['play','swim','fish','sing','walk','bath'].includes(id),needsSearch=outdoor&&!plan.location||relocated&&Object.hasOwn(radii,id);
 if(!needsSearch)return {...plan,relocated,spaceScale:1};
 const layout=normalizeLayout(visit.layout),r=radii[id]||(['swim','bath'].includes(id)?3.3:id==='walk'?2.8:1.8),land=options.land||'forest';
 const room=p=>{let free=14.4-Math.hypot(p.x,p.z);if(land==='sea')free=Math.min(free,p.z+3.2);if(['river','genshi'].includes(land))free=Math.min(free,p.x+8);if(['highlake','lakefuji','cabins'].includes(land))free=Math.min(free,p.z-1.2);for(const k of Object.keys(radii))if(k!==id&&visit.actions?.[k])free=Math.min(free,Math.hypot(p.x-layout[k].x,p.z-layout[k].z)-radii[k]-.4);return free;};
 const candidates=[];for(let z=1;z<=12;z+=.5)for(let x=-5;x<=11;x+=.5){if(Math.abs(x)<2.5&&z>9)continue;const p={x,z},free=room(p),far=!visit.actions?.tent||Math.hypot(x-layout.tent.x,z-layout.tent.z)>7;candidates.push({p,free,far});}
 const full=candidates.filter(c=>c.free>r).sort((a,b)=>Number(b.far)-Number(a.far)||b.free-a.free),best=full[0]||candidates.sort((a,b)=>b.free-a.free)[0];
 const location=best.p,spaceScale=outdoor?Math.min(1,Math.max(.35,best.free/r)):1;
 return {...plan,manual:false,location,relocated:true,spaceScale,placement:Object.hasOwn(radii,id)?{...location,rotation:layout[id].rotation}:plan.placement,placementKey:Object.hasOwn(radii,id)?id:null};
}

// Tent and tarp centers use the current origin. Small gear is placed safely in front.
export function activityStartPoint(id,{current,target,manual=null}={}){const p=current||manual||target;if(!p)return null;const offset={meal:2,fire:1.6,car:2.8}[id]||0;return {x:p.x,z:p.z-offset};}
export function nearestActivitySpot(visit,id,origin,land='forest'){for(let distance=.25;distance<=20;distance+=.25){const steps=Math.max(16,Math.ceil(distance*12));for(let i=0;i<steps;i++){const angle=i/steps*Math.PI*2,p={x:origin.x+Math.cos(angle)*distance,z:origin.z+Math.sin(angle)*distance};if(!nextActivityPlan(visit,id,{manual:p,land}).blocked)return p;}}return null;}

// The equipment center is the chosen origin; the builder stands beside its entrance.
export function constructionStand(placement,visit,key){const layout=normalizeLayout(visit.layout),rotation=placement.rotation||0;const choices=[0,.4,-.4,.8,-.8,1.2,-1.2,1.6,-1.6,Math.PI].map(delta=>({x:placement.x+Math.sin(rotation+delta)*3.1,z:placement.z+Math.cos(rotation+delta)*3.1}));return choices.find(p=>Math.hypot(p.x,p.z)<16.8&&Object.keys(radii).every(k=>k===key||!visit.actions?.[k]||Math.hypot(p.x-layout[k].x,p.z-layout[k].z)>radii[k]+.7))||choices[0];}
