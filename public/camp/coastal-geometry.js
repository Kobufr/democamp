// Subdivided so the software renderer can clip distant water without losing the entire sea.
export function coastZ(x){return -4.8+Math.sin(x*.16)*.45+Math.sin(x*.055)*.7;}
export function oceanVertices(){const vertices=[],columns=80,rows=80;for(let i=0;i<columns;i++){const x=-240+i*6,next=x+6;for(let j=0;j<rows;j++){const a=[x,.12,coastZ(x)-j*6],b=[next,.12,coastZ(next)-j*6],c=[x,.12,coastZ(x)-(j+1)*6],d=[next,.12,coastZ(next)-(j+1)*6];vertices.push(...a,...b,...c,...b,...d,...c)}}return vertices;}
