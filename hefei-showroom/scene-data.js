(function(root){
'use strict';
const scale=.035,mapPoint=(x,y)=>[(x-718)*scale,(y-390)*scale];
const entry={id:'entrance',name:'入口 · H1 导览',group:'welcome',pixel:[727,76],narration:'您好，我是 H1，欢迎来到零次方合肥展厅。我将带您了解企业、数据平台、核心硬件与八个真实任务演示。请跟我沿环廊前进。',steps:['机器人迎宾','介绍参观路线','出发参观']};
const zones=[entry,
{id:'central',name:'形象展示 · 人形舞蹈',group:'welcome',pixel:[718,390],narration:'这里是中央形象展示区。弧形屏呈现品牌影片，中央机器人展示协同动作；外侧为企业荣誉、知识产权与生态合作。',steps:['观看品牌展示','观看机器人舞蹈']},
{id:'lounge',name:'休闲等候区',group:'welcome',pixel:[944,139],narration:'入口右侧是休闲等候区。圆桌、软包座椅和绿植为等候、交流与短暂休息提供舒适空间。咖啡制作演示设在后面的物理 agent 板块。',steps:['自由落座','了解参观动线']},
{id:'company',name:'企业概况',group:'company',pixel:[1034,298],narration:'零次方以本体、模型和数据构建具身智能体系。沿这面墙可以了解发展历程、核心技术、生态合作及企业荣誉。',steps:['企业概况','发展历程','生态合作']},
{id:'ai',name:'AI 基建 · 六套系统',group:'ai',pixel:[1032,457],narration:'这里的六块独立屏幕分别对应 UMI 采集、数据平台、标注清洗、数据湖、数据回流和部署系统。数据平台屏与下方操作台共用同一任务状态，您可以对照观察抓取、搬运与放置。',steps:['创建采集任务','扫描并定位目标','执行桌面抓取','搬运至目标框','放置并校验','数据上传与入库']},
{id:'components',name:'硬件展示 · 核心零部件',group:'hardware',pixel:[1043,590],narration:'第一组硬件展陈将整机按头部、机身、双臂、夹爪、关节与电子模块分解展开。标注线连接深度相机、激光雷达、电源管理、通信及用户接口，帮助您理解系统协同。',steps:['整机展开','查看感知与电子模块','查看关节与夹爪']},
{id:'products',name:'硬件展示 · 产品陈列',group:'hardware',pixel:[995,670],narration:'第二组按产品线陈列：初代人形、二代人形、H1 轮臂、G0 夹爪与手套、末端夹爪，以及 MatrixPick 产品说明。整机与末端分层展示。',steps:['人形机器人','H1轮臂','夹爪与采集手套','MatrixPick']},
{id:'universal',name:'万物可抓',group:'api',pixel:[825,710],narration:'万物可抓演示从左侧来源框识别和抓取物品，再放入右侧目标框。后方大屏逐步显示目标定位、抓取姿态、轨迹规划和放置校验，与桌面动作同步。',steps:['识别左侧物品','估计抓取姿态','左框抓取','规划搬运轨迹','右框放置','结果校验']},
{id:'multi',name:'一脑多形',group:'api',pixel:[670,731],narration:'这里沿用一脑多形演示。一台 H1 轮式双臂机器人与两台桌装机械臂使用统一的任务表达及末端接口，展示不同构型完成桌面操作。',steps:['统一任务指令','三种构型执行','分类与插装','放置完成']},
{id:'sorting',name:'双臂工业分拣',group:'api',pixel:[539,675],narration:'传送带送来螺栓与螺母。左臂只抓螺栓，放入左侧螺栓框；右臂只抓螺母，放入右侧螺母框。两臂独立分工，完成识别、抓取与分类。',steps:['传送带送料','识别螺栓与螺母','左臂抓螺栓 / 右臂抓螺母','同步搬运','分别放入对应框','完成分类']},
{id:'tidy',name:'房间整理',group:'agent',pixel:[430,575],narration:'这是一间封闭、透明的生活场景实验室。机器人先擦拭茶几，再把散落靠垫整理回沙发，最后完成物品归位。透明墙方便观察完整动作。',steps:['扫描房间','拿起清洁布','擦拭桌面','收回清洁布','抓取沙发靠垫','沙发靠垫归位','检查整理结果']},
{id:'packing',name:'机器人打包',group:'agent',pixel:[385,442],narration:'机器人在操作桌上抓取物品并装入纸箱，随后合拢箱盖，沿箱缝贴合胶带并压实，完成打包与封箱。',steps:['识别待装物品','抓取物品','装入纸箱','合拢箱盖','胶带封箱','压实并检查']},
{id:'coffee',name:'咖啡水吧',group:'agent',pixel:[405,290],narration:'咖啡水吧沿用现有服务流程。机器人取杯、对准咖啡机接取饮料、盖好杯盖，再把咖啡递到观众取用位置。',steps:['取咖啡杯','咖啡机接咖啡','盖上杯盖','递给观众']},
{id:'shop',name:'机器人小店',group:'scenario',pixel:[537,90],narration:'机器人小店保留现有移动零售舱和货架。接收订单后，机器人识别所选商品、抓取、装袋并移到交付台。',steps:['接收订单','定位货架商品','抓取商品','装袋','订单交付']},
{id:'warehouse',name:'惠宜选前置仓',group:'scenario',pixel:[105,370],narration:'惠宜选前置仓内设多排货架。机器人从门口进入货架间通道，停靠目标货位取货，绕行到另一排货架，最后返回集货交付位。',steps:['进入货架通道','前往第一货位','停靠拣货','沿横向通道换排','第二货位拣货','返回集货位','放入集货框']}
].map(z=>({...z,p:mapPoint(...z.pixel)}));
const route=zones.map(z=>z.id),demos=zones.filter(z=>['api','agent','scenario'].includes(z.group));
const systems=[{id:'umi',name:'UMI 数据采集'},{id:'platform',name:'数据平台',demo:'data-platform'},{id:'annotation',name:'标注清洗'},{id:'lake',name:'数据湖'},{id:'feedback',name:'数据回流'},{id:'deployment',name:'部署系统'}];
const signs=[{text:'企业概况',major:true,angle:-.34},{text:'AI 基建',major:true,angle:.20},{text:'硬件展示',major:true,angle:.75},{text:'具身技术',major:true,angle:1.79},{text:'抓取放置 API',group:'api',angle:1.76},{text:'原子能力 + 物理 agent',group:'agent',angle:3.04},{text:'场景作业',group:'scenario',angle:4.17}];
const preservedFacilities=['大会议室','小会议室','办公区','电梯','楼梯','卫生间','后侧走廊'];
const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t),clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*(3-2*t)};
function path(keys,t){if(t<=keys[0][0])return keys[0][1].slice();for(let i=1;i<keys.length;i++)if(t<=keys[i][0])return mix(keys[i-1][1],keys[i][1],ease((t-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));return keys.at(-1)[1].slice()}
function platformStatus(t){const phase=Math.min(5,Math.floor(Math.max(0,t)/2));return{phase,taskId:'HF-COLLECT-001',action:zones.find(z=>z.id==='ai').steps[phase],uploaded:phase===5,frames:Math.floor(clamp(t/12)*360)}}
const warehousePath=[[0,[2.60,3.6]],[2,[1.2,3.6]],[4,[1.2,.5]],[6,[1.2,.5]],[8,[1.2,-3.5]],[10,[-1.2,-3.5]],[12,[-1.2,-.5]],[14,[-1.2,-.5]],[15,[-1.2,3.6]],[16,[2.60,3.6]],[17,[1.15,4.50]],[20,[1.15,4.50]]];
function isWarehouseWalkable(p){return ![-2.4,0,2.4].some(x=>Math.abs(p[0]-x)<.58&&Math.abs(p[1])<2.98)}
function guideWaypoint(id){const z=zones.find(z=>z.id===id);if(id==='warehouse')return[-16.35,2.9];if(id==='central')return[0,-8.3];const angle=Math.atan2(z.p[1],z.p[0]);return[Math.cos(angle)*8.7,Math.sin(angle)*8.7]}
function demoPose(id,t){t=Math.max(0,t);const idleR=[.24,.96,.36],idleL=[-.24,.96,.36];let right=idleR.slice(),left=idleL.slice(),s={id,t,left,right,robot:[0,0],phase:Math.floor(t/2),action:'准备就绪'};
if(id==='universal'||id==='data-platform'){
 const item=path([[0,[-.70,.87,.82]],[2,[-.70,.87,.82]],[4,[-.70,1.07,.82]],[6,[0,1.22,.82]],[8,[.70,1.07,.82]],[10,[.70,.87,.82]],[12,[.70,.87,.82]]],t);
 left=path([[0,[-.23,1.02,.36]],[2,[-.70,1.02,.82]],[4,[-.70,1.22,.82]],[6,[0,1.37,.82]],[8,[.70,1.22,.82]],[10,[.70,1.02,.82]],[12,[-.23,1.02,.36]]],t);
 return{...s,left,item,held:t>=2&&t<10,...(id==='data-platform'?platformStatus(t):{}),action:id==='data-platform'?platformStatus(t).action:zones.find(z=>z.id==='universal').steps[Math.min(5,Math.floor(t/2))]};
}
if(id==='sorting'){
 const bolt=path([[0,[-.18,.88,.86]],[2,[-.18,.88,.86]],[4,[-.18,1.16,.86]],[6,[-.70,1.13,.70]],[8,[-.70,.93,.70]],[10,[-.70,.90,.70]]],t);
 const nut=path([[0,[.18,.88,.86]],[2,[.18,.88,.86]],[4,[.18,1.16,.86]],[6,[.70,1.13,.70]],[8,[.70,.93,.70]],[10,[.70,.90,.70]]],t);
 left=(t<2?mix(idleL,[-.18,1.03,.86],ease(t/2)):t<8?[bolt[0],bolt[1]+.15,bolt[2]]:mix([-.70,1.08,.70],idleL,ease((t-8)/2)));
 right=(t<2?mix(idleR,[.18,1.03,.86],ease(t/2)):t<8?[nut[0],nut[1]+.15,nut[2]]:mix([.70,1.08,.70],idleR,ease((t-8)/2)));
 return{...s,left,right,leftItem:'bolt',rightItem:'nut',boltPosition:bolt,nutPosition:nut,action:zones.find(z=>z.id===id).steps[Math.min(5,Math.floor(t/2))]};
}
if(id==='tidy'){
 const wiping=t<7;right=path([[0,[.24,1.0,.4]],[1,[.24,.78,.65]],[2,[-.32,.69,.78]],[3,[.32,.69,.78]],[4,[-.32,.69,.78]],[5,[.32,.69,.78]],[6,[.24,.90,.50]],[6.5,[.70,.82,.78]],[7,[.70,.68,.78]],[7.3,[.70,.68,.78]],[7.8,[.24,1.05,.5]],[8,[.68,.82,-.32]],[9,[.56,1.05,-.26]],[10,[.38,.98,-.70]],[11,[.38,.84,-.70]],[13,[.24,.96,.36]]],t);
 return{...s,right,cloth:t<7.3?[right[0],right[1]-.145,right[2]]:[.70,.535,.78],cushion:t<8?[.68,.62,-.32]:t<11?[right[0],right[1]-.13,right[2]]:[.38,.71,-.70],action:t>=6&&t<7.4?'放回清洁布':wiping?(t>=2&&t<6?'擦拭桌面':'拿取 / 收回清洁布'):'沙发靠垫归位',roomTransparent:true};
}
if(id==='packing'){
 const object=path([[0,[-.65,.90,.80]],[2,[-.65,.90,.80]],[4,[-.65,1.22,.80]],[6,[.20,1.20,.8]],[7,[.20,.92,.8]]],t);
 right=t<7?[object[0],object[1]+.15,object[2]]:path([[7,[.20,1.10,.8]],[8,[.43,1.13,.8]],[9,[.2,1.13,.8]],[10,[.2,1.13,.52]],[11,[.2,1.13,1.05]],[12,idleR]],t);
 left=t<7?idleL:path([[7,[-.4,1.10,.8]],[8,[-.08,1.13,.8]],[10,[-.08,1.13,.8]],[12,idleL]],t);
 return{...s,left,right,item:object,sealed:t>=10,flap:clamp((t-7)/2),action:zones.find(z=>z.id===id).steps[Math.min(5,Math.floor(t/2))]};
}
if(id==='warehouse'){
 const robot=path(warehousePath,Math.min(t,20));let right=[.23,1.02,.38],left=[-.23,.98,.35];
 if(t>=4&&t<=6)right=path([[4,[0,1.15,.90]],[5,[0,1.15,.90]],[6,[0,1.02,.38]]],t);
 if(t>6&&t<7)right=path([[6,[0,1.02,.38]],[7,[.23,1.02,.38]]],t);
 if(t>=5&&t<=7)left=path([[5,[-.23,.98,.35]],[6,[0,1.02,.38]],[7,[-.23,.98,.35]]],t);
 if(t>=12&&t<=14)right=path([[12,[0,1.15,.90]],[13,[0,1.15,.90]],[14,[.23,1.02,.38]]],t);
 if(t>=17){left=path([[17,[-.23,.98,.35]],[18,[-.10,1.20,.78]],[19,[-.10,1.08,.78]],[20,[-.23,.98,.35]]],t);right=path([[17,[.23,1.02,.38]],[18,[.15,1.20,.90]],[19,[.15,1.08,.90]],[20,[.23,1.02,.38]]],t);}
 return{...s,robot,left,right,heading:t>=17?-Math.PI/2:null,carrying:t>=4.5&&t<19,secondItem:t>=12.5&&t<19,deposited:t>=19,action:zones.find(z=>z.id===id).steps[Math.min(6,Math.floor(t/2.8))]};
}
if(id==='coffee'){
 const cup=path([[0,[-.85,.81,-.08]],[1.1,[-.85,.81,-.08]],[2.4,[-.60,1.02,.06]],[3.6,[.60,1.02,-.05]],[4.1,[.60,.845,-.05]],[5.9,[.60,.845,-.05]],[6.6,[-.15,.98,-.15]],[7.8,[-.15,.98,-.15]],[8.5,[-1.85,1.15,-.10]],[9.6,[-1.95,1.02,.48]]],t);
 const x=path([[0,[-1.07]],[1.1,[-1.07]],[2.4,[-.82]],[3.6,[.38]],[5.9,[.38]],[6.6,[-.37]],[7.8,[-.37]],[8.8,[-2.14]],[9.6,[-2.14]]],t)[0],z=t<8.8?-.99:path([[8.8,[-.99]],[9.6,[-.10]]],t)[0];
 return{...s,robot:[x,z],right:[cup[0]-x,cup[1]+.12,cup[2]-z],left:idleL,cup,lid:t>=7.8,stream:t>4.1&&t<5.9,action:zones.find(z=>z.id===id).steps[Math.min(3,Math.floor(t/2.4))]};
}
if(id==='shop'){
 const robot=path([[0,[1.20,-.85]],[5,[1.20,-.85]],[7,[1.20,-.45]],[9,[1.20,-.10]],[12,[1.20,-.10]]],t),item=path([[0,[.44,1.15,-1.25]],[3,[.44,1.15,-1.25]],[4,[.44,1.38,-1.25]],[6,[1.0,1.35,.0]],[8,[1.0,1.10,.38]],[10,[1.0,1.10,.45]],[12,[1.0,1.10,.45]]],t);
 left=t<10?[item[0]-robot[0],item[1]-.40+.15,item[2]-robot[1]]:path([[10,[-.20,.85,.55]],[12,[-.23,.96,.36]]],t);
 return{...s,robot,baseHeight:.40,left,right:idleR,item,bagged:t>=8,action:zones.find(z=>z.id===id).steps[Math.min(4,Math.floor(t/2.4))]};
}
if(id==='multi'){right=path([[0,[-.18,1.07,.48]],[2,[-.18,.98,.48]],[5,[0,1.19,.52]],[8,[.18,.98,.65]],[10,[.18,.98,.65]],[12,[.20,1.09,.45]]],t);const held=t>=2&&t<9,base=held?[right[0],right[1]-.12,right[2]]:t<2?[-.18,.86,.48]:[.18,.86,.65];return{...s,right,items:[{kind:'part',position:[base[0],base[1],base[2]+.34]},{kind:'cube',position:base.slice()},{kind:'card',position:base.slice()}],action:zones.find(z=>z.id===id).steps[Math.min(3,Math.floor(t/3))]}}
return s;
}
const data={scale,mapPoint,zones,route,demos,systems,signs,preservedFacilities,demoPose,platformStatus,path,guideWaypoint,isWarehouseWalkable};
if(typeof module!=='undefined')module.exports=data;root.ShowroomData=data;
})(globalThis);
