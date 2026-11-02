// Character faces point along local +Z; water props point along local -Z.
export function activityFacing(activity,position,fallback=0){
 if(!activity||activity.id==='walk'||activity.id==='sleep')return fallback;
 if(activity.water)return Math.PI+(activity.water.rotation||0);
 const target={x:activity.x,z:activity.z};
 if(activity.id==='play')target.z-=1.3;
 const dx=target.x-position.x,dz=target.z-position.z;
 return Math.hypot(dx,dz)>.05?Math.atan2(dx,dz):Math.PI;
}
