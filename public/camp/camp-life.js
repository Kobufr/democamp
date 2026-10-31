export const IDLE_ACTIONS=['walk','wave','hop','stretch','look','sit'];
export function chooseIdle(random=Math.random,{energetic=false}={}){const pick=random(),walkChance=energetic?.7:.45,action=pick<walkChance?'walk':IDLE_ACTIONS[1+Math.min(4,Math.floor((pick-walkChance)/(1-walkChance)*5))];return {action,duration:action==='walk'?2.4+random()*2:1.3+random()*1.8,x:-5+random()*13,z:1+random()*9};}
// Resolve in screen space so the same gap works at every zoom level. The source anchors stay immutable.
export function separateMapPoints(points,gap=68){const out=points.map(p=>({...p,anchorX:p.x,anchorY:p.y}));for(let pass=0;pass<100;pass++){let overlap=false;for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){const a=out[i],b=out[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>=gap-.1)continue;overlap=true;if(d<.001){const angle=(i*2.4+j)*2.39996;dx=Math.cos(angle);dy=Math.sin(angle);d=1;}const shift=(gap-d)/2+.05;a.x-=dx/d*shift;a.y-=dy/d*shift;b.x+=dx/d*shift;b.y+=dy/d*shift;}if(!overlap)break;}return out;}

export function partyPositions(x,z,count){return Array.from({length:count},(_,i)=>{const angle=(i+1)*Math.PI*2/(count+1)+Math.PI/2;let px=x+Math.cos(angle)*2,pz=z+Math.sin(angle)*2;const length=Math.hypot(px,pz);if(length>13.7){px*=13.7/length;pz*=13.7/length;}return {x:px,z:pz};});}
export function showMapNames(distance,previous=false){return distance<=(previous?54:48);}

export function mapDetailPolicy(distance,count,previous=false){const sparse=count>0&&count<=6;return {sparse,names:sparse||showMapNames(distance,previous),models:sparse||distance<=65};}
