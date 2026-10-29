export const CHARACTERS={bear:{name:'コモ / くま',icon:'🐻',body:0xbb936d,shirt:0x6c8d74},rabbit:{name:'ミミ / うさぎ',icon:'🐰',body:0xe9d9c1,shirt:0xc28c76},fox:{name:'コン / きつね',icon:'🦊',body:0xd99c61,shirt:0x789b9b},panda:{name:'モク / パンダ',icon:'🐼',body:0xe9e5d5,shirt:0x7d8d68}};
export const WEATHER={unknown:'未記録',sunny:'☀️ 晴れ',cloudy:'☁️ くもり',rainy:'🌧️ 雨',snowy:'❄️ 雪',mixed:'🌤️ 晴れ時々くもり'};
export const MEALS={curry:{name:'カレーライス',icon:'🍛'},bbq:{name:'バーベキュー',icon:'🍖'},sandwich:{name:'ホットサンド',icon:'🥪'},noodles:{name:'ラーメン',icon:'🍜'},stew:{name:'あったかシチュー',icon:'🥘'},rice:{name:'おにぎり',icon:'🍙'}};
export const TENT_TYPES=['dome','pole','ridge','cottage'];
export const COMPANION_RELATIONS=['家族','パートナー','子ども','友人'];
export function normalizeCompanions(value){return (Array.isArray(value)?value:[]).slice(0,5).filter(v=>v&&typeof v==='object').map((v,i)=>({name:typeof v.name==='string'?v.name.trim().slice(0,30)||'同行者'+(i+1):'同行者'+(i+1),character:Object.hasOwn(CHARACTERS,v.character)?v.character:'bear',relation:COMPANION_RELATIONS.includes(v.relation)?v.relation:'家族'}));}
export function normalizeProfile(p={}){return {companions:normalizeCompanions(p.companions),name:typeof p.name==='string'?p.name.trim().slice(0,30):'',character:Object.hasOwn(CHARACTERS,p.character)?p.character:'bear',preferredTent:TENT_TYPES.includes(p.preferredTent)?p.preferredTent:'dome'}};
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// Merge explicitly imported guest visits by stable ID, never by date or campground.
export function mergeRecords(account={},guest={}){const out=structuredClone(account);for(const [key,data] of Object.entries(guest)){if(key.startsWith('_')||!Array.isArray(data?.visits))continue;out[key] ||= {visits:[]};const ids=new Set(out[key].visits.map(v=>v.id));for(const v of data.visits)if(!ids.has(v.id)){out[key].visits.push({...structuredClone(v),closed:true});ids.add(v.id)}}return out;}
