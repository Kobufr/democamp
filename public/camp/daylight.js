export const DAY_PHASES=['day','dusk','night','dawn'];
export function phaseLighting(phase,weather={}){return ({
 day:{sky:weather.sky??0xc3e0e8,ambient:weather.ambient??2.6,sun:weather.sun??4,color:0xfff0d4,disc:0xffdd91,sunY:11,nightness:0},
 dusk:{sky:0xd6a090,ambient:1.45,sun:1.15,color:0xffa26a,disc:0xffb779,sunY:2.5,nightness:0},
 night:{sky:0x354b65,ambient:.8,sun:.3,color:0xa7bbdb,disc:0xffdd91,sunY:-5,nightness:1},
 dawn:{sky:0xeec5a6,ambient:1.55,sun:1.7,color:0xffba7a,disc:0xffcb8a,sunY:1.2,nightness:0}
 })[phase]||phaseLighting('day',weather);}
export function transitionProgress(start,now,duration){const p=Math.max(0,Math.min(1,(now-start)/Math.max(.001,duration)));return p*p*(3-2*p);}
