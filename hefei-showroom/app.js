/* Self-contained WebGL showroom. No CDN, build tool, or network dependency. */
'use strict';
const $=s=>document.querySelector(s),canvas=$('#scene');
const zones=[
{name:'俯视概览',en:'THE COMPLETE SPACE',title:'一座展厅，完整的智能闭环',desc:'沿推荐动线，从入口、饮品服务与企业概况出发，依次探索 AI 基建、硬件平台和三大应用场景。拖动自由旋转，滚轮缩放；点击展区标注进入近景。',p:[0,0],steps:[]},
{name:'入口迎宾',en:'01 / WELCOME',title:'从这里，进入具身世界',desc:'穿过零次方品牌入口，沿紫色动线进入展厅。空间以暖白墙面、石材地面、浅木与金属构成，连接技术展示和真实应用。',p:[-10,9],steps:['进入品牌门厅','了解参观动线','前往休闲区']},
{name:'休闲区',en:'02 / ROBOT HOSPITALITY',title:'你的第一杯，来自机器人',desc:'机器人接收饮品指令，识别杯具与设备，完成取杯、摆杯、注水或启动咖啡机，并把饮品送到吧台交付区。',p:[-10,4.6],steps:['接收饮品指令','识别并抓取杯具','摆杯与设备交互','注水 / 制作饮品','移动至取用位置']},
{name:'企业概况区',en:'03 / ABOUT ZERITH',title:'本体 × 模型 × 数据',desc:'零次方聚焦通用具身智能机器人的研发与应用，以本体、模型、数据三位一体，探索长序列任务、跨场景泛化与真实环境中的持续操作。',p:[-10,-3.2],steps:['本体：全身协同运动与操作','模型：Zerith-V0 认知—行为双系统','数据：全模态数据链与自增强回路']},
{name:'AI 基建区',en:'04 / THE DATA FLYWHEEL',title:'看见每一次行动背后的数据',desc:'六个演示从 UMI 采集贯穿至真机评测。右侧弧形大屏依据新地图的 AI 基建位置设置，点击下方模块，观察大屏与看板切换。动态数值均为交互示例。',p:[-.6,-.7],steps:['现场采集与轨迹记录','任务上传与质量检查','清洗、标注与数据集构建','真实场景回流与模型评测']},
{name:'硬件展示区',en:'05 / ONE BRAIN, MANY FORMS',title:'一脑多形，同一种操作语言',desc:'依照 PDF 中的演示构想，T0 夹爪适配三种不同机械臂 / 机器人构型，以统一末端执行器完成桌面抓取与放置。设备外观为建模示意。',p:[7,-6.3],steps:['统一任务指令','不同构型识别目标','T0 夹爪执行抓取','协同放置，完成任务']},
{name:'机器人小店',en:'06 / ROBOT RETAIL',title:'一张订单，一次完整交付',desc:'选择商品，体验从订单、识别、货架抓取到装袋交付的连贯零售服务。小店任务为按参观要求补充的交互演示。',p:[10,1.4],steps:['接收并核对订单','定位货架商品','抓取并核验商品','取袋、撑袋与装袋','移至交付区']},
{name:'家庭整理区',en:'07 / HOME IN ORDER',title:'让生活，回到井然有序',desc:'机器人在小房间中识别散放的玩具、书本、衣物与垃圾，依规则送回不同收纳位置，最后复查房间状态，展示移动、不同高度操作与多任务串联。',p:[2.1,5.7],steps:['扫描房间，识别散放物品','抓取玩具并放入收纳箱','将书本与衣物归位','将可处理垃圾投入垃圾桶','完成房间状态复查']},
{name:'工业分拣区',en:'08 / SORT, PACK, DELIVER',title:'从混合零件，到有序交付',desc:'传送带送来混合螺栓与螺母，机器人视觉识别位置与类型，双臂分类放入对应物料箱，再衔接取袋、装入与交付。打包衔接依据参观要求进行概念整合。',p:[10,7],steps:['传送带输送混合零件','视觉识别螺栓与螺母','双臂抓取并分类入箱','取袋、撑袋、装入商品','完成打包，移至交付位']}
];
const modules=[['UMI 数据采集','手持 UMI 夹爪采集多模态轨迹，无需机器人本体参与。','采集轨迹','现场采集'],['数采平台','管理端下发任务，DataLink APP 完成关联、上传与入库。','任务进度','数据上传'],['标注清洗','质量检查、ETL、多模态对齐、预标注与人工修正。','处理进度','质检中'],['数据湖','按项目、任务、数据类型和日期统一组织数据资产。','分区索引','数据入湖'],['数据回流','真机场景轨迹与异常事件回流，支持清洗、再训练与迭代。','回流队列','场景回流'],['评测系统','z-rio 执行多轮抓取测试，按 SKU、标签和轮次汇总结果。','评测轮次','测试执行']];
let calibratedCartBounds=null;let ringVisible=true,ringMode='auto',danceRunning=true,danceTime=0;const WALL_HEIGHT=3.6,ROBOT_SCALE=[1,1,1];
let current=0,activeModule=0,demoRunning=false,demoTime=0,stepIndex=-1,tourAuto=false,tourElapsed=0,product=0,labelsVisible=false,dragging=false,lastPointer=[0,0],moved=0,selectedRobot=-1;
const FLOOR_AREA=1000,PLAN_SCALE=0.040901249437730526;
const zoneMap={"1":[672,269],"2":[843,345],"3":[900,435],"4":[905,550],"5":[835,680],"6":[600,740],"7":[471,572],"8":[455,440]};for(const key in zoneMap){const p=zoneMap[key];zones[key].p=[(p[0]-660)*PLAN_SCALE,(p[1]-540)*PLAN_SCALE]}

zones[0].title='1000㎡ · 零次方合肥展厅';zones[0].desc='按地图外轮廓校准总面积为1000㎡（含图示附属空间）；家具及设备保持人尺度。分区尺寸仍为地图估算。';
zones[2].steps=['启动咖啡机','取杯子','在咖啡机处接取饮料','盖盖子','递给观众'];zones[2].desc='商业咖啡机、磨豆机、杯架及杯盖台组成完整服务吧台。机器人依次启动、取杯、接饮料、盖盖并递到观众取杯台。';
zones[4].steps=['采集员戴手套操作桌面物体','记录手部动作与物体轨迹','六看板同屏查看全链路','回流与评测结果展示'];zones[4].desc='一块贴合外围弧墙的曲面大屏同时呈现UMI数采、数采平台、标注清洗、数据湖、数据回流和评测六类看板；旁侧独立桌面演示手套采集。';
zones[5].steps=['三种设备共享T0夹爪','移动双臂进行零件插装','固定双臂进行分类入盒','单臂设备进行卡片入槽','三个桌面任务完成'];zones[5].desc='约5.7米弧形操作桌，后方为移动双臂、固定双臂及单臂设备。三种设备均使用T0夹爪，分别完成零件插装、分类入盒、卡片入槽。前方留出观众围观空间。';
zones[8].steps=['拣货机器人进入货架通道','定位货架目标','夹取商品','运往分拣工位','分拣机器人接货','按类别分拣','打包机器人取货','放入纸箱','封箱完成'];zones[8].desc='工业区紧接家庭区，沿左侧连续布置。三台机器人接力完成货架穿梭拣货、桌面分拣与装箱封箱。已移除后方紫色前台，会议室通过工业区后侧通道绕行到达。';

zones[4].p=PENDING_AI_POINT();function PENDING_AI_POINT(){return[(880-660)*PLAN_SCALE,(575-540)*PLAN_SCALE]}
zones[5].desc='弧形墙与连续弧形操作桌，轮式双臂机器人站在桌后，两台机械臂直接固定在桌面；三种设备均使用T0夹爪。';zones[5].steps=['统一模型与T0末端','轮式双臂零件操作','桌装机械臂分类入盒','桌装机械臂卡片入槽','三台设备同时完成任务'];
zones[8].steps=['识别待分拣物品','抓取目标零件','分类放置','交接打包工位','抓取装箱','合盖封箱','完成检查','准备交付'];zones[8].desc='工业区沿弧墙布置，展示零件分类与打包；已移除CTU/STU仓储演示。后侧通道供观众前往会议室。';

const updatedCopy=[
 ['展厅全景','1000㎡ · 零次方合肥展厅','从入口出发，探索模型、数据、本体与应用场景。',[]],
 ['入口迎宾','欢迎来到零次方','由北侧入口进入，正前方为中央弧形影厅。',['进入展厅','了解参观路线','前往休闲区']],
 ['休闲区','一杯咖啡，完整交付','机器人身高1.6m，台面高0.8m。侧置咖啡机，观众与机器人均可观察取饮过程。',['取咖啡杯','在咖啡机接咖啡','盖上盖子','递给观众']],
 ['企业简介','本体 · 模型 · 数据','零次方聚焦通用具身智能机器人的研发与应用，以本体、模型、数据三位一体的技术体系，推动机器人进入真实世界。',['机器人本体','具身操作模型','全模态数据链']],
 ['AI 基建','让每一次行动成为数据','贴墙弧形屏同时展示六类看板；采集员在屏幕旁的弧形台后演示采集手套。',['采集手套操作物体','记录动作与轨迹','同步展示六类看板','完成采集']],
 ['一脑多形','同一智能，不同形态','连续弧形实心工作台，两台机械臂直接安装于桌面，一台轮式机器人在台后操作，均配备T0夹爪。',['统一模型与T0末端','轮式机器人进行装配','桌装机械臂分类','桌装机械臂插卡','完成桌面任务']],
 ['机器人小店','从订单到交付','货架位于5×3m小车框架内部，展示商品识别、取货和交付。',['接收订单','定位商品','抓取商品','完成装袋','交付订单']],
 ['家庭场景','回到生活的自然秩序','弧形沙发、茶几与收纳柜沿墙面布置，展示家庭整理。',['识别待整理物品','抓取物品','分类收纳','归位复查','完成整理']],
 ['工业场景','识别、分拣与打包','弧形工作台承接家庭区，展示分拣与打包。后侧保留通向会议室的参观通道。',['识别待分拣物品','抓取目标','分类放置','移交打包位','装入纸箱','合盖封箱','完成检查','准备交付']]
];updatedCopy.forEach((v,i)=>Object.assign(zones[i],{name:v[0],title:v[1],desc:v[2],steps:v[3]}));
modules.forEach((m,i)=>{m[0]=['UMI 数据采集','数据平台','标注清洗','数据湖','数据回流','部署系统'][i];m[1]=['全模态动作轨迹采集','数据上传与管理','数据清洗与标注','统一数据资产','真实场景数据回流','模型部署与执行'][i];m[2]=m[0];m[3]='实时演示'});
zones.push({name:'中央圆弧区',en:'BRAND FILM & ROBOT DANCE',title:'走进圆弧影厅',desc:'观看贴合圆弧墙面的品牌内容与中央机器人舞蹈。机器人面向观众，随后前往咖啡吧台。',p:[(670-660)*PLAN_SCALE,(490-540)*PLAN_SCALE],steps:['进入圆弧影厅','观看品牌内容与机器人舞蹈','前往咖啡吧台']});
const routeOrder=[0,1,9,2,3,4,5,6,7,8];
const nav=$('#nav');routeOrder.forEach(i=>{const z=zones[i];const b=document.createElement('button');b.dataset.zone=String(i);b.className='nav-item'+(i===0?' active':'');b.innerHTML=`<span class="num">${String(i).padStart(2,'0')}</span><span class="name">${z.name}</span><span class="arrow">↗</span>`;b.onclick=()=>{tourAuto=false;selectZone(i)};nav.appendChild(b)});
const refButton=document.createElement('button');refButton.className='robot-reference-button';refButton.textContent='H1 PRO · 外形参考 ↗';refButton.setAttribute('aria-expanded','false');const refPanel=document.createElement('div');refPanel.className='robot-reference';refPanel.hidden=true;refPanel.innerHTML='<strong>H1 PRO / 用户指定机器人</strong><img src="assets/robot-reference.webp" alt="用户提供的银色 H1 PRO 机器人，黑色椭圆面罩、后置立柱、双臂夹爪与轮式底盘"><p>按产品图进行外观近似建模。银色机身、黑色面罩、立柱与移动底盘；背面细节及精确尺寸待补充。</p>';refButton.onclick=()=>{refPanel.hidden=!refPanel.hidden;refButton.setAttribute('aria-expanded',String(!refPanel.hidden))};$('.viewport').append(refButton,refPanel);
const mapButton=document.createElement('button');mapButton.id='mapView';mapButton.textContent='俯视地图';mapButton.onclick=()=>{tourAuto=false;selectZone(0);goal={target:hallCenter.slice(),yaw:0,pitch:1.565,radius:overviewRadius()};$('#viewName').textContent='按图俯视 · 上北下南'};const compareButton=document.createElement('button');compareButton.id='compareMap';compareButton.textContent='原图对照';const planPanel=document.createElement('div');planPanel.className='floorplan-reference';planPanel.hidden=true;planPanel.innerHTML='<div><strong>用户提供的展厅地图</strong><button aria-label="关闭地图">×</button></div><img src="assets/floorplan.webp" alt="展厅原始地图：中央圆形形象展示区，右侧弧形展示墙，右上吧台，右下硬件，左下小店，左侧家庭及工业区域"><p>按原图比例建模；入口以你的最新指示为准：上方进入，下方封闭。</p>';compareButton.onclick=()=>{planPanel.hidden=!planPanel.hidden};planPanel.querySelector('button').onclick=()=>planPanel.hidden=true;$('.view-tools').prepend(mapButton,compareButton);$('.viewport').append(planPanel);
const aiViewButton=document.createElement('button');aiViewButton.textContent='采集视角';aiViewButton.hidden=true;
function aiScreenView(){return{target:[hub[0]+Math.cos(.22)*(253*MAP.scale-.123),1.55,hub[1]+Math.sin(.22)*(253*MAP.scale-.123)],yaw:-Math.PI/2,pitch:.04,radius:canvas.clientWidth/canvas.clientHeight<.8?8.5:4.4}}
aiViewButton.onclick=()=>{const capture=aiViewButton.textContent==='采集视角';goal=capture?{target:[P(875,612)[0],1.05,P(875,612)[1]],yaw:-2.0,pitch:.18,radius:3.4}:aiScreenView();document.body.dataset.aiScreen=String(!capture);aiViewButton.textContent=capture?'大屏视角':'采集视角'};$('.view-tools').prepend(aiViewButton);
const industryViewButton=document.createElement('button');industryViewButton.textContent='工业说明';industryViewButton.hidden=true;industryViewButton.onclick=()=>{const showWall=industryViewButton.textContent==='工业说明';goal=showWall?{target:[P(524,238)[0],1.55,P(524,238)[1]],yaw:0,pitch:.06,radius:4.8}:{target:[zones[8].p[0],1.2,zones[8].p[1]],yaw:1.72,pitch:.70,radius:8.8};industryViewButton.textContent=showWall?'三机演示':'工业说明'};$('.view-tools').prepend(industryViewButton);
const gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:true});
if(!gl){$('#fallback').hidden=false;$('#loading').style.display='none';throw new Error('WebGL unavailable')}
const vsrc=`attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uVP;uniform mat4 uModel;uniform mat4 uLightVP;varying vec3 vN;varying vec3 vP;varying vec3 vC;varying vec4 vLight;void main(){vec4 w=uModel*vec4(aPos,1.);vP=w.xyz;vN=mat3(uModel)*aNormal;vC=aColor;vLight=uLightVP*w;gl_Position=uVP*w;}`;
const fsrc=`precision highp float;
varying vec3 vN; varying vec3 vP; varying vec3 vC; varying vec4 vLight;
uniform sampler2D uShadow; uniform sampler2D uMaterials;
uniform vec3 uEye; uniform float uGlow; uniform float uFinish;
const float PI=3.14159265;
float unpackDepth(vec4 p){return dot(p,vec4(1.,1./255.,1./65025.,1./16581375.));}
float material(vec2 uv,float band){return texture2D(uMaterials,vec2(fract(uv.x),(band+fract(uv.y))/3.)).r;}
void main(){
 vec3 n=normalize(vN),view=normalize(uEye-vP),light=normalize(vec3(-.45,1.,.6));
 vec3 base=pow(max(vC,vec3(.001)),vec3(2.2));float metal=uFinish,rough=.69;
 vec2 uv=abs(n.y)>.6?vP.xz:(abs(n.x)>.6?vP.zy:vP.xy);
 bool wood=vC.r-vC.g>.055&&vC.r-vC.g<.19&&vC.g-vC.b>.075;
 bool cloth=distance(vC,vec3(.79,.75,.65))<.045;
 if(metal<.1){
   float band=wood?0.:(cloth?2.:1.);uv*=wood?vec2(.40,.13):vec2(.95);
   float tex=material(uv,band);base*=wood?.90+tex*.18:.88+tex*.22;
   float dx=material(uv+vec2(.002,0.),band)-tex,dz=material(uv+vec2(0.,.002),band)-tex;
   n=normalize(n+vec3(dx,0.,dz)*(wood?.35:.16));rough=wood?.58:(cloth?.91:.67);
   if(vP.y<.035&&n.y>.7){vec2 f=fract(vP.xz/1.2);float gap=min(min(f.x,1.-f.x),min(f.y,1.-f.y));base*=mix(.71,1.,smoothstep(.001,.004,gap));rough=.56;}
 }else{rough=dot(vC,vec3(.333))<.12?.13:.26;}
 if(distance(vC,vec3(.89,.88,.85))<.015)rough=.24;
 vec3 sc=vLight.xyz/vLight.w*.5+.5;float shadow=0.;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){float depth=unpackDepth(texture2D(uShadow,sc.xy+vec2(float(x),float(y))*.0006));shadow+=sc.z-(.002+.003*(1.-max(dot(n,light),0.)))>depth?1.:0.;}shadow/=9.;
 vec3 halfV=normalize(light+view);float nl=max(dot(n,light),.001),nv=max(dot(n,view),.001),nh=max(dot(n,halfV),0.),vh=max(dot(view,halfV),0.);
 float a=rough*rough,a2=a*a,den=nh*nh*(a2-1.)+1.;float D=a2/max(PI*den*den,.001);float k=(rough+1.)*(rough+1.)/8.;
 float G=nv/(nv*(1.-k)+k)*nl/(nl*(1.-k)+k);vec3 f0=mix(vec3(.04),base,metal);vec3 F=f0+(1.-f0)*pow(1.-vh,5.);
 vec3 diffuse=(1.-F)*(1.-metal)*base/PI;vec3 spec=D*G*F/max(4.*nv*nl,.001);
 vec3 color=(diffuse+spec)*nl*vec3(2.15,2.06,1.94)*(1.-shadow*.82);
 color+=base*(.34+.13*n.y)*(1.-metal*.78);
 vec3 reflected=reflect(-view,n);vec3 env=mix(vec3(.10,.12,.15),vec3(.81,.84,.88),reflected.y*.5+.5);
 float strip=pow(max(0.,1.-abs(reflected.x-.27)*3.0),18.)*smoothstep(.15,.9,reflected.y);
 env+=vec3(.95,.92,.87)*strip*.9;vec3 fresnel=f0+(1.-f0)*pow(1.-nv,5.);
 color+=env*fresnel*(metal*.78+(1.-rough)*.12);
 color=mix(color,pow(vC,vec3(2.2)),uGlow);
 color=color/(vec3(1.)+color*.22);color=pow(max(color,vec3(0.)),vec3(1./2.2));
 float fog=clamp((distance(uEye,vP)-50.)/160.,0.,.10);color=mix(color,vec3(.055,.065,.10),fog);
 gl_FragColor=vec4(color,1.);
}
`;
function shader(type,s){const sh=gl.createShader(type);gl.shaderSource(sh,s);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vsrc));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fsrc));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const attrib=['aPos','aNormal','aColor'].map(n=>gl.getAttribLocation(program,n)),loc={};['uVP','uModel','uEye','uGlow','uLightVP','uShadow','uMaterials','uFinish'].forEach(n=>loc[n]=gl.getUniformLocation(program,n));
const shadowProgram=gl.createProgram();gl.attachShader(shadowProgram,shader(gl.VERTEX_SHADER,'attribute vec3 aPos;uniform mat4 uVP;uniform mat4 uModel;void main(){gl_Position=uVP*uModel*vec4(aPos,1.);}'));gl.attachShader(shadowProgram,shader(gl.FRAGMENT_SHADER,'precision highp float;void main(){vec4 p=fract(gl_FragCoord.z*vec4(1.,255.,65025.,16581375.));p-=p.yzww*vec4(1./255.,1./255.,1./255.,0.);gl_FragColor=p;}'));gl.linkProgram(shadowProgram);const sh={a:gl.getAttribLocation(shadowProgram,'aPos'),vp:gl.getUniformLocation(shadowProgram,'uVP'),m:gl.getUniformLocation(shadowProgram,'uModel')};let shadowPass=false;
const shadowTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,shadowTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2048,2048,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);const shadowFB=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,shadowFB);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,shadowTexture,0);const shadowDepth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,shadowDepth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,2048,2048);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,shadowDepth);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>{const l=Math.hypot(...a);return a.map(x=>x/l)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function lookAt(eye,target){let z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])}
function perspective(fov,asp,n,f){const q=1/Math.tan(fov/2);return new Float32Array([q/asp,0,0,0,0,q,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0])}
function model(x,y,z,sx=1,sy=1,sz=1,rot=0){const c=Math.cos(rot),s=Math.sin(rot);return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1])}
const C={white:[.96,.96,.97],wall:[.81,.83,.87],floor:[.68,.71,.76],wood:[.60,.47,.34],oak:[.74,.64,.50],purple:[.58,.41,.83],lilac:[.73,.62,.92],dark:[.15,.17,.20],metal:[.67,.70,.74],glass:[.64,.73,.74],green:[.30,.39,.25],leaf:[.39,.48,.31],cream:[.79,.75,.65],blue:[.38,.48,.60],orange:[.49,.39,.29],light:[.99,.96,.85],screen:[.075,.11,.15]};
let verts=[];
function tri(a,b,c,n,col){for(const p of [a,b,c])verts.push(...p,...n,...col)}
function box(x,y,z,w,h,d,col=C.white,rot=0){const points=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]].map(p=>[x+p[0]*w*Math.cos(rot)+p[2]*d*Math.sin(rot),y+p[1]*h,z-p[0]*w*Math.sin(rot)+p[2]*d*Math.cos(rot)]);for(const [idx,n] of [[[0,3,2,1],[0,0,-1]],[[4,5,6,7],[0,0,1]],[[0,4,7,3],[-1,0,0]],[[1,2,6,5],[1,0,0]],[[3,7,6,2],[0,1,0]],[[0,1,5,4],[0,-1,0]]]){const nn=[n[0]*Math.cos(rot)+n[2]*Math.sin(rot),n[1],-n[0]*Math.sin(rot)+n[2]*Math.cos(rot)];tri(points[idx[0]],points[idx[1]],points[idx[2]],nn,col);tri(points[idx[0]],points[idx[2]],points[idx[3]],nn,col)}}
function smoothTri(a,b,c,na,nb,nc,col){for(const [p,n] of [[a,na],[b,nb],[c,nc]])verts.push(...p,...n,...col)}
function cyl(x,y,z,r,h,col=C.white,segments=48,rTop=r){segments=segments<12?segments:Math.max(48,segments);const slope=(r-rTop)/Math.max(h,.001);for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2,p=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r],q=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r],u=[x+Math.cos(a)*rTop,y+h/2,z+Math.sin(a)*rTop],v=[x+Math.cos(b)*rTop,y+h/2,z+Math.sin(b)*rTop],na=norm([Math.cos(a),slope,Math.sin(a)]),nb=norm([Math.cos(b),slope,Math.sin(b)]);if(segments<12){const n=norm([Math.cos((a+b)/2),slope,Math.sin((a+b)/2)]);tri(p,u,q,n,col);tri(q,u,v,n,col)}else{smoothTri(p,u,q,na,na,nb,col);smoothTri(q,u,v,nb,na,nb,col)}tri([x,y+h/2,z],v,u,[0,1,0],col);tri([x,y-h/2,z],p,q,[0,-1,0],col)}}
function sphere(x,y,z,rx,ry,rz,col=C.white){const lat=16,lon=32;const p=(i,j)=>{const u=i/lon*Math.PI*2,v=j/lat*Math.PI;return[x+Math.sin(v)*Math.cos(u)*rx,y+Math.cos(v)*ry,z+Math.sin(v)*Math.sin(u)*rz]},n=q=>norm([(q[0]-x)/(rx*rx),(q[1]-y)/(ry*ry),(q[2]-z)/(rz*rz)]);for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const a=p(i,j),b=p(i+1,j),c=p(i+1,j+1),d=p(i,j+1);smoothTri(a,b,c,n(a),n(b),n(c),col);smoothTri(a,c,d,n(a),n(c),n(d),col)}}
function planPrism(points,bottom,topNavBar,col){const center=[points.reduce((s,p)=>s+p[0],0)/points.length,points.reduce((s,p)=>s+p[1],0)/points.length];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],n=norm([b[1]-a[1],0,a[0]-b[0]]);tri([center[0],topNavBar,center[1]],[a[0],topNavBar,a[1]],[b[0],topNavBar,b[1]],[0,1,0],col);tri([a[0],bottom,a[1]],[b[0],bottom,b[1]],[a[0],topNavBar,a[1]],n,col);tri([a[0],topNavBar,a[1]],[b[0],bottom,b[1]],[b[0],topNavBar,b[1]],n,col)}}
function mesh(data){const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};for(let i=0;i<data.length;i+=9)for(let j=0;j<3;j++){bounds.min[j]=Math.min(bounds.min[j],data[i+j]);bounds.max[j]=Math.max(bounds.max[j],data[i+j])}const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return{b,count:data.length/9,bounds}}
function build(fn){const old=verts;verts=[];fn();const m=mesh(verts);verts=old;return m}
function draw(m,mat=I(),glow=0){if(m.central&&!ringVisible)return;gl.bindBuffer(gl.ARRAY_BUFFER,m.b);if(shadowPass){gl.enableVertexAttribArray(sh.a);gl.vertexAttribPointer(sh.a,3,gl.FLOAT,false,36,0);gl.uniformMatrix4fv(sh.m,false,mat)}else{for(let i=0;i<3;i++){gl.enableVertexAttribArray(attrib[i]);gl.vertexAttribPointer(attrib[i],3,gl.FLOAT,false,36,i*12)}gl.uniformMatrix4fv(loc.uModel,false,mat);gl.uniform1f(loc.uGlow,glow);gl.uniform1f(loc.uFinish,m.finish||0)}gl.drawArrays(gl.TRIANGLES,0,m.count)}
function shadow(x,z,w,d){cyl(x,.012,z,1,.013,[.66,.65,.62],28); /* secondary contact is built in furniture plinths */}
function localFrame(x,z,rot,fn){const start=verts.length;fn();const c=Math.cos(rot),s=Math.sin(rot);for(let i=start;i<verts.length;i+=9){const px=verts[i],pz=verts[i+2],nx=verts[i+3],nz=verts[i+5];verts[i]=x+px*c+pz*s;verts[i+2]=z-px*s+pz*c;verts[i+3]=nx*c+nz*s;verts[i+5]=-nx*s+nz*c}}
function arcLocalCounter(cx,cz,r,a,b,h,depth,col=C.white){const n=48;for(let i=0;i<n;i++){const u=a+(b-a)*i/n,v=a+(b-a)*(i+1)/n;const points=[r-depth/2,r+depth/2].flatMap(rad=>[[cx+Math.sin(u)*rad,cz+Math.cos(u)*rad],[cx+Math.sin(v)*rad,cz+Math.cos(v)*rad]]);planPrism([points[0],points[1],points[3],points[2]],.06,h-.06,col);planPrism([points[0],points[1],points[3],points[2]],h-.06,h,C.white)}}
function roundedArcBlock(r,a,b,y0,y1,depth,col){
 const half=depth/2,v=Math.min(.025,(y1-y0)*.22),profile=[[-half+v,y0], [half-v,y0],[half,y0+v],[half,y1-v],[half-v,y1],[-half+v,y1],[-half,y1-v],[-half,y0+v]],N=Math.max(40,Math.ceil((b-a)*r*14));
 const point=(aa,p)=>[hub[0]+Math.cos(aa)*(r+p[0]),p[1],hub[1]+Math.sin(aa)*(r+p[0])];
 for(let i=0;i<N;i++){const aa=a+(b-a)*i/N,bb=a+(b-a)*(i+1)/N;for(let j=0;j<8;j++){const k=(j+1)%8,p=profile[j],q=profile[k],du=q[0]-p[0],dy=q[1]-p[1],n=norm([dy, -du,0]),nn=angle=>[n[0]*Math.cos(angle),n[1],n[0]*Math.sin(angle)];smoothTri(point(aa,p),point(bb,p),point(aa,q),nn(aa),nn(bb),nn(aa),col);smoothTri(point(bb,p),point(bb,q),point(aa,q),nn(bb),nn(bb),nn(aa),col)}}
 for(const [aa,sgn] of [[a,-1],[b,1]]){const cx=hub[0]+Math.cos(aa)*r,cz=hub[1]+Math.sin(aa)*r,levels=[[y0,half-v],[y0+v,half],[y1-v,half],[y1,half-v]],M=40;for(let i=0;i<M;i++){const u=aa+sgn*i/M*Math.PI,w=aa+sgn*(i+1)/M*Math.PI;for(let j=0;j<3;j++){const p=levels[j],q=levels[j+1],pt=(angle,lv)=>[cx+Math.cos(angle)*lv[1],lv[0],cz+Math.sin(angle)*lv[1]],normal=angle=>[Math.cos(angle),0,Math.sin(angle)];smoothTri(pt(u,p),pt(w,p),pt(u,q),normal(u),normal(w),normal(u),col);smoothTri(pt(w,p),pt(w,q),pt(u,q),normal(w),normal(w),normal(u),col)}for(const j of [0,3]){const lv=levels[j];tri([cx,lv[0],cz],[cx+Math.cos(u)*lv[1],lv[0],cz+Math.sin(u)*lv[1]],[cx+Math.cos(w)*lv[1],lv[0],cz+Math.sin(w)*lv[1]],[0,j===3?1:-1,0],col)}}}
}
function curvedCabinet(r,a,b,h=.82,depth=.85,col=C.white){roundedArcBlock(r,a,b,.06,h-.06,depth-.06,col);roundedArcBlock(r,a,b,h-.06,h,depth,C.white)}

function table(x,z,w=2,d=1.2,y=1.05){roundedBox(x,y,z,w,.065,d,Math.min(.12,w*.12,d*.12),[.67,.58,.46]);for(const dx of [-w/2+.10,w/2-.10]){for(const dz of [-d/2+.10,d/2-.10]){box(x+dx,y/2-.03,z+dz,.045,y-.06,.045,C.metal);cyl(x+dx,.015,z+dz,.035,.025,C.dark)}box(x+dx,y-.16,z,.035,.22,d-.18,C.metal)}box(x,y-.12,z-d/2+.1,w-.20,.08,.035,C.metal);cyl(x+w*.35,y+.036,z-d*.32,.028,.007,C.dark)}
function plant(x,z,s=1){cyl(x,.25*s,z,.22*s,.50*s,[.39,.38,.35],48,.28*s);cyl(x,.505*s,z,.25*s,.012,[.15,.13,.10]);for(let i=0;i<14;i++){const a=i*2.4,h=(.75+(i%5)*.09)*s,dx=Math.sin(a),dz=Math.cos(a);cyl(x+dx*.04*s,h*.5,z+dz*.04*s,.006*s,h,[.24,.27,.18],8);const origin=[x+dx*.04*s,h,z+dz*.04*s],tip=[x+dx*.42*s,h+.12*s,z+dz*.42*s],mid=[x+dx*.23*s,h+.17*s,z+dz*.23*s],l=[mid[0]+dz*.07*s,mid[1],mid[2]-dx*.07*s],r=[mid[0]-dz*.07*s,mid[1],mid[2]+dx*.07*s];tri(origin,l,tip,[0,1,0],[.23,.29,.18]);tri(origin,tip,r,[0,1,0],[.27,.32,.20]);tri(origin,tip,l,[0,-1,0],[.19,.24,.15]);tri(origin,r,tip,[0,-1,0],[.20,.25,.16]);}}
function chair(x,z,rot=0){const start=verts.length;roundedBox(0,.48,0,.8,.18,.8,.10,C.cream);roundedBox(0,.86,.32,.82,.69,.16,.07,C.cream);for(const dx of [-.29,.29])for(const dz of [-.29,.29])cyl(dx,.23,dz,.025,.47,C.wood,24);for(let i=start;i<verts.length;i+=9){const px=verts[i],pz=verts[i+2],nx=verts[i+3],nz=verts[i+5],c=Math.cos(rot),s=Math.sin(rot);verts[i]=x+px*c+pz*s;verts[i+2]=z-px*s+pz*c;verts[i+3]=nx*c+nz*s;verts[i+5]=-nx*s+nz*c}}
function bottle(x,y,z,col=C.green){cyl(x,y+.16,z,.09,.32,col,12);cyl(x,y+.35,z,.045,.09,C.white,10);cyl(x,y+.16,z,.092,.12,C.cream,12)}
function cup(x,y,z){cyl(x,y+.12,z,.11,.23,C.white,16,.14);cyl(x,y+.24,z,.115,.007,C.wood,16)}
function screen(x,y,z,w,h){box(x,y,z,w+.1,h+.1,.13,C.dark);box(x,y,z+.08,w,h,.02,C.screen);for(let i=0;i<3;i++)box(x-w*.36+i*w*.27,y+h*.27,z+.1,w*.2,.035,.02,C.lilac);for(let i=0;i<12;i++){let v=.1+((i*7)%10)/17;box(x-w*.43+i*w*.075,y-h*.25+v*.25,z+.105,w*PLAN_SCALE,v,.015,i%3?C.purple:C.green)}for(let i=0;i<4;i++)box(x-w*.25,y+.08-i*.12,z+.11,w*.4,.025,.01,C.blue)}
// The new reference map is the single source of spatial coordinates.
// One image pixel maps to .035 scene units; north remains the topNavBar of the map.
const MAP={scale:PLAN_SCALE,cx:660,cy:540};
const P=(x,y)=>[(x-MAP.cx)*MAP.scale,(y-MAP.cy)*MAP.scale];
const COLLECTOR_A=.52,COLLECTOR_R=8.95,COLLECTOR_ROT=-Math.PI/2-COLLECTOR_A;const collectorPlan=[670+Math.cos(COLLECTOR_A)*COLLECTOR_R/MAP.scale,490+Math.sin(COLLECTOR_A)*COLLECTOR_R/MAP.scale];
const hub=P(670,490),hallCenter=[-7.7,0,1.5];
function atScaled(px,py,rot,sx,sy,sz,fn){at(px,py,rot,()=>{const start=verts.length;fn();for(let i=start;i<verts.length;i+=9){verts[i]*=sx;verts[i+1]*=sy;verts[i+2]*=sz;const n=norm([verts[i+3]/sx,verts[i+4]/sy,verts[i+5]/sz]);verts[i+3]=n[0];verts[i+4]=n[1];verts[i+5]=n[2]}if(px===600&&py===740){const mn=[Infinity,Infinity,Infinity],mx=[-Infinity,-Infinity,-Infinity];for(let i=start;i<verts.length;i+=9)for(let j=0;j<3;j++){mn[j]=Math.min(mn[j],verts[i+j]);mx[j]=Math.max(mx[j],verts[i+j])}calibratedCartBounds={min:mn,max:mx}}})}
function at(px,py,rot,fn){const start=verts.length,p=P(px,py),c=Math.cos(rot),s=Math.sin(rot);fn();for(let i=start;i<verts.length;i+=9){const x=verts[i],z=verts[i+2],nx=verts[i+3],nz=verts[i+5];verts[i]=p[0]+x*c+z*s;verts[i+2]=p[1]-x*s+z*c;verts[i+3]=nx*c+nz*s;verts[i+5]=-nx*s+nz*c}}
function mapBox(px,py,w,d,h,col=C.wall,base=0){const p=P(px,py);box(p[0],base+h/2,p[1],w*MAP.scale,h,d*MAP.scale,col)}
function mapWall(x1,y1,x2,y2,h=2.8,col=C.wall,thick=.12){if(h>.5)h=WALL_HEIGHT;const a=P(x1,y1),b=P(x2,y2),dx=b[0]-a[0],dz=b[1]-a[1];box((a[0]+b[0])/2,h/2,(a[1]+b[1])/2,Math.hypot(dx,dz),h,thick,col,-Math.atan2(dz,dx))}
function arc(cx,cy,r,start,end,height,col,thick=.10,base=0){const cp=P(cx,cy),rr=r*MAP.scale,N=Math.ceil(Math.abs(end-start)*72);for(let i=0;i<N;i++){const a=start+(end-start)*i/N,b=start+(end-start)*(i+1)/N;for(const sign of [-1,1]){const rad=rr+sign*thick/2,p=[cp[0]+Math.cos(a)*rad,base,cp[1]+Math.sin(a)*rad],q=[cp[0]+Math.cos(b)*rad,base,cp[1]+Math.sin(b)*rad],u=[p[0],base+height,p[2]],v=[q[0],base+height,q[2]],na=[Math.cos(a)*sign,0,Math.sin(a)*sign],nb=[Math.cos(b)*sign,0,Math.sin(b)*sign];smoothTri(p,q,u,na,nb,na,col);smoothTri(q,v,u,nb,nb,na,col)}for(const y of [base,base+height]){const p=[cp[0]+Math.cos(a)*(rr-thick/2),y,cp[1]+Math.sin(a)*(rr-thick/2)],q=[cp[0]+Math.cos(b)*(rr-thick/2),y,cp[1]+Math.sin(b)*(rr-thick/2)],u=[cp[0]+Math.cos(a)*(rr+thick/2),y,cp[1]+Math.sin(a)*(rr+thick/2)],v=[cp[0]+Math.cos(b)*(rr+thick/2),y,cp[1]+Math.sin(b)*(rr+thick/2)];tri(p,q,u,[0,y===base?-1:1,0],col);tri(q,v,u,[0,y===base?-1:1,0],col)}}}
const architecture=build(()=>{
const outline=[[0,235],[818,235],[942,352],[942,920],[544,920],[544,846],[0,846]].map(p=>P(...p));
// The footprint is concave, so construct its main sections separately.
planPrism([[0,235],[818,235],[942,352],[942,846],[0,846]].map(p=>P(...p)),-.30,.01,C.floor);
planPrism([[544,846],[942,846],[942,920],[544,920]].map(p=>P(...p)),-.30,.01,C.floor);
mapBox(672,221,105,28,.12,C.white,-.12);
// Stone tile joints clipped to the exact visible footprint.
// Main visitor entrance is at the NORTH/topNavBar edge; south edge is continuous and closed.
mapWall(0,235,480,235,1.1);mapWall(480,235,620,235,2.8);mapWall(725,235,818,235,2.8);mapWall(818,235,942,352,2.8);mapWall(942,352,942,920,1.0);
mapWall(0,235,0,846,1.05);mapWall(0,846,544,846,.85);mapWall(544,846,544,920,.85);mapWall(544,920,942,920,1.4);
mapWall(0,235,480,235,.065,C.white,.17);mapWall(725,235,818,235,.07,C.white,.17);
// Primary entrance, framed in purple; gap corresponds to the double doors.
at(672,235,Math.PI,()=>{for(const x of [-1.83,1.83])box(x,1.6,0,.15,3.2,.23,C.purple);box(0,3.16,0,3.8,.18,.25,C.purple);box(0,.025,0,3.55,.035,1.3,C.cream)});
// Left office block and the staff room, drawn as cutaway rooms.
mapWall(0,330,190,330,1.4);mapWall(190,377,190,645,1.4);mapWall(0,645,190,645,1.4);mapWall(190,645,190,793,1.4);mapWall(190,825,190,846,1.4);
mapWall(260,520,372,520,1.5);mapWall(260,520,260,777,1.5);mapWall(260,645,372,645,1.5);mapWall(260,777,372,777,1.5);mapWall(372,330,372,355,1.8);mapWall(372,397,372,520,1.8);mapWall(372,520,372,568,1.5);mapWall(372,600,372,700,1.5);mapWall(372,730,372,846,1.5);
// Stair core and bathrooms between the office block and public entrance.
mapWall(380,650,485,650,1.1);mapWall(485,650,485,846,1.1);mapWall(380,650,380,846,1.1);mapWall(485,805,580,805,.9);mapWall(580,805,580,920,.9);mapWall(485,850,580,850,.9);
mapWall(780,765,942,765,1.25);mapWall(780,765,780,848,1.25);mapWall(868,765,868,846,1.25);mapWall(868,846,942,846,1.25);
// East elevator shaft with an open south side; southeast stairs.
mapBox(900,803,52,52,.04,C.metal);mapWall(876,777,926,777,1.65);mapWall(926,777,926,831,1.65);mapWall(876,777,876,831,1.65);
mapWall(818,856,932,856,.55,C.white);mapWall(818,856,818,914,.55,C.white);
// The central circle is the IMAGE / BRAND FILM pavilion, not the AI zone.
cyl(hub[0],.065,hub[1],5.15,.13,C.white,96);cyl(hub[0],.14,hub[1],5.15,.035,C.purple,96);cyl(hub[0],.17,hub[1],5.07,.025,[.95,.95,.96],96);
// Continuous curved right-hand wall, as shown on the plan.
arc(670,490,253,-1.18,.48,WALL_HEIGHT,C.wall,.16);arc(670,490,251,-1.17,.48,.07,C.purple,.12,WALL_HEIGHT+.02);
// One continuous six-panel LED wall; no hardware plinths.
// Outer wall inner radius is 253*scale-.08. The screen back exactly meets it.
arc(670,490,(253*MAP.scale-.10)/MAP.scale,-.025,.465,2.45,C.dark,.04,.30);
// Removed the added portal. Meeting-room access follows the existing rear circulation passage.

// Visible structural columns from the map.
for(const [x,y] of [[173,245],[175,320],[390,245],[577,250],[768,250],[390,650],[479,650],[389,837],[479,837],[577,837],[767,837],[923,650]])mapBox(x,y,19,21,WALL_HEIGHT+.05,C.wall);
// Ceiling track lights follow the perimeter rather than crossing the central void.
for(const [x1,y1,x2,y2] of [[395,256,565,256],[785,265,918,374],[925,400,925,625],[802,739,908,669],[395,366,395,610]]){const a=P(x1,y1),b=P(x2,y2);box((a[0]+b[0])/2,3.06,(a[1]+b[1])/2,Math.hypot(b[0]-a[0],b[1]-a[1]),.06,.055,C.dark,-Math.atan2(b[1]-a[1],b[0]-a[0]));for(let i=0;i<3;i++){let t=(i+.5)/3;const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;cyl(x,2.93,z,.09,.2,C.dark,10);cyl(x,2.82,z,.08,.012,C.light,10)}}
// The dashed annular route is copied from the reference's outer circulation ring.
});
const centralWalls=build(()=>{arc(670,490,4.9/MAP.scale,.76,4.02,3.35,C.white,.20,.17);arc(670,490,4.9/MAP.scale,.76,4.02,.055,C.purple,.22,3.52);
// Curved film display is mounted on the INNER wall face, with no standalone panel.
// Wall inner face is 4.83; display back radius 4.830 and front radius 4.795.
arc(670,490,4.7825/MAP.scale,.94,3.84,2.30,C.dark,.035,.52);

});centralWalls.central=true;
const furniture=build(()=>{
// Side-facing espresso machine. Counter topNavBar is exactly 0.80m.
at(827,341,-Math.PI/4,()=>{
 roundedBox(0,.385,0,3.25,.73,.92,.045,[.86,.85,.83]);roundedBox(0,.77,0,3.35,.06,1.02,.025,C.white);
 roundedBox(0,.065,0,3.08,.09,.80,.025,[.28,.29,.32]);
 for(const x of [-.84,.12,.98])box(x,.40,.466,.008,.61,.008,[.68,.66,.70]);
 localFrame(.98,-.05,-Math.PI/2,()=>{
  roundedBox(0,1.125,-.06,.70,.65,.57,.045,[.72,.73,.75]);
  roundedBox(0,1.12,.245,.61,.44,.025,.015,C.dark);roundedBox(0,1.355,.27,.37,.10,.015,.012,C.screen);
  box(0,.815,.32,.62,.025,.40,C.metal);for(let i=0;i<13;i++)box(-.27+i*.045,.833,.32,.012,.009,.35,C.dark);
  for(const x of [-.10,.10]){cyl(x,1.20,.32,.020,.12,C.metal);box(x,1.265,.30,.03,.02,.11,C.metal)}
  for(const x of [-.26,.26])sphere(x,1.35,.265,.018,.018,.008,C.metal);
  for(let i=0;i<9;i++)box(.355,1.0+i*.035,-.08,.006,.009,.30,[.32,.34,.36]);
 });
 // Cup dispenser and lid stack stay clear of the robot's torso and elbow corridor.
 cyl(-1.15,.90,-.10,.12,.20,C.dark);for(let i=0;i<3;i++)cyl(-1.15,1.01+i*.035,-.10,.11,.035,C.white);
 for(let i=0;i<5;i++)cyl(-.65,.815+i*.014,.19,.125,.014,C.cream);
 roundedBox(-.35,.812,.32,.55,.02,.28,.025,C.metal);
});

// One continuous curved industrial worktop follows the same centre as the wall.
curvedCabinet(8.55,3.31,3.83,.82,.92,[.85,.86,.88]);
for(const [i,a] of [3.45,3.70].entries()){
 const pp=[670+Math.cos(a)*8.50/MAP.scale,490+Math.sin(a)*8.50/MAP.scale];
 at(...pp,Math.PI/2-a,()=>{
  if(i===0){for(const x of [-.43,0,.43]){roundedBox(x,.84,0,.35,.025,.48,.012,C.dark);for(const dx of [-.175,.175])box(x+dx,.91,0,.012,.14,.48,C.metal);box(x,.91,.24,.35,.14,.012,C.metal)}}
  else{box(0,.85,0,.62,.025,.48,C.wood);for(const x of [-.31,.31])box(x,.985,0,.015,.26,.48,C.wood);for(const z of [-.24,.24])box(0,.985,z,.62,.26,.015,C.wood);roundedBox(.49,.95,-.05,.17,.23,.17,.02,C.dark);cyl(.49,1.08,-.05,.065,.025,C.cream)}
 });
}
// Supplies remain against the wall, clear of the meeting-room passage.


// Curved domestic furniture shares the centre of the architectural wall.
roundedArcBlock(9.75,2.64,2.96,.07,.44,.78,[.85,.82,.76]);
roundedArcBlock(10.12,2.64,2.96,.43,.99,.18,C.cream);
for(let n=0;n<5;n++){const a=2.67+n*.058;at(670+Math.cos(a)*9.74/MAP.scale,490+Math.sin(a)*9.74/MAP.scale,-Math.PI/2-a,()=>roundedBox(0,.46,0,.53,.10,.63,.045,C.cream))}
for(const a of [2.64,2.96])at(670+Math.cos(a)*9.75/MAP.scale,490+Math.sin(a)*9.75/MAP.scale,-Math.PI/2-a,()=>roundedBox(0,.58,0,.13,.34,.79,.045,C.cream));
curvedCabinet(8.55,2.64,2.91,.48,.80,[.79,.74,.67]);

{const a=2.77;const x=hub[0]+Math.cos(a)*8.55,z=hub[1]+Math.sin(a)*8.55;}
// Lower-left robot shop and service island.
atScaled(600,740,2.67,1.25,.90,3/1.92,()=>{
roundedBox(0,.22,-.5,4.0,.42,1.92,.30,[.43,.25,.10]);for(const x of [-1.70,1.70])roundedBox(x,1.43,-.85,.50,2.30,1.16,.22,[.83,.78,.71]);box(0,1.43,-1.40,3.1,2.15,.10,[.72,.64,.55]);roundedBox(0,2.38,-.85,3.9,.35,1.16,.15,[.83,.78,.71]);box(0,.51,-.24,2.95,.30,.12,C.cream);
box(-.45,1.36,-1.23,1.82,1.64,.06,[.26,.18,.14]);box(0,2.55,-.30,3.25,.12,1.42,C.cream);
for(const x of [-1.7,1.7]){roundedBox(x,1.37,-.13,.40,1.12,.14,.18,[.78,.035,.055]);roundedBox(x,1.60,-.045,.28,.40,.035,.10,C.white);box(x,1.58,-.02,.20,.24,.02,C.dark)}
box(1.45,1.30,-.18,.40,.32,.08,C.dark);box(1.45,1.30,-.132,.34,.26,.015,C.purple);
for(let j=0;j<4;j++){box(-.45,.68+j*.35,-.82,1.82,.035,.62,C.metal);for(let k=0;k<12;k++){const col=[[.9,.32,.035],[.66,.045,.04],[.035,.32,.09],[.7,.62,.13]][j];cyl(-1.27+k*.15,.79+j*.35,-.80,.045,.21,col,12);cyl(-1.27+k*.15,.91+j*.35,-.80,.026,.04,C.white,12)}}
for(const x of [-1.55,1.55])for(const z of [-1.12,.10])cyl(x,.06,z,.06,.12,C.dark,16);
});
// Solid curved workstations conceal the underside and leave a clear operator bay.
arc(670,490,253,.48,1.28,WALL_HEIGHT,C.wall,.16);
curvedCabinet(8.95,.69,1.20,.89,1.0);
curvedCabinet(8.95,.435,.55,.84,.80);
at(...collectorPlan,COLLECTOR_ROT,()=>{roundedBox(-.38,.86,.02,.43,.025,.30,.02,C.metal);box(-.40,1.015,-.14,.41,.27,.025,C.dark);box(.15,.853,.02,.25,.018,.27,C.dark);cyl(-.60,1.12,-.19,.014,.56,C.metal);roundedBox(-.60,1.42,-.19,.09,.055,.07,.015,C.dark)});

// Salon conversation corner on the west of the exhibition entrance.
at(334,445,Math.PI/2,()=>{box(0,.45,-.8,2.3,.65,.70,C.cream);box(0,.85,-1.04,2.3,.65,.18,C.cream);cyl(0,.62,.1,.46,.07,C.oak);cyl(0,.3,.1,.05,.6,C.dark);chair(-.75,.8,Math.PI);chair(.75,.8,Math.PI)});
// Background offices and work areas from the map.
at(91,500,0,()=>{for(let i=0;i<4;i++){const x=-2.1+i*1.28;box(x,.79,0,.68,.10,7.0,C.dark);for(const z of [-2.9,2.9])box(x,.38,z,.06,.75,.06,C.metal)}});
function meeting(px,py,w,d,chairs){at(px,py,0,()=>{table(0,0,w,d,.80);for(let i=0;i<chairs;i++){const z=-d/2+.3+i*(d-.6)/Math.max(1,chairs-1);chair(-w/2-.42,z,Math.PI/2);chair(w/2+.42,z,-Math.PI/2)}})}
meeting(89,741,1.8,4.6,5);meeting(315,581,.95,2.3,3);meeting(315,709,.95,2.2,3);
// Two runs of stairs, landings, and the southeast emergency stair.
at(432,740,0,()=>{for(let i=0;i<11;i++){box(-.70,.06+i*.07,1.7-i*.28,1.1,.12+i*.14,.28,C.white);box(.70,.06+(10-i)*.07,1.7-i*.28,1.1,.12+(10-i)*.14,.28,C.white)}box(0,1.5,-1.38,2.6,.14,.7,C.white);for(const x of [-1.32,0,1.32])box(x,1.55,0,.035,.75,3.5,C.metal)});
at(880,885,Math.PI/2,()=>{for(let i=0;i<10;i++)box(0,.045+i*.055,-1.4+i*.28,1.6,.09+i*.11,.28,C.white);box(-.83,1.2,0,.035,.65,3,C.metal);box(.83,1.2,0,.035,.65,3,C.metal)});
// Elevator doors and restroom fixtures.
at(900,830,0,()=>{box(0,1.05,0,1.45,2.1,.10,C.metal);box(0,1.05,.06,.015,2.1,.02,C.dark)});
for(const py of [830,880])at(555,py,0,()=>{box(0,.78,0,.55,.12,.32,C.white);cyl(0,.85,0,.11,.03,C.metal,12)});
for(const [x,y,s] of [[790,273,.85],[913,615,.75],[500,700,.85],[409,385,.7],[605,785,.75],[224,810,1]]){const p=P(x,y);plant(p[0],p[1],s)}
});

const exhibitDetails=build(()=>{
// Removed industrial rear reception desk: preserve the meeting-room approach.

// Family and industrial walls continue around the same plan centre.
arc(670,490,268,2.56,3.14,WALL_HEIGHT,C.oak,.15);
arc(670,490,268,3.17,3.92,WALL_HEIGHT,C.white,.15);
arc(670,490,266,2.56,3.92,.035,C.purple,.02,WALL_HEIGHT+.01);

// Company copy is applied directly to a white curved wall; no relief border.
arc(670,490,(253*MAP.scale-.10)/MAP.scale,-.50,-.035,2.50,C.white,.04,.23);

// Threshold and counter hardware.
at(672,235,Math.PI,()=>{for(const x of [-1.72,1.72]){box(x,1.4,0,.035,2.8,.05,C.metal);box(x* .94,1.15,.07,.025,.38,.025,C.metal)}box(0,.005,-.40,3.4,.015,.70,C.dark)});
});
const centralHalo=build(()=>{// A continuous white halo and curved reveal frame the central pavilion.
arc(670,490,4.97/MAP.scale,0,Math.PI*2,.13,C.white,.42,3.60);
arc(670,490,4.725/MAP.scale,0,Math.PI*2,.035,C.light,.04,3.58);
for(const a of [.76,4.02]){const x=hub[0]+Math.cos(a)*4.9,z=hub[1]+Math.sin(a)*4.9;box(x,1.92,z,.14,3.45,.17,C.purple,-a)}
});centralHalo.central=true;
const lightingDetails=build(()=>{arc(670,490,5.11/MAP.scale,0,Math.PI*2,.018,C.lilac,.035,.045);arc(670,490,252,-1.17,1.20,.018,C.light,.02,WALL_HEIGHT-.04)});
// Mechanical orbital sculpture and planets seen in the reference's central installation.
const orbital=build(()=>{const points=[[-2.8,3.64,-1.2],[1.0,3.80,-.55],[-2.1,3.83,1.9],[2.8,3.72,1.4]];for(let i=0;i<points.length-1;i++){let a=points[i],b=points[i+1],d=sub(b,a),len=Math.hypot(...d),m=linkBetween(a,b),start=verts.length;cyl(0,len/2,0,.095,len,C.metal,48);cyl(0,.07,0,.18,.14,C.dark,48);cyl(0,len-.07,0,.18,.14,C.dark,48);for(let k=start;k<verts.length;k+=9){const v=[verts[k],verts[k+1],verts[k+2],1],n=[verts[k+3],verts[k+4],verts[k+5],0];for(let j=0;j<3;j++){verts[k+j]=m[j]*v[0]+m[4+j]*v[1]/len+m[8+j]*v[2]+m[12+j];verts[k+3+j]=m[j]*n[0]+m[4+j]*n[1]/len+m[8+j]*n[2]}}}for(const p of points){cyl(p[0],p[1],p[2],.18,.48,C.white,48);cyl(p[0],p[1]+.26,p[2],.185,.03,C.dark,48)}
});orbital.finish=.78;orbital.central=true;
// Robot models: wheeled dual arm, pedestal arm, and fixed dual arm.
function roundedBox(x,y,z,w,h,d,r,col){const N=12,bevel=Math.min(.018,h*.14,r*.22),levels=[[-h/2,bevel,-.7],[-h/2+bevel,0,0],[h/2-bevel,0,0],[h/2,bevel,.7]],point=(j,k,l)=>{let a=(j*90+k/N*90)*Math.PI/180,lv=levels[l],rad=r-lv[1];return[x+(j===0||j===3?1:-1)*(w/2-r)+Math.cos(a)*rad,y+lv[0],z+(j<2?1:-1)*(d/2-r)+Math.sin(a)*rad]},normal=(j,k,l)=>{let a=(j*90+k/N*90)*Math.PI/180;return norm([Math.cos(a),levels[l][2],Math.sin(a)])};for(let j=0;j<4;j++)for(let k=0;k<=N;k++){const nj=k===N?(j+1)%4:j,nk=k===N?0:k+1;for(let l=0;l<3;l++){let a=point(j,k,l),b=point(nj,nk,l),c=point(j,k,l+1),d=point(nj,nk,l+1);smoothTri(a,b,c,normal(j,k,l),normal(nj,nk,l),normal(j,k,l+1),col);smoothTri(b,d,c,normal(nj,nk,l),normal(nj,nk,l+1),normal(j,k,l+1),col)}for(const l of [0,3])tri([x,y+levels[l][0],z],point(j,k,l),point(nj,nk,l),[0,l===0?-1:1,0],col)}}
function shell(x,z,rings,col){const N=64,point=(r,t)=>[x+Math.cos(t)*r[1],r[0],z+Math.sin(t)*r[2]],normal=(j,t)=>{const p=rings[Math.max(0,j-1)],q=rings[Math.min(rings.length-1,j+1)],r=rings[j],dy=Math.max(.001,q[0]-p[0]),sx=(q[1]-p[1])/dy,sz=(q[2]-p[2])/dy;return norm([Math.cos(t)/r[1],-sx*Math.cos(t)*Math.cos(t)/r[1]-sz*Math.sin(t)*Math.sin(t)/r[2],Math.sin(t)/r[2]])};for(let j=0;j<rings.length-1;j++)for(let i=0;i<N;i++){const a=i/N*Math.PI*2,b=(i+1)/N*Math.PI*2,p=rings[j],q=rings[j+1];smoothTri(point(p,a),point(q,a),point(p,b),normal(j,a),normal(j+1,a),normal(j,b),col);smoothTri(point(p,b),point(q,a),point(q,b),normal(j,b),normal(j+1,a),normal(j+1,b),col)}}
const silver=[.82,.84,.87],black=[.055,.06,.065];
// H1 PRO silhouette from the user's supplied product reference: silver mast,
// forward tapered torso, black oval face, paired grippers, rounded mobile base.
const robotBody=build(()=>{
 // Geometry is authored directly in metres. Slender mast, torso and arms retain the exact overall envelope.
 roundedBox(0,.045,0,.70,.09,.80,.16,black);
 roundedBox(0,.16,0,.65,.18,.75,.15,silver);roundedBox(0,.255,0,.62,.025,.72,.14,black);
 for(const x of [-.24,.24])for(const z of [-.27,.27])sphere(x,.055,z,.065,.05,.067,[.18,.19,.21]);
 roundedBox(0,.15,.379,.34,.027,.012,.01,C.light);
 cyl(0,.785,-.15,.067,1.08,silver,48);cyl(0,1.31,-.15,.071,.025,black,48);
 for(const x of [-.035,.025])box(x,.79,-.080,.006,1.00,.008,black);
 shell(0,.035,[[1.00,.115,.075],[1.08,.145,.09],[1.20,.195,.115],[1.29,.205,.115],[1.35,.14,.08],[1.38,.09,.065]],silver);
 for(const side of [-1,1])sphere(side*.225,1.27,.035,.065,.075,.065,silver);
 cyl(0,1.39,.035,.045,.105,black,32);sphere(0,1.48,.035,.105,.12,.085,silver);
 sphere(0,1.485,.111,.086,.070,.018,black);sphere(.036,1.50,.130,.009,.009,.004,C.light);
 roundedBox(0,1.16,.147,.13,.018,.006,.006,C.dark);
});

const singleArm=build(()=>{cyl(0,.25,0,.28,.50,C.dark);sphere(0,.56,0,.19,.19,.19,C.white);box(0,.90,0,.20,.65,.20,C.white);sphere(0,1.22,0,.15,.15,.15,C.dark);box(0,1.32,.24,.15,.18,.52,C.white);sphere(0,1.32,.5,.13,.13,.13,C.purple);box(0,1.2,.57,.14,.25,.12,C.dark);box(-.09,1.1,.57,.06,.16,.06,C.white);box(.09,1.1,.57,.06,.16,.06,C.white)});
const link=build(()=>{cyl(0,.5,0,.045,1,silver,48,.037);cyl(0,.04,0,.047,.045,C.metal,40);cyl(0,.96,0,.040,.035,C.dark,40)}),joint=build(()=>sphere(0,0,0,.057,.057,.057,C.dark)),grip=build(()=>{roundedBox(0,.015,0,.155,.12,.105,.012,[.22,.24,.26]);box(0,-.047,0,.18,.018,.075,C.metal);for(const x of [-.078,.078]){box(x,-.105,0,.024,.115,.055,silver);box(x-Math.sign(x)*.013,-.132,0,.009,.055,.050,C.dark);sphere(x,.043,.055,.009,.009,.004,C.metal)}box(0,.022,.055,.072,.019,.004,C.cream)}),item=build(()=>{box(0,0,0,.20,.26,.18,C.orange)}),toy=build(()=>sphere(0,0,0,.14,.14,.14,C.orange)),part=build(()=>{cyl(0,0,0,.07,.16,C.metal,6);cyl(0,.10,0,.12,.04,C.metal,6)});
robotBody.finish=.86;singleArm.finish=.78;link.finish=.82;grip.finish=.62;joint.finish=.12;part.finish=.83;
function world(px,py,rot,x,y,z){const p=P(px,py);return[p[0]+x*Math.cos(rot)+z*Math.sin(rot),y,p[1]-x*Math.sin(rot)+z*Math.cos(rot)]}
const hwRot=-Math.PI*3/4;
const robots=[
{zone:2,frame:[827,341,-Math.PI/4],pos:[0,0,-.85],kind:0},
{zone:5,angle:.73,kind:0,task:0},{zone:5,angle:.94,kind:1,task:1},{zone:5,angle:1.15,kind:2,task:2},
{zone:6,frame:[600,740,2.67],pos:[1.3,0,-.90],kind:0},
{zone:7,frame:[670+Math.cos(2.77)*7.72/MAP.scale,490+Math.sin(2.77)*7.72/MAP.scale,Math.PI/2-2.77],pos:[0,0,0],kind:0},
{zone:8,frame:[670+Math.cos(3.45)*9.42/MAP.scale,490+Math.sin(3.45)*9.42/MAP.scale,-Math.PI/2-3.45],pos:[0,0,0],kind:0,task:1},
{zone:8,frame:[670+Math.cos(3.70)*9.42/MAP.scale,490+Math.sin(3.70)*9.42/MAP.scale,-Math.PI/2-3.70],pos:[0,0,0],kind:0,task:2}];
function linkBetween(a,b){let y=sub(b,a),len=Math.max(.001,Math.hypot(...y));y=norm(y);let x=norm(cross(Math.abs(y[2])>.99?[1,0,0]:[0,0,1],y)),z=cross(x,y);return new Float32Array([x[0],x[1],x[2],0,y[0]*len,y[1]*len,y[2]*len,0,z[0],z[1],z[2],0,...a,1])}
const cleaningCloth=build(()=>roundedBox(0,0,0,.20,.028,.16,.035,[.48,.64,.69]));
const cardMesh=build(()=>{roundedBox(0,0,0,.21,.14,.008,.008,[.80,.80,.76]);box(0,.025,.005,.16,.018,.002,C.dark);box(-.04,-.025,.005,.08,.014,.002,[.44,.39,.51])});
const cupMesh=build(()=>{cyl(0,.10,0,.095,.20,C.white,48,.12);cyl(0,.202,0,.103,.004,[.22,.12,.06])});
const lidMesh=build(()=>{cyl(0,0,0,.125,.025,[.9,.89,.85]);cyl(0,.015,0,.105,.015,C.white)});
const streamMesh=build(()=>cyl(0,0,0,.008,1,[.25,.14,.065]));
const fixedBody=build(()=>{roundedBox(0,.09,0,.70,.18,.58,.04,C.dark);box(0,.72,-.15,.19,1.25,.21,C.metal);roundedBox(0,1.45,0,.62,.36,.30,.045,silver);box(0,1.47,.16,.30,.10,.02,C.dark)});fixedBody.finish=.72;
const cobotBody=build(()=>{roundedBox(0,.10,0,.65,.20,.60,.035,C.dark);cyl(0,.62,0,.13,1.05,C.metal);cyl(0,1.2,0,.17,.13,silver)});cobotBody.finish=.8;
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function path(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++)if(t<=keys[i][0])return mix(keys[i-1][1],keys[i][1],ease((t-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));return keys.at(-1)[1]}
function drawBody(mat){draw(robotBody,mat)}
function arm(base,side,hand,kind=0,high=false){
 const shoulder=[side*.225,1.27,.035],v=sub(hand,shoulder),d=Math.hypot(...v),mid=mix(shoulder,hand,.5);
 // Bend the elbow outward; no straight link crosses through the torso.
 const bend=Math.min(.27,Math.sqrt(Math.max(.015,.49*.49-d*d/4)));
 const lateral=norm([side,0,-side*v[0]/Math.max(.25,Math.abs(v[2]))]);const elbow=mid.map((p,i)=>p+lateral[i]*bend);
 draw(link,mul(base,linkBetween(shoulder,elbow)));draw(link,mul(base,linkBetween(elbow,hand)));draw(joint,mul(base,model(...shoulder)));draw(joint,mul(base,model(...elbow)));draw(grip,mul(base,model(...hand,.80,.80,.80)));
}

function drawRobot(r,time){if(r.zone===5){drawHardware(r,time);return}const t=r.zone===current?Math.min(time,r.zone===8?19.2:12):0,pos=r.pos,origin=world(...r.frame,...pos),base=model(...origin,1,1,1,r.frame[2]);if(r.zone!==2)drawBody(base);let hand=[.23,.92,.43],other=[-.23,.92,.43];
if(r.zone===2){
 const cp=path([[0,[-.85,.81,-.08]],[1.1,[-.85,.81,-.08]],[2.4,[-.60,1.02,.06]],[3.6,[.60,1.02,-.05]],[4.1,[.60,.845,-.05]],[5.9,[.60,.845,-.05]],[6.6,[-.15,.98,-.15]],[7.8,[-.15,.98,-.15]],[8.5,[-1.85,1.15,-.10]],[9.0,[-1.95,1.12,.15]],[9.6,[-1.95,1.02,.48]]],t);
 const bodyX=path([[0,[-1.07]],[1.1,[-1.07]],[2.4,[-.82]],[3.6,[.38]],[5.9,[.38]],[6.6,[-.37]],[7.8,[-.37]],[8.8,[-2.14]],[9.6,[-2.14]]],t)[0],bz=t<8.8?-0.99:path([[8.8,[-.99]],[9.6,[-.10]]],t)[0];
 const mb=model(...world(...r.frame,bodyX,0,bz),1,1,1,r.frame[2]);drawBody(mb);
 hand=[cp[0]-bodyX,cp[1]+.12,cp[2]-bz];
 other=path([[0,[-.25,.99,.36]],[5.9,[-.25,.99,.36]],[6.6,[-.65-bodyX,.95,.19-bz]],[7.1,[cp[0]-bodyX,1.37,cp[2]-bz]],[7.8,[cp[0]-bodyX,cp[1]+.25,cp[2]-bz]],[8.3,[-.25,1.07,.38]]],t);
 arm(mb,1,hand);arm(mb,-1,other);
 const cw=world(...r.frame,...cp);draw(cupMesh,model(...cw));
 if(t>=6.6){const lp=t<7.8?world(...r.frame,bodyX+other[0],other[1]-.02,bz+other[2]):[cw[0],cw[1]+.217,cw[2]];draw(lidMesh,model(...lp))}
 if(t>4.1&&t<5.9)draw(streamMesh,model(...world(...r.frame,.60,1.105,-.05),1,.12,1));return;
}

if(r.zone===8){const tt=r.task===1?t:Math.max(0,t-9.6);hand=path([[0,[.22,1.02,.36]],[2.4,[-.20,.98,.80]],[4.8,[0,1.14,.80]],[7.2,[.30,.98,.80]],[9.6,[.22,1.02,.36]]],tt);if(tt>=2.4&&tt<7.2)draw(item,mul(base,model(hand[0],hand[1]-.11,hand[2],.65,.65,.65)));if(r.task===2&&t>17.8){const p=world(...r.frame,0,1.15,.95);draw(packageLid,model(...p,.90,1,.90))}}
if(r.zone===7){
 hand=path([[0,[.22,1.00,.35]],[1.2,[.10,1.10,.50]],[2.1,[-.12,.78,.70]],[2.4,[-.12,.615,.73]],[3.6,[.14,.615,.73]],[4.8,[-.12,.615,.75]],[6,[.14,.615,.75]],[7.2,[-.12,.615,.73]],[8.4,[.14,.615,.73]],[9.6,[.10,.90,.65]],[11.2,[.22,1.00,.35]]],t);
 other=[-.22,1.02,.30];draw(cleaningCloth,mul(base,model(hand[0],hand[1]-.12,hand[2],1,1,1)));
}

if(r.zone===6){hand=path([[0,[.23,.92,.43]],[3,[-.15,1.02,.53]],[6,[.23,.96,.65]],[9,[.25,1.02,.60]],[12,[.23,.92,.43]]],t);if(t>3&&t<9)draw(item,mul(base,model(hand[0],hand[1]-.12,hand[2],.7,.7,.7)))}
arm(base,1,hand);arm(base,-1,other);}
// White rotary-joint arm casings and purple T0 fingers, based on reference photo 2.
const benchBase=build(()=>{cyl(0,.035,0,.115,.07,C.metal);cyl(0,.14,0,.085,.18,C.white);for(let i=0;i<6;i++){const a=i*Math.PI/3;cyl(Math.cos(a)*.095,.075,Math.sin(a)*.095,.009,.014,C.dark)}});
const benchLink=build(()=>{cyl(0,.5,0,.073,1,C.white,64,.058);cyl(0,.06,0,.077,.035,C.dark);cyl(0,.94,0,.062,.025,C.dark)});benchLink.finish=.24;
const benchJoint=build(()=>{sphere(0,0,0,.090,.09,.09,C.white);cyl(0,0,0,.055,.19,C.metal)});
const t0=build(()=>{roundedBox(0,.015,0,.14,.11,.10,.012,C.metal);for(const side of [-1,1]){box(side*.075,-.095,0,.024,.14,.055,C.purple);box(side*.060,-.12,0,.008,.06,.05,C.dark)}});
function hardwareBase(a,r,y=0){return model(hub[0]+Math.cos(a)*r,y,hub[1]+Math.sin(a)*r,1,1,1,-Math.PI/2-a)}
function drawHardware(r,time){const t=current===5?Math.min(time,12):0,f=t/12,base=hardwareBase(r.angle,r.kind===0?9.90:9.23),hand=path([[0,[-.18,1.07,.48]],[.2,[-.18,.98,.48]],[.45,[0,1.19,.52]],[.70,[.18,.98,.65]],[.85,[.18,.98,.65]],[1,[.20,1.09,.45]]],f);let mat=base;
if(r.kind===0){drawBody(base);hand[2]+=.34;arm(base,1,hand);arm(base,-1,[-.23,.93,.40]);}else{draw(benchBase,mul(base,model(0,.89,0)));const shoulder=[0,1.10,0],elbow=[r.kind===1?.10:-.10,1.43,.20];draw(benchLink,mul(base,linkBetween(shoulder,elbow)));draw(benchLink,mul(base,linkBetween(elbow,hand)));draw(benchJoint,mul(base,model(...shoulder)));draw(benchJoint,mul(base,model(...elbow)));draw(t0,mul(base,model(...hand)));}
const z=r.kind===0?.82:.48,obj=f<.2?[-.18,.95,z]:f<.85?[hand[0],hand[1]-.11,hand[2]]:[.18,.95,z+.17];draw(r.task===0?part:r.task===2?cardMesh:item,mul(mat,model(...obj,.7,.7,.7)));}
function drawDance(time){const t=time,turn=Math.sin(t*.65)*.22,base=mul(model(hub[0]+Math.sin(t*.7)*.16,.18,hub[1],1,1,1,Math.atan2(eye[0]-hub[0],eye[2]-hub[1])+turn),I());drawBody(base);arm(base,1,[.35+.08*Math.sin(t*1.9),1.12+.25*Math.sin(t*2.0),.26]);arm(base,-1,[-.35+.08*Math.cos(t*1.9),1.12+.25*Math.cos(t*2.0),.26]);}
const packageLid=build(()=>{box(0,0,0,.7,.025,.55,C.wood);box(0,.018,0,.07,.012,.55,C.cream)});
const humanBody=build(()=>{for(const x of [-.14,.14]){roundedBox(x,.06,0,.19,.12,.36,.05,C.dark);cyl(x,.49,-.06,.085,.78,[.19,.21,.24])}shell(0,-.06,[[.86,.22,.14],[1.10,.22,.15],[1.43,.27,.15],[1.52,.18,.12]],[.42,.44,.46]);cyl(0,1.56,-.06,.07,.12,[.58,.44,.34]);sphere(0,1.73,-.06,.12,.17,.12,[.58,.44,.34]);sphere(0,1.82,-.08,.12,.10,.115,C.dark)});
const gloveMesh=build(()=>{roundedBox(0,0,0,.09,.05,.12,.02,C.dark);for(let i=0;i<4;i++){box(-.035+i*.023,-.01,.09,.016,.03,.09,C.dark);cyl(-.035+i*.023,.025,.05,.008,.01,C.metal)}box(.064,0,.025,.05,.035,.025,C.dark)});
const sleeve=build(()=>{cyl(0,.5,0,.075,1,[.41,.43,.45],32,.06)}),forearm=build(()=>cyl(0,.5,0,.05,1,[.58,.44,.34],32,.038));
function drawCollector(t){
 const a=COLLECTOR_A,base=hardwareBase(a,9.75);
 draw(humanBody,mul(base,model(0,0,0,1,.90,1)));
 const hand=path([[0,[.15,.98,.59]],[1.8,[0,.98,.72]],[2.4,[0,.98,.72]],[4,[0,1.14,.72]],[6,[.22,1.14,.90]],[7.2,[.22,.98,.90]],[8.4,[.22,.98,.90]],[9.6,[.15,.98,.59]]],Math.min(t,9.6));
 for(const side of [-1,1]){const p=[side*.24,1.26,0],q=[side*.29,1.09,.30],end=side===1?hand:[-.20,1.00,.65];draw(sleeve,mul(base,linkBetween(p,q)));draw(forearm,mul(base,linkBetween(q,end)));draw(gloveMesh,mul(base,model(...end)))}
 const obj=t<2.4?[0,.91,.72]:t<8.4?[hand[0],hand[1]-.07,hand[2]]:[.22,.91,.90];draw(collectorObject,mul(base,model(...obj)));
}

const collectorObject=build(()=>roundedBox(0,0,0,.13,.12,.13,.012,[.53,.42,.30]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let easing=.055;
const overviewRadius=()=>Math.max(65,49/(2*Math.tan(.32)*(canvas.clientWidth/canvas.clientHeight)));
let target=hallCenter.slice(),yaw=.40,pitch=.98,radius=overviewRadius(),goal={target:[0,0,0],yaw:.66,pitch:.83,radius:overviewRadius()},eye=[0,0,0],vp=I();
let cameraStep=.016;
const angleDelta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
function camera(){
 const dy=angleDelta(yaw,goal.yaw);yaw+=Math.max(-cameraStep*.85,Math.min(cameraStep*.85,dy));
 pitch+=(goal.pitch-pitch)*easing;radius+=(goal.radius-radius)*easing;
 target=target.map((x,i)=>x+(goal.target[i]-x)*easing);
 const desired=[goal.target[0]+Math.sin(goal.yaw)*Math.cos(goal.pitch)*goal.radius,goal.target[1]+Math.sin(goal.pitch)*goal.radius,goal.target[2]+Math.cos(goal.yaw)*Math.cos(goal.pitch)*goal.radius];
 eye=eye.map((x,i)=>x+(desired[i]-x)*easing);
 const toward=norm(sub(target,eye)),centre=norm(sub([hub[0],1.6,hub[1]],eye));
 const aligned=toward.reduce((a,v,i)=>a+v*centre[i],0)>.965;
 ringVisible=ringMode==='show'||(ringMode==='auto'&&(current===0||aligned));
 vp=mul(perspective(current?(canvas.width/canvas.height<.8?1.20:.85):.64,canvas.width/canvas.height,.1,240),lookAt(eye,target));gl.uniformMatrix4fv(loc.uVP,false,vp);gl.uniform3fv(loc.uEye,eye);
}

// Fine type and diagrams are rendered as spatial HTML labels, remaining readable at every zoom.
const labelEls=zones.slice(1).map((z,j)=>{const e=document.createElement('button');e.className='zone-label';e.innerHTML=`<span>${String(j+1).padStart(2,'0')}</span>${z.name}`;e.onclick=()=>{tourAuto=false;selectZone(j+1)};$('#labels').appendChild(e);return e});
function project(p){const v=[...p,1],r=[0,0,0,0];for(let i=0;i<4;i++)for(let j=0;j<4;j++)r[i]+=vp[j*4+i]*v[j];return[(r[0]/r[3]+1)/2*canvas.clientWidth,(1-r[1]/r[3])/2*canvas.clientHeight,r[3]]}
const roomTags=[['中央形象展示',670,490],['沙龙会客区',330,440],['大会议室',89,741],['小会议室',315,581],['小会议室',315,709],['展厅工作人员室',95,280],['开放办公区',90,500],['楼梯',432,740],['电梯',900,803],['楼梯',880,885]];roomTags.forEach(t=>{const e=document.createElement('button');e.className='room-tag';e.textContent=t[0];t.e=e;$('#labels').append(e);if(t[0]==='中央形象展示'){e.onclick=()=>{tourAuto=false;selectZone(0);goal={target:[hub[0],1.1,hub[1]],yaw:.1,pitch:.45,radius:16};$('#viewName').textContent='中央形象展示 · 品牌影片区'}}else e.tabIndex=-1});
const wallLabels=[];
wallLabels.forEach(l=>{l.e=document.createElement('div');l.e.style.cssText=`position:absolute;transform:translate(-50%,-50%);font-size:${l.s}px;color:#72617e;white-space:nowrap;pointer-events:none;font-weight:500;letter-spacing:1.4px`;l.e.textContent=l.t;$('#labels').appendChild(l.e)});
function updateLabels(){roomTags.forEach(t=>{const p=P(t[1],t[2]),q=project([p[0],.9,p[1]]);t.e.style.left=q[0]+'px';t.e.style.topNavBar=q[1]+'px';t.e.style.display=labelsVisible&&current===0&&q[2]>0?'block':'none'});labelEls.forEach((e,i)=>{const z=zones[i+1],p=project([z.p[0],1.8,z.p[1]]);e.style.left=p[0]+'px';e.style.topNavBar=p[1]+'px';e.style.display=labelsVisible&&p[2]>0&&(current===0||current===i+1)?'flex':'none';e.classList.toggle('current',current===i+1)});wallLabels.forEach(l=>{let p=project(l.p);l.e.style.left=p[0]+'px';l.e.style.topNavBar=p[1]+'px';l.e.style.display=p[2]>0?'block':'none';l.e.style.opacity=radius<19?'1':'.7'})}
function selectZone(i){ringMode='auto';current=Math.max(0,Math.min(9,i));demoRunning=false;demoTime=0;stepIndex=-1;const z=zones[current];[...nav.children].forEach((b,j)=>b.classList.toggle('active',Number(b.dataset.zone)===current));$('#viewName').textContent=current?z.name:'展厅全景';$('#counter').innerHTML=`${String(current).padStart(2,'0')} <span>/ 08</span>`;$('#progress').style.width=routeOrder.indexOf(current)/9*100+'%';$('#journeyText').textContent=current?`${String(current).padStart(2,'0')} / ${z.title}`:'从全景开始，遇见每一种可能';$('#detail').hidden=current===0;$('#detailEyebrow').textContent=z.en;$('#detailTitle').textContent=z.title;$('#detailDesc').textContent=z.desc;$('#steps').innerHTML=z.steps.map((s,j)=>`<div class="step"><span>${String(j+1).padStart(2,'0')}</span>${s}</div>`).join('');$('#demoTabs').innerHTML='';$('#screenUI').hidden=current!==4;$('#playDemo').hidden=[0,1,3].includes(current);$('#playDemo').textContent='▶ 播放演示';$('#demoStatus').textContent='可交互的动作示意 · 非真机直播';$('#tour').innerHTML=tourAuto?'暂停导览 <span>Ⅱ</span>':current?'自动导览 <span>↗</span>':'开始参观 <span>↗</span>';
if(current===0)goal={target:hallCenter.slice(),yaw:.40,pitch:.98,radius:overviewRadius()};else{const v={1:[Math.PI,.25,4.5],2:[-.55,.36,6.8],3:[-1.30,.22,5.5],4:[-1.15,.10,4.5],5:[-1.90,.12,5.8],6:[2.55,.20,4.8],7:[1.15,.26,5.0],8:[1.72,.70,8.8],9:[Math.PI/2,.15,8]}[current];goal={target:[z.p[0],1.2,z.p[1]],yaw:v[0],pitch:v[1],radius:v[2]}}
if(current===4){modules.forEach((m,j)=>{const b=document.createElement('button');b.textContent=m[0];b.onclick=()=>{activeModule=j;updateModule()};$('#demoTabs').appendChild(b)});updateModule()}
if(current===6){$('#demoTabs').innerHTML='<div class="retail-options"><button class="active">矿泉水</button><button>盒装饮品</button><button>零食</button></div>';$('#demoTabs').querySelectorAll('button').forEach((b,j)=>b.onclick=()=>{product=j;$('#demoTabs').querySelectorAll('button').forEach((v,k)=>v.classList.toggle('active',j===k));$('#demoStatus').textContent='已选择：'+b.textContent+' · 点击播放下单'})}
tourElapsed=0;refreshGuide();industryViewButton.hidden=current!==8;industryViewButton.textContent='工业说明';document.body.dataset.aiScreen=String(current===4);aiViewButton.hidden=current!==4;aiViewButton.textContent='采集视角';if(current===4)goal=aiScreenView();
}
function updateModule(){if($('#demoSelect'))$('#demoSelect').value=String(activeModule);[...$('#demoTabs').children].forEach((b,j)=>b.classList.toggle('active',j===activeModule));const m=modules[activeModule];$('#screenUI').innerHTML=`<div class="screen-head"><span>${m[0]} / 可视化示意</span><span>● ${m[3]}</span></div><div class="bars">${Array.from({length:14},(_,i)=>`<i style="height:${15+((i*17+activeModule*9)%30)}px"></i>`).join('')}</div><div class="screen-stats"><span>${m[2]}</span><span id="simCount">等待演示</span></div>`;$('#detailDesc').textContent=m[1]+' 动态图表为模拟数据，未连接生产系统。'}
$('#reset').onclick=()=>{tourAuto=false;selectZone(0)};$('.brand').onclick=e=>{e.preventDefault();tourAuto=false;selectZone(0)};$('#close').onclick=()=>{tourAuto=false;selectZone(0)};$('#labelsBtn').onclick=()=>{labelsVisible=!labelsVisible;$('#labelsBtn').classList.toggle('selected',labelsVisible)};
$('#full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('#instruction').textContent='可使用浏览器 F11 进入全屏'}};
$('#prev').onclick=()=>{tourAuto=false;selectZone(current===0?8:current-1)};$('#next').onclick=()=>{tourAuto=false;selectZone((current+1)%9)};
$('#tour').onclick=()=>{if(current===0){tourAuto=false;selectZone(1)}else{tourAuto=!tourAuto;tourElapsed=0;$('#tour').textContent=tourAuto?'暂停自动导览':'自动导览'}};
$('#playDemo').onclick=()=>{demoRunning=!demoRunning;if(demoRunning&&demoTime>=zones[current].steps.length*2.4){demoTime=0;stepIndex=-1}$('#playDemo').textContent=demoRunning?'暂停演示':demoTime>0?'继续演示':'播放演示'};
canvas.addEventListener('pointerdown',e=>{dragging=true;lastPointer=[e.clientX,e.clientY];moved=0;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer[0],dy=e.clientY-lastPointer[1];moved+=Math.abs(dx)+Math.abs(dy);goal.yaw-=dx*.006;goal.pitch=Math.max(.16,Math.min(1.45,goal.pitch+dy*.005));lastPointer=[e.clientX,e.clientY]});canvas.addEventListener('pointerup',e=>{dragging=false;if(moved<6){const rect=canvas.getBoundingClientRect(),p=[e.clientX-rect.left,e.clientY-rect.topNavBar];let near=-1,dist=65;zones.slice(1).forEach((z,i)=>{let q=project([z.p[0],.6,z.p[1]]),d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<dist){dist=d;near=i+1}});if(near>0){tourAuto=false;selectZone(near)}}});canvas.addEventListener('pointercancel',()=>dragging=false);canvas.addEventListener('wheel',e=>{e.preventDefault();goal.radius=Math.min(85,Math.max(4,goal.radius+e.deltaY*.018))},{passive:false});document.addEventListener('keydown',e=>{if(e.key==='Escape'){tourAuto=false;selectZone(0)}if(e.key==='ArrowRight')$('#next').click();if(e.key==='ArrowLeft')$('#prev').click()});
let touchesDist=0;canvas.addEventListener('touchstart',e=>{if(e.touches.length===2){dragging=false;touchesDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)}},{passive:true});canvas.addEventListener('touchmove',e=>{if(e.touches.length===2){e.preventDefault();let d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);goal.radius=Math.max(4,Math.min(85,goal.radius+(touchesDist-d)*.05));touchesDist=d}},{passive:false});

const shortCopy={1:'从地图上方入口进入。点击“下一站”，前往入口右侧的休闲区。',2:'机器人完成取杯、制饮与交付。点击播放，观看完整服务流程。',3:'通过右侧弧墙，了解零次方的本体、模型与数据体系。',4:'选择一个模块，右侧大屏会切换内容；点击播放查看数据流程。',5:'三种构型使用统一夹爪执行同一任务。点击播放，查看“一脑多形”。',6:'先选商品，再点击播放，体验从接单到装袋交付。',7:'机器人识别散放物品，并送回收纳位置。点击播放查看整理流程。',8:'从传送带识别、分类入箱到打包交付，点击播放查看完整流程。'};
Object.assign(shortCopy,{2:'启动咖啡机 → 取杯 → 接饮料 → 盖盖 → 递交。',4:'贴墙曲面屏同时呈现六类看板；旁侧为采集手套操作桌。',5:'长桌后三种设备、统一T0夹爪，同时执行三个桌面任务。',8:'工业区紧接家庭区，三机接力完成拣货、分拣和打包；会议室从工业区后侧通道绕行。'});
const fullCopy=zones.map(z=>z.desc);
function refreshGuide(){const z=zones[current],card=$('#detail');document.body.dataset.touring=String(current>0);card.dataset.zone=String(current);card.classList.remove('expanded');$('#moreInfo').textContent='展开说明';$('#moreInfo').setAttribute('aria-expanded','false');$('#detailTitle').textContent=z.name;$('#detailDesc').textContent=shortCopy[current]||'';$('#routeStep').textContent=current?'第 '+current+' 站 / 共 8 站':'自由查看';$('#journeyText').textContent=current===0?'拖动旋转，滚轮缩放':current===8?'参观最后一站':'下一站：'+zones[routeOrder[(routeOrder.indexOf(current)+1)%routeOrder.length]].name;$('#viewName').textContent=current?'收起介绍':'自由查看';$('#tour').textContent=current===0?'开始参观':tourAuto?'暂停自动导览':'自动导览';$('#next').textContent=current===8?'返回全景 ↗':'下一站 →';$('#prev').disabled=current===0;$('#next').hidden=current===0;$('#counter').hidden=true;$('#demoSelect').hidden=current!==4;$('#demoTabs').classList.toggle('ai-tabs',current===4);$('#actionText').textContent=[0,1,3].includes(current)?'': '准备就绪 · '+z.steps.length+' 个动作步骤';$('#playDemo').textContent='播放演示';$('#routeMenu').hidden=true;$('#routeMenuBtn').setAttribute('aria-expanded','false')}
$('#demoSelect').innerHTML=modules.map((m,i)=>'<option value="'+i+'">'+m[0]+'</option>').join('');$('#demoSelect').onchange=e=>{activeModule=Number(e.target.value);updateModule()};
$('#routeMenuBtn').onclick=()=>{const m=$('#routeMenu');m.hidden=!m.hidden;$('#routeMenuBtn').setAttribute('aria-expanded',String(!m.hidden))};$('#closeMenu').onclick=()=>{$('#routeMenu').hidden=true;$('#routeMenuBtn').setAttribute('aria-expanded','false')};
$('#viewName').onclick=()=>{if(current){$('#detail').hidden=!$('#detail').hidden;$('#viewName').textContent=$('#detail').hidden?'展开介绍':'收起介绍'}};$('#close').onclick=()=>{$('#detail').hidden=true;$('#viewName').textContent='展开介绍'};$('#moreInfo').onclick=()=>{const expanded=$('#detail').classList.toggle('expanded');$('#moreInfo').textContent=expanded?'收起说明':'展开说明';$('#moreInfo').setAttribute('aria-expanded',String(expanded));$('#detailDesc').textContent=expanded?fullCopy[current]:shortCopy[current]};

const resize=()=>{const dpr=Math.min(devicePixelRatio,1.75);canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height)};new ResizeObserver(resize).observe(canvas);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
const lightVP=mul(new Float32Array([1/26,0,0,0,0,1/26,0,0,0,0,-2/100,0,0,0,-1,1]),lookAt([-20,40,25],[0,0,0]));
// In-world type is printed on physical wall panels and display surfaces.
const texProgram=gl.createProgram();gl.attachShader(texProgram,shader(gl.VERTEX_SHADER,'attribute vec3 aTexPos;attribute vec2 aTexUV;uniform mat4 uVP;uniform mat4 uModel;varying vec2 vUV;void main(){vUV=aTexUV;gl_Position=uVP*uModel*vec4(aTexPos,1.);}'));gl.attachShader(texProgram,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 vUV;uniform sampler2D uTex;void main(){gl_FragColor=texture2D(uTex,vUV);}'));gl.linkProgram(texProgram);const tx={a:gl.getAttribLocation(texProgram,'aTexPos'),uv:gl.getAttribLocation(texProgram,'aTexUV'),vp:gl.getUniformLocation(texProgram,'uVP'),m:gl.getUniformLocation(texProgram,'uModel'),tex:gl.getUniformLocation(texProgram,'uTex')};const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,0,0,1,.5,-.5,0,1,1,.5,.5,0,1,0,-.5,-.5,0,0,1,.5,.5,0,1,0,-.5,.5,0,0,0]),gl.STATIC_DRAW);
function textSurface(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');paint(ctx,w,h);const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return{c,ctx,texture}}
const industrialTex=textSurface(1800,700,(c,w,h)=>{
c.fillStyle='#20242b';c.fillRect(0,0,w,h);c.fillStyle='#f0edf7';c.font='bold 60px Microsoft YaHei';c.fillText('工业智能 · 识别、分拣与打包',65,105);c.fillStyle='#aaa0be';c.font='24px Arial';c.fillText('PICK  /  SORT  /  PACK',68,155);
const names=['工件识别','双臂分类','装箱与封箱'],desc=['工件到位 → 目标识别 → 抓取准备','接收货物 → 类别识别 → 分类放置','取货装箱 → 合盖封箱 → 完成交付'];
for(let i=0;i<3;i++){const x=65+i*570;c.fillStyle='#30353e';c.fillRect(x,210,535,400);c.fillStyle='#c2acd9';c.font='38px Arial';c.fillText('0'+(i+1),x+30,270);c.fillStyle='#e6e6ed';c.font='bold 34px Microsoft YaHei';c.fillText(names[i],x+105,270);c.strokeStyle='#a1adb9';c.lineWidth=5;
if(i===0){for(let r=0;r<3;r++)for(let j=0;j<2;j++){c.strokeRect(x+60+r*145,330+j*90,75,60);c.beginPath();c.arc(x+98+r*145,360+j*90,14,0,Math.PI*2);c.stroke()}}
if(i===1){for(let j=0;j<3;j++){c.strokeRect(x+45+j*155,430,125,60);c.fillStyle=['#77978d','#8299af','#9c8cae'][j];c.fillRect(x+80+j*155,390,48,35)}c.beginPath();c.moveTo(x+90,340);c.lineTo(x+260,305);c.lineTo(x+340,360);c.stroke()}
if(i===2){c.strokeRect(x+140,355,250,140);c.beginPath();c.moveTo(x+140,355);c.lineTo(x+205,310);c.lineTo(x+450,310);c.lineTo(x+390,355);c.moveTo(x+265,355);c.lineTo(x+265,495);c.stroke()}
c.fillStyle='#b8bec9';c.font='22px Microsoft YaHei';c.fillText(desc[i],x+30,565);}
});
const companyTex=textSurface(1800,1000,(c,w,h)=>{
 c.fillStyle='#ffffff';c.fillRect(0,0,w,h);c.fillStyle='#403867';c.font='24px Arial';c.fillText('ZERITH  /  COMPANY PROFILE',90,115);
 c.font='bold 66px Microsoft YaHei';c.fillText('走进零次方',90,235);
 c.fillStyle='#5e6175';c.font='30px Microsoft YaHei';['聚焦通用具身智能机器人的研发与应用。','以本体、模型、数据三位一体的技术体系，','推动机器人在真实世界中持续完成任务。'].forEach((v,i)=>c.fillText(v,90,340+i*58));
 const titles=['本体','模型','数据'],en=['EMBODIMENT','INTELLIGENCE','DATA'],desc=['全身协同与稳定操作','Zerith-V0 具身操作模型','全模态数据与训练闭环'];
 for(let i=0;i<3;i++){const x=90+i*560;c.fillStyle='#9286ae';c.font='22px Arial';c.fillText('0'+(i+1)+'  /  '+en[i],x,650);c.fillStyle='#403867';c.font='bold 46px Microsoft YaHei';c.fillText(titles[i],x,730);c.fillStyle='#686b7d';c.font='25px Microsoft YaHei';c.fillText(desc[i],x,805)}
});

function simpleTitle(a,b,bg='#dedbd3',fg='#756082'){return textSurface(1024,180,(c,w,h)=>{c.fillStyle=bg;c.fillRect(0,0,w,h);c.fillStyle=fg;c.textAlign='center';c.font='bold 43px Arial';c.fillText(a,w/2,78);c.font='22px Microsoft YaHei';c.fillText(b,w/2,130)})}
const hardwareTex=simpleTitle('ONE BRAIN, MANY FORMS','一脑多形 · T0 统一末端执行器');const storeTex=simpleTitle('ZERITH MART','机器人小店 · 从订单到交付');const entryTex=simpleTitle('ZERITH','让智能，走进真实世界','#766087','#fff9ef');
const centralTex=simpleTitle('ZERITH','形象展示 · 宣传影片播放位','#1d2228','#dfd7ed');
const kioskTex=simpleTitle('零次方机器人小店','机器人零售服务','#e6dfd1','#f9f7f2');
const formsTex=textSurface(1800,600,(c,w,h)=>{c.fillStyle='#eeeef1';c.fillRect(0,0,w,h);c.fillStyle='#3e354c';c.font='bold 58px Microsoft YaHei';c.fillText('一脑多形 · 统一 T0 操作能力',65,100);c.fillStyle='#665971';c.font='29px Microsoft YaHei';['01  轮式双臂机器人 / 零件插装','02  桌装机械臂 A / 分类入盒','03  桌装机械臂 B / 卡片入槽'].forEach((v,i)=>{c.fillText(v,65+i*580,220);c.fillStyle='#a28abd';c.fillRect(65+i*580,265,470,3);c.fillStyle='#776b82';c.font='23px Microsoft YaHei';c.fillText('统一模型 · 不同构型 · 同一末端',65+i*580,340);c.font='29px Microsoft YaHei'});});
const homeTex=simpleTitle('家庭整理','识别散落物品 → 分类抓取 → 归位整理','#ece9e5','#64516f');
const dataTex=textSurface(1800,900,()=>{});let lastDataPaint=-1;
function paintData(time){const c=dataTex.ctx;c.fillStyle='#10161d';c.fillRect(0,0,1800,900);c.fillStyle='#e6eaf0';c.font='30px Microsoft YaHei';c.fillText('AI 基建 / 全模态数据闭环',40,52);c.font='17px Microsoft YaHei';c.fillStyle='#8c9aa9';c.fillText('演示数据 · 六看板同屏',1460,48);
const line=(pts,col='#a89ac2')=>{c.strokeStyle=col;c.lineWidth=3;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke()};
for(let i=0;i<6;i++){const x=40+i%3*585,y=90+Math.floor(i/3)*395;c.fillStyle=i===activeModule?'#202c38':'#18212b';c.fillRect(x,y,550,365);c.fillStyle='#e0e5ec';c.font='24px Microsoft YaHei';c.fillText(modules[i][0],x+24,y+42);c.font='15px Microsoft YaHei';c.fillStyle='#8b9bab';c.fillText(['手部轨迹 / RGB-D / 关节姿态','任务接入 / 设备在线 / 上传队列','质量检查 / 时序对齐 / 人工复核','场景索引 / 多模态资产 / 数据版本','部署日志 / 异常片段 / 训练回流','任务成功率 / 长序列完成度 / 泛化'][i],x+24,y+72);
if(i===0){for(let k=0;k<3;k++){c.fillStyle=['#253a44','#33404d','#394251'][k];c.fillRect(x+24+k*170,y+95,155,88);c.fillStyle='#899da9';for(let n=0;n<7;n++)c.fillRect(x+31+k*170+n*19,y+112+(n%3)*12,12,35)}line(Array.from({length:70},(_,j)=>[x+30+j*7,y+260+Math.sin(j*.13+time*.8)*43]),'#8eb5ad');c.fillStyle='#a4b0bd';c.fillText('采集员手套动作 → 轨迹记录',x+25,y+335)}
if(i===1){['采集任务 01','采集任务 02','采集任务 03','采集任务 04'].forEach((t,j)=>{const yy=y+115+j*58;c.fillStyle='#aeb9c5';c.fillText(t,x+26,yy);c.fillStyle='#2d3b47';c.fillRect(x+155,yy-13,290,12);c.fillStyle='#8a9cad';c.fillRect(x+155,yy-13,80+((time*12+j*59)%210),12);c.fillStyle='#83a89f';c.fillText('在线',x+470,yy)})}
if(i===2){for(let a=0;a<8;a++)for(let b=0;b<5;b++){c.fillStyle=(a+b)%9===0?'#a38766':(a+b)%3?'#4f7b73':'#718e87';c.fillRect(x+28+a*62,y+104+b*38,52,27)}c.fillStyle='#bac4ce';c.fillText('✓ 已通过    ▧ 待复核    → 对齐完成',x+28,y+330)}
if(i===3){const rects=[[25,105,285,145,'#4b6070','零售'],[325,105,195,145,'#63627b','家庭'],[25,265,180,65,'#677d75','工业'],[220,265,300,65,'#4f596b','科研']];for(const r of rects){c.fillStyle=r[4];c.fillRect(x+r[0],y+r[1],r[2],r[3]);c.fillStyle='#e3e7ed';c.font='18px Microsoft YaHei';c.fillText(r[5],x+r[0]+14,y+r[1]+32)}}
if(i===4){const points=[[65,175],[260,175],[450,175],[260,285]];line(points.map(p=>[x+p[0],y+p[1]]),'#687586');line([[x+260,y+285],[x+65,y+175]],'#687586');points.forEach((p,j)=>{c.fillStyle=j===Math.floor(time)%4?'#a697bb':'#566477';c.beginPath();c.arc(x+p[0],y+p[1],24,0,Math.PI*2);c.fill();c.fillStyle='#d6dce5';c.font='16px Microsoft YaHei';c.fillText(['部署','异常筛选','回流','训练'][j],x+p[0]-30,y+p[1]+48)});}
if(i===5){['抓取','分拣','整理','长序列','跨场景'].forEach((v,j)=>{const yy=y+115+j*44;c.fillStyle='#b9c3ce';c.fillText(v,x+25,yy);c.fillStyle='#2e3d49';c.fillRect(x+110,yy-15,350,16);c.fillStyle='#8b9eaf';c.fillRect(x+110,yy-15,200+(j*37)%130,16);});c.fillStyle='#8795a5';c.fillText('仅为界面示意，不代表真实评测成绩',x+25,y+345)}
}gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,dataTex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,dataTex.c)}
function surface(t,x,y,z,w,h,rot=0){gl.useProgram(texProgram);gl.uniformMatrix4fv(tx.vp,false,vp);gl.uniformMatrix4fv(tx.m,false,model(x,y,z,w,h,1,rot));gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(tx.a);gl.vertexAttribPointer(tx.a,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(tx.uv);gl.vertexAttribPointer(tx.uv,2,gl.FLOAT,false,20,12);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,t.texture);gl.uniform1i(tx.tex,1);gl.drawArrays(gl.TRIANGLES,0,6);gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTexture)}

// A single continuous UV mesh follows exactly the same circular wall centre.
function curvedPoster(start,end,bottom,topNavBar,radius){const m={buffer:gl.createBuffer(),count:96*6},v=[];const pt=(i,up)=>{const u=i/96,a=start+(end-start)*u;return[hub[0]+Math.cos(a)*radius,up?topNavBar:bottom,hub[1]+Math.sin(a)*radius,u,up?0:1]};for(let i=0;i<96;i++)for(const p of [pt(i,0),pt(i+1,0),pt(i+1,1),pt(i,0),pt(i+1,1),pt(i,1)])v.push(...p);gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);return m}
const hardwarePoster=curvedPoster(.50,1.18,1.88,3.12,253*MAP.scale-.09);
const homePoster=curvedPoster(2.64,3.10,1.90,3.18,268*MAP.scale-.09);
const industryPoster=curvedPoster(3.24,3.79,1.90,3.18,268*MAP.scale-.09);
const companyCurve={buffer:gl.createBuffer(),count:128*6};
{const v=[],r=253*MAP.scale-.123;const point=(i,topNavBar)=>{const u=i/128,a=-.495+.455*u;return[hub[0]+Math.cos(a)*r,topNavBar?2.69:.28,hub[1]+Math.sin(a)*r,u,topNavBar?0:1]};for(let i=0;i<128;i++)for(const p of [point(i,0),point(i+1,0),point(i+1,1),point(i,0),point(i+1,1),point(i,1)])v.push(...p);gl.bindBuffer(gl.ARRAY_BUFFER,companyCurve.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
const aiCurve={buffer:gl.createBuffer(),count:128*6};
{const v=[],r=253*MAP.scale-.123;const point=(i,topNavBar)=>{const u=i/128,a=-.020+.480*u;return[hub[0]+Math.cos(a)*r,topNavBar?2.71:.34,hub[1]+Math.sin(a)*r,u,topNavBar?0:1]};for(let i=0;i<128;i++)for(const p of [point(i,0),point(i+1,0),point(i+1,1),point(i,0),point(i+1,1),point(i,1)])v.push(...p);gl.bindBuffer(gl.ARRAY_BUFFER,aiCurve.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
const curvedDisplay={radius:4.76,start:.94,end:3.84,y:1.67,height:2.22,count:96*6,buffer:gl.createBuffer()};
{const v=[];const point=(i,topNavBar)=>{const u=i/96,angle=curvedDisplay.start+(curvedDisplay.end-curvedDisplay.start)*u;return[hub[0]+Math.cos(angle)*curvedDisplay.radius,curvedDisplay.y+(topNavBar?.5:-.5)*curvedDisplay.height,hub[1]+Math.sin(angle)*curvedDisplay.radius,u,topNavBar?0:1]};for(let i=0;i<96;i++)for(const p of [point(i,false),point(i+1,false),point(i+1,true),point(i,false),point(i+1,true),point(i,true)])v.push(...p);gl.bindBuffer(gl.ARRAY_BUFFER,curvedDisplay.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
function curvedFilmSurface(texture){if(!ringVisible)return;gl.useProgram(texProgram);gl.uniformMatrix4fv(tx.vp,false,vp);gl.uniformMatrix4fv(tx.m,false,I());gl.bindBuffer(gl.ARRAY_BUFFER,curvedDisplay.buffer);gl.enableVertexAttribArray(tx.a);gl.vertexAttribPointer(tx.a,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(tx.uv);gl.vertexAttribPointer(tx.uv,2,gl.FLOAT,false,20,12);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texture.texture);gl.uniform1i(tx.tex,1);gl.drawArrays(gl.TRIANGLES,0,curvedDisplay.count);gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTexture)}



// The screen artwork is extracted from the user's supplied brand-design PDF.
const brandArtwork=new Image();brandArtwork.onload=()=>{gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,centralTex.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,brandArtwork)};brandArtwork.src='assets/brand-film.webp';
const skyTex=textSurface(2048,2048,(c,w,h)=>{c.fillStyle='#090b18';c.fillRect(0,0,w,h);let seed=9614;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296};for(let i=0;i<400;i++){const x=rnd()*w,y=rnd()*h,r=30+rnd()*130,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?'#31315428':'#734d6128');g.addColorStop(1,'#100d1700');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}for(let i=0;i<6500;i++){c.fillStyle=i%4?'#d6def5':'#f6d7b0';c.globalAlpha=.18+rnd()*.8;const r=rnd()> .99?1.7:.5+rnd()*.5;c.beginPath();c.arc(rnd()*w,rnd()*h,r,0,Math.PI*2);c.fill()}c.globalAlpha=1});
const skyMesh={buffer:gl.createBuffer(),count:96*3};{const v=[];for(let i=0;i<96;i++){for(const a of [null,i/96*2*Math.PI,(i+1)/96*2*Math.PI]){const x=a===null?0:Math.cos(a)*4.47,z=a===null?0:Math.sin(a)*4.47;v.push(hub[0]+x,3.91,hub[1]+z,.5+x/8.94,.5+z/8.94)}}gl.bindBuffer(gl.ARRAY_BUFFER,skyMesh.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
function texMesh(m,t,mat){gl.useProgram(texProgram);gl.uniformMatrix4fv(tx.vp,false,vp);gl.uniformMatrix4fv(tx.m,false,mat);gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(tx.a);gl.vertexAttribPointer(tx.a,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(tx.uv);gl.vertexAttribPointer(tx.uv,2,gl.FLOAT,false,20,12);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,t.texture);gl.uniform1i(tx.tex,1);gl.drawArrays(gl.TRIANGLES,0,m.count);gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTexture)}
const planetMesh={buffer:gl.createBuffer(),count:64*32*6};{const v=[],p=(i,j)=>{let u=i/64,t=j/32,ph=u*Math.PI*2,th=t*Math.PI;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph),u,t]};for(let j=0;j<32;j++)for(let i=0;i<64;i++)for(const q of [p(i,j),p(i+1,j),p(i+1,j+1),p(i,j),p(i+1,j+1),p(i,j+1)])v.push(...q);gl.bindBuffer(gl.ARRAY_BUFFER,planetMesh.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW)}
const planetTex=[0,1,2].map(kind=>textSurface(1024,512,(c,w,h)=>{const im=c.createImageData(w,h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){let lon=x/w*Math.PI*2,lat=y/h*Math.PI,f=Math.sin(lon*3+Math.sin(lat*5)*2)+.5*Math.sin(lon*7-lat*9)+.23*Math.sin(lon*19+lat*17),cloud=Math.sin(lon*24+lat*27)+Math.sin(lon*17-lat*13),col;if(kind===0){col=f>.22?[.29,.40,.22]:[.055,.23,.52];if(Math.abs(y/h-.5)>.43)col=[.88,.91,.93];else if(cloud>1.30)col=col.map(v=>v*.35+.63)}else if(kind===1){let band=Math.sin(lat*51+Math.sin(lon*4+lat*7)*.8);col=[.64+band*.13,.43+band*.10,.31+band*.08]}else{const grain=Math.sin(lon*83+lat*71)*.035;col=[.64+f*.07+grain,.21+f*.04,.09+f*.02]}const shade=.60+.40*Math.max(0,Math.cos(lon-.8)*Math.sin(lat));const k=(y*w+x)*4;for(let n=0;n<3;n++)im.data[k+n]=Math.min(255,col[n]*255*shade);im.data[k+3]=255}c.putImageData(im,0,0)}));
function drawPlanets(){if(!ringVisible)return;const p=[[hub[0]+2.3,3.45,hub[1]-1.6,.56,0],[hub[0]-2.2,3.35,hub[1]-1.5,.89,1],[hub[0]+1.65,3.32,hub[1]+2.0,.33,2]];for(const a of p)texMesh(planetMesh,planetTex[a[4]],model(a[0],a[1],a[2],a[3],a[3],a[3]));if(current===1)texMesh(skyMesh,skyTex,I())}
const materialAtlas=gl.createTexture();
{const c=document.createElement('canvas');c.width=512;c.height=1536;const ctx=c.getContext('2d'),im=ctx.createImageData(512,1536);const hash=(x,y)=>{let v=Math.imul(x+131,y+9271)^Math.imul(x+23,374761393);v=(v^(v>>>13))*1274126177;return((v^(v>>>16))>>>0)/4294967295};for(let band=0;band<3;band++)for(let y=0;y<512;y++)for(let x=0;x<512;x++){const rnd=hash(x,y),broad=Math.sin(y*.035+Math.sin(x*.009)*2.5),vein=Math.sin(x*.22+Math.sin(y*.016)*5+Math.sin(y*.07)*.8);let val;if(band===0)val=.58+vein*.12+broad*.07+rnd*.10;else if(band===1)val=.56+rnd*.15+(rnd>.985?.16:0)+Math.sin(x*.018+y*.029)*.02;else val=.58+Math.sin(x*Math.PI)*.03+((x%3===0||y%3===0)?-.08:.04)+rnd*.08;const i=((band*512+y)*512+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=Math.max(0,Math.min(255,val*255));im.data[i+3]=255}ctx.putImageData(im,0,0);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,materialAtlas);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.activeTexture(gl.TEXTURE0)}

const taskFixtures=build(()=>{for(const [i,a] of [.73,.94,1.15].entries()){const r=i===0?9.90:9.23,rot=-Math.PI/2-a,pp=[670+Math.cos(a)*r/MAP.scale,490+Math.sin(a)*r/MAP.scale];at(...pp,rot,()=>{const z=i===0?.99:.65;if(i===0){roundedBox(.18,.924,z,.30,.065,.26,.02,C.metal);cyl(.18,.961,z,.05,.012,C.dark)}else if(i===1){for(const xx of [-.25,.18]){box(xx,.915,z,.28,.025,.26,C.dark);for(const dx of [-.14,.14])box(xx+dx,.97,z,.012,.12,.26,C.metal);box(xx,.97,z+.13,.28,.12,.012,C.metal)}}else{roundedBox(.18,.93,z,.28,.08,.14,.01,C.metal);box(.18,.973,z,.22,.006,.012,C.dark)}})}});
const precisionDetails=build(()=>{
// Industrial content uses the marked NORTH wall, leaving the rear passage empty.
at(524,238,0,()=>{roundedBox(0,1.55,0,3.34,1.39,.065,.025,C.white);box(0,.84,.045,3.24,.025,.015,C.purple)});

// Hardware is integrated into the side-facing coffee machine above.

});

let shadowRenderedAt=-1;

let renderSignature="",last=0,frameCount=0;document.addEventListener('visibilitychange',()=>{last=performance.now()});function frame(now){const elapsed=Math.min((now-last)/1000,.5),dt=Math.min(elapsed,.06);last=now;if(danceRunning&&(current===0||current===9)&&!document.hidden)danceTime+=elapsed;const sig=[current,demoTime,danceTime,ringVisible,goal.yaw,goal.pitch,goal.radius,...goal.target,canvas.width,canvas.height,activeModule,brandArtwork.complete].join(',');if(!(danceRunning&&(current===0||current===9))&&!demoRunning&&!tourAuto&&sig===renderSignature&&Math.abs(angleDelta(yaw,goal.yaw))+Math.abs(pitch-goal.pitch)+Math.abs(radius-goal.radius)+Math.hypot(...sub(target,goal.target))<.001){requestAnimationFrame(frame);return}renderSignature=sig;cameraStep=dt;easing=reduced.matches?1:1-Math.exp(-dt/.65);camera();if(demoRunning&&!document.hidden)demoTime+=elapsed;
const shadowKey=current+":"+demoTime+":"+ringVisible+":"+Math.floor(danceTime*6);if(shadowRenderedAt!==shadowKey){shadowRenderedAt=shadowKey;gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(2.,4.);shadowPass=true;gl.useProgram(shadowProgram);gl.bindFramebuffer(gl.FRAMEBUFFER,shadowFB);gl.viewport(0,0,2048,2048);gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(sh.vp,false,lightVP);draw(architecture);draw(centralWalls);draw(centralHalo);draw(furniture);draw(exhibitDetails);draw(precisionDetails);draw(taskFixtures);draw(orbital,model(hub[0],0,hub[1]));if(!shadowPass)draw(lightingDetails,I(),.8);robots.forEach(r=>drawRobot(r,demoTime));drawDance(danceTime);drawCollector(current===4?demoTime:0);shadowPass=false;gl.disable(gl.POLYGON_OFFSET_FILL);}gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);gl.uniformMatrix4fv(loc.uLightVP,false,lightVP);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTexture);gl.uniform1i(loc.uShadow,0);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,materialAtlas);gl.uniform1i(loc.uMaterials,2);gl.activeTexture(gl.TEXTURE0);
gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);draw(architecture);draw(centralWalls);draw(centralHalo);draw(furniture);draw(exhibitDetails);draw(precisionDetails);draw(taskFixtures);draw(orbital,model(hub[0],0,hub[1]));if(!shadowPass)draw(lightingDetails,I(),.8);robots.forEach(r=>drawRobot(r,demoTime));drawDance(danceTime);drawCollector(current===4?demoTime:0);
if(frameCount%10===0||lastDataPaint!==activeModule){paintData(demoTime);lastDataPaint=activeModule}texMesh(companyCurve,companyTex,I());texMesh(hardwarePoster,formsTex,I());texMesh(homePoster,homeTex,I());texMesh(industryPoster,industrialTex,I());surface(industrialTex,P(524,238)[0],1.55,P(524,238)[1]+.040,3.20,1.25,0);texMesh(aiCurve,dataTex,I());surface(entryTex,...[P(672,231)[0],3.16,P(672,231)[1]],3.5,.23,Math.PI);curvedFilmSurface(centralTex);drawPlanets();{const cp=P(600,740),x=cp[0]+Math.sin(2.67)*.17,z=cp[1]+Math.cos(2.67)*.17;surface(kioskTex,x,2.439,z,3.56,.333,2.67);}
for(let i=0;i<3;i++){const p=P(438+i*9,581+i*6),dest=P(450,608),f=current===7?Math.max(0,Math.min(1,(demoTime-2-i*2)/2)):0;draw(i===0?toy:item,model(p[0]+(dest[0]-p[0])*f,.20+f*.4+Math.sin(f*Math.PI)*.6,p[1]+(dest[1]-p[1])*f))}
if(current===6&&demoTime>3){const p=P(534,757);draw(item,model(p[0],1.25,p[1]))}

updateLabels();if(demoRunning){let n=zones[current].steps.length,idx=Math.min(n-1,Math.floor(demoTime/2.4));if(idx!==stepIndex){stepIndex=idx;$('#steps').querySelectorAll('.step').forEach((e,i)=>{e.classList.toggle('active',i===idx);e.classList.toggle('done',i<idx)});$('#demoStatus').textContent=`动作示意 ${Math.min(idx+1,n)} / ${n}`;$('#actionText').textContent=(idx+1)+' / '+n+' · '+zones[current].steps[idx]}if(current===4&&frameCount%25===0){$('#screenUI .bars').querySelectorAll('i').forEach((e,i)=>e.style.height=12+(Math.sin(demoTime+i*1.7)+1)*15+'px');$('#simCount').textContent='模拟更新 · '+Math.floor(demoTime*12)+' 条'}if(demoTime>n*2.4+1.2){demoRunning=false;$('#playDemo').textContent='↻ 重新演示';$('#demoStatus').textContent='演示完成 · 动作为流程示意';$('#actionText').textContent='演示完成 · 可重播或前往下一站';$('#steps').querySelectorAll('.step').forEach(e=>{e.classList.remove('active');e.classList.add('done')})}}
if(tourAuto&&!document.hidden){tourElapsed+=elapsed;if(tourElapsed>2&&!demoRunning&&demoTime===0&&![1,3,9].includes(current)){demoRunning=true;demoTime=.01;$('#playDemo').textContent='Ⅱ 暂停演示'}if(tourElapsed>Math.max(17,zones[current].steps.length*2.4+4)){if(current===8){tourAuto=false;selectZone(0)}else selectZone(routeOrder[routeOrder.indexOf(current)+1])}}refreshDock();frameCount++;requestAnimationFrame(frame)}

// Single guide module owns all visitor actions and optional view tools.
const ringToggle=document.createElement('button');ringToggle.onclick=()=>{ringMode=ringMode==='auto'?'show':ringMode==='show'?'hide':'auto';renderSignature='';refreshDock()};$('.view-tools').append(ringToggle);
const centreView=document.createElement('button');centreView.textContent='中央弧形影厅';centreView.onclick=()=>{selectZone(0);ringMode='show';goal={target:[hub[0],1.45,hub[1]],yaw:.25,pitch:.12,radius:8.7};refreshDock()};$('.view-tools').prepend(centreView);

const danceView=document.createElement('button');danceView.textContent='中央机器人舞蹈';danceView.onclick=()=>{selectZone(0);ringMode='hide';danceRunning=true;goal={target:[hub[0],1.0,hub[1]],yaw:Math.PI/2,pitch:.12,radius:5.5};refreshDock()};$('.view-tools').append(danceView);
function refreshDock(){const start=current===0,label=start?'展厅全景':zones[current].name;const rb=$('#routeMenuBtn');if(rb.textContent!==label)rb.textContent=label;$('#routeStep').textContent=start?'1000㎡ · 9站导览':String(routeOrder.indexOf(current)).padStart(2,'0')+' / 09';$('#prev').hidden=start;$('#next').hidden=start;$('#playDemo').hidden=false;$('#playDemo').textContent=start?'开始参观':[1,3].includes(current)?'继续参观':demoRunning?'暂停演示':demoTime>0?(demoTime<zones[current].steps.length*2.4+1.2?'继续演示':'重新播放'):'播放演示';$('#moreInfo').hidden=start;$('#moreInfo').textContent=$('#detail').classList.contains('expanded')?'收起详情':'详情';$('#tour').textContent=tourAuto?'停止自动导览':'自动导览';ringToggle.textContent=ringVisible?'隐藏中央环墙':'显示中央环墙';$('#actionText').hidden=!demoRunning&&demoTime===0;}
const selectWithLegacy=selectZone;selectZone=function(i){selectWithLegacy(i);if(canvas.clientWidth/canvas.clientHeight<.8){if(current===5||current===6)goal.radius*=1.8;else if([2,3,7].includes(current))goal.radius*=1.4}$('#viewMenu').hidden=true;$('#viewOptions').setAttribute('aria-expanded','false');refreshDock();};
const playWithLegacy=$('#playDemo').onclick;$('#playDemo').onclick=()=>{if(current===0){tourAuto=false;selectZone(1)}else if([1,3].includes(current)){tourAuto=false;selectZone(current+1)}else{playWithLegacy();refreshDock()}};
$('#tour').onclick=()=>{if(current===0){selectZone(1);tourAuto=true}else tourAuto=!tourAuto;tourElapsed=0;refreshDock()};
$('#viewOptions').onclick=()=>{const panel=$('#viewMenu');panel.hidden=!panel.hidden;$('#viewOptions').setAttribute('aria-expanded',String(!panel.hidden));$('#routeMenu').hidden=true};
$('#close').onclick=()=>{const compact=$('#guideDock').classList.toggle('compact');$('#close').textContent=compact?'展开':'收起';$('#close').setAttribute('aria-label',compact?'展开导览':'收起导览');$('#viewMenu').hidden=true;$('#routeMenu').hidden=true};
$('#routeMenuBtn').addEventListener('click',()=>{$('#viewMenu').hidden=true});$('#viewMenu').addEventListener('click',e=>{if(e.target.closest('button')){$('#viewMenu').hidden=true;$('#viewOptions').setAttribute('aria-expanded','false')}});


const topNavBar=document.createElement('header');topNavBar.className='top-nav';topNavBar.innerHTML='<span class="site-title">合肥展厅<span>空间导览</span></span><div class="top-actions"><button id="topOverview">全景</button><button id="topZones" aria-expanded="false">展区</button><button id="topPlan">平面图</button><button id="topViews" aria-expanded="false">视图</button><button id="topFull">全屏</button></div>';document.body.append(topNavBar);
const routePanel=$('#routeMenu'),viewPanel=$('#viewMenu');topNavBar.append(routePanel,viewPanel);
$('#topOverview').onclick=()=>$('#reset').click();$('#topZones').onclick=()=>{routePanel.hidden=!routePanel.hidden;viewPanel.hidden=true;$('#topZones').setAttribute('aria-expanded',String(!routePanel.hidden))};$('#topPlan').onclick=()=>mapButton.click();$('#topViews').onclick=()=>{viewPanel.hidden=!viewPanel.hidden;routePanel.hidden=true;$('#topViews').setAttribute('aria-expanded',String(!viewPanel.hidden))};$('#topFull').onclick=()=>$('#full').click();
$('#reset').hidden=true;mapButton.hidden=true;$('#full').hidden=true;
$('#routeMenuBtn').disabled=true;$('#routeMenu .menu-heading').firstChild.textContent='选择展区';$('#routeMenuBtn').removeAttribute('aria-expanded');
mapButton.textContent='俯视平面图';compareButton.textContent='原图对照';aiViewButton.textContent='采集视角';industryViewButton.textContent='工业说明';danceView.textContent='中央机器人舞蹈';$('#closeMenu').textContent='关闭';$('#prev').textContent='上一站';$('#loading').textContent='正在载入展厅';$('#fallback').textContent='请使用支持 WebGL 的浏览器查看展厅';
const legacyRefresh=refreshDock;refreshDock=function(){legacyRefresh();$('#routeStep').textContent=current?String(current).padStart(2,'0')+' / 08':'1000㎡ · 9站导览';$('#playDemo').textContent=current===0?'开始参观':[1,3].includes(current)?'继续参观':demoRunning?'暂停演示':demoTime===0?'播放演示':demoTime<zones[current].steps.length*2.4+1.2?'继续演示':'重新播放';$('#next').textContent=current===8?'返回全景':'下一站';$('#moreInfo').textContent=$('#detail').classList.contains('expanded')?'收起详情':'详情';$('#close').textContent=$('#guideDock').classList.contains('compact')?'展开':'收起';$('#tour').textContent=tourAuto?'停止自动导览':'自动导览';ringToggle.textContent='环墙：'+({auto:'自动',show:'常显',hide:'隐藏'}[ringMode]);$('#topZones').setAttribute('aria-expanded',String(!routePanel.hidden));$('#topViews').setAttribute('aria-expanded',String(!viewPanel.hidden));};
// Keep screen mode independent from text labels.
aiViewButton.onclick=()=>{const capture=document.body.dataset.aiScreen==='true';goal=capture?{target:[hub[0]+Math.cos(.52)*9.1,1.12,hub[1]+Math.sin(.52)*9.1],yaw:-2.02,pitch:.16,radius:3.7}:aiScreenView();document.body.dataset.aiScreen=String(!capture);aiViewButton.textContent=capture?'看板视角':'采集视角'};
zones[7].steps=['抬起清洁布','定位茶几表面','沿台面连续擦拭','抬起收回','完成清洁'];zones[7].desc='沙发与茶几共用同一个圆心与弧线方向。机器人在茶几前擦拭桌面，清洁布接触表面后保持高度，完成后先抬起再收回。';
const fixedSelect=selectZone;selectZone=function(i){fixedSelect(i);aiViewButton.textContent='采集视角';industryViewButton.textContent='工业说明';$('#detailDesc').textContent=zones[current].desc;$('#detailDesc').dataset.ready='true';if(current===2)goal={target:[P(827,341)[0],1.0,P(827,341)[1]],yaw:-1.45,pitch:.22,radius:canvas.clientWidth/canvas.clientHeight<.8?7.5:5.2};};
$('#moreInfo').onclick=()=>{const expanded=$('#detail').classList.toggle('expanded');$('#detail').hidden=false;$('#detailDesc').textContent=zones[current].desc;$('#moreInfo').setAttribute('aria-expanded',String(expanded));refreshDock()};
document.addEventListener('pointerdown',e=>{if(!topNavBar.contains(e.target)){routePanel.hidden=true;viewPanel.hidden=true}});

$('#prev').onclick=()=>{tourAuto=false;selectZone(routeOrder[Math.max(0,routeOrder.indexOf(current)-1)])};
$('#next').onclick=()=>{tourAuto=false;selectZone(routeOrder[(routeOrder.indexOf(current)+1)%routeOrder.length])};
$('#playDemo').onclick=()=>{if(current===0){tourAuto=false;selectZone(1)}else if([1,3,9].includes(current)){$('#next').click()}else{demoRunning=!demoRunning;if(demoRunning&&demoTime>=zones[current].steps.length*2.4){demoTime=0;stepIndex=-1}refreshDock()}};
const refreshBeforeRoute=refreshDock;refreshDock=function(){refreshBeforeRoute();if(current===9){$('#playDemo').textContent='前往咖啡吧台';$('#actionText').hidden=true}$('#routeStep').textContent=current?String(routeOrder.indexOf(current)).padStart(2,'0')+' / 09':'1000㎡ · 9站导览';};
eye=[target[0]+Math.sin(yaw)*Math.cos(pitch)*radius,target[1]+Math.sin(pitch)*radius,target[2]+Math.cos(yaw)*Math.cos(pitch)*radius];
resize();selectZone(0);requestAnimationFrame(frame);$('#loading').style.display='none';window.showroom={selectZone,getState:()=>({current,demoRunning,stepIndex,tourAuto,activeModule,webgl:!!gl,floorArea:FLOOR_AREA,planScale:MAP.scale,robotCount:robots.length,robotBodyBounds:robotBody.bounds,robotScale:ROBOT_SCALE,robotDimensions:{length:.8,width:.7,height:1.6},cartBounds:calibratedCartBounds,shopDimensions:{width:5,depth:3},wallHeight:WALL_HEIGHT,ringVisible,ringMode,eye:eye.slice(),target:target.slice(),goal,coffeeCounterHeight:.8,collectorDeskHeight:.84,coffeeRobotHeight:1.6,industrialRobotsBehindDesk:true,roundedDesks:true,danceTime,benchArms:2,vertices:architecture.count+furniture.count}),project};
