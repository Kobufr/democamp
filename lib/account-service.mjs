import {wishlistFields} from '../public/camp/wishlist.js';
import {normalizeLayout} from '../public/camp/camp-layout.js';
import {normalizeProfile,normalizeCompanions,CHARACTERS,TENT_TYPES,WEATHER,MEALS} from '../public/camp/preferences.js';
import {isValidVisitDate} from '../public/camp/camp-history.js';
const headers={'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
const json=(data,status=200)=>Response.json(data,{status,headers});
export function validateState(body){
 if(!body||!Number.isSafeInteger(body.revision)||body.revision<0)throw Error('不正な更新番号です。');
 const p=body.profile;
 if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.trim().length>30||!Object.hasOwn(CHARACTERS,p.character)||!TENT_TYPES.includes(p.preferredTent))throw Error('名前・キャラクター・テントを確認してください。');
 const data=body.records;if(!data||typeof data!=='object'||Array.isArray(data))throw Error('記録を確認してください。');
 const records={};let total=0;
 for(const [key,entry] of Object.entries(data)){
  if(key==='_active')continue;
  if(!/^[a-z0-9-]{1,64}$/.test(key)||!entry||!Array.isArray(entry.visits))throw Error('キャンプ場の記録が不正です。');
  const ids=new Set();records[key]={...wishlistFields(entry),visits:entry.visits.map(v=>{
   if(++total>3000||!v||typeof v.id!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(v.id)||ids.has(v.id))throw Error('訪問記録が不正です。');ids.add(v.id);
   if(v.visitDate&&!isValidVisitDate(v.visitDate))throw Error('今日以前の訪問日を選んでください。');
   if(v.weather&&!Object.hasOwn(WEATHER,v.weather))throw Error('天気を確認してください。');
   if(v.mealMenu&&!Object.hasOwn(MEALS,v.mealMenu))throw Error('メニューを確認してください。');
   if(v.tentType&&!TENT_TYPES.includes(v.tentType))throw Error('テントを確認してください。');
   const timestamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))?x:null;
   return {id:v.id,visitDate:v.visitDate||'',startedAt:timestamp(v.startedAt),updatedAt:timestamp(v.updatedAt),layout:normalizeLayout(v.layout),recordedAt:timestamp(v.recordedAt),actions:Object.fromEntries(['tent','fire','meal','sleep','car','tarp'].map(k=>[k,!!v.actions?.[k]])),tentType:v.tentType||null,weather:v.weather||'unknown',mealMenu:v.mealMenu||null,character:Object.hasOwn(CHARACTERS,v.character)?v.character:'bear',companions:normalizeCompanions(v.companions),closed:!!v.closed,legacy:!!v.legacy,source:v.source==='manual'?'manual':'game'};
  })};
 }
 if(data._active){const a=data._active;if(records[a.campId]?.visits.some(v=>v.id===a.visitId&&!v.closed))records._active={campId:a.campId,visitId:a.visitId};}
 return {profile:normalizeProfile(p),records};
}
export async function accountResponse(request,user,db){
 if(request.method==='GET'){
  if(!user)return json({user:null,profile:null,records:{},revision:0});
  const row=await db.prepare('SELECT profile,records,revision FROM accounts WHERE user_id = ?').bind(user.userId).first();
  return json({user:user.guest?null:{id:user.userId,name:user.fullName||''},canSave:true,storageId:user.userId,profile:row?JSON.parse(row.profile):null,records:row?JSON.parse(row.records):{},revision:row?.revision||0});
 }
 if(!user)return json({error:'記録の同期にはログインしてください。'},401);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'このサイトから保存してください。'},403);
 const raw=await request.text();if(raw.length>1_000_000)return json({error:'保存できる記録の上限を超えています。'},413);
 let body,state;try{body=JSON.parse(raw);state=validateState(body)}catch(e){return json({error:e.message||'入力を確認してください。'},400)}
 const args=[JSON.stringify(state.profile),JSON.stringify(state.records),new Date().toISOString()];
 const result=body.revision===0?
  await db.prepare('INSERT INTO accounts (profile,records,updated_at,user_id,revision) VALUES (?,?,?,?,1) ON CONFLICT(user_id) DO NOTHING').bind(...args,user.userId).run():
  await db.prepare('UPDATE accounts SET profile = ?, records = ?, updated_at = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?').bind(...args,user.userId,body.revision).run();
 if(!result.meta.changes)return json({error:'ほかの端末で更新されています。最新の記録を確認してから保存してください。',conflict:true},409);
 return json({revision:body.revision+1});
}
