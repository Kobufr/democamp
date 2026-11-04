// Product names and source URLs verified against manufacturer pages, 2026-11-05.
// Models are independently authored approximations, not official product models.
export const GEAR_CATEGORIES={car:'車',tent:'テント',tarp:'タープ',lantern:'ランタン',chair:'チェア',cooler:'クーラーボックス'};
export const GEAR_SHAPES={car:{suv:'SUV',compact:'コンパクト',minivan:'バン',camper:'キャンピングカー'},tent:{dome:'ドーム',pole:'ワンポール',ridge:'リッジ',cottage:'ロッジ'},tarp:{ridge:'レクタ',hex:'ヘキサ',wing:'ウイング'},lantern:{classic:'クラシック',led:'LED'},chair:{folding:'軽量チェア',wood:'ウッドチェア'},cooler:{compact:'コンパクト',large:'大型'}};
export const GEAR_COLORS={original:'定番カラー',sand:'サンド',olive:'オリーブ',navy:'ネイビー',red:'レッド',cream:'アイボリー',sky:'ブルー'};
export const GEAR_CATALOG=[
 {id:'suzuki-jimny-sierra',category:'car',brand:'SUZUKI',name:'ジムニー シエラ',model:'suv',color:'olive',design:'jimny',url:'https://www.suzuki.co.jp/car/jimny_sierra/',note:'角張ったボディ・丸形ライト・背面スペアタイヤを表現。'},
 {id:'snowpeak-amenity-m',category:'tent',brand:'snow peak',name:'アメニティドームM',model:'dome',color:'sand',design:'amenity',url:'https://ec.snowpeak.co.jp/item/SNP0118A0266',note:'低めのドームと前室、交差するポールを表現。'},
 {id:'snowpeak-hex-l',category:'tarp',brand:'snow peak',name:'HDタープ“シールド”・ヘキサ（L）',model:'hex',color:'sand',design:'hex',url:'https://ec.snowpeak.co.jp/item/SNP0118A0547',note:'六角形の幕体と、張り綱・ポールを表現。'},
 {id:'snowpeak-hozuki',category:'lantern',brand:'snow peak',name:'ほおずき ゆき',model:'led',color:'cream',design:'hozuki',url:'https://ec.snowpeak.co.jp/item/SNP0115A0069',note:'丸い白色シェードと吊り下げ用ループを表現。'},
 {id:'helinox-chair-one',category:'chair',brand:'Helinox',name:'Chair One',model:'folding',color:'navy',design:'chair-one',url:'https://helinox.tokyo/products/chair-one-black',note:'吊り下げ式シートと細いフレームを表現。色は自由に変更できます。'},
 {id:'coleman-steel-belt',category:'cooler',brand:'Coleman',name:'54QT スチールベルトクーラー',model:'large',color:'sand',design:'steel-belt',url:'https://ec.coleman.co.jp/ext/pickup_54qt_steelbeltedcooler.html',note:'金属調の縁・ラッチ・左右のハンドルを表現。'},
];
const text=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
export function safeGearURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
export function normalizeGearCollection(value={}){
 const items=[],seen=new Set();
 for(const raw of (Array.isArray(value?.items)?value.items:[]).slice(0,40)){
  if(!raw||typeof raw!=='object')continue;
  const known=GEAR_CATALOG.find(p=>p.id===raw.id);
  if(known){if(!seen.has(known.id)){items.push({...known,source:'catalog'});seen.add(known.id);}continue;}
  const id=text(raw.id,80),category=raw.category,name=text(raw.name,80);
  if(!/^own-[a-zA-Z0-9-]+$/.test(id)||seen.has(id)||!Object.hasOwn(GEAR_CATEGORIES,category)||!name)continue;
  const shapes=GEAR_SHAPES[category],photo=typeof raw.photo==='string'&&raw.photo.length<=12000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(raw.photo)?raw.photo:'';
  items.push({id,category,name,brand:text(raw.brand,60),note:text(raw.note,240),url:safeGearURL(raw.url),model:Object.hasOwn(shapes,raw.model)?raw.model:Object.keys(shapes)[0],color:Object.hasOwn(GEAR_COLORS,raw.color)?raw.color:'original',source:'custom',photo});seen.add(id);
 }
 const equipped=Object.fromEntries(Object.keys(GEAR_CATEGORIES).map(category=>[category,items.find(item=>item.id===value?.equipped?.[category]&&item.category===category)?.id||null]));
 const colors=Object.fromEntries(Object.keys(GEAR_CATEGORIES).map(category=>[category,Object.hasOwn(GEAR_COLORS,value?.colors?.[category])?value.colors[category]:'original']));
 return {items,equipped,colors};
}
export function gearFor(profile,category){const c=normalizeGearCollection(profile?.gearCollection);return c.items.find(p=>p.id===c.equipped[category])||null;}
export function addGear(collection,item){const c=normalizeGearCollection(collection);if(c.items.some(p=>p.id===item.id))return c;if(c.items.length>=40)throw Error('持ち物は40点まで登録できます。');return normalizeGearCollection({...c,items:[...c.items,item]});}
export function removeGear(collection,id){const c=normalizeGearCollection(collection);return normalizeGearCollection({...c,items:c.items.filter(item=>item.id!==id)});}
export function equipGear(profile,id){const c=normalizeGearCollection(profile.gearCollection),item=c.items.find(p=>p.id===id);if(!item)throw Error('持ち物に追加してから選んでください。');const next={...profile,gearCollection:{...c,colors:{...c.colors,[item.category]:'original'},equipped:{...c.equipped,[item.category]:id}}};
 const key={car:'preferredCar',tent:'preferredTent',tarp:'preferredTarp'}[item.category];
 if(key)next[key]=item.model;else next.goods={...profile.goods,[item.category]:item.model};
 if(item.category==='car')next.preferredCarColor=item.color==='original'?'olive':item.color;
 if(item.category==='tent')next.preferredTentColor=item.color;
 if(item.category==='tarp')next.preferredTarpColor=item.color;
 return next;
}
export function gearSnapshot(profile){return Object.fromEntries(Object.keys(GEAR_CATEGORIES).flatMap(category=>{const p=gearFor(profile,category);return p?[[category,{name:p.name,brand:p.brand,design:p.design||'',color:(profile.gearCollection?.colors?.[category]&&profile.gearCollection.colors[category]!=='original'?profile.gearCollection.colors[category]:p.color)}]]:[]}));}
export function normalizeGearSnapshot(value={}){return Object.fromEntries(Object.keys(GEAR_CATEGORIES).flatMap(category=>{const p=value?.[category];if(!p||typeof p!=='object'||!text(p.name,80))return [];return [[category,{name:text(p.name,80),brand:text(p.brand,60),design:GEAR_CATALOG.find(c=>c.category===category&&c.design===p.design)?.design||'',color:Object.hasOwn(GEAR_COLORS,p.color)?p.color:'original'}]];}));}
