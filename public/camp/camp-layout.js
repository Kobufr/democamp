export const CAMP_RADIUS=17;
export const PLACEMENT_RADIUS=13;
export const WALK_RADIUS=14;
export const PLACEABLE_KEYS=['tent','fire','meal','car','tarp'];
export const DEFAULT_LAYOUT={tent:{x:-2,z:0,rotation:.18},fire:{x:1.4,z:1.4,rotation:0},meal:{x:-1.4,z:2.4,rotation:0},car:{x:5,z:4,rotation:-.4},tarp:{x:-3,z:-3,rotation:.2}};
export function normalizePlacement(p,key){const fallback=DEFAULT_LAYOUT[key];if(!fallback)return null;const x=Number.isFinite(p?.x)?p.x:fallback.x,z=Number.isFinite(p?.z)?p.z:fallback.z;const len=Math.hypot(x,z),limit=PLACEMENT_RADIUS;return {x:len>limit?x*limit/len:x,z:len>limit?z*limit/len:z,rotation:Number.isFinite(p?.rotation)?Math.atan2(Math.sin(p.rotation),Math.cos(p.rotation)):fallback.rotation};}
export function normalizeLayout(layout={}){return Object.fromEntries(PLACEABLE_KEYS.map(key=>[key,normalizePlacement(layout?.[key],key)]));}
// Automatic saves combine separate visits and retain the latest edit of a shared visit.
export function reconcileRecords(remote={},local={}){const out=structuredClone(remote);for(const [key,data] of Object.entries(local)){if(key.startsWith('_')||!Array.isArray(data?.visits))continue;out[key] ||= {visits:[]};const byId=new Map(out[key].visits.map(v=>[v.id,v]));for(const v of data.visits){const old=byId.get(v.id);if(!old||(v.updatedAt||v.recordedAt||v.startedAt||'')>(old.updatedAt||old.recordedAt||old.startedAt||''))byId.set(v.id,structuredClone(v));}out[key].visits=[...byId.values()];}const active=local._active||remote._active;if(active&&out[active.campId]?.visits.some(v=>v.id===active.visitId&&!v.closed))out._active=structuredClone(active);else delete out._active;return out;}
