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
 {"id": "toyota-hiace", "category": "car", "brand": "TOYOTA", "name": "ハイエース バン", "model": "minivan", "color": "cream", "design": "hiace", "url": "https://toyota.jp/hiacevan/", "note": "背の高い箱形ボディ、広い窓、横長のフロントを表現。"},
 {"id": "mitsubishi-delica", "category": "car", "brand": "MITSUBISHI", "name": "デリカD:5", "model": "minivan", "color": "navy", "design": "delica", "url": "https://www.mitsubishi-motors.com/jp/newsroom/newsrelease/2026/20260109_1.html", "note": "高めの車高と縦型ライト、大きなグリルを表現。"},
 {"id": "coleman-touring-lx", "category": "tent", "brand": "Coleman", "name": "ツーリングドーム/LX", "model": "dome", "color": "olive", "design": "touring", "url": "https://www.coleman.co.jp/customersupport/howtomovie/2000038142/", "note": "コンパクトなドームと張り出した前室を表現。"},
 {"id": "tentmark-circus-dx", "category": "tent", "brand": "tent-Mark DESIGNS", "name": "サーカスTC DX+", "model": "pole", "color": "sand", "design": "circus", "url": "https://www.tent-mark.com/products/circus_tc_dx_sand_color/", "note": "ワンポールの円錐形とサイドフラップを表現。"},
 {"id": "dod-itsuka", "category": "tarp", "brand": "DOD", "name": "いつかのタープ", "model": "hex", "color": "cream", "design": "itsuka", "url": "https://www.dod.camp/product/tt5_631_tn/", "note": "広がりのある六角形と黒色のポールを表現。"},
 {"id": "snowpeak-recta-m", "category": "tarp", "brand": "snow peak", "name": "HDタープ“シールド”・レクタ(M)", "model": "ridge", "color": "sand", "design": "recta", "url": "https://www.snowpeak.com/products/recta-tarp-m", "note": "四角く広い幕と四隅の支柱を表現。"},
 {"id": "coleman-one-mantle", "category": "lantern", "brand": "Coleman", "name": "ワンマントルランタン", "model": "classic", "color": "red", "design": "one-mantle", "url": "https://www.coleman.co.jp/customersupport/howtomovie/2164001-2169494/", "note": "燃料タンク、ガラスのグローブ、上部のベンチレーターを表現。"},
 {"id": "5050-minimalight", "category": "lantern", "brand": "5050WORKSHOP", "name": "MINIMALight", "model": "led", "color": "olive", "design": "minimalight", "url": "https://5050workshop.com/products/minimalight", "note": "スリムな円筒形のライトと発光部を表現。"},
 {"id": "snowpeak-lowchair30", "category": "chair", "brand": "snow peak", "name": "ローチェア30 カーキ", "model": "wood", "color": "olive", "design": "lowchair", "url": "https://ec.snowpeak.co.jp/item/SNP0116A0238", "note": "四角い背もたれ、低い座面、竹調のアームレストを表現。"},
 {"id": "coleman-laychair", "category": "chair", "brand": "Coleman", "name": "レイチェア", "model": "folding", "color": "olive", "design": "laychair", "url": "https://partscatalog.special-coleman.com/catalog/detail/1182", "note": "傾斜したハイバックとリクライニングフレームを表現。"},
 {"id": "yeti-tundra45", "category": "cooler", "brand": "YETI", "name": "Tundra 45", "model": "large", "color": "cream", "design": "tundra", "url": "https://www.yeti.com/coolers/hard-coolers/tundra/tundra-45.html", "note": "厚みのある角形ボディ、2つのラバーラッチとロープハンドルを表現。"},
 {"id": "snowpeak-soft18", "category": "cooler", "brand": "snow peak", "name": "ソフトクーラー18", "model": "compact", "color": "sand", "design": "soft-cooler", "url": "https://www.snowpeak.com/collections/under-100/products/soft-cooler-18-fp-118", "note": "布製のバッグ形状、ファスナーとショルダーストラップを表現。"},
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
export function gearSnapshot(profile){return Object.fromEntries(Object.keys(GEAR_CATEGORIES).flatMap(category=>{const p=gearFor(profile,category);return p?[[category,{id:p.id,name:p.name,brand:p.brand,design:p.design||'',color:(profile.gearCollection?.colors?.[category]&&profile.gearCollection.colors[category]!=='original'?profile.gearCollection.colors[category]:p.color)}]]:[]}));}
export function normalizeGearSnapshot(value={}){return Object.fromEntries(Object.keys(GEAR_CATEGORIES).flatMap(category=>{const p=value?.[category];if(!p||typeof p!=='object'||!text(p.name,80))return [];return [[category,{id:typeof p.id==='string'&&(GEAR_CATALOG.some(c=>c.id===p.id&&c.category===category)||/^own-[a-zA-Z0-9-]{1,76}$/.test(p.id))?p.id:'',name:text(p.name,80),brand:text(p.brand,60),design:GEAR_CATALOG.find(c=>c.category===category&&c.design===p.design)?.design||'',color:Object.hasOwn(GEAR_COLORS,p.color)?p.color:'original'}]];}));}

// Apply only a currently owned item. This changes a single visit, never the profile or other visits.
export function selectVisitGear(visit,collection,id){
 const c=normalizeGearCollection(collection),item=c.items.find(p=>p.id===id);
 if(!item)throw Error('この道具は持ち物に登録されていません。');
 const snapshot={...normalizeGearSnapshot(visit.gearSnapshot),[item.category]:{id:item.id,name:item.name,brand:item.brand,design:item.design||'',color:item.color}};
 const next={...visit,gearSnapshot:snapshot};
 if(item.category==='tent'){next.tentType=item.model;next.tentColor=item.color;}
 else if(item.category==='tarp'){next.tarpType=item.model;next.tarpColor=item.color;}
 else if(item.category==='car'){next.carType=item.model;next.carColor=item.color==='original'?'olive':item.color;}
 else next.goods={...visit.goods,[item.category]:item.model};
 return next;
}
export function visitGearId(visit,category){const p=visit.gearSnapshot?.[category];return p?.id||GEAR_CATALOG.find(item=>item.category===category&&item.design===p?.design)?.id||null;}
export function matchesGearQuery(item,query=''){const aliases={'snow peak':'スノーピーク',Helinox:'ヘリノックス',SUZUKI:'スズキ',Coleman:'コールマン',TOYOTA:'トヨタ',MITSUBISHI:'三菱 デリカ','tent-Mark DESIGNS':'テンマクデザイン サーカス',DOD:'ディーオーディー',YETI:'イエティ','5050WORKSHOP':'フィフティフィフティワークショップ'};return `${item.brand} ${item.name} ${aliases[item.brand]||''}`.normalize('NFKC').toLocaleLowerCase().includes(query.trim().normalize('NFKC').toLocaleLowerCase());}
