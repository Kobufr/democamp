// Area extents are approximate visual guides, not administrative boundaries.
export const REGIONS={
 '北海道':{prefectures:['北海道'],bounds:[139.3,41.3,145.9,45.7]},
 '東北':{prefectures:['青森','岩手','宮城','秋田','山形','福島'],bounds:[138.2,36.8,142.3,41.6]},
 '関東':{prefectures:['茨城','栃木','群馬','埼玉','千葉','東京','神奈川'],bounds:[138.35,34.85,141,37.15]},
 '中部':{prefectures:['新潟','富山','石川','福井','山梨','長野','岐阜','静岡','愛知'],bounds:[135.4,34.5,139.9,38.6]},
 '近畿':{prefectures:['三重','滋賀','京都','大阪','兵庫','奈良','和歌山'],bounds:[134.2,33.3,137.1,35.8]},
 '中国':{prefectures:['鳥取','島根','岡山','広島','山口'],bounds:[130.8,33.7,134.6,36.35]},
 '四国':{prefectures:['徳島','香川','愛媛','高知'],bounds:[132,32.65,134.85,34.6]},
 '九州・沖縄':{prefectures:['福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄'],bounds:[122.8,24,132.2,34.7]}
};
const PREF_BOUNDS={山梨:[138.1,35.15,139.15,35.98],静岡:[137.45,34.55,139.2,35.65],千葉:[139.7,34.85,140.9,36.15],茨城:[139.65,35.72,140.9,36.95],栃木:[139.28,36.2,140.3,37.2],群馬:[138.35,35.95,139.65,37.1],長野:[137.3,35.15,138.8,37.05],新潟:[137.6,36.7,139.9,38.6]};
export function regionForPrefecture(pref){return Object.keys(REGIONS).find(r=>REGIONS[r].prefectures.includes(pref))||null;}
export function matchesRegion(camp,region='全国'){return region==='全国'||!!REGIONS[region]?.prefectures.includes(camp.pref);}
export function areaBounds(region,prefecture='すべて',camps=[]){if(prefecture!=='すべて'){if(PREF_BOUNDS[prefecture])return PREF_BOUNDS[prefecture];const matches=camps.filter(c=>c.pref===prefecture);if(matches.length){const xs=matches.map(c=>c.geo[0]),ys=matches.map(c=>c.geo[1]);return [Math.min(...xs)-.3,Math.min(...ys)-.3,Math.max(...xs)+.3,Math.max(...ys)+.3];}}return REGIONS[region]?.bounds||null;}
// Sutherland–Hodgman clipping lets the highlight follow the island coastline.
export function clipToBounds(points,[west,south,east,north]){let out=points.map(p=>[...p]);for(const [axis,edge,sign] of [[0,west,1],[0,east,-1],[1,south,1],[1,north,-1]]){const input=out;out=[];if(!input.length)break;let prev=input.at(-1),prevIn=(prev[axis]-edge)*sign>=0;for(const current of input){const inside=(current[axis]-edge)*sign>=0;if(inside!==prevIn){const t=(edge-prev[axis])/(current[axis]-prev[axis]);out.push([prev[0]+t*(current[0]-prev[0]),prev[1]+t*(current[1]-prev[1])]);}if(inside)out.push(current);prev=current;prevIn=inside;}}return out;}

export function selectedPrefectures(regions=[],prefs=[]){return prefs.length?[...prefs]:[...new Set(regions.flatMap(r=>REGIONS[r]?.prefectures||[]))];}
export function matchesAreas(camp,regions=[],prefs=[]){return (!regions.length||regions.some(r=>matchesRegion(camp,r)))&&(!prefs.length||prefs.includes(camp.pref));}
export function toggleRegion(regions,prefs,region){const next=regions.includes(region)?regions.filter(r=>r!==region):[...regions,region];return {regions:next,prefs:prefs.filter(p=>next.some(r=>REGIONS[r]?.prefectures.includes(p)))};}
