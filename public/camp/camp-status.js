import {recordedVisits} from './camp-history.js';
export function campStatus(record={}){return recordedVisits(record).length?{state:'visited',label:'行った',icon:'',color:0x328498,ground:null}:record.wishlist?{state:'wanted',label:'行きたい',icon:'',color:0xc58a3d,ground:null}:{state:'new',label:'未訪問',icon:'',color:0x829279,ground:null};}

export function matchesStatus(record,wanted=false,visited=false){const state=campStatus(record).state;return !wanted&&!visited||wanted&&state==='wanted'||visited&&state==='visited';}
