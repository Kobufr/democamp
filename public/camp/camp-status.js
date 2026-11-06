import {campModes} from './real-memories.js';
export function campStatus(record={}){const m=campModes(record);return m.real?{state:'visited',label:'リアルで訪問',icon:'',color:0x328498,ground:null}:m.wanted?{state:'wanted',label:'気になる',icon:'',color:0xc58a3d,ground:null}:m.game?{state:'experienced',label:'3D体験済み',icon:'',color:0x829279,ground:null}:{state:'new',label:'未記録',icon:'',color:0x829279,ground:null};}
export function matchesStatus(record,wanted=false,visited=false){const m=campModes(record);return !wanted&&!visited||wanted&&m.wanted||visited&&m.real>0;}
