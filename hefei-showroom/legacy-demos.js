function softLegacyBox(x,y,z,w,h,d,r,col){if(w>.9&&h<1)curvedBlock(x,y,z,w,h,d,Math.min(.28,d*.25),Math.min(.15,w*.04),col);else roundedBox(x,y,z,w,h,d,Math.min(Math.max(r,.04),w*.35,d*.35),col)}
const legacyShop=build(()=>{const start=verts.length;
softLegacyBox(0,.22,-.5,4.0,.42,1.92,.30,[.82,.75,.64]);for(const x of [-1.70,1.70])softLegacyBox(x,1.43,-.85,.50,2.30,1.16,.22,[.83,.78,.71]);box(0,1.43,-1.40,3.1,2.15,.10,[.88,.85,.80]);softLegacyBox(0,2.38,-.85,3.9,.35,1.16,.15,[.83,.78,.71]);box(0,.51,-.24,2.95,.30,.12,C.cream);
box(-.45,1.36,-1.23,1.82,1.64,.06,[.85,.82,.77]);box(0,2.55,-.30,3.25,.12,1.42,C.cream);
for(const x of [-1.7,1.7]){softLegacyBox(x,1.37,-.13,.40,1.12,.14,.18,[.78,.035,.055]);softLegacyBox(x,1.60,-.045,.28,.40,.035,.10,C.white);box(x,1.58,-.02,.20,.24,.02,C.dark)}
box(1.45,1.30,-.18,.40,.32,.08,C.dark);box(1.45,1.30,-.132,.34,.26,.015,C.purple);
for(let j=0;j<4;j++){box(-.45,.68+j*.35,-.82,1.82,.035,.62,C.metal);for(let k=0;k<12;k++){const col=[[.9,.32,.035],[.66,.045,.04],[.035,.32,.09],[.7,.62,.13]][j];cyl(-1.27+k*.15,.79+j*.35,-.80,.045,.21,col,12);cyl(-1.27+k*.15,.91+j*.35,-.80,.026,.04,C.white,12)}}
for(const x of [-1.55,1.55])for(const z of [-1.12,.10])cyl(x,.06,z,.06,.12,C.dark,16);
for(let i=start;i<verts.length;i+=9){verts[i]*=1.25;verts[i+1]*=.90;verts[i+2]*=3/1.92;const n=norm([verts[i+3]/1.25,verts[i+4]/.90,verts[i+5]/(3/1.92)]);verts[i+3]=n[0];verts[i+4]=n[1];verts[i+5]=n[2]}});