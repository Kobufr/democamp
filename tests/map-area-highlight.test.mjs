import test from 'node:test';import assert from 'node:assert/strict';
import {createAreaHighlight} from '../public/camp/map-area-highlight.js';import {selectedPrefectures} from '../public/camp/regions.js';import * as THREE from '../public/camp/vendor/three.module.js';
const geo=(lon,lat)=>[(lon-138.5)*12,(36.5-lat)*12];
test('Kanto highlights cover Kanagawa and Chiba and render above land without depth occlusion',()=>{const names=selectedPrefectures(['関東']),g=createAreaHighlight(names,geo);g.updateMatrixWorld(true);assert.equal(new Set(g.children.filter(o=>o.isMesh).map(o=>o.userData.prefecture)).size,7);for(const [name,lon,lat] of [['神奈川',139.5,35.4],['千葉',140.2,35.5]]){const [x,z]=geo(lon,lat),ray=new THREE.Raycaster(new THREE.Vector3(x,10,z),new THREE.Vector3(0,-1,0)),hits=ray.intersectObjects(g.children);assert.ok(hits.some(h=>h.object.userData.prefecture===name),name);for(const h of hits.filter(h=>h.object.isMesh)){assert.equal(h.object.material.depthTest,true);assert.ok(h.object.position.y>.012);assert.ok(h.object.renderOrder>-3);}}});

import {REGIONS} from '../public/camp/regions.js';
test('empty boundary remnants never interrupt rendering any of the 47 prefectures',()=>{const names=Object.values(REGIONS).flatMap(r=>r.prefectures),g=createAreaHighlight(names,geo);assert.equal(new Set(g.children.filter(o=>o.isMesh).map(o=>o.userData.prefecture)).size,47);});
