import {ACTION_KEYS} from './activities.js';
export {ACTION_KEYS} from './activities.js';
import {MAP_MIN_DISTANCE,MAP_MAX_DISTANCE,clampMapDistance} from './map-zoom.js';
// Pure record and filter operations, shared by the UI and tests.
export const ATTRIBUTE_LABELS = ['ファミリー', '海', '川', '山', 'オート', '釣り', '遊具', '湖・池', '林間', '草原', 'コテージ等'];
export const CAMP_ATTRIBUTES = {
  fumoto: ['ファミリー', '山', 'オート', '草原'],
  cabins: ['ファミリー', '山', 'オート', '遊具', '林間', 'コテージ等'],
  verga: ['ファミリー', '川', '山', 'オート', '林間', 'コテージ等'],
  mochiya: ['ファミリー', '山', '遊具', '草原'],
  genshi: ['ファミリー', '川', '山', '林間', 'コテージ等'],
  tanuki: ['ファミリー', '山', '釣り', '湖・池', '草原'],
  ryuyo: ['ファミリー', '海', 'オート', '遊具', '草原', 'コテージ等'],
  yume: ['ファミリー', 'オート', '草原'],
  morimaki: ['ファミリー', 'オート', '草原'],
  sweet: ['ファミリー', '川', '山', 'オート', '遊具', '林間', 'コテージ等'],
  tsumagoi: ['ファミリー', '山', 'オート', '釣り', '湖・池', '草原', 'コテージ等'],
  daigo: ['ファミリー', '山', 'オート', '遊具', '草原', 'コテージ等'],
  hinuma: ['ファミリー', 'オート', '湖・池', '草原'],
  nasu: ['ファミリー', '山', 'オート', '遊具', '林間', 'コテージ等'],
  maple: ['ファミリー', '川', '山', 'オート', '釣り', '遊具', '湖・池', '林間', 'コテージ等'],
  marunuma: ['ファミリー', '山', 'オート', '草原'],
  akagi: ['ファミリー', '山', 'オート', '遊具', '林間', 'コテージ等'],
  togakushi: ['ファミリー', '川', '山', 'オート', '林間', '草原', 'コテージ等'],
  komade: ['ファミリー', '川', '山', 'オート', '遊具', '湖・池', '林間', 'コテージ等'],
  snowpeak: ['ファミリー', '草原'],
  tsunan: ['ファミリー', '山', 'オート', '釣り', '湖・池', '林間', 'コテージ等']
};
export function todayInJapan(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit'}).format(now);
}
export function isValidVisitDate(value, today = todayInJapan()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '0001-01-01' || value > today) return false;
  const parsed = new Date(value + 'T12:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value;
}
export function visitDateOf(visit) {
  if (isValidVisitDate(visit.visitDate, '9999-12-31')) return visit.visitDate;
  if (visit.startedAt && Number.isFinite(new Date(visit.startedAt).getTime())) return todayInJapan(new Date(visit.startedAt));
  return '';
}
export function hasActivity(visit) { return ACTION_KEYS.some(key => !!visit.actions?.[key]); }
export function recordedVisits(data) { return (data?.visits || []).filter(hasActivity); }
export function sortVisits(list) {
  return list.map((v,index)=>({v,index})).sort((a,b)=>visitDateOf(a.v).localeCompare(visitDateOf(b.v)) || a.index-b.index).map(item=>item.v);
}
export function activitySummary(list) {
  return Object.fromEntries(ACTION_KEYS.map(key=>[key,list.some(v=>!!v.actions?.[key])]));
}
export function matchesCamp(camp, prefecture='すべて', attributes=[]) {
  return (prefecture==='すべて' || camp.pref===prefecture) && attributes.every(a=>camp.attributes?.includes(a));
}
export function createPastVisit({id,visitDate,activities,tentType='dome',weather='unknown',mealMenu=null,character='bear',carType='suv',carColor='olive',companions=[],now=new Date()}) {
  if (!isValidVisitDate(visitDate,todayInJapan(now))) throw new Error('実在する訪問日を今日以前の日付で入力してください。');
  const actions=Object.fromEntries(ACTION_KEYS.map(key=>[key,!!activities?.[key]]));
  if (!ACTION_KEYS.some(key=>actions[key])) throw new Error('体験したことを1つ以上選んでください。');
  if (actions.tent && !['dome','pole','ridge','cottage'].includes(tentType)) throw new Error('宿泊場所の種類を選んでください。');
  return {id,visitDate,weather,carType,carColor,mealMenu:actions.meal?mealMenu:null,character,companions:structuredClone(companions),startedAt:null,recordedAt:now.toISOString(),actions,tentType:actions.tent?tentType:null,closed:true,source:'manual'};
}
export function replaySnapshot(visit) {
  // Viewing a memory must never mutate the persisted record or its visit count.
  return JSON.parse(JSON.stringify(visit));
}
export function distanceForZoom(value) { return MAP_MAX_DISTANCE*Math.pow(MAP_MIN_DISTANCE/MAP_MAX_DISTANCE,Math.max(0,Math.min(100,Number(value)))/100); }
export function zoomForDistance(distance) { return Math.max(0,Math.min(100,100*Math.log(clampMapDistance(distance)/MAP_MAX_DISTANCE)/Math.log(MAP_MIN_DISTANCE/MAP_MAX_DISTANCE))); }
