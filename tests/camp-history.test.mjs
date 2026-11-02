import test from 'node:test';
import assert from 'node:assert/strict';
import {todayInJapan,isValidVisitDate,visitDateOf,sortVisits,recordedVisits,activitySummary,matchesCamp,createPastVisit,replaySnapshot,distanceForZoom,zoomForDistance,CAMP_ATTRIBUTES} from '../public/camp/camp-history.js';
const now=new Date('2026-10-28T10:00:00Z');
test('dates use Japan time, accept leap days, and reject invalid or future dates',()=>{
 assert.equal(todayInJapan(new Date('2026-10-27T16:00:00Z')),'2026-10-28');
 assert.equal(isValidVisitDate('2024-02-29','2026-10-28'),true);
 for(const d of ['2023-02-29','2026-02-30','2026-13-01','2026-10-29','bad',''])assert.equal(isValidVisitDate(d,'2026-10-28'),false,d);
 assert.equal(visitDateOf({startedAt:'2026-10-27T16:00:00Z'}),'2026-10-28');
 assert.equal(visitDateOf({startedAt:null}), '');
});
test('past registrations record only chosen activities and shelter types',()=>{
 const v=createPastVisit({id:'past',visitDate:'2025-07-12',activities:{fire:true},tentType:'cottage',now});
 assert.equal(v.closed,true);assert.equal(v.tentType,null);assert.equal(v.actions.tent,false);assert.equal(v.actions.fire,true);
 assert.deepEqual(activitySummary([v]),{tent:false,fire:true,meal:false,sleep:false,car:false,tarp:false,play:false,swim:false,fish:false,sing:false,walk:false,bath:false});
 assert.throws(()=>createPastVisit({id:'empty',visitDate:'2025-07-12',activities:{},now}),/1つ以上/);
 assert.throws(()=>createPastVisit({id:'future',visitDate:'2027-01-01',activities:{fire:true},now}),/訪問日/);
 const tent=createPastVisit({id:'pole',visitDate:'2025-07-12',activities:{tent:true,sleep:true},tentType:'pole',now});
 assert.equal(tent.tentType,'pole');assert.equal(tent.actions.sleep,true);
});
test('viewing memories and editing visit dates do not add or modify visits',()=>{
 const visit=createPastVisit({id:'one',visitDate:'2025-07-12',activities:{tent:true,meal:true},tentType:'dome',now});
 const data={visits:[visit]};const before=JSON.stringify(data),snapshot=replaySnapshot(visit);
 snapshot.actions.fire=true;snapshot.visitDate='2020-01-01';
 assert.equal(JSON.stringify(data),before);assert.equal(recordedVisits(data).length,1);
 visit.visitDate='2024-07-12';assert.equal(recordedVisits(data).length,1);assert.deepEqual(activitySummary(data.visits),{tent:true,fire:false,meal:true,sleep:false,car:false,tarp:false,play:false,swim:false,fish:false,sing:false,walk:false,bath:false});
});
test('legacy and newly backdated visits stay sortable without fabricating legacy dates',()=>{
 const legacy={id:'legacy',startedAt:null,actions:{fire:true}},recent={id:'recent',startedAt:'2026-10-27T16:00:00Z',actions:{meal:true}},past={id:'past',visitDate:'2025-01-02',actions:{sleep:true}};
 assert.deepEqual(sortVisits([recent,past,legacy]).map(v=>v.id),['legacy','past','recent']);
 assert.deepEqual(recordedVisits({visits:[recent,{actions:{}},past]}),[recent,past]);
});
test('prefecture and attribute filters combine with AND and can return no matches',()=>{
 const sea={pref:'静岡',attributes:CAMP_ATTRIBUTES.ryuyo},lake={pref:'静岡',attributes:CAMP_ATTRIBUTES.tanuki};
 assert.equal(matchesCamp(sea,'静岡',['ファミリー','海','オート']),true);
 assert.equal(matchesCamp(sea,'千葉',['海']),false);
 assert.equal(matchesCamp(lake,'すべて',['釣り']),true);
 assert.equal(matchesCamp(lake,'すべて',['オート']),false);
 assert.equal(matchesCamp(lake,'すべて',['海','釣り']),false);
 assert.equal(Object.keys(CAMP_ATTRIBUTES).length,21);
});
test('zoom slider spans close-up to the whole country and round trips',()=>{
 assert.equal(distanceForZoom(0),400);assert.ok(Math.abs(distanceForZoom(100)-.8)<1e-9);
 for(const n of [0,10,25,50,75,100])assert.ok(Math.abs(zoomForDistance(distanceForZoom(n))-n)<1e-9);
});
