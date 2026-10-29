const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{const u=clamp(x);return u*u*(3-2*u);};
export const JOURNEY_ENTER_SECONDS=4;
// Pure timeline; frame-rate independent and safe after a suspended browser tab.
export function journeyPose(kind,elapsed,hasCar=false){
 if(kind==='enter')return {phase:'walk',progress:ease(elapsed/JOURNEY_ENTER_SECONDS),boarded:false,done:elapsed>=JOURNEY_ENTER_SECONDS};
 const pack=3,walk=hasCar?3:4,drive=3.8,end=pack+walk+(hasCar?drive:0);
 return {phase:elapsed<pack?'pack':elapsed<pack+walk?'walk':hasCar?'drive':'walk',progress:ease((elapsed-pack)/walk),boarded:hasCar&&elapsed>=pack+walk,driveProgress:ease((elapsed-pack-walk)/drive),done:elapsed>=end};
}
