// Approximate display positions, with models inspired by the official references.
export const MAP_LANDMARKS=[
 {id:'fuji',name:'富士山',type:'fuji',geo:[138.73,35.36],width:10.2,base:.14,url:'https://www.fujisan-climb.jp/'},
 {id:'inubo',name:'犬吠埼灯台',type:'lighthouse',geo:[140.868,35.708],width:4.5,base:.4,url:'https://www.city.choshi.chiba.jp/edu/sg-guide/page210157.html'},
 {id:'kegon',name:'華厳滝',type:'waterfall',geo:[139.502,36.738],width:3.6,base:.32,url:'https://www.nikko-kankou.org/public/spot/5'},
 {id:'shiraito',name:'白糸ノ滝',type:'waterfall',geo:[138.588,35.313],width:3.6,base:.3,url:'https://fujinomiya.gr.jp/guide/170/'},
 {id:'asama',name:'浅間山',type:'mountain',geo:[138.523,36.406],width:5,base:.26,url:'https://www.pref.gunma.jp/page/8044.html'},
 {id:'nantai',name:'男体山',type:'mountain',geo:[139.491,36.766],width:5,base:.23,url:'https://www.nikko-kankou.org/spot/list?categoryIds=121'}
];
// Keep landmarks visible at every zoom, with a bounded screen footprint.
export function landmarkScale(landmark,worldUnitsPerPixel){return Math.min(Math.max(landmark.base,18*worldUnitsPerPixel/landmark.width),65*worldUnitsPerPixel/landmark.width);}
