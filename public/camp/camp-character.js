import {CHARACTERS,normalizeOutfit} from './preferences.js';
import {clothingColor,decorateOutfit} from './appearance.js';
export function createCamper(type='bear',parent,appearance={},shapes){
 const {group,ball,cone,cyl,box}=shapes,outfit=normalizeOutfit(appearance),base=CHARACTERS[type]||CHARACTERS.bear,c={...base,shirt:clothingColor(outfit,base.shirt)},g=group(.7,0,9.5,parent);g.userData.character=Object.hasOwn(CHARACTERS,type)?type:'bear';g.scale.setScalar(1.25);
 const part=(mesh,name)=>{mesh.name=name;return mesh;};
 ball(.35,c.shirt,0,.55,0,g);ball(.38,c.body,0,1.05,0,g);
 for(const a of [-1,1]){
  if(type==='rabbit'){const ear=ball(.13,c.body,a*.2,1.55,0,g);ear.scale.set(.8,2.4,.8);const inner=ball(.07,0xd7afa2,a*.2,1.57,.08,g);inner.scale.y=2.4;}
  else if(type==='fox'||type==='cat'){part(cone(type==='cat'?.15:.17,type==='cat'?.32:.42,c.body,a*.27,1.43,0,g,4),'pointed-ear');if(type==='cat')cone(.08,.18,0xdd9d9a,a*.27,1.45,.09,g,4);}
  else if(type==='elephant'){const ear=part(ball(.24,c.body,a*.4,1.08,-.02,g),'elephant-ear');ear.scale.set(.85,1.3,.4);const inner=ball(.17,0xbbafb1,a*.42,1.08,.06,g);inner.scale.set(.8,1.3,.25);}
  else if(type==='dog'){const ear=part(ball(.16,0x8d715a,a*.34,1.1,-.02,g),'floppy-ear');ear.scale.set(.7,1.9,.7);}
  else if(type!=='penguin')ball(.14,type==='panda'?0x47554d:c.body,a*.29,1.32,0,g);
  const foot=ball(.11,type==='penguin'?0xe8ad5c:type==='panda'?0x47554d:c.body,a*.2,.12,.08,g);if(type==='penguin')foot.scale.set(1.35,.6,1.6);
  const arm=ball(.12,c.body,a*.4,.6,.02,g);if(type==='penguin')arm.scale.set(.65,1.6,.6);(g.userData.arms||=[]).push(arm);
  if(type==='panda'){const patch=ball(.09,0x47554d,a*.14,1.09,.31,g);patch.scale.z=.4;}
  ball(.033,0x34483a,a*.13,1.09,.36,g,8);ball(.07,0xe9bb9e,a*.23,.98,.29,g);
  if(type==='cat')for(const y of [.94,.99]){const whisker=part(box(.16,.014,.014,0x736657,a*.3,y,.37,g),'whisker');whisker.rotation.z=a*(y===.94?-.15:.15);}
 }
 if(type==='elephant'){for(let i=0;i<4;i++){const trunk=part(ball(.105-i*.012,c.body,0,.99-i*.13,.39+i*.026,g),'trunk');trunk.scale.y=1.1;}ball(.075,c.body,0,.56,.53,g);}
 else if(type==='penguin'){const face=ball(.24,0xf0ead8,0,.98,.27,g);face.scale.set(1,.85,.4);const beak=part(cone(.095,.22,0xe8ad5c,0,1,.41,g,4),'beak');beak.rotation.x=Math.PI/2;const belly=part(ball(.25,0xf0ead8,0,.52,.24,g),'penguin-belly');belly.scale.set(.9,1.12,.45);}
 else{const muzzle=ball(.14,type==='dog'?0xefddc0:0xf0dfc4,0,.95,.34,g);if(type==='dog')muzzle.scale.z=1.4;ball(type==='dog'?.06:.045,type==='cat'?0xce8f8b:0x44503c,0,1,type==='dog'?.52:.46,g);}
 if(type==='cat'||type==='dog')for(let i=0;i<3;i++)part(ball(.075,c.body,(type==='cat'?.22:.1)*Math.sin(i*.8),.36+i*.1,-.36-i*.08,g),'tail');
 if(outfit.hat==='cap'||outfit.hat==='auto'&&['bear','fox','panda','dog'].includes(type)){cyl(.42,.42,.06,c.shirt,0,1.34,0,g);cyl(.26,.3,.16,c.shirt,0,1.44,0,g);}
 box(.5,.42,.2,0xd28c51,0,.65,-.29,g);box(.52,.08,.22,0xe5b27c,0,.87,-.29,g);return decorateOutfit(g,outfit,c.shirt);
}
