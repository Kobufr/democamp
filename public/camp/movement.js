// All walking uses world units per second, including scene transitions.
export const WALK_SPEED=6.5;
export const walkingSeconds=(start,end)=>Math.hypot(end.x-start.x,end.z-start.z)/WALK_SPEED;
export function walkingProgress(start,end,elapsed){const seconds=walkingSeconds(start,end);return seconds?Math.max(0,Math.min(1,elapsed/seconds)):1;}
export function walkingPoint(start,end,elapsed){const progress=walkingProgress(start,end,elapsed);return {x:start.x+(end.x-start.x)*progress,z:start.z+(end.z-start.z)*progress,progress};}
