// One gesture stream for canvas, markers and clusters. A pinch never becomes a tap.
export class MapGesture {
 constructor(){this.reset();}
 reset(){this.points=new Map();this.start=null;this.last=null;this.moved=false;this.pinched=false;this.target=null;}
 down(id,x,y,target=null){if(!this.points.size){this.reset();this.start={x,y};this.last={x,y};this.target=target;}this.points.set(id,{x,y});if(this.points.size>1){this.pinched=true;this.moved=true;this.target=null;}}
 move(id,x,y){if(!this.points.has(id))return null;const previous=[...this.points.values()];this.points.set(id,{x,y});if(this.points.size>=2){const current=[...this.points.values()],a=previous[0],b=previous[1],c=current[0],d=current[1],oldSpan=Math.hypot(a.x-b.x,a.y-b.y),span=Math.hypot(c.x-d.x,c.y-d.y),anchor={x:(a.x+b.x)/2,y:(a.y+b.y)/2};return {type:'pinch',scale:span>0&&oldSpan>0?oldSpan/span:1,anchor,dx:(c.x+d.x)/2-anchor.x,dy:(c.y+d.y)/2-anchor.y};}const dx=x-this.last.x,dy=y-this.last.y;if(Math.hypot(x-this.start.x,y-this.start.y)>5)this.moved=true;this.last={x,y};return {type:'pan',dx,dy};}
 up(id,x,y,cancelled=false){if(!this.points.has(id))return null;this.points.delete(id);if(this.points.size){this.last={...[...this.points.values()][0]};this.start={...this.last};return null;}const tap=!cancelled&&!this.moved&&!this.pinched&&Math.hypot(x-this.start.x,y-this.start.y)<=5?{type:'tap',x,y,target:this.target}:null;this.reset();return tap;}
}
