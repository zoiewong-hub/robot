'use strict';
const skuMeshes=new Map(),rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function skuMesh(item){const key=item.kind+item.color;if(skuMeshes.has(key))return skuMeshes.get(key);const col=rgb(item.color||'#8870bb'),m=build(()=>{switch(item.kind){
 case 'car':roundedBox(0,.045,0,.23,.08,.12,.025,col);roundedBox(0,.105,-.015,.12,.06,.10,.02,[.65,.81,.87]);for(const x of [-.075,.075])for(const z of [-.065,.065])sphere(x,.025,z,.032,.032,.018,C.dark);break;
 case 'animal':sphere(0,.08,0,.10,.07,.065,col);sphere(.075,.14,.035,.05,.05,.045,col);for(const x of [-.06,.06])for(const z of [-.04,.04])cyl(x,.035,z,.018,.07,col,10);break;
 case 'figure':roundedBox(0,.095,0,.09,.10,.055,.012,col);sphere(0,.185,0,.045,.045,.043,C.sand||C.cream);for(const x of [-.035,.035])roundedBox(x,.025,0,.04,.06,.05,.008,C.metal);break;
 case 'pen':case 'ruler':roundedBox(0,.015,0,item.kind==='ruler'?.27:.23,.025,item.kind==='ruler'?.055:.022,.008,col);for(let i=0;i<6;i++)box(-.09+i*.034,.03,0,.005,.003,.024,C.white);break;
 case 'tape':case 'spool':case 'bead':cyl(0,.045,0,.065,.09,col,28);cyl(0,.092,0,.026,.004,C.dark,24);if(item.kind==='spool'){cyl(0,.007,0,.085,.014,C.white);cyl(0,.09,0,.085,.014,C.white)}break;
 case 'drink':case 'can':cyl(0,.075,0,.05,.15,col,24);cyl(0,.155,0,.034,.013,C.metal,24);break;
 case 'transparent':roundedBox(0,.035,0,.19,.035,.14,.018,[.77,.89,.91]);for(const z of [-.075,.075])roundedBox(0,.039,z,.20,.012,.008,.003,C.white);for(let i=0;i<3;i++)sphere(-.055+i*.05,.055,0,.017,.018,.017,col);break;
 case 'flower':cyl(0,.075,0,.009,.15,[.39,.56,.37],12);for(let i=0;i<6;i++)sphere(Math.cos(i)*.045,.16,Math.sin(i)*.045,.033,.018,.033,col);sphere(0,.178,0,.025,.02,.025,[.90,.71,.32]);break;
 case 'snack':roundedBox(0,.065,0,.15,.12,.075,.025,col);box(0,.13,0,.17,.012,.08,C.white);box(0,.065,.04,.075,.032,.005,C.cream);break;
 case 'cloth':case 'ribbon':for(let i=0;i<9;i++)roundedBox(-.12+i*.03,.018+Math.sin(i)*.012,0,.034,.022,item.kind==='ribbon'?.045:.17,.008,col);break;
 case 'paper':case 'card':case 'book':roundedBox(0,.012,0,.18,item.kind==='book'?.045:.012,.13,.009,item.kind==='paper'?C.white:col);for(let i=0;i<3;i++)box(0,.037,.035-i*.028,.11,.003,.005,C.white);break;
 case 'button':cyl(0,.016,0,.05,.025,col,24);for(const x of [-.015,.015])for(const z of [-.015,.015])cyl(x,.031,z,.006,.004,C.dark,10);break;
 case 'ball':sphere(0,.07,0,.07,.07,.07,col);break;
 case 'cup':cyl(0,.07,0,.07,.14,C.white,28,.085);cyl(0,.143,0,.068,.003,[.42,.28,.15]);break;
 case 'vase':cyl(0,.10,0,.06,.20,col,28,.032);for(const x of [-.03,0,.03])segment([0,.18,0],[x,.34,.015],.004,[.40,.58,.39]);sphere(0,.34,0,.055,.045,.05,[.88,.71,.72]);break;
 case 'key':cyl(0,.009,0,.038,.018,C.metal,24);roundedBox(.07,.012,0,.11,.014,.023,.004,C.metal);break;
 case 'fruit':cyl(0,.012,0,.14,.024,C.white,32);for(let i=0;i<4;i++)sphere(Math.cos(i*1.8)*.065,.065,Math.sin(i*1.8)*.065,.044,.045,.044,i%2?[.83,.44,.24]:[.61,.72,.36]);break;
 case 'cushion':roundedBox(0,.08,0,.38,.16,.33,.08,col);break;
 case 'dice':roundedBox(0,.055,0,.11,.11,.11,.014,C.white);for(const x of [-.027,.027])for(const z of [-.027,.027])sphere(x,.112,z,.009,.004,.009,col);break;
 default:roundedBox(0,.055,0,.16,.11,.12,.025,col);box(0,.055,.062,.07,.036,.003,C.cream);
 }});skuMeshes.set(key,m);return m}
function drawSku(item,f){draw(skuMesh(item),matFrame(f,...item.position,item.scale||.7))}
// Every machine below uses the same T0 body and fingers, with an animated aperture.
const t0Body=build(()=>{cyl(0,.045,0,.045,.04,C.metal,24);roundedBox(0,0,0,.13,.07,.085,.018,silver);roundedBox(0,-.044,0,.14,.018,.079,.006,C.dark);roundedBox(.075,.007,0,.025,.035,.03,.006,C.metal)});
const t0Finger=build(()=>{roundedBox(0,-.075,0,.027,.065,.055,.009,silver);roundedBox(0,-.112,0,.038,.025,.06,.009,C.metal);box(-.017,-.11,.006,.005,.024,.045,C.dark)});
function drawT0(base,hand,closed){const wrist=mul(base,model(...hand));draw(t0Body,wrist);for(const side of [-1,1])draw(t0Finger,mul(wrist,model(side*(closed?.043:.071),0,0,1,1,1,side<0?Math.PI:0)))}
function operationArm(base,shoulder,hand,closed){const elbow=[(shoulder[0]+hand[0])*.5,Math.max(1.46,(shoulder[1]+hand[1])*.5+.15),Math.min(.20,hand[2]*.3)];draw(link,mul(base,linkBetween(shoulder,elbow)));draw(link,mul(base,linkBetween(elbow,hand)));for(const p of [shoulder,elbow])draw(joint,mul(base,model(...p)));drawT0(base,hand,closed)}
function drawSingleT0(base,x,hand,closed){draw(armBaseNew,mul(base,model(x,.83,.12)));operationArm(base,[x,1.07,.12],hand,closed)}
function drawH1T0(base,p){drawBody(base);for(const side of [-1,1])operationArm(base,[side*.213,1.278,.04],side===1?p.right:p.left,side===1?p.closed:false)}
function operationPitch(a){const c=Math.cos(a),sn=Math.sin(a);return new Float32Array([1,0,0,0,0,c,sn,0,0,-sn,c,0,0,0,0,1])}
const operationTextures=Array.from({length:3},()=>textSurface(900,520,()=>{}));
const tabletopTextures=Array.from({length:2},()=>textSurface(1024,900,()=>{}));
const operationScreens=[];
const tabletopScreens=tabletopTextures.map((texture,i)=>({texture,mat:mul(mul(matFrame(deviceFrame(multiDeviceOffsets[i]),0,.807,.70),operationPitch(-Math.PI/2)),model(0,0,0,2.08,1.92,1))}));
function screenTray(x,z,w,d,col){for(const side of [-1,1]){curvedBlock(x+side*w/2,.88,z,.027,.15,d,.012,0,col);curvedBlock(x,.88,z+side*d/2,w,.15,.025,.012,0,col)}}
function operationTote(x,z,col){const w=.50,d=.50;curvedBlock(x,.85,z,w,.035,d,.04,0,col);for(const side of [-1,1]){curvedBlock(x+side*w/2,.94,z,.026,.18,d,.01,0,col);curvedBlock(x,.91,z+side*d/2,w,.10,.026,.01,0,col);for(const sx of [-1,1])curvedBlock(x+sx*.18,1.005,z+side*d/2,.14,.085,.028,.012,0,col);curvedBlock(x,1.045,z+side*d/2,w,.025,.032,.012,0,col)}for(const xx of [-.21,.21])for(const zz of [-.21,.21])curvedBlock(x+xx,.95,z+zz,.035,.22,.035,.012,0,[.68,.73,.79])}
const tabletScreen=textSurface(700,430,(c,w,h)=>{c.fillStyle='#f7f5fb';c.fillRect(0,0,w,h);c.fillStyle='#65517f';c.font='bold 42px Microsoft YaHei';c.fillText('iPad · 指定即抓',35,70);for(let i=0;i<6;i++){c.fillStyle=['#d7cee8','#cde4df','#f3dcc5'][i%3];c.fillRect(35+i%3*220,110+Math.floor(i/3)*130,195,105);c.fillStyle='#675679';c.font='24px Microsoft YaHei';c.fillText(['捏捏乐','布片','透明袋','丝带','纸张','零食包'][i],55+i%3*220,170+Math.floor(i/3)*130)}});
const operationFixtures=build(()=>{
 for(let i=0;i<3;i++){const f=deviceFrame(multiDeviceOffsets[i]);atFrame(f,()=>{
  if(i<2){worktable(2.18,2.0,.80);if(i===0){screenTray(-.57,.64,.97,.70,[.64,.75,.85]);screenTray(.57,1.25,.97,.56,[.61,.78,.71])}else{screenTray(0,.63,1.82,.62,[.64,.75,.85]);for(const x of [-.45,0,.45])screenTray(x,1.36,.39,.36,[.61,.78,.71])}}
  else{const cfg=D.conveyorLayout;for(let k=0;k<96;k++){const a=k*Math.PI*2/96,b=(k+1)*Math.PI*2/96,pt=(r,t,y)=>[r*Math.sin(t),y,cfg.centerZ+r*Math.cos(t)],o=pt(cfg.radius,a,.88),n=pt(cfg.radius,b,.88),u=pt(cfg.innerRadius,a,.88),v=pt(cfg.innerRadius,b,.88);tri(o,n,u,[0,1,0],[.47,.54,.62]);tri(n,v,u,[0,1,0],[.47,.54,.62]);for(const r of [cfg.radius,cfg.innerRadius]){const p=pt(r,a,.78),q=pt(r,b,.78),rr=pt(r,a,.88),ss=pt(r,b,.88),normal=[Math.sin(a),0,Math.cos(a)];tri(p,q,rr,normal,C.metal);tri(q,ss,rr,normal,C.metal)}}
   for(let k=0;k<24;k++){const a=k*Math.PI/12;segment([.68*Math.sin(a),.886,.15+.68*Math.cos(a)],[1.12*Math.sin(a),.886,.15+1.12*Math.cos(a)],.005,[.70,.76,.81])}
   for(const x of [-.77,.77])for(const z of [-.59,.91])curvedBlock(x,.38,z,.07,.76,.07,.025,0,C.metal);curvedBlock(0,.38,.02,.93,.76,.75,.13,.02,C.white);
   for(const b of D.binDefs)operationTote(b.position[0],b.position[2],[.72,.79,.85]);

  }});

  if(i===0){addLabel('杂物栏 · 机器人侧',f,-.57,1.04,1.02,.95,.12,{bg:'#e3e9f1'});addLabel('置物区 · 观众侧',f,.57,1.04,1.58,.95,.12,{bg:'#deece5'})}
  else if(i===1){addLabel('杂物栏 · 机器人侧',f,0,1.04,.98,1.70,.13,{bg:'#e3e9f1'});addLabel('置物区 · 按指令顺序',f,0,1.04,1.60,1.70,.13,{bg:'#deece5'})}
  else for(const b of D.binDefs)addLabel(b.name+'筐',f,b.position[0],1.12,b.position[2]+.28,.56,.11,{bg:'#f4f0f8'});
 }
 for(const [i,q] of D.floorplan.decisionScreens.entries()){
  if(q.kind==='arc'){const f={id:'multi-decision-'+i,x:q.x,z:q.z,rot:-Math.PI/2-q.angle};const panel=addScreen(f,0,q.y,0,q.width,q.height,operationTextures[i],'decision-'+i);operationScreens.push({...panel,inBase:true});}
  else{const f={id:'multi',x:q.x,z:q.z,rot:Math.PI};atFrame(f,()=>curvedBlock(0,q.y,-.045,q.width+.11,q.height+.11,.075,.065,.005,C.white));operationScreens.push({texture:operationTextures[i],mat:mul(matFrame(f,0,q.y,.005),model(0,0,0,q.width,q.height,1))});}
 }
 const f=deviceFrame(0);atFrame(f,()=>{curvedBlock(1.02,.43,1.87,.11,.86,.11,.045,0,C.metal);curvedBlock(1.02,.04,1.87,.50,.08,.42,.14,0,C.white);curvedBlock(1.02,1.06,1.87,.38,.28,.055,.045,0,C.metal)});addLabel('iPad 互动端',f,1.02,1.42,1.87,.78,.13,{light:true});

 atFrame(frames.tidy,()=>{for(const x of [-2.01,-1.56])for(const z of [-1.02,-.25])roundedBox(x,.66,z,.035,1.32,.035,.012,C.metal);for(const y of [.22,.60,1.02])curvedBlock(-1.78,y,-.65,.57,.045,.93,.09,.02,C.oak);tray(1.60,.19,.18,.65,.62,[.74,.67,.80]);curvedBlock(1.60,.32,.18,.65,.16,.62,.12,.02,[.77,.70,.82]);});
 atFrame(frames.industrial,()=>{
  // Robot stands between the continuous rear wall and a level demonstration table.
  for(const x of [-1.75,1.75])curvedBlock(x,.35,.90,.12,.70,.82,.045,0,C.white);
  for(let i=0;i<5;i++){const x=-1.52+i*.76;screenTray(x,1.23,.72,.44,[.73,.78,.84])}
  // Pre-existing shallow assembly fixture, behind the audience-side material bins.
  curvedBlock(0,.82,.59,3.92,.04,.54,.07,0,[.70,.76,.80]);
  for(const z of [.32,.86])curvedBlock(0,.87,z,3.80,.06,.025,.012,0,C.metal);
  for(const x of [-1.90,-.78,.14,.93,1.90])curvedBlock(x,.87,.59,.035,.06,.48,.012,0,C.metal);
  // Headlight housing is already bolted to the fixture; only its wiring is installed last.
  curvedBlock(-1.56,.935,.59,.68,.19,.36,.07,.015,[.30,.36,.42]);
  curvedBlock(-1.235,.87,.59,.07,.06,.12,.015,0,[.19,.25,.30]);
  // A shallow car side-frame replaces the full-depth free-standing car.
  const col=[.58,.66,.72],z=-.13;
  for(const [a,b] of [[[-1.92,.83,z],[1.92,.83,z]],[[-1.92,.83,z],[-1.82,1.15,z]],[[-1.82,1.15,z],[-1.08,1.22,z]],[[-1.08,1.22,z],[-.55,1.80,z]],[[-.55,1.80,z],[.88,1.80,z]],[[.88,1.80,z],[1.45,1.20,z]],[[1.45,1.20,z],[1.92,1.12,z]],[[1.92,1.12,z],[1.92,.83,z]],[[-.08,.83,z],[-.08,1.80,z]]])segment(a,b,.035,col);
  for(const x of [-1.15,1.18]){sphere(x,.70,z,.28,.28,.035,[.36,.41,.46]);sphere(x,.70,z+.04,.16,.16,.009,C.metal)}
  for(const x of [-1.85,1.85])curvedBlock(x,1.18,-.035,.045,.70,.045,.02,0,[.91,.72,.28]);
 });
 for(let i=0;i<5;i++)addLabel(['线束盒','电池架','钣金件','盖板架','零部件盒'][i],frames.industrial,-1.52+i*.76,1.01,1.49,.65,.12,{bg:'#eef0f5'});
 addLabel('预置支架模组 · 装配区',frames.industrial,.20,1.20,.31,1.95,.13,{bg:'#eef0f5'});
 addLabel('工业长程 · 平桌装配',frames.industrial,0,2.12,-.13,3.7,.21,{light:true});

 atFrame(frames.parts,()=>{cyl(0,.47,0,1.0,.94,C.white,64);arcWall(1.01,-Math.PI,Math.PI,.92,.018,.016,C.lilac)});addLabel('关节 · 感知 · T0',frames.parts,0,2.25,-.5,3.2,.27,{light:true});
});
const metalPanel=build(()=>{roundedBox(0,0,0,.65,.045,.45,.055,[.69,.74,.78]);for(const x of [-.23,.23])roundedBox(x,.07,0,.065,.12,.42,.025,C.metal);roundedBox(0,.025,0,.26,.015,.23,.04,[.47,.54,.61])});metalPanel.finish=.86;
drawMultiInteraction=function(t){const p=D.multiPose(t);for(let i=0;i<3;i++){const f=deviceFrame(multiDeviceOffsets[i]),q=p.devices[i],base=matFrame({...f,scaleXZ:1});if(i===0)drawSingleT0(base,0,q.right.map((v,k)=>k===1?v:v*.78),q.closed);else if(i===1)drawH1T0(base,{...q,right:q.right.map((v,k)=>k===1?v:v*.78),left:q.left.map((v,k)=>k===1?v:v*.78)});else{drawSingleT0(base,-.44*.78,q.left.map((v,k)=>k===1?v:v*.78),q.closed.left);drawSingleT0(base,.44*.78,q.right.map((v,k)=>k===1?v:v*.78),q.closed.right);for(const it of D.beltItems(t))if(!(it.position[2]>.80&&Math.abs(it.position[0])<.65))drawSku(it,f);}for(const item of q.items)drawSku(item,f)}};
function drawRoomOperation(t){const p=D.roomPose(t),f=frames.tidy;drawH1T0(matFrame({...f,scaleXZ:1},p.robot[0]*.85,0,p.robot[1]*.85),{...p,right:p.right.map((v,k)=>k===1?v:v*.85),left:p.left.map((v,k)=>k===1?v:v*.85),closed:t%8>=2&&t%8<6});for(const it of p.items)drawSku(it,f)}
const automotiveParts=D.industrialSteps.map((step,i)=>build(()=>{
 const col=[[.63,.68,.74],[.77,.81,.85],[.73,.78,.82],[.34,.44,.53],[.30,.35,.40]][i];
 if(i===4){for(let k=0;k<4;k++)segment([-.16,.025,k*.023-.035],[.16,.025,k*.023-.035],.009,[.28+.1*k,.34,.40]);roundedBox(-.18,.025,0,.08,.06,.12,.012,C.metal);roundedBox(.18,.025,0,.08,.06,.12,.012,C.metal)}
 else if(i===3){roundedBox(0,0,0,.68,.12,.40,.035,col);for(let k=0;k<6;k++)roundedBox(-.27+k*.105,.07,0,.07,.025,.34,.01,C.metal);}
 else if(i===2){roundedBox(0,0,0,.56,.12,.075,.025,col);for(const x of [-.23,.23])roundedBox(x,.13,0,.05,.24,.065,.015,C.metal)}
 else{roundedBox(0,0,0,.50,i===0?.13:.035,.33,.04,col);if(i===0)for(const x of [-.18,.18])cyl(x,.11,0,.035,.10,C.metal,16);else for(const x of [-.20,.20])for(const z of [-.11,.11])cyl(x,.025,z,.015,.02,C.metal,12)}
}));
const factoryTorso=build(()=>{shell(0,0,[[1.01,.155,.085],[1.10,.18,.10],[1.32,.235,.125],[1.42,.20,.105],[1.46,.12,.065]],[.26,.29,.33]);cyl(0,1.49,0,.055,.09,C.metal,28);sphere(0,1.68,.015,.106,.14,.085,[.08,.09,.11]);sphere(0,1.69,.09,.08,.09,.02,[.025,.03,.04]);roundedBox(0,1.03,0,.32,.14,.19,.045,[.25,.28,.32])});
const headlightLensOff=build(()=>curvedBlock(-1.56,.935,.781,.55,.115,.018,.035,0,[.60,.67,.72]));
const headlightLensOn=build(()=>{curvedBlock(-1.56,.935,.783,.55,.115,.02,.035,0,[1,.96,.75]);for(let i=0;i<5;i++)curvedBlock(-1.77+i*.105,.935,.797,.068,.073,.012,.018,0,[1,1,.94])});
function drawIndustrialOperation(t){const p=D.industrialPose(t),f=frames.industrial,base=mul(matFrame(f,p.robot[0],0,p.robot[1]),model(0,0,0,1,1,1,p.yaw));draw(factoryTorso,base);for(const side of [-1,1]){const foot=[side*.14,.08,0],knee=[side*.14,.53,.02];draw(danceFoot,mul(base,model(...foot)));draw(danceLimb,mul(base,linkBetween(foot,knee)));draw(danceLimb,mul(base,linkBetween(knee,[side*.14,1.0,0])));operationArm(base,[side*.25,1.39,0],side===1?p.right:p.left,p.grasped)}for(let i=0;i<5;i++){const step=D.industrialSteps[i],pos=i<p.completed?step.target:i===p.active?p.part:step.source;draw(automotiveParts[i],matFrame(f,...pos));}draw(p.headlightOn?headlightLensOn:headlightLensOff,matFrame(f),p.lampIntensity*.95);}

function paintOperationScreen(i,t){const tex=operationTextures[i],c=tex.ctx,w=900,h=520,q=D.multiPose(t).devices[i];c.fillStyle='#f5f3f9';c.fillRect(0,0,w,h);c.fillStyle='#6e558a';c.font='bold 35px Microsoft YaHei';c.fillText(['① 泛化抓取 · 决策 UI','② 指定即抓 · 决策 UI','③ 双臂分拣 · 决策 UI'][i],30,52);c.fillStyle='#a0b5c4';c.fillRect(30,90,420,260);c.fillStyle='#e5edef';c.fillRect(45,105,390,230);for(const it of q.items.slice(0,50)){const x=240+it.position[0]*170,y=330-it.position[2]*140;c.fillStyle=it.color||'#9f8ac0';c.fillRect(x-6,y-7,13,13)}c.strokeStyle='#8771a6';c.lineWidth=3;c.strokeRect(60+Math.sin(t*.3)*12,145,145,145);c.font='22px Microsoft YaHei';c.fillStyle='#736482';c.fillText('相机 / 目标识别示意',45,382);const lines=i===0?['目标 '+D.catalog.find(x=>x.id===q.activeItem).name,'累计 '+q.completed+' / 50','成功率 '+(q.success===null?'—':q.success+'%'),'抓取近景 / 提起确认']:i===1?['iPad 选择 '+q.order.length+' 件','已完成 '+q.completed.length+' 件',q.force,'按观众指令顺序放置']:[q.shared,...D.binDefs.map(b=>b.name+' '+q.stats[b.id])];c.font='24px Microsoft YaHei';lines.forEach((v,j)=>c.fillText(v,475,120+j*58));c.fillStyle='#b3a1c7';c.fillRect(30,410,840,1);c.fillStyle='#6b577f';c.font='24px Microsoft YaHei';c.fillText(q.action.slice(0,36),30,458);c.fillStyle='#9f91ab';c.font='17px Microsoft YaHei';c.fillText('感知 → 目标选择 → 规划 → 执行 · 流程动画示意',30,500);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,tex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tex.c)}
const levelDesk=build(()=>curvedBlock(0,.755,.92,4.08,.09,1.24,.22,.025,C.white));
function drawCollectionHuman(t){const f=frames.ai,p=D.collectionPose(t),scale=f.scaleXZ||1,base=matFrame({...f,scaleXZ:1});const hands={right:p.right.map((v,k)=>k===1?v:v*scale),left:p.left.map((v,k)=>k===1?v:v*scale)};drawHumanCatcher(base,hands.right.map((v,k)=>k===1?v+.07:v),hands.left.map((v,k)=>k===1?v+.07:v));for(const h of [hands.right,hands.left]){drawT0(base,h,p.held);draw(grip,mul(base,model(h[0],h[1]+.08,h[2],.35,.35,.35)))}draw(objectMesh,matFrame(f,...p.item));}
function paintTabletop(i,t,clock){const tex=tabletopTextures[i],c=tex.ctx,w=1024,h=900,q=D.multiPose(t).devices[i],xy=p=>[(p[0]/2.08+.5)*w,(1.66-p[2])/1.92*h];
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#e4f0f0');g.addColorStop(.5,'#edf0f9');g.addColorStop(1,'#f7eadc');c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let j=0;j<14;j++){const x=(j*95+clock*45)%(w+150)-75;c.fillStyle=['#acbdda38','#b6d5ca44','#debfca33'][j%3];c.beginPath();c.arc(x,450+Math.sin(j+clock*.6)*250,90+35*Math.sin(j),0,Math.PI*2);c.fill()}
 c.strokeStyle='#ffffff99';c.lineWidth=1;for(let x=0;x<w;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}for(let y=0;y<h;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
 c.fillStyle='#6e627b';c.font='bold 26px Microsoft YaHei';c.fillText(i===0?'DENSE PICK · 泛化抓取':'TARGET PICK · 指定即抓',38,48);c.font='20px Microsoft YaHei';c.fillText('同款 T0 · 同一模型体系',38,82);
 for(const it of q.items){const [x,y]=xy(it.position);c.strokeStyle=it.id===q.activeItem?'#8d66b7':'#7d9fb1';c.lineWidth=it.id===q.activeItem?4:1.5;c.strokeRect(x-23,y-23,46,46)}
 const target=q.items.find(x=>x.id===q.activeItem);if(target){const [x,y]=xy(target.position);c.strokeStyle='#9671ba';c.lineWidth=3;c.beginPath();c.arc(x,y,39+4*Math.sin(clock*3),0,Math.PI*2);c.stroke();c.fillStyle='#6f547f';c.font='18px Microsoft YaHei';c.fillText('TARGET',x+40,y)}
 c.fillStyle='#7a6a85';c.font='19px Microsoft YaHei';c.fillText(q.action.slice(0,28),35,h-35);c.fillText('动态视觉 / 抓取流程示意',35,h-65);
 gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,tex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tex.c);
}
let lastOperationScreen=-1;const operationOpaque=LocalScene.drawOpaqueScene;LocalScene.drawOpaqueScene=function(s){operationOpaque(s);draw(operationFixtures);draw(levelDesk,matFrame(frames.industrial));const f=frames.parts;draw(jointComponent,matFrame(f,-.5,1.02,.1,1.4));draw(stereoCameraMesh,matFrame(f,0,1.06,.1));drawT0(matFrame(f,.53,1.22,.1),[0,0,0],false);if(!shadowPass&&(Math.abs(s.clock-lastOperationScreen)>.10||s.demoTime!==window.lastPaintedOperationTime)){lastOperationScreen=s.clock;window.lastPaintedOperationTime=s.demoTime;const t=s.current==='multi'?s.demoTime:0;for(let i=0;i<3;i++)paintOperationScreen(i,t);for(let i=0;i<2;i++)paintTabletop(i,t,s.current==='multi'?s.clock:0)}};
const operationSurfaces=LocalScene.drawSceneSurfaces;LocalScene.drawSceneSurfaces=function(s){for(const p of [...operationScreens,...tabletopScreens])if(!p.inBase)flatSurface(p.texture,p.mat);flatSurface(tabletScreen,mul(matFrame(deviceFrame(0)),model(1.02,1.06,1.904,.34,.24,1)));operationSurfaces(s)};
Object.assign(LocalScene.geometry,{threeDeviceTypes:['single-arm','h1','dual-arm'],sharedGripper:'T0',denseSKU:50,classificationBins:4,collectorActor:'human',tabletopScreens:2,decisionScreens:3,continuousBackdrop:true,coffeeBar:false,conveyor:D.conveyorLayout,industrial:D.industrialLayout,tabletInteraction:true,roomDrag:true,industrialLongTask:true,metric:D.metric,sortingAssignment:{mode:'dynamic',categories:D.binDefs.map(x=>x.id)}});
