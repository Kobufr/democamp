import * as THREE from './vendor/three.module.js';
const palette={sand:0xc8a477,olive:0x758565,navy:0x45566c,red:0xb85d47,cream:0xeee5d2,sky:0x80aab8};
function builder(g){const owned=g.userData.ownedMaterials||=new Map();const material=(color,metal=false)=>{const key=color+':'+metal;if(!owned.has(key))owned.set(key,new THREE.MeshStandardMaterial({color,roughness:metal?.35:.9,metalness:metal?.65:0,side:THREE.DoubleSide}));return owned.get(key);};
 const add=(geo,color,x=0,y=0,z=0,metal=false)=>{const o=new THREE.Mesh(geo,material(color,metal));o.position.set(x,y,z);g.add(o);return o;};
 const rod=(a,b,r,c,metal=false)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);const m=add(new THREE.CylinderGeometry(r,r,d.length(),8),c,...av.clone().add(bv).multiplyScalar(.5).toArray(),metal);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;};
 const fabric=(points,faces,color)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(faces.flatMap(f=>f.flatMap(i=>points[i])),3));geo.computeVertexNormals();return add(geo,color);};
 return {add,rod,fabric};}
export function detailShelter(g,type,design=''){
 if(g.userData.detailedGear)return g;g.userData.detailedGear=true;g.userData.productDesign=design;const {add,rod,fabric}=builder(g),dark=0x4f5b4e,edge=0x9a7854;
 const floor=add(new THREE.CylinderGeometry(1.13,1.13,.045,24),dark,0,.02,0);floor.scale.z=1.12;floor.name='tent-groundsheet';
 if(type==='dome'){
 const points=[[-.68,.04,1.02],[.68,.04,1.02],[-.42,.95,.84],[.42,.95,.84],[-.65,.04,1.75],[.65,.04,1.75],[0,.65,1.75]];
 fabric(points,[[0,2,4],[2,6,4],[2,3,6],[3,5,6],[3,1,5]],0xd99b69).name='tent-vestibule';
 rod([-.65,.04,1.75],[0,.65,1.75],.018,edge);rod([0,.65,1.75],[.65,.04,1.75],.018,edge);
 for(const x of [-.6,.6])rod([x,.06,1.65],[x*1.5,0,2.05],.012,0xe7dac3);
 fabric([[-.23,.49,1.045],[.23,.49,1.045],[0,.78,.88]],[[0,1,2]],dark).name='tent-vent';
 }else if(type==='pole'){const seam=add(new THREE.TorusGeometry(.23,.012,5,20),edge,0,.76,.76);seam.rotation.x=.2;}
 for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a),z=Math.sin(a)*1.1;rod([x,.3,z],[x*1.45,.02,z*1.4],.009,0xd8c8ab);rod([x*1.45,0,z*1.4],[x*1.45,.13,z*1.4],.018,0x737c76,true);}
 return g;
}
export function detailTarp(g,type){const {rod,add}=builder(g);g.userData.detailedGear=true;g.userData.tarpShape=type;
 const anchors=type==='hex'?[[-2,1.6,-1],[0,2.4,-2],[2,1.6,-1],[2,1.6,1],[0,2.4,2],[-2,1.6,1]]:type==='wing'?[[-2.5,1.6,-1.7],[2.5,2.5,-1.7],[2.5,1.6,1.7],[-2.5,2.5,1.7]]:[[-2,1.5,-1.5],[0,2.5,-1.5],[2,1.5,-1.5],[2,1.5,1.5],[0,2.5,1.5],[-2,1.5,1.5]];
 anchors.forEach((p,i)=>{rod(p,anchors[(i+1)%anchors.length],.012,0xa18d65);const end=[p[0]*1.28,.03,p[2]*1.5];rod(p,end,.009,0xe4dbc6);rod(end,[end[0],.16,end[2]],.018,0x66716a,true);const ring=add(new THREE.TorusGeometry(.045,.012,4,8),0x9d9b8f,...p,true);ring.rotation.x=Math.PI/2;});return g;}
export function createDetailedGoods(goods={},snapshot={}){
 const g=new THREE.Group();g.name='camp-goods';const {add,rod,fabric}=builder(g),wood=goods.chair==='wood',frame=wood?0x9e7954:0x3f4946,cloth=palette[snapshot.chair?.color]||0x667d6c;
 const at=(x,y,z)=>[-2.4+x,y,2.6+z];
 const points=[at(-.4,.54,.35),at(.4,.54,.35),at(-.32,.5,-.2),at(.32,.5,-.2),at(-.45,1.19,-.36),at(.45,1.19,-.36),at(0,.73,-.28)];
 fabric(points,[[0,1,2],[1,3,2],[2,3,6],[2,6,4],[6,5,4],[3,5,6]],cloth).name='chair-sling-seat';
 for(const side of [-1,1]){rod(at(side*.34,.04,.4),at(-side*.35,1.18,-.36),.025,frame,!wood);rod(at(side*.34,.04,-.32),at(-side*.4,.54,.35),.025,frame,!wood);for(const z of [-.32,.4]){const foot=add(new THREE.SphereGeometry(.05,8,6),0x363f38,...at(side*.34,.04,z));foot.scale.y=.6;}if(wood){rod(at(side*.46,.75,.3),at(side*.46,.75,-.3),.045,frame);}}
 rod(at(-.34,.4,0),at(.34,.4,0),.035,frame);for(let i=0;i<2;i++)rod(points[i],points[i+2],.012,0xcac8b4);
 const large=goods.cooler==='large',w=large?1.1:.7,cx=2.5,cz=2.5,coolerColor=palette[snapshot.cooler?.color]||0x8aaeb5;
 const cooler=add(new THREE.BoxGeometry(w,.55,.6),coolerColor,cx,.3,cz);cooler.name='cooler-body';
 add(new THREE.BoxGeometry(w+.045,.1,.65),0xd8d7c8,cx,.62,cz,true).name='cooler-lid';
 for(const y of [.07,.55])add(new THREE.BoxGeometry(w+.01,.025,.61),0xc3c8be,cx,y,cz,true);
 for(const x of [cx-w/2-.03,cx+w/2+.03]){rod([x,.39,cz-.15],[x,.39,cz+.15],.022,0xbac1b7,true);rod([x,.25,cz-.15],[x,.39,cz-.15],.02,0xbac1b7,true);rod([x,.25,cz+.15],[x,.39,cz+.15],.02,0xbac1b7,true);}
 add(new THREE.BoxGeometry(.1,.17,.045),0x9ca89f,cx,.49,cz+.335,true).name='cooler-latch';
 const lx=0,lz=3.2,led=goods.lantern==='led',glow=0xffdba0,lanternColor=palette[snapshot.lantern?.color]||0x54705c;
 add(new THREE.CylinderGeometry(.32,.36,.06,18),0xa48762,lx,.48,lz);rod([0,0,lz],[0,.48,lz],.035,0x776d57);
 if(led){const shade=add(new THREE.SphereGeometry(.24,18,12),0xf1eddf,lx,.79,lz);shade.scale.y=.8;shade.name='lantern-diffuser';add(new THREE.CylinderGeometry(.11,.19,.09,14),lanternColor,0,1.01,lz);const bail=add(new THREE.TorusGeometry(.12,.018,6,18),0x9a9d8f,0,1.16,lz,true);bail.name='lantern-handle';add(new THREE.SphereGeometry(.08,10,6),glow,0,.68,lz);}
 else{add(new THREE.CylinderGeometry(.19,.23,.16,16),lanternColor,0,.6,lz);add(new THREE.CylinderGeometry(.14,.14,.31,16),0xf4dca8,0,.83,lz).name='lantern-globe';add(new THREE.ConeGeometry(.26,.13,16),lanternColor,0,1.05,lz);for(const x of [-.16,.16])rod([x,.68,lz],[x,1.01,lz],.013,0x879286,true);const bail=add(new THREE.TorusGeometry(.2,.016,6,18,Math.PI),0x7e8b7b,0,1.02,lz,true);bail.name='lantern-handle';}
 return g;
}
