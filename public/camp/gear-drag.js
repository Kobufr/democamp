export function canDragGear(hit){return !!hit;}
export function dragGearPosition(start,current,ground,offset={x:0,z:0},started=false){if(!ground||!started&&Math.hypot(current.x-start.x,current.y-start.y)<10)return null;return {x:ground.x+offset.x,z:ground.z+offset.z};}

// Only a stationary press outside the panel may dismiss it. Keep a gesture
// marked as moved even if the pointer returns to its original position.
export class CampPanelDismiss {
 constructor(){this.pointers=new Set();this.tap=null;}
 down(id,x,y,eligible){this.pointers.add(id);this.tap=this.pointers.size===1&&eligible?{id,x,y,moved:false}:null;}
 move(id,x,y){if(this.tap?.id===id&&Math.hypot(x-this.tap.x,y-this.tap.y)>4)this.tap.moved=true;}
 up(id,x,y,cancelled=false){this.move(id,x,y);const close=!cancelled&&this.tap?.id===id&&!this.tap.moved&&this.pointers.size===1;this.pointers.delete(id);this.tap=null;return !!close;}
}
