import * as THREE from './vendor/three.module.js';
import {visitDateOf} from './camp-history.js';
import {allowsPerimeterTree} from './map-motion.js';
export function seasonForDate(date){const month=Number(String(date||'').slice(5,7));if(month<1||month>12||!Number.isFinite(month))return 'unknown';return month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter';}
const seasons={
 unknown:{name:"季節未記録",ground:0xb5c997,leaves:[0x89a76b,0x9ab77c,0x7e9c62],evergreen:0x779a65,drift:null},
 spring:{name:'春',ground:0xb1c987,leaves:[0x93bd75,0xf2bdc4,0xa5c884],evergreen:0x739563,drift:'petals',driftColor:0xf5c5d0},
 summer:{name:'夏',ground:0x82a567,leaves:[0x6d994f,0x7da75e,0x91b76b],evergreen:0x5c8156,drift:null},
 autumn:{name:'秋',ground:0xb9a278,leaves:[0xc77948,0xd6a252,0xb85e48],evergreen:0x6b8759,drift:'leaves',driftColor:0xc9884e},
 winter:{name:'冬',ground:0xb5b8a0,leaves:[0x9c9c83,0xaaa58d,0x879080],evergreen:0x859584,drift:null}
};
const weather={
 unknown:{name:'天気未記録',sky:0xe7eddb,clouds:2,sun:3.5,ambient:2.5},
 sunny:{name:'晴れ',sky:0xc3e0e8,clouds:1,sun:4,ambient:2.6},
 mixed:{name:'晴れ時々くもり',sky:0xcbdfe2,clouds:4,sun:3.1,ambient:2.4},
 cloudy:{name:'くもり',sky:0xbdc9ca,clouds:7,sun:1.2,ambient:2.2},
 rainy:{name:'雨',sky:0x8fabb6,clouds:8,sun:.6,ambient:1.8,precipitation:'rain',count:190},
 snowy:{name:'雪',sky:0xc5d5db,clouds:6,sun:1,ambient:2.1,precipitation:'snow',count:95}
};
export function environmentForVisit(visit,land='forest'){
 const season=seasonForDate(visitDateOf(visit)),s=seasons[season],w=weather[visit.weather]||weather.unknown;
 return {...s,...w,season,snowCover:visit.weather==='snowy',wet:visit.weather==='rainy',land,summary:`${s.name} ・ ${w.name}`};
}
// One small point buffer per effect, also understood by the software renderer.
export function particlePosition(kind,index,time){const seed=(index*0.61803398875)%1,span=kind==='rain'?17:14,speed=kind==='rain'?15:kind==='snow'?1.6:.75;return {x:((index*7.13)%30)-15+Math.sin(time*.6+index)*(kind==='rain'?.25:.9),y:span-((seed*span+time*speed)%span),z:((index*11.71)%28)-14};}
export class CampEnvironment{
 constructor(root,materialForColor){this.root=root;this.materialForColor=materialForColor;this.group=null;this.key='';this.particles=[];this.clouds=[];}
 clear(){if(this.group){this.root.remove(this.group);this.group.traverse(o=>{o.geometry?.dispose();if(o.material&&!o.userData.shared)o.material.dispose();});}this.group=null;this.particles=[];this.clouds=[];}
 apply(visit,land){const config=environmentForVisit(visit,land),key=[config.season,visit.weather,land].join('|');this.config=config;if(key===this.key)return config;this.key=key;this.clear();const g=this.group=new THREE.Group();g.name='camp-environment';this.root.add(g);
 this.root.traverse(o=>{if(o.userData.seasonFlower)o.visible=['spring','summer','unknown'].includes(config.season);if(o.userData.leafType!==undefined){const base=config.leaves[o.userData.leafShade%3];o.material=this.materialForColor(o.userData.leafType===0?config.evergreen:base);}if(o.userData.seasonGround){const color=new THREE.Color(o.userData.seasonGround).lerp(new THREE.Color(config.snowCover?0xe9eeea:config.ground),config.snowCover?.85:.65);if(config.wet)color.multiplyScalar(.82);o.material=this.materialForColor(color.getHex());}});
 const addMesh=(geometry,color,x,y,z)=>{const m=new THREE.Mesh(geometry,this.materialForColor(color));m.userData.shared=true;m.position.set(x,y,z);g.add(m);return m;};
 for(let i=0;i<config.clouds;i++){const cloud=new THREE.Group(),x=-18+i*36/Math.max(1,config.clouds-1),z=-8+(i%3)*3;cloud.position.set(x,9+(i%2)*.8,z);for(let j=0;j<3;j++){const m=new THREE.Mesh(new THREE.SphereGeometry(1.1+(j===1?.5:0),6,4),this.materialForColor(config.wet?0x9eadb0:0xf0f1e9));m.userData.shared=true;m.position.set((j-1)*1.25,j===1?.15:0,0);m.scale.set(1,.6,.7);cloud.add(m);}cloud.userData.baseX=x;g.add(cloud);this.clouds.push(cloud);}
 if(['sunny','mixed'].includes(visit.weather)){const sun=new THREE.Mesh(new THREE.SphereGeometry(.9,10,6),new THREE.MeshBasicMaterial({color:0xffdd91}));sun.position.set(-10,11,-7);g.add(sun);this.sunDisc=sun;}else this.sunDisc=null;
 if(config.precipitation)this.addParticles(config.precipitation,config.count,config.precipitation==='rain'?0xc8e5ef:0xffffff);
 if(config.drift)this.addParticles(config.drift,config.drift==='petals'?20:26,config.driftColor);
 for(let i=0;i<16;i++){const angle=i*2.39996,x=Math.cos(angle)*(11+i%4),z=Math.sin(angle)*(11+i%4);if(!allowsPerimeterTree(land,x,z))continue;if(config.snowCover){const m=addMesh(new THREE.CircleGeometry(.5+i%3*.2,7),0xeef2eb,x,.03,z);m.rotation.x=-Math.PI/2;m.userData.layer=-1;}else if(config.season==='autumn'){const m=addMesh(new THREE.CircleGeometry(.16,4),config.leaves[i%3],x,.03,z);m.rotation.x=-Math.PI/2;m.userData.layer=-1;}else if(config.season==='spring'){const m=addMesh(new THREE.SphereGeometry(.12,5,3),0xf1c6d0,x,.2,z);m.scale.y=.5;}}
 return config;}
 addParticles(kind,count,color){const geo=new THREE.BufferGeometry(),rain=kind==='rain';geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(count*(rain?6:3)),3));const p=rain?new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false})):new THREE.Points(geo,new THREE.PointsMaterial({color,size:.13,transparent:true,opacity:.9,depthWrite:false}));p.userData.weatherParticle=kind;p.frustumCulled=false;this.group.add(p);this.particles.push({p,kind,count});}
 update(time,night=false,reducedMotion=false){for(const c of this.clouds){c.position.x=c.userData.baseX+Math.sin(time*.06+c.userData.baseX)*.8;c.visible=!night;}if(this.sunDisc)this.sunDisc.visible=!night;for(const {p,kind,count} of this.particles){const pos=p.geometry.attributes.position;for(let i=0;i<count;i++){const v=particlePosition(kind,i,reducedMotion?0:time);if(kind==='rain'){pos.setXYZ(i*2,v.x,v.y,v.z);pos.setXYZ(i*2+1,v.x-.12,v.y-.8,v.z);}else pos.setXYZ(i,v.x,v.y,v.z);}pos.needsUpdate=true;}}
}
