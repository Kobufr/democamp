import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REGIONS,regionForPrefecture} from '../public/camp/regions.js';
import {ATTRIBUTE_LABELS} from '../public/camp/camp-history.js';
import {coastZ,oceanVertices} from '../public/camp/coastal-geometry.js';
test('143 unique camps retain existing IDs and ship matching DB seeds and offline catalog',()=>{const seeds=JSON.parse(readFileSync('data/camps.json'));assert.deepEqual(seeds,JSON.parse(readFileSync('public/camp/camps.json')));assert.equal(seeds.length,143);assert.equal(new Set(seeds.map(c=>c.id)).size,143);for(const c of seeds){assert.ok(regionForPrefecture(c.pref),c.name);assert.ok(c.geo.every(Number.isFinite));assert.ok(c.geo[0]>128&&c.geo[0]<146&&c.geo[1]>30&&c.geo[1]<46);assert.ok(c.attributes.every(a=>ATTRIBUTE_LABELS.includes(a)));assert.ok(c.url.startsWith('https://'));}for(const region of Object.keys(REGIONS))assert.ok(seeds.some(c=>regionForPrefecture(c.pref)===region),region);});
test('ocean is continuous beyond the campsite and subdivided for near/far clipping',()=>{const v=oceanVertices();assert.ok(v.length>10000);for(let i=0;i<v.length;i+=9){const zs=[v[i+2],v[i+5],v[i+8]];assert.ok(Math.max(...zs)-Math.min(...zs)<8);for(let j=0;j<9;j+=3)assert.ok(v[i+j+2]<=coastZ(v[i+j])+.001);}assert.ok(Math.min(...v.filter((_,i)=>i%3===2))< -470);assert.notEqual(coastZ(0),coastZ(10));});
