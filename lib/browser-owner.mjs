// Anonymous browser ownership is a scoped data capability, separate from Sites sign-in.
const COOKIE='__Host-komorebi-browser';
export async function browserOwner(request,{create=false}={}){
 const local=new URL(request.url).hostname==='terminal.local'||['localhost','127.0.0.1'].includes(new URL(request.url).hostname);
 const name=local?'komorebi-browser-dev':COOKIE;
 const current=request.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1);
 let token=/^[0-9a-f]{64}$/.test(current||'')?current:null,cookie=null;
 if(!token&&create){const bytes=crypto.getRandomValues(new Uint8Array(32));token=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');cookie=`${name}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${local?'':'; Secure'}`;}
 if(!token)return {owner:null,cookie:null,cookieName:name};
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 const id='browser-'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 return {owner:{userId:id,fullName:'',guest:true},cookie,cookieName:name};
}
