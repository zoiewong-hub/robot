'use strict';
const multiDeviceOffsets=[-2.28,0,2.28];
function deviceFrame(offset){const f=frames.multi,p=pointFrame(f,offset,0,0);return{id:'multi',x:p[0],z:p[2],rot:f.rot}}
const algorithmTexture=textSurface(1600,1024,(c,w,h)=>{c.fillStyle='#f1edf6';c.fillRect(0,0,w,h)});
const algorithmImageSource=new Image();algorithmImageSource.onload=()=>{const c=algorithmTexture.ctx;c.fillStyle='#f1edf6';c.fillRect(0,0,1600,1024);const ratio=Math.min(720/algorithmImageSource.width,984/algorithmImageSource.height),w=algorithmImageSource.width*ratio,h=algorithmImageSource.height*ratio;c.drawImage(algorithmImageSource,40+(720-w)/2,20+(984-h)/2,w,h);c.fillStyle='#665079';c.font='bold 62px Microsoft YaHei';c.fillText('ZERITH V2',820,145);c.font='36px Microsoft YaHei';c.fillText('agent × 模型',820,220);c.fillText('算法展示 · 系统协同',820,280);const rows=[['01','双目感知 / 时空编码'],['02','时空记忆与特征融合'],['03','认知推理 / 任务规划'],['04','神经动力学引擎'],['05','行为网络 / 实时动作']];rows.forEach(([n,text],i)=>{const y=405+i*104;c.fillStyle='#d9cee9';c.fillRect(820,y-38,690,72);c.fillStyle='#6b5286';c.font='30px Microsoft YaHei';c.fillText(n+'   '+text,845,y+8)});c.fillStyle='#8c7b9a';c.font='27px Microsoft YaHei';c.fillText('原始系统架构图 · 可在导览卡放大',820,970);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,algorithmTexture.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,algorithmTexture.c);window.sceneDirty=true};algorithmImageSource.src='assets/algorithm.webp';
const mapInteractionFixtures=build(()=>{
 for(const [i,x] of multiDeviceOffsets.entries()){const f=deviceFrame(x);atFrame(f,()=>{worktable(2.12,1.25,.80);if(i<2){tray(-.61,.84,.82,.68,.94,color.blue);tray(.61,.84,.82,.68,.94,color.mint)}else{tray(-.72,.84,.65,.52,.58,color.blue);tray(.72,.84,.65,.52,.58,color.mint);roundedBox(0,.84,1.03,.85,.08,.32,.035,[.48,.49,.54]);for(let j=0;j<11;j++)cyl(-.37+j*.074,.89,1.03,.018,.30,C.metal,12)}});
  addLabel(['设备一 · 万物可抓','设备二 · 困难物品 / 顺序可选','设备三 · 双臂工业分拣'][i],f,0,2.13,-.35,2.12,.28,{light:true});
  if(i<2){addLabel('左框 · 来源',f,-.61,1.02,1.31,.66,.14,{bg:'#e3e9f1'});addLabel('右框 · 轻放',f,.61,1.02,1.31,.66,.14,{bg:'#deece5'})}
  else{addLabel('左臂 · 螺栓',f,-.72,1.04,.97,.7,.14,{bg:'#e3e9f1'});addLabel('右臂 · 螺母',f,.72,1.04,.97,.7,.14,{bg:'#deece5'})}
 }
 for(const [i,offset] of [-1.47,1.47].entries()){const base=pointFrame(frames.hanging,offset,0,0),f={id:'hanging',x:base[0],z:base[2],rot:frames.hanging.rot};atFrame(f,()=>{cyl(0,.06,.08,1.20,.12,[.89,.87,.94],72);arcWall(1.18,-Math.PI,0,2.35,.15,.09,[.73,.68,.81]);arcWall(1.18,0,Math.PI,2.35,.15,.09,[.73,.68,.81]);for(const x of [-1.18,1.18])curvedBlock(x,1.22,0,.11,2.44,.13,.05,0,[.72,.70,.77]);for(let k=0;k<8;k++){const x=(-.70+k*.20)*.84,z=(.65+Math.sqrt(Math.max(0,1-((-.70+k*.20)/.82)**2))*.22)*.84;segment([x,2.36,z],[x,2.346,z],.014,C.metal)}});addLabel(i===0?'机器人 · 精准接棒':'观众体验 · 反应挑战',f,0,2.65,-.15,2.65,.24,{light:true});}

 addScreen(frames.algorithm,0,1.80,-.65,3.8,2.97,algorithmTexture,'zerith-v2');
 atFrame(frames.algorithm,()=>curvedBlock(0,.13,-.55,3.95,.26,.85,.25,.08,C.white));
});
const softDifficultMesh=build(()=>{for(let i=0;i<12;i++){const x=-.14+i*.025;roundedBox(x,.025+Math.sin(i*.8)*.015,0,.032,.04,.22,.014,[.59,.51,.72])}});
const fragileDifficultMesh=build(()=>{cyl(0,.06,0,.066,.12,[.76,.88,.93],32,.082);cyl(0,.124,0,.083,.012,[.93,.97,.98],32);cyl(0,.131,0,.066,.004,[.58,.74,.80],32)});
const irregularDifficultMesh=build(()=>{sphere(0,.055,0,.10,.065,.075,[.68,.77,.58]);sphere(.085,.04,.015,.067,.05,.055,[.68,.77,.58]);sphere(-.06,.10,-.03,.046,.07,.05,[.68,.77,.58])});
const hangingBarMesh=build(()=>{cyl(0,.5,0,.027,1,[.48,.58,.76],20);sphere(0,0,0,.034,.035,.034,[.64,.73,.90])});
function drawMultiInteraction(t){const p=D.multiPose(t);
 for(let i=0;i<3;i++){const f=deviceFrame(multiDeviceOffsets[i]),q=p.devices[i];if(i===1){drawTableArm(matFrame(f),0,q.right);for(const item of q.items){const m={soft:softDifficultMesh,fragile:fragileDifficultMesh,irregular:irregularDifficultMesh}[item.kind];draw(m,matFrame(f,...item.position));}}
  else{h1(matFrame(f),q.right,q.left);if(i===0)draw(objectMesh,matFrame(f,...q.item));else{draw(boltMesh,matFrame(f,...q.boltPosition));draw(nutMesh,matFrame(f,...q.nutPosition));for(let j=0;j<3;j++){draw(boltMesh,matFrame(f,-.25+j*.18,.91,1.08));draw(nutMesh,matFrame(f,-.25+j*.18,.91,.99))}}}
 }
}
const humanHead=build(()=>{sphere(0,1.65,0,.105,.135,.10,[.80,.63,.50]);sphere(0,1.73,-.015,.109,.072,.10,[.22,.19,.20]);sphere(-.035,1.67,.09,.009,.009,.004,[.16,.15,.17]);sphere(.035,1.67,.09,.009,.009,.004,[.16,.15,.17])});
const humanBody=build(()=>{shell(0,0,[[.83,.15,.10],[1.02,.18,.11],[1.34,.23,.12],[1.43,.18,.10]],[.50,.53,.69]);for(const side of [-1,1]){segment([side*.11,.87,0],[side*.14,.47,0],.075,[.33,.34,.44]);segment([side*.14,.47,0],[side*.16,.10,0],.062,[.33,.34,.44]);roundedBox(side*.16,.06,.055,.16,.12,.28,.045,[.88,.87,.84])}});
const humanUpperArm=build(()=>cyl(0,.5,0,.058,1,[.50,.53,.69],20)),humanForearm=build(()=>cyl(0,.5,0,.046,1,[.80,.63,.50],20)),humanPalm=build(()=>sphere(0,0,0,.05,.065,.035,[.80,.63,.50]));
function drawHumanCatcher(base,right,left){draw(humanBody,base);draw(humanHead,base);for(const [side,hand] of [[1,right],[-1,left]]){const shoulder=[side*.23,1.36,0],elbow=[side*.34,1.17,Math.max(.1,hand[2]*.5)];draw(humanUpperArm,mul(base,linkBetween(shoulder,elbow)));draw(humanForearm,mul(base,linkBetween(elbow,hand)));draw(humanPalm,mul(base,model(...hand)))}}
function drawHangingInteraction(t){const f=frames.hanging,p=D.hangingPose(t);for(const rig of p.rigs){const base=mul(matFrame(f,rig.offset,.12,0),model(0,0,0,rig.scale,rig.scale,rig.scale));if(rig.actor==='robot')h1(base,rig.right,rig.left);else drawHumanCatcher(base,rig.right,rig.left);for(const bar of rig.bars){const top=[bar.tip[0],bar.tip[1]+.9,bar.tip[2]];draw(hangingBarMesh,mul(base,linkBetween(bar.tip,top)))}}}


