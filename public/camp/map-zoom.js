export const MAP_MIN_DISTANCE=10,MAP_MAX_DISTANCE=400;
export function clampMapDistance(distance){return Math.max(MAP_MIN_DISTANCE,Math.min(MAP_MAX_DISTANCE,distance));}
export function wheelMapDistance(distance,deltaY,deltaMode=0,viewportHeight=900){const pixels=deltaY*(deltaMode===1?16:deltaMode===2?viewportHeight:1);return clampMapDistance(distance*Math.exp(Math.max(-250,Math.min(250,pixels))*.0015));}
