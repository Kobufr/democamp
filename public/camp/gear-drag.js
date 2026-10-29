export function canDragGear(hit,selected){return !!hit&&hit===selected;}
export function dragGearPosition(start,current,ground,offset={x:0,z:0},started=false){if(!ground||!started&&Math.hypot(current.x-start.x,current.y-start.y)<10)return null;return {x:ground.x+offset.x,z:ground.z+offset.z};}
