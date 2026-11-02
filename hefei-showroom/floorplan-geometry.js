'use strict';
function buildFloorplanWallSections(){const fp=ShowroomData.floorplan,outline=fp.outer,sections=[];for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],length=Math.hypot(a[0]-b[0],a[1]-b[1]),count=Math.ceil(length/1.4);for(let j=0;j<count;j++){const u=a.map((v,k)=>v+(b[k]-v)*j/count),v=a.map((t,k)=>t+(b[k]-t)*(j+1)/count),x=(u[0]+v[0])/2,z=(u[1]+v[1])/2;if(Math.abs(z-fp.point(975,95)[1])<.05&&x>fp.point(905,95)[0]&&x<fp.point(1048,95)[0])continue;if(z>16&&x> -2.2&&x<3.6)continue;sections.push({angle:Math.atan2(z,x),mesh:build(()=>softWall(u,v,2.75,[.94,.935,.95],.17))})}}
 return sections;
}
buildRevisedFloor=function(){return build(()=>{planPrism(ShowroomData.floorplan.outer,-.24,.012,[.945,.94,.935])})};
buildRevisedArchitecture=function(){const fp=ShowroomData.floorplan,l=ShowroomData.layout,p=fp.point;return build(()=>{
 const wall=fp.exhibitWall;arcWall(wall.radius,wall.start,wall.end,0,3.6,.16,[.945,.94,.955]);arcWall(wall.radius-.11,wall.start,wall.end,3.47,.025,.022,C.lilac);
 for(let i=1;i<fp.demoBackdrop.length;i++){const a=fp.demoBackdrop[i-1],b=fp.demoBackdrop[i];softWall(a,b,3.35,[.945,.94,.955],.16);segment([a[0],3.23,a[1]],[b[0],3.23,b[1]],.012,C.lilac)}
 softWall(p(595,223),p(595,616),3.35,[.945,.94,.955],.14);
 const w=l.warehouse;roundedRoom(w.x,w.z,w.width,w.depth,{door:'east',doorZ:w.doorZ,height:2.8});for(const z of [w.door[1]-.89,w.door[1]+.89])roundedBox(w.door[0],1.25,z,.14,2.5,.10,.045,C.white);roundedBox(w.door[0],2.52,w.door[1],.15,.16,1.94,.06,[.83,.76,.94]);
 const e=p(975,95);for(const x of [e[0]-1.8,e[0]+1.8])curvedBlock(x,1.60,e[1],.13,3.2,.22,.06,0,[.80,.74,.90]);curvedBlock(e[0],3.18,e[1],3.7,.15,.22,.06,0,[.80,.74,.90]);
 for(const [x,y] of [[322,112],[850,112],[1102,112],[322,310],[322,620],[322,900],[588,640],[846,850],[1098,990]]){const q=p(x,y);curvedBlock(q[0],1.43,q[1],.62,2.86,.62,.12,0,[.91,.90,.92]);curvedBlock(q[0],2.91,q[1],.67,.10,.67,.14,0,C.white)}
})};
function floorplanMeeting(room){roundedRoom(room.x,room.z,room.width,room.depth,{door:room.doorSide,doorZ:room.doorZ,height:1.2});localFrame(room.x,room.z,0,()=>{const big=room.id==='meeting-large',w=big?1.7:1.35,depth=big?4.8:2.8;curvedBlock(0,.79,0,w,.09,depth,.42,.08,C.oak);for(const x of [-w/2-.45,w/2+.45])for(let i=0;i<(big?6:4);i++)chair(x,-depth/2+.25+i*(depth-.5)/(big?5:3),x<0?Math.PI/2:-Math.PI/2);for(const z of [-depth*.3,depth*.3])curvedBlock(0,.38,z,.17,.74,.48,.07,0,C.white)});addLabel(room.name,{x:room.x,z:room.z-room.depth/2,rot:0},0,1.55,.04,3,.32,{light:true})}
function floorplanStairs(x,z,width=3.6,depth=6.4){roundedRoom(x,z,width,depth,{door:'west',height:.95});for(let i=0;i<12;i++){const yy=.055+i*.055,zz=z+depth*.32-i*depth*.058;roundedBox(x-width*.22,yy,zz,width*.37,.11+i*.11,depth*.060,.03,C.white);roundedBox(x+width*.22,.055+(11-i)*.055,zz,width*.37,.11+(11-i)*.11,depth*.060,.03,C.white)}curvedBlock(x,1.4,z-depth*.4,width-.2,.14,.70,.22,0,C.white)}
buildRevisedAnnex=function(){const l=ShowroomData.layout,fp=ShowroomData.floorplan,p=fp.point;return build(()=>{
 const staff=l.staff;roundedRoom(staff.x,staff.z,staff.width,staff.depth,{door:'east',height:1.15});for(const x of [-2.8,0,2.8])localFrame(staff.x+x,staff.z,0,()=>{curvedWorktable(1.7,.8,.76);chair(0,-.1,0)});addLabel('工作人员工作室',{x:staff.x,z:staff.z-staff.depth/2,rot:0},0,1.55,0,5,.35,{light:true});
 const s=l.salon;roundedRoom(s.x,s.z,s.width,s.depth,{door:'west',doorZ:-1.8,height:1.15});localFrame(s.x,s.z,0,()=>{curvedBlock(.7,.42,-.9,1.05,.72,3.1,.32,.08,C.cream);curvedBlock(1.1,.83,-.9,.18,.65,3.1,.08,0,C.cream);cyl(-.55,.63,.25,.56,.06,C.oak,48);cyl(-.55,.31,.25,.05,.62,C.metal,24);chair(-1.25,-.75,.5);chair(-1.25,1.20,2.5);plant(1.3,-2.65,.65)});addLabel('沙龙会客区',{x:s.x,z:s.z-s.depth/2,rot:0},0,1.55,0,3.7,.33,{light:true});
 for(const room of l.meetings)floorplanMeeting(room);
 floorplanStairs(l.stairs.x,l.stairs.z,4.1,8.4);addLabel('楼梯',{x:l.stairs.x,z:l.stairs.z-4.2,rot:0},0,1.65,0,2,.3,{light:true});const q=p(1265,943);floorplanStairs(q[0],q[1],3.0,2.9);
 const lift=l.lift;roundedRoom(lift.x,lift.z,2.7,2.7,{door:'west',height:1.3});roundedBox(lift.x,1.25,lift.z-1.22,1.8,2.5,.13,.06,[.82,.84,.86]);box(lift.x,1.25,lift.z-1.14,.015,2.4,.01,C.metal);addLabel('电梯',{x:lift.x,z:lift.z-1.3,rot:0},0,2.8,0,1.6,.3,{light:true});
 const wash=l.restrooms;roundedRoom(wash.x,wash.z,3.9,3.1,{door:'west',height:1.1});for(const dx of [-.9,.9])curvedBlock(wash.x+dx,.78,wash.z-.7,.70,.12,.45,.16,0,C.white);addLabel('卫生间',{x:wash.x,z:wash.z-1.5,rot:0},0,1.7,0,2.4,.3,{light:true});
 const c=l.corridor;addLabel('← 前置仓 · 会议室 ↓',{x:c.junction[0]+.5,z:c.junction[1],rot:0},0,1.9,0,5.2,.34,{light:true});
})};
buildCorridorLighting=function(){const fp=ShowroomData.floorplan;return build(()=>{for(const [a,b] of fp.edgeList){const u=fp.anchors[a],v=fp.anchors[b],len=Math.hypot(u[0]-v[0],u[1]-v[1]),n=Math.max(1,Math.floor(len/.70));for(let i=0;i<n;i++){const start=i/n,end=Math.min(1,(i+.38)/n);segment([u[0]+(v[0]-u[0])*start,.025,u[1]+(v[1]-u[1])*start],[u[0]+(v[0]-u[0])*end,.025,u[1]+(v[1]-u[1])*end],.012,[.78,.68,.91])}const x=(u[0]+v[0])/2,z=(u[1]+v[1])/2;localFrame(x,z,-Math.atan2(v[1]-u[1],v[0]-u[0]),()=>tri([-.10,.035,-.07],[.13,.035,0],[-.10,.035,.07],[0,1,0],[.78,.68,.91]))}})};
if(typeof module!=='undefined')module.exports={};

