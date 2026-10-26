'use strict';
function roundedOutline(w,d,r=.2,n=12){r=Math.min(r,w/2,d/2);const out=[];for(let j=0;j<4;j++)for(let k=0;k<n;k++){const a=(j*90+k/n*90)*Math.PI/180;out.push([(j===0||j===3?1:-1)*(w/2-r)+Math.cos(a)*r,(j<2?1:-1)*(d/2-r)+Math.sin(a)*r])}return out}
function curvedBlock(x,y,z,w,h,d,r=.20,bow=.12,col=C.white){
 const bevel=Math.min(.018,h*.18),levels=[[-h/2,bevel,-.7],[-h/2+bevel,0,0],[h/2-bevel,0,0],[h/2,bevel,.7]],rings=levels.map(l=>roundedOutline(w-l[1]*2,d-l[1]*2,Math.max(.01,r-l[1])).map(p=>[x+p[0],y+l[0],z+p[1]-bow*(p[0]/(w/2))**2])),N=rings[0].length;
 for(let i=0;i<N;i++){const next=(i+1)%N,prev=(i+N-1)%N,n=(k,l)=>{const v=sub(rings[l][(k+1)%N],rings[l][(k+N-1)%N]);return norm([v[2],levels[l][2],-v[0]])};for(let l=0;l<3;l++){const a=rings[l][i],b=rings[l][next],c=rings[l+1][i],dd=rings[l+1][next];smoothTri(a,b,c,n(i,l),n(next,l),n(i,l+1),col);smoothTri(b,dd,c,n(next,l),n(next,l+1),n(i,l+1),col)}for(const l of [0,3])tri([x,y+levels[l][0],z-bow*.22],rings[l][i],rings[l][next],[0,l===0?-1:1,0],col)}
}
function curvedWorktable(w=2.5,d=1.3,h=.80){const bow=Math.min(.20,w*.045);curvedBlock(0,h-.045,.70,w,.09,d,Math.min(.25,d*.22),bow,C.white);for(const x of [-w/2+.18,w/2-.18]){curvedBlock(x,(h-.09)/2,.62,.12,h-.09,d*.68,.05,0,[.89,.88,.92]);cyl(x,.025,.62,.18,.05,C.metal,32)}curvedBlock(0,h-.15,.59,w-.32,.14,.10,.04,bow,[.86,.84,.90])}
function softWall(a,b,h=1.15,col=C.wall,thick=.14){const len=Math.hypot(a[0]-b[0],a[1]-b[1]);localFrame((a[0]+b[0])/2,(a[1]+b[1])/2,-Math.atan2(b[1]-a[1],b[0]-a[0]),()=>roundedBox(0,h/2,0,len+.02,h,thick,Math.min(thick*.45,.07),col))}
function roomWallSegments(w,d,{door='east',doorZ=0}={}){const pts=roundedOutline(w,d,.38,12),result=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],cuts=[0,1],side=door==='east'?a[0]>w/2-.08&&b[0]>w/2-.08:a[0]<-w/2+.08&&b[0]<-w/2+.08;if(side&&Math.abs(b[1]-a[1])>.0001)for(const z of [doorZ-.88,doorZ+.88]){const t=(z-a[1])/(b[1]-a[1]);if(t>0&&t<1)cuts.push(t)}cuts.sort((x,y)=>x-y);for(let j=0;j<cuts.length-1;j++){const p=a.map((v,k)=>v+(b[k]-v)*cuts[j]),q=a.map((v,k)=>v+(b[k]-v)*cuts[j+1]),mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2,gap=(door==='east'&&mx>w/2-.08||door==='west'&&mx<-w/2+.08)&&Math.abs(mz-doorZ)<.88;if(!gap)result.push([p,q])}}return result}
function roundedRoom(x,z,w,d,{door='east',doorZ=0,height=1.15}={}){for(const [a,b] of roomWallSegments(w,d,{door,doorZ}))softWall([x+a[0],z+a[1]],[x+b[0],z+b[1]],height,[.93,.925,.94])}
function buildRevisedFloor(){const l=SpatialRevision.layout;return build(()=>{
 const p=Array.from({length:128},(_,i)=>[Math.cos(i/128*Math.PI*2)*13.67,Math.sin(i/128*Math.PI*2)*13.67]);planPrism(p,-.24,.012,[.94,.935,.93]);
 slab(-3.1,-12.15,14.7,5.7,[.95,.945,.94]);
 slab(l.staff.x,l.staff.z,l.staff.width+1.0,l.staff.depth+.3,[.94,.94,.95]);
 slab(-16.4,-9.2,16.5,2.6,[.94,.93,.95]);slab(-22.4,3.3,3.6,26,[.94,.93,.95]);
 slab(l.warehouse.x,l.warehouse.z,l.warehouse.width+.2,l.warehouse.depth+.2,[.93,.935,.94]);
 for(const room of l.meetings)slab(room.x,room.z,room.width+.2,room.depth+.2,[.945,.94,.93]);slab(l.salon.x,l.salon.z,l.salon.width+.2,l.salon.depth+.2,[.945,.94,.93]);
 slab(0,15.3,28,5.8,[.94,.94,.95]);
})}
function buildRevisedArchitecture(){const l=SpatialRevision.layout;return build(()=>{
 // Rounded entry portal, with a clear northwest passage behind the retail frontage.
 for(const x of [-2.55,2.55])roundedBox(x,1.6,-11.25,.16,3.2,.22,.07,[.82,.75,.92]);curvedBlock(0,3.16,-11.25,5.25,.17,.25,.10,0,[.82,.75,.92]);
 roundedRoom(l.warehouse.x,l.warehouse.z,l.warehouse.width,l.warehouse.depth,{door:'east',doorZ:-4.3,height:2.8});
 // Door crown sits over the actual northern cross-aisle entrance.
 localFrame(l.warehouse.x,l.warehouse.z,0,()=>{roundedBox(4.62,2.52,-4.3,.17,.16,1.9,.06,[.83,.76,.94]);for(const z of [-5.2,-3.4])roundedBox(4.62,1.25,z,.16,2.5,.10,.045,C.white)});
})}
function buildRevisedAnnex(){const l=SpatialRevision.layout;return build(()=>{
 const staff=l.staff;roundedRoom(staff.x,staff.z,staff.width,staff.depth,{door:'east',doorZ:0,height:1.05});
 for(let i=0;i<5;i++)localFrame(staff.x-7+i*3.4,staff.z,0,()=>{curvedWorktable(2.1,.9,.76);chair(0,-.25,0)});
 addLabel('展厅工作人员工作室',{x:staff.x,z:staff.z-1.65,rot:0},0,1.6,.05,6.4,.40,{light:true});
 const salon=l.salon;roundedRoom(salon.x,salon.z,salon.width,salon.depth,{door:'west',doorZ:-1.8,height:1.15});localFrame(salon.x,salon.z,0,()=>{curvedBlock(1.35,.40,-.4,1.1,.68,3.8,.3,.12,C.cream);curvedBlock(1.78,.8,-.4,.18,.72,3.8,.085,0,C.cream);cyl(-.40,.63,0,.63,.06,C.oak,48);cyl(-.40,.30,0,.06,.60,C.metal,24);chair(-1.35,-1.0,.65);chair(-1.35,1.0,2.5);plant(1.6,-2.75,.75)});addLabel('沙龙会客区',{x:salon.x,z:salon.z-3.5,rot:0},0,1.7,.05,3.5,.38,{light:true});
 for(const room of l.meetings){const door=room.id==='meeting-large'?'east':'west';roundedRoom(room.x,room.z,room.width,room.depth,{door,height:1.15});localFrame(room.x,room.z,0,()=>{const big=room.id==='meeting-large',w=big?2.5:1.8,depth=big?5.5:3.0;curvedBlock(0,.79,0,w,.09,depth,.5,.12,C.oak);for(const x of [-w/2-.48,w/2+.48])for(let i=0;i<(big?6:4);i++)chair(x,-depth/2+.25+i*(depth-.5)/(big?5:3),x<0?Math.PI/2:-Math.PI/2);for(const z of [-depth*.33,depth*.33])curvedBlock(0,.38,z,.2,.74,.5,.08,0,C.white)});addLabel(room.name,{x:room.x,z:room.z-room.depth/2,rot:0},0,1.65,.04,3.0,.36,{light:true});
  const signF={x:room.approach[0],z:room.approach[1],rot:room.id==='meeting-large'?Math.PI/2:-Math.PI/2};addLabel(room.name+' →',signF,0,1.8,0,2.0,.27,{light:true});
 }
 const stair=l.stairs;localFrame(stair.x,stair.z,0,()=>{roundedRoom(0,0,3.7,6.0,{door:'west',height:.9});for(let i=0;i<11;i++){roundedBox(-.73,.055+i*.06,1.8-i*.32,1.25,.11+i*.12,.34,.035,C.white);roundedBox(.73,.055+(10-i)*.06,1.8-i*.32,1.25,.11+(10-i)*.12,.34,.035,C.white)}curvedBlock(0,1.4,-1.7,3.2,.14,.8,.25,0,C.white)});addLabel('楼梯',{x:stair.x,z:stair.z-2.9,rot:0},0,1.8,.04,1.5,.3,{light:true});
 const lift=l.lift;localFrame(lift.x,lift.z,0,()=>{roundedRoom(0,0,3.2,3.6,{door:'west',height:1.2});roundedBox(0,1.25,-1.60,1.8,2.5,.13,.06,[.82,.84,.86]);box(0,1.25,-1.52,.014,2.4,.01,C.metal)});addLabel('电梯',{x:lift.x,z:lift.z-1.5,rot:0},0,2.8,0,1.5,.32,{light:true});
 const wash=l.restrooms;localFrame(wash.x,wash.z,0,()=>{roundedRoom(0,0,4.5,2.6,{door:'west',height:1.0});for(const x of [-1.2,1.2]){curvedBlock(x,.78,-.65,.76,.12,.43,.16,0,C.white);cyl(x,.85,-.65,.11,.025,C.metal,24)}});addLabel('洗手间',{x:wash.x,z:wash.z-1.3,rot:0},0,1.7,0,2,.3,{light:true});
 addLabel('← 惠宜选前置仓 · 会议室 ↓',{x:-22.4,z:-9.25,rot:0},0,2.15,0,6.0,.40,{light:true});
})}
function buildCorridorLighting(){return build(()=>{const c=SpatialRevision.layout.corridor;for(const z of [-9.65,-8.75])roundedBox(-16.5,.026,z,15.5,.012,.018,.008,C.lilac);for(const x of [-22.88,-21.92])roundedBox(x,.026,3.2,.018,.012,25,.008,C.lilac);for(const z of [-5,0,5,10,15])localFrame(-22.4,z,-Math.PI/2,()=>tri([-.15,.031,-.1],[.18,.031,0],[-.15,.031,.1],[0,1,0],C.purple))})}
function wallScreenPoint(f,x,y,z,radius=13.23){const fp=globalThis.ShowroomData?.floorplan,custom=fp?.screenPoint(f,x,y,z);if(custom)return custom;const angle=Math.atan2(f.z,f.x)+x/radius;return[Math.cos(angle)*radius,y,Math.sin(angle)*radius]}
function curvedScreenSurface(f,x,y,z,w,h){const vertices=[],count=48;for(let i=0;i<count;i++){const pt=(n,up)=>[...wallScreenPoint(f,x-w/2+n/count*w,y+(up?.5:-.5)*h,z),n/count,up?0:1];for(const p of [pt(i,0),pt(i+1,0),pt(i+1,1),pt(i,0),pt(i+1,1),pt(i,1)])vertices.push(...p)}const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);return{buffer,count:vertices.length/5}}
if(typeof module!=='undefined')module.exports={roundedOutline,roomWallSegments,wallScreenPoint};
