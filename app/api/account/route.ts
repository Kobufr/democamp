import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {accountResponse} from '../../../lib/account-service.mjs';
import {browserOwner} from '../../../lib/browser-owner.mjs';
import {mergeRecords} from '../../../public/camp/preferences.js';
export const dynamic='force-dynamic';
async function handle(request:Request){try{
 const signed=await getChatGPTUser();
 const browser=await browserOwner(request,{create:request.method==='GET'&&!signed});
 const owner=signed||browser.owner;
 if(request.method==='PUT'&&(!owner||request.headers.get('X-Camp-Storage')!==owner.userId))return Response.json({error:'利用者が切り替わりました。ページを開き直してください。',storageChanged:true},{status:409,headers:{'Cache-Control':'no-store, private'}});
 // Sign-in carries this browser's server-saved trips to the account once, by stable visit ID.
 if(signed&&browser.owner&&request.method==='GET'){
  const guest=await env.DB!.prepare('SELECT profile,records FROM accounts WHERE user_id = ?').bind(browser.owner.userId).first<{profile:string,records:string}>();
  if(guest){for(let attempt=0;attempt<3;attempt++){
   const current=await env.DB!.prepare('SELECT profile,records,revision FROM accounts WHERE user_id = ?').bind(signed.userId).first<{profile:string,records:string,revision:number}>();
   const records=mergeRecords(current?JSON.parse(current.records):{},JSON.parse(guest.records));
   const profile=current?.profile||guest.profile;
   const now=new Date().toISOString();
   const result=current?await env.DB!.prepare('UPDATE accounts SET records = ?, updated_at = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?').bind(JSON.stringify(records),now,signed.userId,current.revision).run():await env.DB!.prepare('INSERT INTO accounts (user_id,profile,records,revision,updated_at) VALUES (?,?,?,1,?) ON CONFLICT(user_id) DO NOTHING').bind(signed.userId,profile,JSON.stringify(records),now).run();
   if(result.meta.changes){break}if(attempt===2)throw Error('Account updated during import');
  }
  // End the anonymous capability after linking; logging out starts a fresh browser record.
  const response=await accountResponse(request,signed,env.DB);
  const name=browser.cookieName;
  response.headers.append('Set-Cookie',`${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${name.startsWith('__Host-')?'; Secure':''}`);
  return response;
  }
 }
 const response=await accountResponse(request,owner,env.DB);
 if(browser.cookie)response.headers.append('Set-Cookie',browser.cookie);
 return response;
}catch{return Response.json({error:'保存に接続できません。通信が戻ると自動で再保存します。'},{status:503,headers:{'Cache-Control':'no-store, private'}})}}
export const GET=handle;export const PUT=handle;
