import {GEAR_CATEGORIES,normalizeGearCollection,visitGearId,matchesGearQuery} from './gear-catalog.js';
import {escapeHTML as esc} from './preferences.js';
export function campGearMarkup(visit,collection,category='tent',action=null,query=''){
 const owned=normalizeGearCollection(collection).items.filter(p=>p.category===category),items=owned.filter(p=>matchesGearQuery(p,query)),selected=visit.gearSnapshot?.[category],currentId=visitGearId(visit,category);
 return `<section class="campGearMenu" aria-label="今回使う装備"><div class="campGearCategories" role="group" aria-label="装備のカテゴリ">${Object.entries(GEAR_CATEGORIES).map(([k,n])=>`<button type="button" data-trip-category="${k}" aria-pressed="${category===k}">${n}</button>`).join('')}</div><div class="campGearCurrent"><span>${GEAR_CATEGORIES[category]}・${owned.length}点</span><small>今回：${selected?esc(selected.name):'自由な形の装備'}</small></div><div class="campGearList">${items.length?items.map(item=>`<button class="campGearRow" type="button" data-use-trip-gear="${item.id}" aria-pressed="${item.id===currentId}" ${item.id===currentId&&!action?'disabled':''}><span><small>${esc(item.brand||'MY GEAR')}</small><strong>${esc(item.name)}</strong></span><b>${action?({tent:'設営',tarp:'はる',car:'到着'})[action]||'使う':item.id===currentId?'✓':'使う'}</b></button>`).join(''):`<p class="campGearEmpty">${owned.length?'一致する持ち物がありません。':'このカテゴリの持ち物は未登録です。'}<button type="button" id="manageTripGear">マイページで追加</button></p>`}</div><div class="campGearFoot">${action==='tent'?'<button type="button" id="genericTripTent">形だけで選ぶ</button>':''}<small>変更はこのキャンプだけに反映</small><button type="button" id="closeTripGear">閉じる</button></div></section>`;
}
export function showCampGearPicker({host,getVisit,getCollection,category='tent',action=null,onSelect,onManage,onGenericTent,onClose}){
 function render(){host.innerHTML=campGearMarkup(getVisit(),getCollection(),category,action);
 host.querySelectorAll('[data-trip-category]').forEach(b=>b.onclick=()=>{category=b.dataset.tripCategory;action=null;render();});
 host.querySelectorAll('[data-use-trip-gear]').forEach(b=>b.onclick=()=>{const id=b.dataset.useTripGear;onClose();onSelect(id,action);});
 host.querySelector('#manageTripGear')?.addEventListener('click',()=>{onClose();onManage(category);});
 host.querySelector('#genericTripTent')?.addEventListener('click',()=>{onClose();onGenericTent();});
 host.querySelector('#closeTripGear').onclick=onClose;
 }render();
}
