import {todayInJapan,isValidVisitDate,recordedVisits} from './camp-history.js';
import {GEAR_CATEGORIES,GEAR_COLORS,GEAR_SHAPES} from './gear-catalog.js';
const text=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
export const PHOTO_LIMIT=3,PHOTO_SIZE=50000,PHOTO_BUDGET=1500000;
export function normalizeRealMemory(raw,today=todayInJapan()){
 if(!raw||!/^memory-[a-zA-Z0-9-]{1,90}$/.test(raw.id||''))throw Error('思い出のIDを確認してください。');
 const updatedAt=typeof raw.updatedAt==='string'&&Number.isFinite(Date.parse(raw.updatedAt))?raw.updatedAt:null;if(!updatedAt)throw Error('思い出の更新日時を確認してください。');
 const precision=['day','month','unknown'].includes(raw.precision)?raw.precision:'day';let startDate='',endDate='';
 if(precision==='day'){if(!isValidVisitDate(raw.startDate,today))throw Error('今日以前の正しい日付を選んでください。');startDate=raw.startDate;endDate=raw.endDate||startDate;if(!isValidVisitDate(endDate,today)||endDate<startDate)throw Error('終了日は開始日から今日までの日付を選んでください。');}
 if(precision==='month'){if(!/^\d{4}-\d{2}$/.test(raw.startDate||'')||!isValidVisitDate(raw.startDate+'-01',today))throw Error('今日以前の年月を選んでください。');startDate=raw.startDate;}
 const photos=(Array.isArray(raw.photos)?raw.photos:[]);if(photos.length>PHOTO_LIMIT||photos.some(p=>typeof p!=='string'||p.length>PHOTO_SIZE||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p)))throw Error('写真は圧縮したJPEGを3枚まで保存できます。');
 const gear=(Array.isArray(raw.gear)?raw.gear:[]).slice(0,40).filter(p=>p&&Object.hasOwn(GEAR_CATEGORIES,p.category)&&text(p.name,80)).map(p=>({id:text(p.id,80),category:p.category,name:text(p.name,80),brand:text(p.brand,60),model:Object.hasOwn(GEAR_SHAPES[p.category],p.model)?p.model:Object.keys(GEAR_SHAPES[p.category])[0],color:Object.hasOwn(GEAR_COLORS,p.color)?p.color:'original'}));
 return {id:raw.id,updatedAt,deleted:!!raw.deleted,precision,startDate,endDate,note:text(raw.note,2000),site:text(raw.site,100),companions:text(raw.companions,200),weather:text(raw.weather,80),tips:text(raw.tips,1000),gear,photos:[...photos]};
}
export function realMemories(record={}){return (Array.isArray(record.memories)?record.memories:[]).filter(m=>!m.deleted).slice().sort((a,b)=>(b.startDate||'').localeCompare(a.startDate||'')||(b.updatedAt||'').localeCompare(a.updatedAt||''));}
export function memoryDateLabel(m){return m.precision==='unknown'?'日付不明':m.precision==='month'?m.startDate.replace('-','年')+'月ごろ':m.startDate===m.endDate?m.startDate.replaceAll('-','/')+'・日帰り':m.startDate.replaceAll('-','/')+' 〜 '+m.endDate.replaceAll('-','/');}
export function memoryFields(entry={}){if(!Array.isArray(entry.memories)||!entry.memories.length)return {};if(entry.memories.length>200)throw Error('このキャンプ場の思い出は200件までです。');const items=entry.memories.map(m=>normalizeRealMemory(m));if(new Set(items.map(m=>m.id)).size!==items.length)throw Error('思い出のIDが重複しています。');return {memories:items};}
export function mergeMemoryFields(a={},b={}){if(!a.memories&&!b.memories)return {};const byId=new Map();for(const m of [...(a.memories||[]),...(b.memories||[])]){const old=byId.get(m.id);if(!old||(m.updatedAt||'')>(old.updatedAt||'')||m.updatedAt===old.updatedAt&&m.deleted)byId.set(m.id,structuredClone(m));}return {memories:[...byId.values()]};}
export function campModes(record={}){return {real:realMemories(record).length,game:recordedVisits(record).length,wanted:!!record.wishlist};}
export function photoBytes(records){return Object.values(records).reduce((total,r)=>total+(r?.memories||[]).reduce((n,m)=>n+(m.photos||[]).reduce((size,p)=>size+p.length,0),0),0);}
