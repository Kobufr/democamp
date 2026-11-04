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
 if(design==='circus'){fabric([[.25,1.55,.6],[1.75,1.25,1.25],[.9,.03,1.3]],[[0,1,2]],0xdcb980).name='circus-side-flap';rod([1.75,.02,1.25],[1.75,1.25,1.25],.025,0x525b51);rod([1.75,1.25,1.25],[2.2,.02,1.6],.01,0xd2c1a1);}
 if(design==='touring'){fabric([[-.68,.75,1.28],[.68,.75,1.28],[-.68,.78,2.05],[.68,.78,2.05]],[[0,1,2],[1,3,2]],0xd99b69).name='touring-front-awning';for(const x of [-.68,.68])rod([x,0,2.05],[x,.78,2.05],.02,0x626956);}
 const scale=design==='touring'?[.86,.8,.92]:design==='circus'?[1.22,1.03,1.22]:[1,1,1];
 if(scale.some(v=>v!==1)){const shape=new THREE.Group();shape.name='product-silhouette';for(const child of [...g.children])shape.add(child);shape.scale.set(...scale);g.add(shape);}
 return g;
}
export function detailTarp(g,type,design=''){const {rod,add}=builder(g);g.userData.detailedGear=true;g.userData.tarpShape=type;g.userData.productDesign=design;
 const anchors=type==='hex'?[[-2,1.6,-1],[0,2.4,-2],[2,1.6,-1],[2,1.6,1],[0,2.4,2],[-2,1.6,1]]:type==='wing'?[[-2.5,1.6,-1.7],[2.5,2.5,-1.7],[2.5,1.6,1.7],[-2.5,2.5,1.7]]:[[-2,1.5,-1.5],[0,2.5,-1.5],[2,1.5,-1.5],[2,1.5,1.5],[0,2.5,1.5],[-2,1.5,1.5]];
 anchors.forEach((p,i)=>{rod(p,anchors[(i+1)%anchors.length],.012,0xa18d65);const end=[p[0]*1.28,.03,p[2]*1.5];rod(p,end,.009,0xe4dbc6);rod(end,[end[0],.16,end[2]],.018,0x66716a,true);const ring=add(new THREE.TorusGeometry(.045,.012,4,8),0x9d9b8f,...p,true);ring.rotation.x=Math.PI/2;});
 if(design==='recta'){for(const x of [-2,2])for(const z of [-1.5,1.5])rod([x,0,z],[x,1.5,z],.03,0x585e54);}
 if(design==='itsuka'){const shape=new THREE.Group();shape.name='itsuka-wide-canopy';for(const child of [...g.children])shape.add(child);shape.scale.set(1.12,.93,.86);g.add(shape);rod([0,2.24,-1.72],[0,2.24,-2.1],.035,0x343d35);}
 return g;}
export function createDetailedGoods(goods={},snapshot={}){
 const g=new THREE.Group();g.name='camp-goods';const {add,rod,fabric}=builder(g),wood=goods.chair==='wood',chairDesign=snapshot.chair?.design||'',high=chairDesign==='laychair',low=chairDesign==='lowchair',frame=low?0xa4ada4:wood?0x9e7954:0x3f4946,cloth=palette[snapshot.chair?.color]||0x667d6c;
 const at=(x,y,z)=>[-2.4+x,y,2.6+z];
 const points=[at(-.4,.54,.35),at(.4,.54,.35),at(-.32,.5,-.2),at(.32,.5,-.2),at(-.45,high?1.62:low?1.28:1.19,high?-.65:-.36),at(.45,high?1.62:low?1.28:1.19,high?-.65:-.36),at(0,.73,-.28)];
 fabric(points,[[0,1,2],[1,3,2],[2,3,6],[2,6,4],[6,5,4],[3,5,6]],cloth).name='chair-sling-seat';
 for(const side of [-1,1]){rod(at(side*.34,.04,.4),at(-side*.35,high?1.62:low?1.28:1.18,high?-.65:-.36),.025,frame,!wood);rod(at(side*.34,.04,-.32),at(-side*.4,.54,.35),.025,frame,!wood);for(const z of [-.32,.4]){const foot=add(new THREE.SphereGeometry(.05,8,6),0x363f38,...at(side*.34,.04,z));foot.scale.y=.6;}if(wood||high){rod(at(side*.46,.75,.3),at(side*.46,.75,-.3),.045,low?0xb18b5b:frame);}}
 if(high)add(new THREE.BoxGeometry(.65,.15,.1),cloth,...at(0,1.43,-.55)).name='laychair-headrest';if(low){for(const x of [-.46,.46])add(new THREE.BoxGeometry(.12,.055,.6),0xc19a6b,...at(x,.77,0)).name='lowchair-wood-arm';}rod(at(-.34,.4,0),at(.34,.4,0),.035,frame);for(let i=0;i<2;i++)rod(points[i],points[i+2],.012,0xcac8b4);
 const coolerDesign=snapshot.cooler?.design||'',soft=coolerDesign==='soft-cooler',tundra=coolerDesign==='tundra',large=goods.cooler==='large',w=large?1.1:.7,cx=2.5,cz=2.5,coolerColor=palette[snapshot.cooler?.color]||0x8aaeb5;
 const cooler=add(new THREE.BoxGeometry(w,.55,.6),coolerColor,cx,.3,cz);cooler.name='cooler-body';
 add(new THREE.BoxGeometry(w+.045,soft?.055:tundra?.16:.1,.65),soft?coolerColor:tundra?coolerColor:0xd8d7c8,cx,.62,cz,!soft&&!tundra).name='cooler-lid';
 if(soft){add(new THREE.BoxGeometry(w+.05,.018,.66),0x514d40,cx,.58,cz).name='soft-cooler-zipper';const strap=add(new THREE.TorusGeometry(.4,.025,6,24,Math.PI),0x615846,cx,.61,cz);strap.scale.set(1,1,.65);strap.name='soft-cooler-strap';}
 else{
 for(const y of [.07,.55])add(new THREE.BoxGeometry(w+.01,.025,.61),tundra?coolerColor:0xc3c8be,cx,y,cz,!tundra);
 for(const x of [cx-w/2-.03,cx+w/2+.03]){rod([x,.39,cz-.15],[x,.39,cz+.15],tundra?.035:.022,tundra?0x464d42:0xbac1b7,!tundra);rod([x,.25,cz-.15],[x,.39,cz-.15],.02,0xbac1b7,!tundra);rod([x,.25,cz+.15],[x,.39,cz+.15],.02,0xbac1b7,!tundra);}
 if(tundra){for(const x of [cx-.3,cx+.3]){add(new THREE.BoxGeometry(.05,.2,.05),0x383f35,x,.49,cz+.34).name='tundra-rubber-latch';add(new THREE.BoxGeometry(.13,.035,.06),0x383f35,x,.42,cz+.35);}}
 else add(new THREE.BoxGeometry(.1,.17,.045),0x9ca89f,cx,.49,cz+.335,true).name='cooler-latch';
 }
 const lx=0,lz=3.2,led=goods.lantern==='led',glow=0xffdba0,lanternColor=palette[snapshot.lantern?.color]||0x54705c;
 add(new THREE.CylinderGeometry(.32,.36,.06,18),0xa48762,lx,.48,lz);rod([0,0,lz],[0,.48,lz],.035,0x776d57);
 if(snapshot.lantern?.design==='minimalight'){add(new THREE.CylinderGeometry(.075,.075,.48,16),lanternColor,0,.83,lz).name='minimalight-cylinder';add(new THREE.CylinderGeometry(.078,.078,.2,16),glow,0,.87,lz);add(new THREE.CylinderGeometry(.09,.09,.07,16),0x3a443c,0,1.1,lz);rod([0,1.13,lz],[0,1.22,lz],.015,0x777e6b);}
 else if(led){const shade=add(new THREE.SphereGeometry(.24,18,12),0xf1eddf,lx,.79,lz);shade.scale.y=.8;shade.name='lantern-diffuser';add(new THREE.CylinderGeometry(.11,.19,.09,14),lanternColor,0,1.01,lz);const bail=add(new THREE.TorusGeometry(.12,.018,6,18),0x9a9d8f,0,1.16,lz,true);bail.name='lantern-handle';add(new THREE.SphereGeometry(.08,10,6),glow,0,.68,lz);}
 else{add(new THREE.CylinderGeometry(.19,.23,.16,16),lanternColor,0,.6,lz);add(new THREE.CylinderGeometry(.14,.14,.31,16),0xf4dca8,0,.83,lz).name='lantern-globe';add(new THREE.ConeGeometry(.26,.13,16),lanternColor,0,1.05,lz);for(const x of [-.16,.16])rod([x,.68,lz],[x,1.01,lz],.013,0x879286,true);const bail=add(new THREE.TorusGeometry(.2,.016,6,18,Math.PI),0x7e8b7b,0,1.02,lz,true);bail.name='lantern-handle';}
 return g;
}
