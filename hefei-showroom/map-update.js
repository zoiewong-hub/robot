(function(root){'use strict';
const d=root.ShowroomData||(typeof require!=='undefined'?require('./scene-data.js'):null),priorPose=d.demoPose;
const stations={company:[-1.02,12.35],products:[-.54,12.1],components:[-.04,12.15],ai:[.46,12.1],algorithm:[.91,12.1],multi:[1.56,12.15],hanging:[2.16,11.85],coffee:[2.70,11.85],tidy:[3.30,11.65]};
const ids=['entrance','central','company','products','components','ai','algorithm','multi','hanging','coffee','tidy','shop','warehouse'];
const existing=d.zones;d.zones=ids.map(id=>existing.find(z=>z.id===id)||{id,group:id==='algorithm'?'ai':'api',steps:[]});
d.zones.push(...existing.filter(z=>z.group==='support'));
for(const [id,[angle,r]] of Object.entries(stations)){const z=d.zones.find(z=>z.id===id);z.p=[Math.cos(angle)*r,Math.sin(angle)*r];z.angle=angle;}
function update(id,name,narration,steps){Object.assign(d.zones.find(z=>z.id===id),{name,narration,steps})}
update('entrance','入口 · H1 导览','欢迎来到零次方合肥展厅。请跟随 H1，从企业概况开始，依次参观硬件协同、AI 基建、抓取放置 API、原子能力与场景作业。中央环墙外侧展示企业荣誉及生态合作。',['机器人迎宾','介绍新版参观路线','出发参观']);
update('products','硬件协同 · 产品陈列','企业介绍之后首先展示产品线：初代人形、二代人形、H1 轮臂、G0 夹爪与手套、末端夹爪及 MatrixPick。随后进入核心零部件爆炸展示，了解整机系统协同。',['人形机器人','H1 轮臂','夹爪与手套','MatrixPick']);
update('components','硬件协同 · 核心零部件','产品陈列之后，通过爆炸装置查看头部、机身、双臂、夹爪、关节和电子模块。拖动展开滑杆，可以观察整机与部件之间的关系。',['整机展开','查看感知与电子模块','查看关节与夹爪']);
update('ai','AI 基建 · 数据驾驶舱','数据驾驶舱保留六块独立系统屏：UMI 采集、数据平台、标注清洗、数据湖、数据回流与部署系统。选择数据平台，屏幕与桌面抓放操作同步演示。',['创建采集任务','扫描并定位目标','执行桌面抓取','搬运至目标框','放置并校验','数据上传与入库']);
update('algorithm','AI 基建 · 算法展示与系统协同','这里通过一块大屏展示 ZERITH V2 模型与 agent 的整体架构。双目感知、时空编码与记忆模块、认知网络和行为网络串联起从任务理解到实时动作的链路。可打开原图放大阅读。',['双目感知与时空编码','时空记忆模块','认知网络与规划','行为网络与实时动作']);
update('multi','一脑多形 · 三设备协同','三台设备使用统一任务表达。设备一从左框抓取万物并放到右框；设备二处理柔软布料、易碎玻璃杯和异形物，您可以指定抓取顺序；设备三用左臂分拣螺栓、右臂分拣螺母。',['统一任务指令','设备一：万物可抓','设备二：困难物抓取','设备三：双臂工业分拣','完成协同作业']);
update('hanging','悬挂棒互动','环形架上垂挂多根互动棒。机器人观察悬挂棒的位置，依次伸手触碰目标，带动棒体摆动，再收手并转向下一根。动作展示手眼协调和对动态目标的响应。',['识别目标悬挂棒','伸手接近','触棒互动','收手与回摆','切换下一根']);
update('coffee','原子能力 · 咖啡吧','原子能力的第一站是咖啡吧。机器人完成取杯、接咖啡、盖杯盖并递给观众，展示服务流程中的连续操作。',['取咖啡杯','咖啡机接咖啡','盖上杯盖','递给观众']);
update('tidy','原子能力 · 房间整理','原子能力的第二站是房间整理。机器人在封闭透明房间内擦桌、放回清洁布并整理沙发靠垫，观众可以从环廊观察完整过程。',['扫描房间','拿起清洁布','擦拭桌面','收回清洁布','抓取沙发靠垫','沙发靠垫归位','检查整理结果']);
d.route=ids;d.demos=d.zones.filter(z=>['api','agent','scenario'].includes(z.group));
d.signs=[{text:'企业概况',major:true,angle:-1.02},{text:'硬件协同',major:true,angle:-.30},{text:'AI 基建',major:true,angle:.68},{text:'具身技术',major:true,angle:2.23},{text:'抓取放置 API',angle:1.88},{text:'原子能力 + 物理 agent',angle:3.03},{text:'场景作业',angle:4.18}];
let order=['soft','fragile','irregular'];const itemNames={soft:'柔软布料',fragile:'易碎玻璃杯',irregular:'异形物品'};
function setGraspOrder(next){if(!Array.isArray(next)||next.length!==3||new Set(next).size!==3||next.some(x=>!Object.hasOwn(itemNames,x)))throw new Error('请选择三种不同物品');order=next.slice();return order.slice()}
function difficultPose(t){const cycle=Math.min(2,Math.floor(Math.max(0,t)/6)),u=Math.min(6,Math.max(0,t)-cycle*6),activeItem=order[cycle],startPositions={soft:[-.6,.88,.56],fragile:[-.6,.88,.84],irregular:[-.6,.88,1.12]},endPositions={soft:[.6,.88,.56],fragile:[.6,.88,.84],irregular:[.6,.88,1.12]},a=startPositions[activeItem],b=endPositions[activeItem];
 const active=d.path([[0,a],[1,a],[2,[a[0],1.19,a[2]]],[3.5,[b[0],1.19,b[2]]],[4.5,b],[6,b]],u),right=d.path([[0,[.24,1.02,.34]],[1,[a[0],1.03,a[2]]],[2,[a[0],1.34,a[2]]],[3.5,[b[0],1.34,b[2]]],[4.5,[b[0],1.03,b[2]]],[6,[.24,1.02,.34]]],u);
 const items=order.map((kind,i)=>({kind,position:i<cycle?endPositions[kind].slice():i===cycle?active:startPositions[kind].slice()}));
 return{robot:[0,0],right,left:[-.24,1.02,.34],activeItem,items,grasp:'柔顺力控 / 接触确认',action:'设备二：'+itemNames[activeItem]+' · '+(u<1?'定位':u<2?'柔顺抓取':u<3.5?'低速搬运':u<4.5?'轻放':'松夹回位')};
}
function multiPose(t){const devices=[priorPose('universal',Math.min(12,t)),difficultPose(t),priorPose('sorting',Math.min(12,t))];return{id:'multi',robot:[0,0],devices,order:order.slice(),action:devices[1].action+'；设备一左右框抓放；设备三左螺栓 / 右螺母'};}
let dropPlan=[];
function resetDropRound(seed=Date.now()){let n=Number(seed)>>>0;const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};dropPlan=Array.from({length:6},()=>({bar:Math.floor(random()*8),release:.80+random()*.35}));return dropPlan.map(x=>({...x}))}
resetDropRound();
function hangingPose(t){t=Math.max(0,Math.min(11.999,t));const cycle=Math.floor(t/4),u=t%4;
 const rigs=['robot','human'].map((actor,rigIndex)=>{const plan=dropPlan[cycle+rigIndex*3],elapsed=u-plan.release,activeBar=plan.bar,caught=elapsed>=.36,fall=Math.min(.63504,Math.max(0,elapsed)**2*4.9),phase=elapsed<0?'waiting':caught?'caught':'falling';
  const bars=Array.from({length:8},(_,i)=>{const x=-.70+i*.20,anchor=[x,2.65,.65+Math.sqrt(Math.max(0,1-(x/.82)**2))*.22];return{anchor,tip:[x,1.75-(i===activeBar?fall:0),anchor[2]],released:i===activeBar&&elapsed>=0}});
  const bar=bars[activeBar],catchPoint=[bar.tip[0],1.75-.63504+.28,bar.tip[2]],idle=[.25,1.03,.28],right=elapsed<0?idle:elapsed<.36?d.path([[0,idle],[.36,catchPoint]],elapsed):catchPoint;
  return{actor,offset:rigIndex===0?-1.47:1.47,scale:.84,activeBar,bars,phase,right,left:[-.32,1.03,.30],contact:caught};
 });
 return{id:'hanging',robot:[0,0],rigs,...rigs[0],action:rigs[0].phase==='waiting'?'等待随机释放蓝色棒体':rigs[0].phase==='falling'?'蓝棒自由落下 · 机器人追踪拦截':'机器人精准接棒 · 观众装置同步体验'};
}
d.demoPose=function(id,t){return id==='multi'?multiPose(t):id==='hanging'?hangingPose(t):priorPose(id,t)};
Object.assign(d,{stations,itemNames,setGraspOrder,getGraspOrder:()=>order.slice(),multiPose,hangingPose,resetDropRound});
update('hanging','悬挂棒互动 · 人机接棒','此处并列设置两套随机落棒装置。左侧由机器人追踪蓝棒下落并精准接住；右侧为观众互动体验位，由人类示意角色接棒。每轮随机选择棒体与释放时刻，展示反应速度与动态抓取。',['等待随机落棒','蓝棒自由下落','追踪拦截','精准接棒','观众互动体验']);
const previous=d.guideWaypoint;d.guideWaypoint=id=>{const z=d.zones.find(z=>z.id===id);if(z&&stations[id]){const a=stations[id][0];return[Math.cos(a)*8.7,Math.sin(a)*8.7]}return previous(id)};
if(typeof module!=='undefined')module.exports=d;
})(globalThis);
