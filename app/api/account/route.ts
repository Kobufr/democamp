import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {accountResponse} from '../../../lib/account-service.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){try{return await accountResponse(request,await getChatGPTUser(),env.DB)}catch{return Response.json({error:'同期できませんでした。端末の記録は保持されています。'},{status:503,headers:{'Cache-Control':'no-store'}})}}
export const GET=handle;export const PUT=handle;
