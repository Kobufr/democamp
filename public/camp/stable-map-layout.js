import {separateMapPoints} from './camp-life.js';
// Resolve close neighbors once in world space, never during zoom, pan or filtering.
export function fixedMapAnchors(points,gap=2.8,pitch=1.13){const factor=Math.sin(pitch),ordered=points.map(p=>({...p})).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);return separateMapPoints(ordered.map(p=>({id:p.id,x:p.x,y:p.z*factor})),gap).map(p=>({id:p.id,x:p.x,z:p.y/factor}));}
export function detailLevel(distance,previous='world'){if(distance<100)return 'camps';if(distance>250)return 'world';if(previous==='camps')return distance>122?'prefectures':'camps';if(previous==='world')return distance<220?'prefectures':'world';return 'prefectures';}
// Cull overlapping names instead of displacing the campsite beneath them.
export function visibleNameSlots(points,width=110,height=42){const accepted=[],visible=new Set();const ordered=[...points].sort((a,b)=>(b.priority||0)-(a.priority||0)||(a.id<b.id?-1:a.id>b.id?1:0));for(const p of ordered){const overlaps=accepted.some(q=>Math.abs(p.x-q.x)<width+6&&Math.abs(p.y-q.y)<height+5);if(!overlaps||p.priority){accepted.push(p);visible.add(p.id);}}return visible;}
