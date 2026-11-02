'use strict';
const D=ShowroomData,labels3D=[],screenPanels=[],glassPanels=[],frames={},assetTextures={};
const color={wall:[.94,.935,.95],stone:[.94,.935,.93],plinth:[.91,.91,.94],purple:[.57,.37,.93],mint:[.36,.62,.55],blue:[.36,.49,.72],sand:[.73,.57,.39]};
const blend=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const mix=blend;
function atFrame(f,fn){const start=verts.length;localFrame(f.x,f.z,f.rot,fn);if(f.scaleXZ){const s=f.scaleXZ;for(let i=start;i<verts.length;i+=9){verts[i]=f.x+(verts[i]-f.x)*s;verts[i+2]=f.z+(verts[i+2]-f.z)*s;const n=norm([verts[i+3]/s,verts[i+4],verts[i+5]/s]);verts[i+3]=n[0];verts[i+4]=n[1];verts[i+5]=n[2]}}}
function matFrame(f,x=0,y=0,z=0,scale=1){return mul(model(f.x,0,f.z,1,1,1,f.rot),model(x*(f.scaleXZ||1),y,z*(f.scaleXZ||1),scale*(f.scaleXZ||1),scale,scale*(f.scaleXZ||1)))}
function pointFrame(f,x,y,z){const s=f.scaleXZ||1;return[f.x+(x*Math.cos(f.rot)+z*Math.sin(f.rot))*s,y,f.z+(-x*Math.sin(f.rot)+z*Math.cos(f.rot))*s]}
function stationFrame(id,radius){if(D.floorplan?.frames[id])return{...D.floorplan.frames[id]};const z=D.zones.find(z=>z.id===id),a=Math.atan2(z.p[1],z.p[0]);return{x:radius?Math.cos(a)*radius:z.p[0],z:radius?Math.sin(a)*radius:z.p[1],rot:-Math.PI/2-a,angle:a}}
for(const z of D.zones)frames[z.id]=stationFrame(z.id);
frames.shop=stationFrame('shop');
frames.warehouse={x:D.layout.warehouse.x,z:D.layout.warehouse.z,rot:0};
frames.ai=stationFrame('ai');
function segment(a,b,r=.012,col=C.lilac){const m=linkBetween(a,b),start=verts.length;cyl(0,.5,0,r,1,col,16);for(let i=start;i<verts.length;i+=9){const p=[verts[i],verts[i+1],verts[i+2]],n=[verts[i+3],verts[i+4],verts[i+5]];for(let j=0;j<3;j++){verts[i+j]=m[j]*p[0]+m[4+j]*p[1]+m[8+j]*p[2]+m[12+j];const ny=m[4+j]/Math.hypot(m[4],m[5],m[6]);verts[i+3+j]=m[j]*n[0]+ny*n[1]+m[8+j]*n[2]}}}
function arcWall(radius,a,b,y,h,thick,col){const n=Math.ceil((b-a)*radius*7);for(let i=0;i<n;i++){const u=a+(b-a)*i/n,v=a+(b-a)*(i+1)/n,m=(u+v)/2;box(Math.cos(m)*radius,y+h/2,Math.sin(m)*radius,Math.hypot(Math.cos(u)-Math.cos(v),Math.sin(u)-Math.sin(v))*radius+.015,h,thick,col,-Math.PI/2-m)}}
function slab(x,z,w,d,col=C.floor){roundedBox(x,-.10,z,w,.20,d,.10,col)}
function tray(x,y,z,w=.55,d=.48,col=color.blue){box(x,y,z,w,.035,d,col);for(const dx of [-w/2,w/2])box(x+dx,y+.08,z,.022,.16,d,col);for(const dz of [-d/2,d/2])box(x,y+.08,z+dz,w,.16,.022,col)}
function worktable(w=2.5,d=1.3,h=.80){curvedWorktable(w,d,h)}
function titleTexture(text,{sub='',light=false,bg=null,width=1024,height=220}={}){return textSurface(width,height,(c,w,h)=>{if(bg){c.fillStyle=bg;c.fillRect(0,0,w,h)}c.textAlign='center';c.textBaseline='middle';c.font='600 '+Math.min(78,Math.floor(w/(text.length*.75)))+'px Microsoft YaHei';if(light){c.shadowColor='#b593ff';c.shadowBlur=13}c.fillStyle=light?'#76558f':'#3b3452';c.fillText(text,w/2,h*(sub?.38:.5));c.shadowBlur=0;if(sub){c.font='24px Microsoft YaHei';c.fillStyle=light?'#9987a8':'#797185';c.fillText(sub,w/2,h*.78)}})}
function addLabel(text,f,x,y,z,w,h,options={}){const tex=titleTexture(text,options);const item={text,owner:f.id||options.owner||null,texture:tex,mat:mul(model(f.x,0,f.z,1,1,1,f.rot),model(x*(f.scaleXZ||1),y,z*(f.scaleXZ||1),w*(f.scaleXZ||1),h,1))};labels3D.push(item);return item}
function addScreen(f,x,y,z,w,h,texture,system){const profile=D.floorplan.wallProfiles[f.id],item={texture,mat:I(),mesh:curvedScreenSurface(f,x,y,z,w,h),system,curved:true,wallRadius:profile?.radius||13.23};screenPanels.push(item);const N=40;for(const side of [-1,1])for(let i=0;i<N;i++){const a=wallScreenPoint(f,x-w/2+i/N*w,y+side*(h/2+.035),z),b=wallScreenPoint(f,x-w/2+(i+1)/N*w,y+side*(h/2+.035),z);segment(a,b,.036,[.73,.70,.79])}for(const side of [-1,1])segment(wallScreenPoint(f,x+side*(w/2+.035),y-h/2,z),wallScreenPoint(f,x+side*(w/2+.035),y+h/2,z),.036,[.73,.70,.79]);return item}
function loadAsset(name,url){const tex=textSurface(512,256,c=>{c.fillStyle='#171c29';c.fillRect(0,0,512,256)}),im=new Image();im.onload=()=>{gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,tex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);window.sceneDirty=true};im.src=url;assetTextures[name]=tex;return tex}
const filmTexture=loadAsset('film','assets/brand-film.webp');
const floorMesh=buildRevisedFloor();
const wallSections=buildFloorplanWallSections();
const architecturalMesh=buildRevisedArchitecture();
const lightMesh=build(()=>{});
const corridorLighting=buildCorridorLighting();
const centralBaseMesh=build(()=>{cyl(0,.065,0,6.03,.13,C.white,96);cyl(0,.135,0,6.02,.025,C.purple,96);cyl(0,.17,0,5.96,.05,[.94,.94,.96],96);cyl(.65,.23,-.55,1.14,.12,[.90,.89,.94],64)});
const centralMesh=build(()=>{arcWall(5.95,.73,3.82,.20,3.0,.16,[.90,.90,.93]);arcWall(5.84,.73,3.82,3.12,.035,.018,C.lilac);cyl(.65,.23,-.55,1.14,.12,[.90,.89,.94],64)});
const centralFilm={buffer:gl.createBuffer(),count:96*6};{const v=[];for(let i=0;i<96;i++){const pt=(n,up)=>{const a=.85+n/96*2.78;return[Math.cos(a)*5.835,up?2.95:.55,Math.sin(a)*5.835,n/96,up?0:1]};for(const p of [pt(i,0),pt(i+1,0),pt(i+1,1),pt(i,0),pt(i+1,1),pt(i,1)])v.push(...p)}gl.bindBuffer(gl.ARRAY_BUFFER,centralFilm.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
const furnitureMesh=build(()=>{
 atFrame(frames.tidy,()=>{
  slab(0,0,4.5,3.4,[.82,.77,.69]);
  curvedBlock(0,.36,-.80,2.65,.58,.82,.22,.12,C.cream);curvedBlock(0,.75,-1.13,2.65,.72,.18,.08,.12,C.cream);for(const x of [-1.25,1.25])roundedBox(x,.57,-.80,.16,.35,.83,.06,C.cream);
  curvedBlock(0,.49,.78,1.65,.06,.85,.30,.08,C.oak);for(const x of [-.68,.68])for(const z of [.48,1.08])cyl(x,.24,z,.025,.48,C.dark,16);
  for(const x of [-2.25,2.25])for(const z of [-1.7,1.7])box(x,1.25,z,.045,2.5,.045,C.metal);
  for(const z of [-1.7,1.7])box(0,2.5,z,4.55,.045,.045,C.metal);for(const x of [-2.25,2.25])box(x,2.5,0,.045,.045,3.45,C.metal);
  // Transparent sliding door in the front frame; its two panels remain closed.
  for(const x of [-.46,.46])box(x,1.25,1.708,.022,2.5,.025,C.metal);box(.43,1.1,1.74,.02,.28,.035,C.dark);
  roundedBox(-1.78,.40,-.72,.48,.8,.6,.03,C.white);plant(1.8,-1.15,.7);
 });
 atFrame(frames.ai,()=>{worktable(2.55,1.20,.80);tray(-.7,.84,.82,.58,.49,color.blue);tray(.7,.84,.82,.58,.49,color.mint);box(-1.15,1.04,-.07,.26,.26,.025,C.dark);cyl(-1.15,.88,-.07,.025,.20,C.metal,24)});
 // Product line: tiered plinth, end-effectors and product information screen.
 atFrame(frames.products,()=>{curvedBlock(0,.125,0,5.1,.25,1.10,.30,.18,C.white);box(0,.255,.54,5.0,.013,.015,C.lilac);curvedBlock(1.05,.54,0,1.18,.60,.72,.20,.06,C.white)});
 // Warehouse shelves: three parallel runs with side and cross aisles.
 atFrame(frames.warehouse,()=>{for(const x of [-2.4,0,2.4]){for(const xx of [-.35,.35])for(const z of [-2.8,2.8])box(x+xx,1.13,z,.045,2.26,.045,C.metal);for(const y of [.25,.80,1.35,1.9]){box(x,y,0,.75,.04,5.70,C.metal);for(let j=0;j<6;j++){const z=-2.35+j*.94;box(x,y+.20,z,.49,.36,.64,j%2?color.sand:color.blue);box(x+.253,y+.20,z,.008,.11,.3,C.cream)}}}localFrame(0,-5.2,0,()=>worktable(1.3,1.0,.78));tray(0,.82,-4.5,1.1,.9,color.mint)});
});
const roomGlass=build(()=>atFrame(frames.tidy,()=>{for(const x of [-2.25,2.25])box(x,1.25,0,.012,2.5,3.4,[.50,.76,.84]);for(const z of [-1.70,1.70])box(0,1.25,z,4.5,2.5,.012,[.50,.76,.84]);box(0,2.5,0,4.5,.012,3.4,[.50,.76,.84])}));roomGlass.opacity=.10;
const annexMesh=buildRevisedAnnex();
const demoHeaders=build(()=>{for(const z of D.zones){if(['welcome','company','support'].includes(z.group)||['multi','industrial'].includes(z.id))continue;const f=frames[z.id];if(z.id==='warehouse'){addLabel('惠宜选前置仓',f,0,3.45,-3.1,4.8,.48,{light:true});continue}addLabel(z.name.replace('AI 基建 · 六套系统','六套系统 · 全流程闭环'),f,0,z.id==='algorithm'?3.22:2.66,-.65,z.id==='products'?5.1:3.2,.26,{light:true})}
 for(const sign of D.floorplan.signs)addLabel(sign.text,sign.f,0,sign.y,-.65,sign.w,.22,{light:true});
 addLabel('ZERITH · 零次方',{x:0,z:-11.14,rot:0},0,3.16,0,4.5,.28,{light:true});

 // Freestanding directional totems and a continuous purple floor route.
 for(const id of ['company','ai','multi','tidy','shop']){const wp=D.guideWaypoint(id),a=Math.atan2(wp[1],wp[0]),f={x:wp[0]*.84,z:wp[1]*.84,rot:-Math.PI/2-a};atFrame(f,()=>{curvedBlock(0,.57,0,.40,1.14,.18,.06,0,[.89,.87,.94]);box(0,1.13,.08,.36,.016,.01,C.lilac)});addLabel(D.zones.find(z=>z.id===id).name+' →',f,0,.91,.083,1.2,.26,{light:true})}
});
const companyTexture=textSurface(1600,800,(c,w,h)=>{c.fillStyle='#edeef2';c.fillRect(0,0,w,h);c.fillStyle='#4d3f72';c.font='bold 70px Microsoft YaHei';c.fillText('本体 × 模型 × 数据',80,130);c.font='29px Microsoft YaHei';c.fillStyle='#6f697c';['通用具身智能机器人研发与应用','全身协同运动与操作 / 多模态任务理解','数据采集 · 模型迭代 · 真实场景部署'].forEach((v,i)=>c.fillText(v,80,215+i*65));c.fillStyle='#9c89b9';c.fillRect(80,430,1440,3);['发展历程','核心技术','生态合作','企业荣誉 / 知识产权'].forEach((t,i)=>{c.fillStyle='#514169';c.font='34px Microsoft YaHei';c.fillText(t,80+i*370,510);c.fillStyle='#b9afc7';for(let j=0;j<3;j++)c.fillRect(80+i*370,565+j*50,240-j*25,12)})});
const aiTextures=D.systems.map((sys,index)=>textSurface(800,440,(c,w,h)=>paintSystem(c,w,h,index,0)));
function paintSystem(c,w,h,index,time){const status=D.platformStatus(time);c.fillStyle='#141b29';c.fillRect(0,0,w,h);c.fillStyle='#bea4ef';c.font='22px Arial';c.fillText('0'+(index+1)+' / ZERITH SYSTEM',30,40);c.fillStyle='#f1edf9';c.font='bold 38px Microsoft YaHei';c.fillText(D.systems[index].name,30,96);c.fillStyle='#9aabbe';c.font='18px Microsoft YaHei';c.fillText('展厅流程演示',w-160,40);
 if(index===1){c.fillStyle='#91bdb3';c.font='23px Arial';c.fillText(status.taskId,30,145);const names=['任务创建','物体定位','抓取','搬运','放置校验','上传入库'];names.forEach((n,i)=>{const y=193+i*34;c.fillStyle=i<=status.phase?'#8db9ad':'#465268';c.fillRect(32,y-17,16,16);c.fillStyle=i===status.phase?'#f3eaff':'#a8b5c9';c.font='20px Microsoft YaHei';c.fillText(n,64,y);c.fillStyle=i<status.phase?'#7cb49f':'#9380b0';c.fillRect(255,y-15,i<status.phase?465:i===status.phase?250:50,8)});return}
 const subtitles=['多模态轨迹 · RGB-D · 关节姿态','任务接入与采集','质检 · 时序对齐 · 人工复核','数据集版本 · 多模态索引','异常片段 · 场景数据回流','模型版本 · 任务执行 · 设备状态'];c.fillStyle='#9aabc3';c.font='21px Microsoft YaHei';c.fillText(subtitles[index],30,145);
 if(index===0){for(let j=0;j<3;j++){c.strokeStyle=['#a18ac9','#78ad9c','#8ca1c8'][j];c.lineWidth=4;c.beginPath();for(let k=0;k<80;k++){const x=30+k*9,y=240+j*42+Math.sin(k*.16+time*.6+j)*25;k?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
 if(index===2)for(let j=0;j<5;j++)for(let k=0;k<12;k++){c.fillStyle=(j+k)%7?'#5f9387':'#a28d65';c.fillRect(30+k*61,185+j*37,50,26)}
 if(index===3){[['家庭',30,190,300,160],['工业',350,190,180,160],['零售',550,190,200,160]].forEach(r=>{c.fillStyle='#46596f';c.fillRect(...r.slice(1));c.fillStyle='#d3e0e8';c.fillText(r[0],r[1]+25,r[2]+45)})}
 if(index===4){['现场执行','异常筛选','轨迹回流','再训练'].forEach((n,i)=>{c.fillStyle=i===Math.floor(time/2)%4?'#9d83c5':'#39485e';c.fillRect(30+i*190,220,160,80);c.fillStyle='#e3deed';c.fillText(n,48+i*190,268)})}
 if(index===5){['模型 H1-LOCAL','设备 H1 / 在线','任务 '+status.action].forEach((n,i)=>{c.fillStyle='#26374c';c.fillRect(30,190+i*62,710,48);c.fillStyle='#bacdcb';c.fillText(n,50,222+i*62)})}
 c.fillStyle='#718295';c.font='17px Microsoft YaHei';c.fillText('与现场流程关联的模拟界面 / 非真实生产数据',30,410);
}
const reasoningTexture=textSurface(1024,550,()=>{});
function paintReasoning(t){const c=reasoningTexture.ctx,w=1024,h=550;c.fillStyle='#101a29';c.fillRect(0,0,w,h);c.fillStyle='#d1bbf5';c.font='bold 40px Microsoft YaHei';c.fillText('万物可抓 / 推理过程',38,65);const p=D.demoPose('universal',t);c.fillStyle='#748ba3';c.fillRect(38,105,430,310);c.strokeStyle='#94e2c1';c.lineWidth=4;c.strokeRect(105,190,115,100);c.strokeRect(290,190,115,100);c.fillStyle='#9ad5b6';c.fillRect(133,215,58,53);c.fillStyle='#e1e3eb';c.font='23px Microsoft YaHei';c.fillText('来源框',112,330);c.fillText('目标框',298,330);c.fillStyle='#bdabdc';c.font='28px Microsoft YaHei';const steps=['目标检测 / 左侧框','姿态估计 / 夹爪对齐','抓取确认','无碰撞轨迹规划','右侧框放置','完成后图像校验'];steps.forEach((n,i)=>{c.fillStyle=i===Math.min(5,Math.floor(t/2))?'#e8dcff':'#7f8fa6';c.fillText((i+1)+'  '+n,510,145+i*55)});c.fillStyle='#8aa1ac';c.font='23px Microsoft YaHei';c.fillText('当前：'+p.action,38,480)}
const productInfoTexture=titleTexture('ZERITH MatrixPick',{sub:'多工位拣选 / 系统协同',bg:'#202435',light:true,width:640,height:500});
const historyTexture=textSurface(1200,760,(c,w,h)=>{c.fillStyle='#f1edf5';c.fillRect(0,0,w,h);c.fillStyle='#665079';c.font='bold 64px Microsoft YaHei';c.fillText('企业发展历程',65,110);['技术研发与积累','本体及模型迭代','真实场景验证','规模化应用与生态合作'].forEach((t,i)=>{const y=235+i*125;c.fillStyle='#c5b4dc';c.beginPath();c.arc(100,y-10,15,0,Math.PI*2);c.fill();c.fillRect(97,y+10,6,72);c.font='37px Microsoft YaHei';c.fillStyle='#77618b';c.fillText(t,150,y)})});
const displayFixtures=build(()=>{
 addScreen(frames.history,0,1.72,-.65,3.0,1.75,historyTexture,'company-history');
 addScreen(frames.company,0,1.72,-.65,3.0,1.75,companyTexture);
 for(let i=0;i<6;i++){const x=(i%3-1)*1.61,y=i<3?2.18:1.20;addScreen(frames.ai,x,y,-.80,1.48,.84,aiTextures[i],D.systems[i].id)}

 addScreen(frames.products,2.13,1.35,-.35,.81,.73,productInfoTexture);
 for(const [i,x] of [-1.75,-.93,-.15,.75,1.55,2.18].entries())addLabel(['Z1 人形','R1 人形','H1 轮臂','T0 夹爪','H1 系列','产品系统'][i],frames.products,x,2.16,-.25,i<3?.78:1,.16,{light:true});
 for(const [text,a] of [['企业荣誉 · 知识产权',1.57],['生态合作',3.34]]){const label=addLabel(text,{x:Math.cos(a)*6.02,z:Math.sin(a)*6.02,rot:-Math.PI/2-a},0,1.6,0,3.8,.5,{light:true});label.central=true;}
});
const shoppingBagMesh=build(()=>{box(0,0,0,.27,.018,.22,C.wood);for(const x of [-.135,.135])box(x,.125,0,.014,.25,.22,C.wood);for(const z of [-.11,.11])box(0,.125,z,.27,.25,.014,C.wood);for(const x of [-.08,.08])segment([x,.25,-.03],[x,.34,.03],.007,C.dark)});
const cardMeshNew=build(()=>{roundedBox(0,0,0,.20,.14,.010,.006,C.white);box(0,.025,.007,.15,.018,.003,C.purple)});
const gloveDisplayMesh=build(()=>{roundedBox(0,0,0,.15,.045,.17,.022,[.23,.25,.29]);for(let i=0;i<4;i++){roundedBox(-.055+i*.037,0,.13,.028,.037,.15,.013,[.23,.25,.29]);cyl(-.055+i*.037,.025,.045,.012,.012,C.metal,16)}roundedBox(.10,0,.02,.07,.035,.035,.014,[.23,.25,.29]);for(const x of [-.06,.06])box(x,.025,-.04,.012,.006,.06,C.purple)});
const stereoCameraMesh=build(()=>{roundedBox(0,0,0,.32,.065,.065,.013,C.dark);for(const x of [-.13,.13]){cyl(x,0,0,.037,.065,C.metal,24);sphere(x,0,.041,.026,.026,.008,[.08,.22,.29])}});
const lidarDisplayMesh=build(()=>{cyl(0,0,0,.075,.075,C.dark,32);cyl(0,.045,0,.065,.020,C.metal,32);cyl(0,.058,0,.052,.010,[.29,.34,.18],24)});
const clothMesh=build(()=>roundedBox(0,0,0,.21,.025,.16,.035,[.41,.62,.65]));
const cushionMesh=build(()=>roundedBox(0,0,0,.40,.20,.37,.08,[.66,.56,.72]));
const boltMesh=build(()=>{cyl(0,0,0,.027,.13,C.metal,16);cyl(0,.074,0,.052,.022,C.metal,6)});boltMesh.finish=.8;
const nutMesh=build(()=>{cyl(0,0,0,.056,.037,C.metal,6);cyl(0,.020,0,.023,.003,C.dark,24)});nutMesh.finish=.8;
const objectMesh=build(()=>roundedBox(0,0,0,.18,.18,.15,.025,color.sand));
const cupMeshNew=build(()=>{cyl(0,.10,0,.095,.20,C.white,32,.12);cyl(0,.202,0,.103,.004,[.22,.12,.06])});
const lidMeshNew=build(()=>{cyl(0,0,0,.125,.025,C.cream);cyl(0,.015,0,.105,.015,C.white)});
const coffeeStreamMesh=build(()=>cyl(0,0,0,.008,.12,[.25,.14,.065]));
const tapeMesh=build(()=>box(0,0,0,.055,.008,.53,C.cream));
const flapMesh=build(()=>box(0,0,0,.31,.015,.53,C.wood));
const armBaseNew=build(()=>{cyl(0,.03,0,.12,.06,C.dark);cyl(0,.14,0,.08,.22,C.white)});
const shellComponent=build(()=>shell(0,0,[[0,.10,.065],[.05,.13,.08],[.25,.19,.11],[.40,.21,.12],[.45,.12,.07]],silver));
const headComponent=build(()=>sphere(0,0,0,.12,.15,.10,black));
const boardComponent=build(()=>{roundedBox(0,0,0,.20,.28,.025,.008,[.10,.22,.22]);for(const x of [-.06,0,.06])for(const y of [-.08,.0,.08])box(x,y,.021,.032,.038,.018,C.dark);for(const y of [-.10,.10])box(0,y,.023,.16,.014,.008,C.metal)});
const jointComponent=build(()=>{cyl(0,0,0,.065,.12,C.dark,48);cyl(0,.065,0,.058,.012,C.metal,48)});
const humanoidMesh=build(()=>{
 for(const side of [-1,1]){roundedBox(side*.13,.045,.035,.18,.09,.29,.035,black);segment([side*.13,.12,0],[side*.13,.51,0],.055,silver);sphere(side*.13,.53,0,.066,.068,.062,black);segment([side*.13,.55,0],[side*.14,.91,0],.073,silver);sphere(side*.14,.94,0,.085,.075,.07,black);sphere(side*.27,1.35,0,.065,.07,.06,silver);segment([side*.27,1.33,0],[side*.33,1.10,.02],.05,silver);sphere(side*.33,1.08,.02,.055,.055,.05,black);segment([side*.33,1.06,.02],[side*.32,.84,.08],.042,silver);roundedBox(side*.32,.81,.08,.09,.12,.09,.022,black)}
 shell(0,0,[[.93,.17,.085],[1.02,.16,.095],[1.25,.23,.12],[1.37,.20,.11],[1.40,.12,.07]],silver);sphere(0,1.56,.015,.105,.14,.08,black);roundedBox(0,1.29,.12,.28,.11,.016,.025,black)
});humanoidMesh.finish=.8;
const explodedLabelMesh=build(()=>{
 atFrame(frames.components,()=>{roundedBox(0,.10,0,3.8,.2,1.12,.055,C.white);for(const side of [-1,1]){for(let j=0;j<3;j++){const x=side*1.42,y=1.05+j*.57;segment([side*.72,y,0],[x,y,-.10],.006,C.lilac);}}});
 for(const [text,x,y] of [['双目 / 深度相机',-1.34,2.72],['MID360 激光雷达',-1.34,2.16],['关节 / EtherCAT',-1.34,1.55],['电源管理模块',1.34,2.72],['高速通信 / 用户接口',1.34,2.16],['视觉力控夹爪',1.34,1.10]])addLabel(text,frames.components,x,y,-.06,1.28,.16,{light:true});
});
function drawExploded(amount){const f=frames.components,e=amount;draw(shellComponent,matFrame(f,0,1.40,0));draw(headComponent,matFrame(f,0,2.12+e*.43,0));for(const side of [-1,1]){const x=side*(.29+e*.55);draw(link,mul(matFrame(f,x,.85,0),model(0,0,0,1,.55,1)));draw(joint,matFrame(f,x,1.40,0));draw(grip,matFrame(f,x,.81,0,.90));for(let j=0;j<3;j++){const sensor=side<0?(j===2?stereoCameraMesh:j===1?lidarDisplayMesh:boardComponent):boardComponent;draw(sensor,matFrame(f,side*(.66+e*.68),1.15+j*.57,-.12,j===2&&side<0?1:.75));}}draw(jointComponent,matFrame(f,0,.73,0,1.3));}
function drawProducts(){const f=frames.products;draw(humanoidMesh,matFrame(f,-1.78,.255,0,.83));draw(humanoidMesh,matFrame(f,-.94,.255,0,.90));h1(matFrame(f,-.12,.255,0,.78));draw(grip,matFrame(f,.64,.97,0,.75));draw(gloveDisplayMesh,matFrame(f,.96,.88,.03,.9));draw(grip,matFrame(f,1.30,.97,0,.75));draw(grip,matFrame(f,1.57,.97,0,.70));}
function drawTableArm(base,x,hand){draw(armBaseNew,mul(base,model(x,.83,.10)));const a=[x,1.07,.10],b=[x+.07,1.40,.31];draw(link,mul(base,linkBetween(a,b)));draw(link,mul(base,linkBetween(b,hand)));draw(joint,mul(base,model(...b)));draw(grip,mul(base,model(...hand,.8,.8,.8)))}
let lastScreenTime=-1;
function updateScreens(time){if(Math.abs(time-lastScreenTime)<.1)return;lastScreenTime=time;for(let i=0;i<6;i++){const tex=aiTextures[i];paintSystem(tex.ctx,800,440,i,time);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,tex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tex.c)}paintReasoning(time);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,reasoningTexture.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,reasoningTexture.c);gl.activeTexture(gl.TEXTURE0)}
function drawDemo(id,time){const f=frames[id],t=time,p=D.demoPose(id==='ai'?'data-platform':id,t),base=matFrame(f,p.robot[0],p.baseHeight||0,p.robot[1]);
 if(id==='multi'){drawMultiInteraction(time);return}
 if(id==='tidy'){drawRoomOperation(time);return}
 if(id==='industrial'){drawIndustrialOperation(time);return}
 if(id==='hanging'){drawHangingInteraction(time);return}
 if(id==='ai'){drawCollectionHuman(time);return}
 if(id==='warehouse'){const next=D.demoPose(id,Math.min(20,t+.04)).robot,dx=next[0]-p.robot[0],dz=next[1]-p.robot[1],heading=p.heading??(Math.hypot(dx,dz)>.001?Math.atan2(dx,dz):(t<7?-Math.PI/2:Math.PI/2)),m=mul(base,model(0,0,0,1,1,1,heading));h1(m,p.right,p.left);const first=t<6?p.right:p.left;if(p.carrying)draw(objectMesh,mul(m,model(first[0],first[1]-.15,first[2],1,1,1)));else if(t<4.5)draw(objectMesh,matFrame(f,.30,1.0,.50));if(p.secondItem)draw(objectMesh,mul(m,model(p.right[0],p.right[1]-.15,p.right[2],.8,.8,.8)));else if(t<12.5)draw(objectMesh,matFrame(f,-.30,1.0,-.50,.8));if(p.deposited){draw(objectMesh,matFrame(f,.37,.93,-4.60));draw(objectMesh,matFrame(f,.25,.93,-4.35,.8));}return}
 h1(base,p.right,p.left);
 const obj=(m,pt,s=1)=>draw(m,mul(matFrame(f),model(...pt,s,s,s)));
 if(id==='ai'||id==='universal')obj(objectMesh,p.item);
 if(id==='sorting'){obj(boltMesh,p.boltPosition);obj(nutMesh,p.nutPosition);for(let i=0;i<3;i++){obj(boltMesh,[-.25+i*.18,.90,1.12]);obj(nutMesh,[-.25+i*.18,.90,.97])}}
 if(id==='tidy'){obj(clothMesh,p.cloth);obj(cushionMesh,p.cushion)}
 if(id==='packing'){obj(objectMesh,p.item,.80);const flapY=1.115,angle=(1-p.flap)*Math.PI/2;for(const side of [-1,1]){const center=.20+side*(.31-.155*Math.cos(angle)),height=flapY+.155*Math.sin(angle),rotation=-side*angle,c=Math.cos(rotation),ss=Math.sin(rotation),rz=new Float32Array([c,ss,0,0,-ss,c,0,0,0,0,1,0,0,0,0,1]);draw(flapMesh,mul(mul(matFrame(f),model(center,height,.8)),rz));}if(p.sealed)obj(tapeMesh,[.20,1.13,.8])}
 if(id==='coffee'){obj(cupMeshNew,p.cup);if(p.lid)obj(lidMeshNew,[p.cup[0],p.cup[1]+.217,p.cup[2]]);if(p.stream){obj(coffeeStreamMesh,[.60,1.105,-.05])}}
 if(id==='shop'){obj(objectMesh,p.item,.7);obj(shoppingBagMesh,t<8?[1.0,.95,.38]:[p.item[0],p.item[1]-.10,p.item[2]]);}
}
function drawOpaqueScene(state){
 draw(floorMesh);for(const section of wallSections){if(state.overview&&Math.cos(section.angle)*eye[0]+Math.sin(section.angle)*eye[2]>0)continue;draw(section.mesh)}draw(architecturalMesh);draw(furnitureMesh);draw(annexMesh);draw(demoHeaders);draw(displayFixtures);draw(explodedLabelMesh);draw(mapInteractionFixtures);
 draw(centralBaseMesh);if(centralWallVisible(state))draw(centralMesh);drawCentralInstallation(state);
 draw(legacyCoffee,matFrame(frames.coffee));draw(legacyShop,matFrame(frames.shop));drawExploded(state.explosion);drawProducts();
 for(const id of ['ai',...D.demos.map(z=>z.id)])drawDemo(id,id===state.current?state.demoTime:0);
 const g=state.guide;h1(model(g.pos[0],0,g.pos[1],1,1,1,g.yaw),[.23,1.02,.35],[-.23,1.02,.35]);
 if(!shadowPass){draw(lightMesh,I(),.95);draw(corridorLighting,I(),.95);}
}
function drawSceneSurfaces(state){for(const p of screenPanels)texMesh(p.mesh,p.texture,p.mat);for(const p of labels3D){if(p.central||(!state.overview&&p.owner&&p.owner!==state.current))continue;labelSurface(p.texture,p.mat);}if(centralWallVisible(state))texMesh(centralFilm,filmTexture,I());drawCentralSurfaces(state);translucent(roomGlass)}
window.LocalScene={frames,screenPanels,labels3D,drawOpaqueScene,drawSceneSurfaces,updateScreens,geometry:{brightWalls:true,curvedWorktops:true,warehouseAccess:'architectural-west-corridor',buildingAligned:true,get central(){return centralFeature},roomClosed:true,transparentRoom:true,loungeTables:0,loungeChairs:0,warehouseShelfRows:3,preservedFacilities:D.preservedFacilities,sortingAssignment:{left:'bolt',right:'nut'}},gl};


