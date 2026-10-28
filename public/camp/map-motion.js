export function createMapMotion(from,to,fromDistance,toDistance,start,duration=900){return {from:[...from],to:[...to],fromDistance,toDistance,start,duration};}
export function sampleMapMotion(motion,now){const progress=Math.max(0,Math.min(1,(now-motion.start)/motion.duration)),ease=progress*progress*(3-2*progress);return {position:motion.from.map((n,i)=>n+(motion.to[i]-n)*ease),distance:motion.fromDistance+(motion.toDistance-motion.fromDistance)*ease,done:progress===1};}
export function nearestMapCamp(points,x,y,radius=54){let best=null,distance=radius*radius;for(const p of points){const d=(p.x-x)**2+(p.y-y)**2;if(d<=distance){distance=d;best=p.index}}return best;}
export function allowsPerimeterTree(land,x,z){return land!=='sea'||z>=2.5;}
