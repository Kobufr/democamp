import {GEAR_CATEGORIES,normalizeGearCollection,visitGearId,matchesGearQuery} from './gear-catalog.js';
import {gearIllustration} from './gear-ui.js';
import {escapeHTML as esc} from './preferences.js';
export function campGearMarkup(visit,collection,category='tent',action=null,query=''){
 const owned=normalizeGearCollection(collection).items.filter(p=>p.category===category),items=owned.filter(p=>matchesGearQuery(p,query)),selected=visit.gearSnapshot?.[category],currentId=visitGearId(visit,category);
 return `<section class="gearBrowser campGearBrowser" aria-labelledby="campGearTitle"><div class="eyebrow">THIS CAMP / MY OWN GEAR</div><h2 id="campGearTitle">今回使う装備を選ぶ</h2><p class="gearLead">自分の持ち物から選択。このキャンプだけに反映します。</p><div class="gearCategories" role="group" aria-label="今回の装備のカテゴリ">${Object.entries(GEAR_CATEGORIES).map(([k,n])=>`<button type="button" data-trip-category="${k}" aria-pressed="${category===k}">${n}</button>`).join('')}</div><div class="tripCurrentGear"><small>今回の${GEAR_CATEGORIES[category]}</small><strong>${selected?esc(selected.name):'自由な形の装備'}</strong><span>持ち物：${owned.length}点</span></div><label class="tripGearSearch">持ち物の商品名で検索<input id="tripGearQuery" type="search" value="${esc(query)}" placeholder="メーカー・商品名"></label><div class="gearResults">${items.length?items.map(item=>`<article class="collectionCard"><div class="collectionArt">${item.photo?`<img src="${esc(item.photo)}" alt="${esc(item.name)}の登録写真">`:gearIllustration(category,item.color,item.design,item.model)}<span>${item.id===currentId?'今回の選択中':'持ち物'}</span></div><div class="collectionInfo"><small>${esc(item.brand||'MY GEAR')}</small><h3>${esc(item.name)}</h3><p>${esc(item.note||'自分で登録した道具')}</p><div class="collectionActions"><button type="button" data-use-trip-gear="${item.id}" ${item.id===currentId&&!action?'disabled':''}>${action?({tent:'このテントを設営',tarp:'このタープをはる',car:'この車で到着'})[action]||'今回使う':item.id===currentId?'選択中 ✓':'今回使う'}</button></div></div></article>`).join(''):`<div class="gearEmpty"><b>${owned.length?'一致する持ち物がありません':'このカテゴリの持ち物がありません'}</b><p>マイページで、商品一覧から追加するかお手持ちの道具を登録できます。</p><button type="button" id="manageTripGear">マイページで持ち物を追加</button></div>`}</div><p class="gearModelNote">3Dは商品の特徴を取り入れた近似表現です。未設営のテント・タープや未到着の車は「体験」から設置できます。</p><div class="tripGearFooter">${action==='tent'?'<button type="button" id="genericTripTent">商品を指定せず形だけで選ぶ</button>':''}<button type="button" id="closeTripGear">← キャンプへ戻る</button></div></section>`;
}
export function showCampGearPicker({getVisit,getCollection,category='tent',action=null,openModal,onSelect,onManage,onGenericTent}){
 const content=document.querySelector('#modalContent'),dialog=document.querySelector('#modal');let query='';
 function render(focusSearch=false){let start=null,end=null;if(focusSearch){const input=content.querySelector('#tripGearQuery');start=input?.selectionStart;end=input?.selectionEnd;}
 openModal(campGearMarkup(getVisit(),getCollection(),category,action,query),true);
 content.querySelectorAll('[data-trip-category]').forEach(b=>b.onclick=()=>{category=b.dataset.tripCategory;action=null;query='';render();});
 content.querySelectorAll('[data-use-trip-gear]').forEach(b=>b.onclick=()=>{const id=b.dataset.useTripGear;dialog.close();onSelect(id,action);});
 content.querySelector('#tripGearQuery').oninput=e=>{query=e.target.value;render(true);};if(focusSearch){const input=content.querySelector('#tripGearQuery');input.focus();try{input.setSelectionRange(start,end);}catch{}}
 content.querySelector('#manageTripGear')?.addEventListener('click',()=>{dialog.close();onManage(category);});
 content.querySelector('#genericTripTent')?.addEventListener('click',()=>{dialog.close();onGenericTent();});
 content.querySelector('#closeTripGear').onclick=()=>dialog.close();
 }render();
}
