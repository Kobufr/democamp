import {env} from 'cloudflare:workers';
import seeds from '../../../data/camps.json';
export const dynamic='force-dynamic';
let seeded:Promise<unknown>|null=null;
export async function GET(){
 try{
  if(!env.DB)throw Error('DB unavailable');
  if(!seeded)seeded=env.DB.batch(seeds.map(c=>env.DB!.prepare('INSERT OR IGNORE INTO campgrounds (id,data) VALUES (?,?)').bind(c.id,JSON.stringify(c)))).catch(e=>{seeded=null;throw e});
  await seeded;
  const {results}=await env.DB.prepare('SELECT data FROM campgrounds ORDER BY rowid').all<{data:string}>();
  return Response.json(results.map(r=>JSON.parse(r.data)),{headers:{'Cache-Control':'public, max-age=60'}});
 }catch{return Response.json({error:'キャンプ場情報を読み込めませんでした。'},{status:503})}
}
