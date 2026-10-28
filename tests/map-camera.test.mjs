import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/camp/vendor/three.module.js';
import {createMapCamera, updateMapCamera, mapPanDelta, MAP_PITCH} from '../public/camp/map-camera.js';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9, `${a} != ${b}`);

test('map panning preserves rotation and applies the same translation at every depth',()=>{
  const target=new THREE.Vector3(4,0,6),camera=createMapCamera(1.5);
  updateMapCamera(camera,{target,distance:91,aspect:1.5});
  const rotation=camera.quaternion.clone();
  const points=[new THREE.Vector3(-8,0,4),new THREE.Vector3(12,7,-20),new THREE.Vector3(0,0,0)];
  const before=points.map(p=>p.clone().project(camera));
  const delta=mapPanDelta(camera,120,-65,800);
  target.x+=delta.x;target.z+=delta.z;
  updateMapCamera(camera,{target,distance:91,aspect:1.5});
  const after=points.map(p=>p.clone().project(camera));
  near(camera.quaternion.angleTo(rotation),0);
  near(camera.rotation.x,-MAP_PITCH);near(camera.rotation.y,0);near(camera.rotation.z,0);
  for(let i=1;i<points.length;i++){
    near(after[i].x-before[i].x,after[0].x-before[0].x);
    near(after[i].y-before[i].y,after[0].y-before[0].y);
  }
  near((after[0].x-before[0].x)*1200/2,120);
  near(-(after[0].y-before[0].y)*800/2,-65);
});

test('changing zoom or viewport preserves the fixed map angle',()=>{
  const camera=createMapCamera(),rotation=camera.quaternion.clone();
  for(const distance of [28,91,395])for(const aspect of [.5,1.5,2]){
    updateMapCamera(camera,{target:new THREE.Vector3(-20,0,30),distance,aspect});
    near(camera.quaternion.angleTo(rotation),0);
    near((camera.right-camera.left)/(camera.top-camera.bottom),aspect);
  }
});
