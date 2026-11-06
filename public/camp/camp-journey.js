import {walkingSeconds} from './movement.js';
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{const u=clamp(x);return u*u*(3-2*u);};
export const JOURNEY_ENTER_SECONDS=2;
// Pure timeline; frame-rate independent and safe after a suspended browser tab.
export function journeyPose(kind,elapsed,hasCar=false,timing={}){
 if(kind==='enter')return {phase:'walk',progress:clamp(elapsed/(timing.walk||JOURNEY_ENTER_SECONDS)),boarded:false,done:elapsed>=(timing.walk||JOURNEY_ENTER_SECONDS)};
 const pack=timing.pack??3,walk=timing.walk??(hasCar?3:4),drive=3.8,end=pack+walk+(hasCar?drive:0);
 return {phase:elapsed<pack?'pack':elapsed<pack+walk?'walk':hasCar?'drive':'walk',progress:clamp((elapsed-pack)/Math.max(.001,walk)),boarded:hasCar&&elapsed>=pack+walk,driveProgress:ease((elapsed-pack-walk)/drive),done:elapsed>=end};
}

export function entrancePositions(count){return Array.from({length:count},(_,i)=>({x:(i%3-1)*1.1,z:13.5-Math.floor(i/3)*.9}));}

export function journeyTiming(journey){const maximum=(starts,ends)=>Math.max(.001,...starts.map((start,i)=>walkingSeconds(start,ends[i])));return journey.kind==='enter'?{pack:0,walk:maximum(journey.starts,journey.ends)}:{pack:Math.max(3,maximum(journey.starts,journey.packSpots)+1.2),walk:maximum(journey.packSpots,journey.ends)};}
