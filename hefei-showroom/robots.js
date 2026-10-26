const robotBody=build(()=>{
 roundedBox(0,.036,0,.70,.072,.80,.16,black);
 roundedBox(0,.185,0,.676,.244,.77,.155,silver);
 roundedBox(0,.311,-.018,.648,.018,.728,.15,black);
 for(const x of [-.245,.245])for(const z of [-.26,.26]){
  sphere(x,.047,z,.058,.047,.060,[.20,.17,.10]);
  sphere(x,.047,z,.027,.028,.061,C.metal);
 }
 roundedBox(0,.205,.387,.30,.027,.008,.003,C.light);
 roundedBox(0,.095,.391,.36,.018,.008,.003,black);
 // Broad rear lift column, black crown, violet status seam and twin guide rails.
 roundedBox(0,.862,-.194,.224,1.084,.185,.074,silver);
 roundedBox(0,1.411,-.194,.227,.035,.188,.074,black);
 roundedBox(0,1.391,-.194,.227,.004,.189,.073,C.purple);
 for(const x of [-.050,.050])roundedBox(x,.865,-.099,.005,.982,.004,.001,black);
 for(const x of [-.115,.115])roundedBox(x,.86,-.194,.005,.99,.065,.002,C.metal);
 // Forward cantilever and tapered chest; the front is positive Z.
 roundedBox(0,1.25,-.097,.24,.10,.19,.035,silver);
 shell(0,.045,[[.976,.102,.069],[.995,.115,.077],[1.035,.124,.083],
  [1.12,.145,.094],[1.24,.178,.110],[1.29,.181,.109],
  [1.33,.155,.090],[1.355,.106,.061],[1.366,.068,.046]],silver);
 sphere(0,.976,.046,.104,.055,.071,silver);
 roundedBox(0,1.009,.132,.083,.016,.008,.004,black);
 roundedBox(0,1.055,.138,.020,.004,.003,.001,black);
 for(const side of [-1,1])sphere(side*.213,1.278,.040,.070,.076,.065,silver);
 cyl(0,1.385,.046,.041,.075,black,48);
 // Keep the body's measured top at 1.600 m, including the black head.
 sphere(0,1.482,.046,.095,.118,.076,black);
 // Side ventilation grille and recessed service panel on both flanks.
 for(const side of [-1,1]){
  for(let j=0;j<12;j++)box(side*.339,.165+j*.004,-.055,.003,.0015,.145,C.metal);
  for(let j=0;j<9;j++)box(side*.340,.20+(j-4)*.005,.10,.003,.002,Math.sqrt(1-((j-4)/5)**2)*.062,black);
 }
});
const robotTrim=build(()=>{
 // Full-height glossy black oval visor with no invented eyes or facial display.
 sphere(0,1.486,.088,.087,.111,.045,[.012,.014,.017]);
 // Curved dark collar/bib, following the sloping upper chest surface.
 const rows=[[1.205,.085,.156],[1.22,.101,.159],[1.28,.124,.165],[1.315,.103,.149],[1.345,.065,.119]];
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<24;i++){
  const point=(r,k)=>{const u=(k/24*2-1);return[u*r[1],r[0],r[2]-.029*u*u]};
  const a=point(rows[j],i),b=point(rows[j],i+1),c=point(rows[j+1],i),d=point(rows[j+1],i+1),n=norm(cross(sub(b,a),sub(c,a)));
  tri(a,b,c,n,[.045,.047,.052]);tri(b,d,c,n,[.045,.047,.052]);
 }
 roundedBox(0,1.217,.163,.12,.020,.007,.008,[.012,.014,.017]);
});robotTrim.finish=.10;

const singleArm=build(()=>{cyl(0,.25,0,.28,.50,C.dark);sphere(0,.56,0,.19,.19,.19,C.white);box(0,.90,0,.20,.65,.20,C.white);sphere(0,1.22,0,.15,.15,.15,C.dark);box(0,1.32,.24,.15,.18,.52,C.white);sphere(0,1.32,.5,.13,.13,.13,C.purple);box(0,1.2,.57,.14,.25,.12,C.dark);box(-.09,1.1,.57,.06,.16,.06,C.white);box(.09,1.1,.57,.06,.16,.06,C.white)});
const link=build(()=>{
 shell(0,0,[[0,.043,.041],[.05,.055,.052],[.15,.061,.056],[.32,.059,.054],
  [.72,.050,.047],[.89,.045,.043],[.96,.039,.038],[1,.035,.035]],silver);
 cyl(0,.04,0,.047,.025,C.metal,48);cyl(0,.96,0,.040,.024,black,48);
}),joint=build(()=>{
 sphere(0,0,0,.064,.064,.061,silver);
 localFrame(0,0,0,()=>{
  const start=verts.length;cyl(0,0,0,.046,.133,black,48);
  cyl(0,.069,0,.040,.008,silver,48);cyl(0,-.069,0,.040,.008,silver,48);
  cyl(0,.074,0,.031,.003,C.metal,48);cyl(0,-.074,0,.031,.003,C.metal,48);
  // Rotate the circular bearing axis from Y to X.
  for(let i=start;i<verts.length;i+=9){const y=verts[i+1],ny=verts[i+4];verts[i+1]=verts[i];verts[i]=y;verts[i+4]=verts[i+3];verts[i+3]=ny;}
 });
}),grip=build(()=>{
 cyl(0,.057,0,.042,.036,black,48);cyl(0,.032,0,.048,.022,silver,48);
 roundedBox(0,-.005,0,.115,.075,.086,.013,silver);
 roundedBox(0,-.047,0,.139,.016,.078,.006,black);
 for(const side of [-1,1]){
  roundedBox(side*.058,-.078,0,.028,.058,.055,.009,silver);
  roundedBox(side*.051,-.119,.006,.038,.044,.066,.012,silver);
  roundedBox(side*.032,-.120,.008,.008,.032,.052,.003,black);
  for(const z of [-.029,.029])sphere(side*.058,-.070,z,.009,.009,.003,C.dark);
 }
 roundedBox(.079,.005,-.015,.040,.048,.036,.004,C.metal);
 for(const x of [.069,.086])box(x,.006,.004,.007,.009,.003,black);
 // Short protected cable from the wrist to the gripper camera.
 for(let i=0;i<8;i++){const a=i/8*Math.PI;sphere(.068+Math.sin(a)*.023,.040+Math.cos(a)*.037,-.021,.004,.008,.004,black);}
}),item=build(()=>{box(0,0,0,.20,.26,.18,C.orange)}),toy=build(()=>sphere(0,0,0,.14,.14,.14,C.orange)),part=build(()=>{cyl(0,0,0,.07,.16,C.metal,6);cyl(0,.10,0,.12,.04,C.metal,6)});
robotBody.finish=.82;singleArm.finish=.78;link.finish=.80;grip.finish=.68;joint.finish=.67;part.finish=.83;

function linkBetween(a,b){let y=sub(b,a),len=Math.max(.001,Math.hypot(...y));y=norm(y);let x=norm(cross(Math.abs(y[2])>.99?[1,0,0]:[0,0,1],y)),z=cross(x,y);return new Float32Array([x[0],x[1],x[2],0,y[0]*len,y[1]*len,y[2]*len,0,z[0],z[1],z[2],0,...a,1])}
function drawBody(mat){draw(robotBody,mat);draw(robotTrim,mat);if(!shadowPass)drawRobotBrand(mat)}
function arm(base,side,hand,kind=0,high=false){
 const shoulder=[side*.213,1.278,.040],v=sub(hand,shoulder),d=Math.hypot(...v),mid=mix(shoulder,hand,.5);
 const direction=norm(v),pole=[side*.55,-1,-.35],along=dot(pole,direction);
 const bendDirection=norm(pole.map((p,i)=>p-along*direction[i]));
 const bend=Math.min(.29,Math.sqrt(Math.max(.003,.34*.34-d*d/4)));
 const elbow=mid.map((p,i)=>p+bendDirection[i]*bend);
 draw(link,mul(base,linkBetween(shoulder,elbow)));draw(link,mul(base,linkBetween(elbow,hand)));draw(joint,mul(base,model(...shoulder)));draw(joint,mul(base,model(...elbow)));const wrist=model(...hand,.80,.80,.80);if(false&&hand[1]>1.3){wrist[5]*=-1;wrist[10]*=-1}draw(grip,mul(base,wrist));
}

const robotBrand=textSurface(512,128,(c,w,h)=>{c.fillStyle='#d4d5d8';c.font='italic 48px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('ZERITH',w/2,h/2)});
const robotBaseBrand=textSurface(512,128,(c,w,h)=>{c.fillStyle='#25262a';c.font='42px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('ZERITH  /  H1 PRO',w/2,h/2)});
function robotDecal(t,mat,x,y,z,w,h){const m=mul(mat,model(x,y,z,w,h,1));texMesh({buffer:quad,count:6},t,m)}
function drawRobotBrand(mat){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);robotDecal(robotBrand,mat,0,1.274,.170,.112,.027);robotDecal(robotBaseBrand,mat,0,.130,.388,.245,.045);gl.disable(gl.BLEND)}


function h1(mat,right=[.24,.96,.36],left=[-.24,.96,.36]){drawBody(mat);arm(mat,1,right);arm(mat,-1,left)}
