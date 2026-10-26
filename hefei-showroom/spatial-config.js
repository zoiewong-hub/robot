(function(root){'use strict';
const d=root.ShowroomData||(typeof require!=='undefined'?require('./scene-data.js'):null);
const layout={
 corridor:{entry:[-10,-9.2],innerGate:[-6.2,-6.1],junction:[-22.4,-9.2],width:3.4,south:16.5},
 warehouse:{x:-28.7,z:0,width:9.2,depth:12,door:[-24.1,-4.3],approach:[-23.25,-4.3]},
 meetings:[{id:'meeting-large',name:'大会议室',x:-28.7,z:11.7,width:9.2,depth:8.6,door:[-24.1,11.7],approach:[-23.25,11.7]},
 {id:'meeting-small-a',name:'小会议室 01',x:-17.65,z:4.6,width:5.5,depth:5.5,door:[-20.4,4.6],approach:[-21.1,4.6]},
 {id:'meeting-small-b',name:'小会议室 02',x:-17.65,z:11.0,width:5.5,depth:5.5,door:[-20.4,11.0],approach:[-21.1,11.0]}],
 salon:{x:-17.65,z:-2.2,width:5.5,depth:7.0},staff:{x:-22.3,z:-12.1,width:22.1,depth:3.3},stairs:{x:-12.5,z:14.4},lift:{x:11.6,z:15.4},restrooms:{x:-7.8,z:16.3}
};
const length=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function isPublicWalkable(p){const [x,z]=p,r=Math.hypot(x,z);return(r>7.35&&r<13.7)||(x>=-24.15&&x<=-8.1&&z>=-10.50&&z<=-7.90)||(x>=-24.15&&x<=-20.65&&z>=-10.5&&z<=17.0)}
function guideRoute(start,end){const p=[start.slice()],c=layout.corridor,fromAnnex=start[0]<-15,toAnnex=end[0]<-15;
 const add=q=>{if(length(p.at(-1),q)>.015)p.push(q.slice())};
 if(fromAnnex&&toAnnex){add([c.junction[0],start[1]]);add([c.junction[0],end[1]]);add(end);return p}
 let source=start.slice();if(fromAnnex){add([c.junction[0],start[1]]);add(c.junction);add(c.entry);add(c.innerGate);source=c.innerGate}
 const target=toAnnex?c.innerGate:end,a=Math.atan2(source[1],source[0]),b=Math.atan2(target[1],target[0]),delta=Math.atan2(Math.sin(b-a),Math.cos(b-a));
 const n=Math.max(1,Math.ceil(Math.abs(delta)/.08));for(let i=1;i<=n;i++){const u=a+delta*i/n;add([Math.cos(u)*8.7,Math.sin(u)*8.7])}
 if(toAnnex){add(c.innerGate);add(c.entry);add(c.junction);add([c.junction[0],end[1]]);}add(end);return p;
}
function dancerPose(time,viewer){const t=time,position=[.65,-.55],yaw=Math.atan2(viewer[0]-position[0],viewer[1]-position[1]);
 const bob=.015*(1+Math.sin(t*2)),legs=[-1,1].map(side=>({side,hip:[side*.13,.98+bob,0],knee:[side*.15,.54+bob*.4,side*Math.sin(t*2)*.075],foot:[side*.18,.06+Math.max(0,Math.sin(t*2+side))* .025,side*Math.sin(t*2)*.055]}));
 return{type:'humanoid',position,yaw,bob,legs,right:[.37+.06*Math.sin(t*1.3),1.25+.28*Math.sin(t*1.8),.25],left:[-.37+.06*Math.cos(t*1.3),1.25+.28*Math.cos(t*1.8),.25],torsoLean:Math.sin(t*.9)*.045};
}
const oldWaypoint=d.guideWaypoint;d.guideWaypoint=function(id){if(id==='warehouse')return layout.warehouse.approach.slice();const room=layout.meetings.find(x=>x.id===id);return room?room.approach.slice():oldWaypoint(id)};
d.zones.find(z=>z.id==='warehouse').p=[layout.warehouse.x,layout.warehouse.z];d.zones.find(z=>z.id==='warehouse').narration='前置仓位于左侧原工作区。请从入口旁的西北通道向西，再沿共享走廊向南进入；同一条走廊还能前往各个会议室。仓内机器人沿货架通道完成拣货和集货交付。';
d.zones.find(z=>z.id==='central').narration='中央形象区以航空基因为主题：天花悬挂巨型机械臂与行星轨道装置，下方是面向观众舞蹈的双足人形机器人。环墙外侧设企业荣誉与生态合作展示。';
const oldPose=d.demoPose;d.demoPose=function(id,t){if(id!=='warehouse')return oldPose(id,t);const old=oldPose(id,t),robot=d.path([[0,[2.6,-4.3]],[1,[2.6,-3.6]],[2,[1.2,-3.6]],[4,[1.2,.5]],[6,[1.2,.5]],[8,[1.2,3.5]],[10,[-1.2,3.5]],[12,[-1.2,-.5]],[14,[-1.2,-.5]],[15,[-1.2,-3.6]],[16,[2.6,-3.6]],[17,[1.15,-4.5]],[20,[1.15,-4.5]]],Math.min(t,20));return{...old,robot}};
for(const room of layout.meetings)d.zones.push({id:room.id,name:room.name,group:'support',p:[room.x,room.z],steps:['沿共享走廊前往','进入会议室'],narration:room.name+'位于前置仓旁的共享走廊。由入口侧向西，再沿纵向通道即可抵达；同一走廊连接其他会议室。'});
d.layout=layout;d.routeGuide=guideRoute;d.dancerPose=dancerPose;
const api={layout,guideRoute,isPublicWalkable,dancerPose};if(typeof module!=='undefined')module.exports=api;root.SpatialRevision=api;
})(globalThis);
