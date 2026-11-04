// A bounded sea leaves the shared pale campground backdrop visible.
export function coastZ(x){return -4.8+Math.sin(x*.16)*.45+Math.sin(x*.055)*.7;}
export function oceanVertices(){const vertices=[],columns=48,rows=20;for(let i=0;i<columns;i++){const x=-24+i,next=x+1;for(let j=0;j<rows;j++){const a=[x,.12,coastZ(x)-j],b=[next,.12,coastZ(next)-j],c=[x,.12,coastZ(x)-(j+1)],d=[next,.12,coastZ(next)-(j+1)];vertices.push(...a,...b,...c,...b,...d,...c)}}return vertices;}
