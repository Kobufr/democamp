import {normalizeCompanions} from './preferences.js';
import {todayInJapan,isValidVisitDate} from './camp-history.js';
export function newTripSetup(profile={},date=todayInJapan()){return {visitDate:date,weather:'sunny',companions:normalizeCompanions(profile.companions).map(person=>({person,enabled:true}))};}
export function tripSetupSnapshot(draft){if(!isValidVisitDate(draft.visitDate))throw Error('今日以前の正しい訪問日を選んでください。');return {visitDate:draft.visitDate,weather:draft.weather,companions:normalizeCompanions(draft.companions.filter(c=>c.enabled).map(c=>c.person))};}
export function shelterDoor(home){return {x:home.x+Math.sin(home.rotation)*2.1,z:home.z+Math.cos(home.rotation)*2.1};}
export function sampleShelterEntry(start,home,index,elapsed){const door=shelterDoor(home),u=Math.max(0,Math.min(1,(elapsed-index*.16)/1.4)),ease=u*u*(3-2*u);return {x:start.x+(door.x-start.x)*ease,z:start.z+(door.z-start.z)*ease,inside:u>=1};}
