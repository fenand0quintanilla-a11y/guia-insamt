import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { PROJECTS } from './project-data.js';

const $ = id => document.getElementById(id);
const PLACES = [
  {name:'Taller automotriz',detail:'Bahía abierta con elevador; acceso junto al portón.',target:[5.7,6.2,.38],route:'ground'},
  {name:'Baños femeninos 1',detail:'Pabellón 1, después del taller.',target:[6.15,16.1,.38],route:'ground'},
  {name:'Baños masculinos 1',detail:'Pabellón 1, antes de dirección.',target:[6.15,22.1,.38],route:'ground'},
  {name:'Dirección y sala de maestros',detail:'Pabellón 1, antes del Aula 1.',target:[6.15,28.1,.38],route:'ground'},
  {name:'Gradas del taller',detail:'Subida de 2 m de ancho al nivel de la cancha.',target:[13.1,4.4,2.55],route:'workshopStairs'},
  {name:'Gradas de 3 m',detail:'Subida junto a la rampa, frente a las primeras aulas.',target:[14.1,36,2.55],route:'mainStairs'},
  {name:'Rampa',detail:'Dos giros en U y salida junto a las gradas de 3 m.',target:[13.7,34,2.55],route:'ramp'},
  {name:'Chalet 1',detail:'Esquina, junto a la cancha y el pabellón 2.',target:[29.4,.2,2.55],route:'upperFront'},
  {name:'Escaleras en U',detail:'Subida al segundo piso del pabellón 2.',target:[28.7,30.5,2.55],route:'upper'},
  {name:'Baños femeninos 2',detail:'Pabellón 2, junto a las escaleras en U.',target:[28.8,37.2,2.55],route:'upper'},
  {name:'Baños masculinos 2',detail:'Pabellón 2, después de los baños femeninos.',target:[28.8,40.2,2.55],route:'upper'},
  {name:'Chalet 2',detail:'Al nivel de la clínica.',target:[19.9,50.4,2.55],route:'upperRear'}
];
let current = PROJECTS[0];
let directory='projects';
let previewProject=null;
let selectItem=()=>{window.location.href='./plano.html'};
const normal = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function list() {
  const q = normal($('search').value.trim());
  $('list').replaceChildren();
  const matches=(directory==='projects'?PROJECTS:PLACES).filter(p=>normal(`${p.name} ${p.room||''} ${p.group||''}`).includes(q));
  $('listhead').textContent=directory==='projects'?`${PROJECTS.length} proyectos con lugar confirmado`:'Puntos fijos del instituto';
  for(const [name,id] of [['projects','showProjects'],['places','showPlaces']]){
    $(id).classList.toggle('active',directory===name);
    $(id).setAttribute('aria-pressed',String(directory===name));
  }
  if(!matches.length){const p=document.createElement('p');p.className='empty';p.textContent='No hay resultados para esa búsqueda.';$('list').append(p)}
  matches.forEach(p=>{
    const b=document.createElement('button');b.type='button';b.className='project'+((previewProject||current).name===p.name?' active':'');
    b.dataset.name=p.name;
    const tag=document.createElement('span');tag.className='roomtag';tag.textContent=directory==='projects'?p.room:'●';
    const desc=document.createElement('span');const title=document.createElement('b');title.textContent=p.name;const sub=document.createElement('small');sub.textContent=directory==='projects'?p.section:p.detail;desc.append(title,sub);
    const chev=document.createElement('span');chev.className='chev';chev.textContent='›';chev.setAttribute('aria-hidden','true');b.append(tag,desc,chev);
    b.addEventListener('click',()=>selectItem(p));$('list').append(b);
  });
}
function details(){
  $('details').replaceChildren();
  const project=Boolean(current.room);
  const k=document.createElement('div');k.className='kicker';k.textContent='Ruta desde la entrada';
  const h=document.createElement('h2');h.textContent=project?`${current.name} · ${current.room}`:current.name;
  const p=document.createElement('p');p.textContent=project?`Sigue la línea turquesa desde la entrada hasta ${current.room}. El recorrido es orientativo.`:`${current.detail} La línea turquesa marca el recorrido orientativo.`;
  const m=document.createElement('div');m.className='meta';m.textContent=project?current.section:'Punto fijo · Ubicación orientativa';$('details').append(k,h,p,m);
}
$('search').addEventListener('input',list);
$('showProjects').addEventListener('click',()=>{directory='projects';$('search').value='';list()});
$('showPlaces').addEventListener('click',()=>{directory='places';$('search').value='';list()});

try {
  const canvas=$('scene'), viewport=$('canvasarea');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(viewport.clientWidth,viewport.clientHeight,false);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.6;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#dce9e6');scene.fog=new THREE.Fog('#dce9e6',115,230);
  const camera=new THREE.PerspectiveCamera(40,viewport.clientWidth/viewport.clientHeight,.1,400);
  const homePos=new THREE.Vector3(70,60,48),homeTarget=new THREE.Vector3(17,1.2,-31);
  camera.position.copy(homePos);
  const controls=new OrbitControls(camera,canvas);controls.target.copy(homeTarget);controls.enableDamping=true;controls.dampingFactor=.09;controls.rotateSpeed=.65;controls.zoomSpeed=.7;controls.panSpeed=.7;controls.minDistance=1.4;controls.maxDistance=165;controls.maxPolarAngle=Math.PI/2.08;controls.update();
  scene.add(new THREE.HemisphereLight(0xecfbff,0x7f9a86,2.4));
  const sun=new THREE.DirectionalLight(0xfff5de,3.1);sun.position.set(-35,80,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=95;sun.shadow.camera.bottom=-80;sun.shadow.normalBias=.02;scene.add(sun);
  const MAT={ground:mat('#91ad8b'),grass:mat('#a6c5a0',{side:THREE.DoubleSide}),terrace:mat('#b8cabe'),earth:mat('#8c9d88'),path:mat('#e4ddd0',{side:THREE.DoubleSide}),brick:mat('#a9674d'),white:mat('#f5f5ef'),blue:mat('#225b9c'),blueDark:mat('#163e72'),roof:mat('#d5dfe1',{metalness:.16,side:THREE.DoubleSide}),roofRib:mat('#e9f0f0',{metalness:.18}),window:mat('#50748a',{metalness:.18,roughness:.26}),frame:mat('#244d73'),court:mat('#c17c60'),stairs:mat('#cdd2ce'),gold:mat('#f3bb72'),cyan:mat('#00d8b5',{emissive:'#006d60',emissiveIntensity:.45}),steel:mat('#718e98',{metalness:.5}),tank:mat('#4b9bc2')};
  function mat(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.72,...opts})}
  const body=new THREE.Group(),upper=new THREE.Group(),markers=new THREE.Group();scene.add(body,upper,markers);
  const clickable=[];
  // SCAD plan uses x,y footprints; in Three.js the plan's y-axis points toward negative z.
  function box(parent,x,y,z,w,d,h,m){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x+w/2,z+h/2,-y-d/2);mesh.receiveShadow=true;mesh.castShadow=true;parent.add(mesh);return mesh}
  function cyl(parent,x,y,z,r,h,m){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,16),m);o.position.set(x,z+h/2,-y);o.castShadow=true;parent.add(o);return o}
  function rail(parent,x1,y1,x2,y2,z,height=1.05){const dx=x2-x1,dy=y2-y1,n=Math.max(2,Math.ceil(Math.hypot(dx,dy)/2));for(let i=0;i<=n;i++){const t=i/n;box(parent,x1+dx*t-.045,y1+dy*t-.045,z,.09,.09,height,MAT.blueDark)}for(const ht of [.55,1]){const start=new THREE.Vector3(x1,z+ht,-y1),end=new THREE.Vector3(x2,z+ht,-y2),v=end.clone().sub(start);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,v.length(),8),MAT.blueDark);bar.position.copy(start.add(end).multiplyScalar(.5));bar.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());parent.add(bar)}}
  function railPath(parent,points){
    for(let j=0;j<points.length-1;j++){
      const [x1,y1,z1]=points[j],[x2,y2,z2]=points[j+1];
      const n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)/1.45));
      for(let i=j?1:0;i<=n;i++){
        const t=i/n;
        box(parent,x1+(x2-x1)*t-.045,y1+(y2-y1)*t-.045,z1+(z2-z1)*t,.09,.09,1.05,MAT.blueDark);
      }
      for(const lift of [.55,1]){
        const a=new THREE.Vector3(x1,z1+lift,-y1),b=new THREE.Vector3(x2,z2+lift,-y2);
        const delta=b.clone().sub(a),bar=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,delta.length(),8),MAT.blueDark);
        bar.position.copy(a.add(b).multiplyScalar(.5));bar.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());parent.add(bar);
      }
    }
  }
  function textSprite(parent,label,x,y,z,scale=3,color='#163c54'){
    const cvs=document.createElement('canvas');cvs.width=512;cvs.height=112;const c=cvs.getContext('2d');
    c.fillStyle='rgba(255,255,250,.95)';c.beginPath();c.roundRect(5,5,502,102,21);c.fill();c.strokeStyle='#aec8c6';c.lineWidth=4;c.stroke();
    c.fillStyle=color;c.font='700 35px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,256,57,475);
    const tex=new THREE.CanvasTexture(cvs);tex.colorSpace=THREE.SRGBColorSpace;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthWrite:false,transparent:true}));sp.position.set(x,z,-y);sp.scale.set(scale,scale*112/512,1);parent.add(sp);return sp
  }
  function placeName(label,x,y,z,w=5){textSprite(body,label,x,y,z,w)}
  function roofSurface(parent,points,material=MAT.roof){
    const geo=new THREE.BufferGeometry();
    const p=points.flatMap(([x,y,z])=>[x,z,-y]);
    geo.setAttribute('position',new THREE.Float32BufferAttribute([...p.slice(0,9),...p.slice(6,9),...p.slice(9,12),...p.slice(3,6)],3));
    geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,material);
    mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
  }
  // Continuous pitched metal roofs replace individual flat classroom caps.
  function gableRoof(parent,x,y,w,d,eave,rise,axis='y'){
    const lip=.25;
    if(axis==='y'){
      const left=x-lip,right=x+w+lip,mid=x+w/2,a=y-lip,b=y+d+lip;
      roofSurface(parent,[[left,a,eave],[mid,a,eave+rise],[left,b,eave],[mid,b,eave+rise]]);
      roofSurface(parent,[[mid,a,eave+rise],[right,a,eave],[mid,b,eave+rise],[right,b,eave]]);
      for(let xx=left+.3;xx<right;xx+=.38){const z=eave+rise*(1-Math.abs(xx-mid)/(mid-left));box(parent,xx-.025,a,z+.012,.05,b-a,.032,MAT.roofRib)}
    }else{
      const near=y-lip,far=y+d+lip,mid=y+d/2,a=x-lip,b=x+w+lip;
      roofSurface(parent,[[a,near,eave],[a,mid,eave+rise],[b,near,eave],[b,mid,eave+rise]]);
      roofSurface(parent,[[a,mid,eave+rise],[a,far,eave],[b,mid,eave+rise],[b,far,eave]]);
      for(let yy=near+.3;yy<far;yy+=.38){const z=eave+rise*(1-Math.abs(yy-mid)/(mid-near));box(parent,a,yy-.025,z+.012,b-a,.05,.032,MAT.roofRib)}
    }
  }
  // Terrain and two elevation levels.
  box(body,-7,-7,-.38,51,78,.38,MAT.ground);
  box(body,-3,-1,0,11,66,.20,MAT.path);
  box(body,10.2,-1,0,27.8,4,2.4,MAT.earth);
  // A single retaining edge follows the court, ramp and pavilion. Separate
  // terrace strips meet at their ends; none changes x or covers a ramp slab.
  for(const [y,d] of [[3,12],[15,11],[26,9],[35,28]]){
    box(body,14.2,y,0,23.8,d,2.4,MAT.earth);
    box(body,14.2,y,2.4,23.8,d,.10,MAT.terrace);
  }
  const grade=9.2;
  for(const [start,len] of [[15,11],[35,28]]){
    roofSurface(body,[[grade,start,.20],[14.2,start,2.46],[grade,start+len,.20],[14.2,start+len,2.46]],MAT.grass);
  }
  // Broad entrance apron; the narrower formal corridor starts at Baños F. 1.
  box(body,6.4,0,.22,3.05,15,.10,MAT.path);
  box(body,6.4,15,.22,1.8,48,.10,MAT.path);
  // Open square ditch, 1 m across and 20 cm below the corridor surface.
  for(const [y,len] of [[15,11],[35,28]]){
    box(body,8.2,y,.02,1,len,.10,MAT.steel);
    box(body,8.2,y,.12,.06,len,.10,MAT.path);
    box(body,9.14,y,.12,.06,len,.10,MAT.path);
  }
  // Stop the corridor at the laboratory facade; continuing through it caused
  // the paved fill to appear inside the room when the view moved.
  box(body,28,14,2.51,1.65,34.2,.12,MAT.path);
  box(body,22,43.7,2.51,6,1.5,.12,MAT.path);
  // Patio observado en las fotos: caminos de ladrillo alrededor de césped.
  box(body,19,15,2.51,1.65,29,.08,MAT.brick);
  box(body,19,30.5,2.51,9,2,.08,MAT.brick);
  box(body,22,18,2.51,5,10,.08,MAT.grass);
  box(body,22,34.5,2.51,5,7,.08,MAT.grass);
  box(body,16.8,37.5,2.51,4.4,5.2,.08,MAT.brick);
  cyl(body,24.5,30.5,2.6,.085,6.0,MAT.steel);
  // A courtyard palm and a broader paved apron are visible in the interior reference.
  const palmX=21.2,palmY=39.5,palmTop=7.05;
  cyl(body,palmX,palmY,2.58,.16,palmTop-2.58,MAT.earth);
  const frondMat=mat('#538a63',{side:THREE.DoubleSide});
  for(let i=0;i<12;i++){
    const angle=i*Math.PI/6,dx=Math.cos(angle),dy=Math.sin(angle);
    const leaf=new THREE.BufferGeometry();
    const points=[palmX,palmTop,-palmY,
      palmX+dx*1.55-dy*.34,palmTop+.17,-palmY-dy*1.55-dx*.34,
      palmX+dx*2.85,palmTop-.95,-palmY-dy*2.85,
      palmX+dx*1.55+dy*.34,palmTop+.17,-palmY-dy*1.55+dx*.34];
    leaf.setAttribute('position',new THREE.Float32BufferAttribute([
      ...points.slice(0,3),...points.slice(3,6),...points.slice(6,9),
      ...points.slice(0,3),...points.slice(6,9),...points.slice(9,12)
    ],3));leaf.computeVertexNormals();body.add(new THREE.Mesh(leaf,frondMat));
  }
  // The long outer rail is one straight line. It stops for the ramp exit;
  // the same line resumes after the adjacent three-metre stair opening.
  railPath(body,[[14.2,5.5,2.51],[14.2,33,2.51]]);
  railPath(body,[[14.2,37.5,2.51],[14.2,63,2.51]]);
  // Classroom entrances sit 90 cm behind the facade; emergency exits are flush.
  function room(parent,id,x,y,w,d,z,{facing='east',featured=false,height=3,roof=true,doorCenters=null,doorOrder=null,flatExit=true}={}){
    const g=new THREE.Group();parent.add(g);g.userData.room=id;
    const match=id.match(/^Aula (\d+)/),classroom=Boolean(match)||id==='OPV'||id==='Clínica';
    const faceX=facing==='east'?x+w-.18:x;
    const outerX=facing==='east'?x+w+.018:x-.075;
    if(classroom&&facing==='north'){
      // Doors on the short north wall face the corridor at the turn of the L.
      const centers=doorCenters||[x+1.45,x+w-1.45];
      const order=doorOrder||['salida','principal'];
      const openings=centers.map((center,i)=>({lo:center-.48,hi:center+.48,type:order[i]}));
      box(g,x,y,z,w,d,.18,MAT.white);
      box(g,x,y+d-.18,z,w,.18,height,MAT.white);
      box(g,x,y+d-.20,z+.07,w,.06,.94,MAT.blue);
      for(const wallX of [x,x+w-.18]){
        box(g,wallX,y,z,.18,d,height,MAT.white);
        box(g,wallX,y,z+.07,.18,d,.94,MAT.blue);
      }
      let cursor=x;
      for(const a of openings){
        if(a.lo>cursor){box(g,cursor,y,z,a.lo-cursor,.18,height,MAT.white);box(g,cursor,y-.02,z+.07,a.lo-cursor,.06,.94,MAT.blue)}
        if(a.type==='salida'&&flatExit){
          box(g,a.lo+.02,y,z+.12,a.hi-a.lo-.04,.08,2.22,MAT.blueDark);
          box(g,a.lo,y,z+2.42,a.hi-a.lo,.18,height-2.42,MAT.white);
          textSprite(g,'SALIDA',(a.lo+a.hi)/2,y-.12,z+2.78,1.55,'#16835d');
        }else{
          for(const wallX of [a.lo,a.hi-.10]){
            box(g,wallX,y,z,.10,.90,2.42,MAT.white);
            box(g,wallX,y,z+.07,.10,.90,.94,MAT.blue);
          }
          box(g,a.lo+.06,y+.90,z+.16,a.hi-a.lo-.12,.09,2.16,MAT.blueDark);
          box(g,a.lo+.77,y+.89,z+1.07,.06,.12,.055,MAT.steel);
          box(g,a.lo,y,z+2.42,a.hi-a.lo,.90,height-2.42,MAT.white);
          if(a.type==='salida')textSprite(g,'SALIDA',(a.lo+a.hi)/2,y-.12,z+2.78,1.55,'#16835d');
        }
        cursor=a.hi;
      }
      if(cursor<x+w){box(g,cursor,y,z,x+w-cursor,.18,height,MAT.white);box(g,cursor,y-.02,z+.07,x+w-cursor,.06,.94,MAT.blue)}
      box(g,x,y,z+height-.23,w,.24,.23,MAT.white);
    }else if(classroom){
      const num=match?Number(match[1]):11;
      const onlyMain=num===5||num===6;
      const order=doorOrder||(onlyMain?['principal']:(num%2?['principal','salida']:['salida','principal']));
      const centers=doorCenters||(onlyMain?[y+d/2]:[y+1.4,y+d-1.4]);
      const alcoves=centers.map((center,i)=>({lo:center-.57,hi:center+.57,type:order[i]}));
      box(g,x,y,z,w,d,.18,MAT.white);
      const backX=facing==='east'?x:x+w-.18;
      box(g,backX,y,z,.18,d,height,MAT.white);
      box(g,backX-.02,y,z+.07,.22,d,.94,MAT.blue);
      for(const sideY of [y,y+d-.18]){
        box(g,x,sideY,z,w,.18,height,MAT.white);
        box(g,x,sideY-.02,z+.07,w,.22,.94,MAT.blue);
      }
      let cursor=y;
      for(const a of alcoves){
        const segment=a.lo-cursor;
        if(segment>0){box(g,faceX,cursor,z,.18,segment,height,MAT.white);box(g,outerX,cursor,z+.07,.06,segment,.94,MAT.blue)}
        if(a.type==='salida'&&flatExit){
          const flushX=facing==='east'?x+w-.08:x;
          box(g,flushX,a.lo+.06,z+.12,.08,a.hi-a.lo-.12,2.22,MAT.blueDark);
          box(g,faceX,a.lo,z+2.42,.18,a.hi-a.lo,height-2.42,MAT.white);
          textSprite(g,'SALIDA',outerX,a.lo+.57,z+2.77,1.55,'#16835d');
          cursor=a.hi;
          continue;
        }
        const recessDepth=.90;
        const recessX=facing==='east'?x+w-recessDepth:x;
        for(const sideY of [a.lo,a.hi-.10]){
          box(g,recessX,sideY,z,recessDepth,.10,2.42,MAT.white);
          box(g,recessX,sideY,z+.07,recessDepth,.10,.94,MAT.blue);
        }
        const innerX=facing==='east'?recessX:x+recessDepth;
        box(g,innerX,a.lo+.07,z+.16,.09,1.0,2.16,MAT.blueDark);
        box(g,innerX,a.lo+.78,z+1.07,.12,.06,.055,MAT.steel);
        box(g,recessX,a.lo,z+2.42,recessDepth,a.hi-a.lo,height-2.42,MAT.white);
        if(a.type==='salida'){
          box(g,outerX,a.lo+.17,z+2.50,.08,.80,.17,mat('#238966'));
          box(g,innerX,a.lo+.17,z+1.15,.11,.80,.045,MAT.steel);
          textSprite(g,'SALIDA',outerX,a.lo+.57,z+2.77,1.55,'#16835d');
        }
        cursor=a.hi;
      }
      if(cursor<y+d){const len=y+d-cursor;box(g,faceX,cursor,z,.18,len,height,MAT.white);box(g,outerX,cursor,z+.07,.06,len,.94,MAT.blue)}
      // Concrete frame conveys the visible seismic construction without claiming certification.
      for(const atY of [y,y+d-.22])box(g,faceX-.03,atY,z,.24,.22,height,MAT.white);
      box(g,faceX-.03,y,z+height-.23,.24,d,.23,MAT.white);
      if(!onlyMain){
        const winY=y+d/2-.60;
        box(g,outerX,winY,z+1.32,.07,1.20,.91,MAT.frame);
        box(g,outerX+.02,winY+.06,z+1.39,.04,1.08,.77,MAT.window);
      }
    }else{
      box(g,x,y,z,w,d,height,MAT.white);
      box(g,x-.025,y-.025,z+.07,w+.05,d+.05,.94,MAT.blue);
      const doorY=y+d*.18;
      box(g,outerX,doorY,z+.12,.07,Math.min(1.07,d*.55),2.18,MAT.blueDark);
      box(g,outerX,doorY+.75,z+1.04,.025,.07,.07,MAT.gold);
      if(d>2.5){
        const winY=y+d*.48;
        box(g,outerX,winY,z+1.28,.065,Math.min(d*.38,2.6),1.02,MAT.frame);
        box(g,outerX+.02,winY+.09,z+1.37,.035,Math.min(d*.38,2.6)-.18,.84,MAT.window);
      }
    }
    if(roof){box(g,x-.22,y-.22,z+height,w+.44,d+.44,.14,MAT.roof);box(g,x-.08,y-.08,z+height+.14,w+.16,d+.16,.045,MAT.steel)}
    const otherX=facing==='east'?x-.08:x+w+.02;
    if(d>2.5&&facing!=='north'){box(g,otherX,y+d*.3,z+1.25,.07,d*.42,1.05,MAT.frame);box(g,otherX+.065,y+d*.3+.07,z+1.32,.025,d*.42-.14,.91,MAT.window)}
    if(featured){
      const hitMat=new THREE.MeshBasicMaterial({visible:false});
      const hit=facing==='north'
        ?box(g,x,y-.14,z,w,.12,height,hitMat)
        :box(g,outerX,y,z,.12,d,height,hitMat);
      if(facing==='north')box(g,x+w*.2,y-.18,z+2.5,1.35,.13,.14,MAT.gold);
      else box(g,outerX,y+d*.2,z+2.5,.13,1.35,.14,MAT.gold);
      hit.userData.room=id;clickable.push(hit);
    }
    textSprite(parent,id,x+w/2,y+d/2,z+height+.75,Math.max(3.5,Math.min(6.8,w*.92)));
    return g;
  }
  // The workshop is a roofed open bay, not a classroom volume.
  box(body,-1.7,0,.20,8.06,15,.12,MAT.stairs);
  // Close the rear west side and the short end; the east-facing work bay
  // remains open beneath the full canopy.
  box(body,-1.7,4,.32,.18,11,2.92,MAT.white);
  box(body,-1.72,4,.36,.22,11,.91,MAT.blue);
  box(body,-1.7,14.82,.32,1.7,.18,2.92,MAT.white);
  box(body,-1.72,14.80,.36,1.74,.22,.91,MAT.blue);
  for(const x of [-1.65,6.3])for(const y of [.15,5,10,14.85]){
    cyl(body,x,y,.32,.10,1.0,MAT.blue);
    cyl(body,x,y,1.32,.08,2.03,MAT.white);
  }
  room(body,'Bodega del taller',-1.7,0,3,4,.32,{height:2.7,roof:false});
  // The vehicle's six-metre axis follows the long axis of the court (x).
  // Its two lift posts flank that axis and leave a clear bay around the car.
  for(const yy of [4.55,7.15]){
    box(body,2.35,yy,.32,.32,.19,2.75,MAT.blueDark);
    box(body,2.30,yy-.15,.32,.50,.49,.16,MAT.steel);
  }
  box(body,2.42,4.65,2.94,.12,2.55,.13,MAT.steel);
  for(const yy of [5.02,6.30])box(body,-.75,yy,.55,6,.28,.13,MAT.steel);
  // Equipment stays outside the car bay and outside the waste-room doors.
  box(body,3.4,8.2,.32,1.15,.75,1.0,MAT.blue);
  for(let i=0;i<3;i++)box(body,3.50,8.22,.54+i*.22,.95,.04,.04,MAT.steel);
  box(body,3.35,9.75,.82,2.4,.65,.16,MAT.steel);
  for(const y of [11.2,11.9,12.6]){
    const tire=new THREE.Mesh(new THREE.TorusGeometry(.32,.11,10,18),MAT.blueDark);
    tire.rotation.y=Math.PI/2;tire.position.set(5.8,.68,-y);body.add(tire);
  }
  // Five one-by-two-metre rooms on the LEFT of the open workshop,
  // with east-facing doors in one row and a clear metre before Baños F. 1.
  for(let i=0;i<5;i++){
    const yy=9+i;
    box(body,-1.35,yy,.32,2,1,2.35,MAT.white);
    box(body,-1.35,yy,.37,2,1,.66,MAT.blue);
    box(body,.65,yy+.10,.48,.075,.80,1.95,MAT.blueDark);
    box(body,.74,yy+.65,1.47,.035,.06,.06,MAT.gold);
    box(body,.63,yy,.32,.12,1,2.35,MAT.white);
  }
  textSprite(body,'RESIDUOS · 5 PUERTAS',-.35,11.5,3.45,7.0);
  textSprite(body,'TALLER · ELEVADOR',2.4,5.85,4.45,8.5);
  const p1=[['Baños femeninos 1',15],['Baños masculinos 1',21],['Maestros y dirección',27],['Aula 1',33],['Aula 2',39],['Aula 3',45],['Aula 4',51],['Cocina',57]];
  p1.forEach(([name,y])=>room(body,name,0,y,6,6,0,{featured:PROJECTS.some(p=>p.room===name),roof:false}));
  const workshopRoof=new THREE.Group();body.add(workshopRoof);
  gableRoof(workshopRoof,-1.7,0,8.06,15,3.35,.58);
  // Metal extension covers the entire broad arrival apron, up to the corridor.
  box(workshopRoof,6.2,0,3.98,3.35,15,.12,MAT.roof);
  // Keep the stair flight and its side exit free of canopy supports.
  for(const yy of [.15,12.75,14.85]){
    cyl(body,9.45,yy,.32,.08,1.0,MAT.blue);
    cyl(body,9.45,yy,1.32,.065,2.67,MAT.white);
  }
  // One galvanized gable covers the classrooms and their shared corridor.
  gableRoof(body,0,15,8.5,48,3.0,.50);
  for(let y=18;y<63;y+=6)cyl(body,8.2,y,.2,.055,2.82,MAT.blue);
  // Present-day entrance: solid closed blue leaves, with no open grille.
  box(body,-1.7,-.55,.20,3,.20,2.60,MAT.white);
  box(body,-1.7,-.57,.20,3,.22,.88,MAT.blueDark);
  box(body,9.5,-.55,.20,1,.20,2.60,MAT.white);
  box(body,9.5,-.57,.20,1,.22,.88,MAT.blueDark);
  for(const x of [1.3,9.5])box(body,x-.10,-.57,.20,.20,.22,2.70,MAT.blueDark);
  box(body,1.4,-.55,.20,4.0,.14,2.55,MAT.blueDark);
  box(body,5.4,-.55,.20,4.0,.14,2.55,MAT.blueDark);
  box(body,5.38,-.58,.20,.04,.18,2.55,MAT.steel);
  // White INSAMT lettering sits directly on the outer face of the metal gate.
  const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=230;
  const sign=signCanvas.getContext('2d');sign.fillStyle='#f4f6f2';sign.font='900 193px system-ui,sans-serif';
  sign.textAlign='center';sign.textBaseline='middle';sign.fillText('INSAMT',512,119,995);
  const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.colorSpace=THREE.SRGBColorSpace;
  const gateName=new THREE.Mesh(new THREE.PlaneGeometry(7.55,1.05),new THREE.MeshBasicMaterial({map:signTexture,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
  gateName.position.set(5.4,1.05,.65);body.add(gateName);
  box(body,-1.7,-1.0,3.0,12.2,1.35,.10,MAT.roof);
  function stairRailX(y,x1,x2,z1,z2,n=15){
    for(let i=0;i<=n;i+=3){const t=i/n;box(body,x1+(x2-x1)*t,y-.045,z1+(z2-z1)*t,.09,.09,1.05,MAT.blueDark)}
    for(const lift of [.55,1.02]){
      const a=new THREE.Vector3(x1,z1+lift,-y),b=new THREE.Vector3(x2,z2+lift,-y);
      const v=b.clone().sub(a),bar=new THREE.Mesh(new THREE.CylinderGeometry(.043,.043,v.length(),8),MAT.blueDark);
      bar.position.copy(a.add(b).multiplyScalar(.5));bar.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());body.add(bar);
    }
  }
  // Workshop stair: two metres wide, same transverse climbing direction as the ramp-side stair.
  const workshopStair={x:8.2,y:3.4,width:2,run:4.8,steps:15};
  for(let i=0;i<workshopStair.steps;i++){
    const xx=workshopStair.x+i*workshopStair.run/workshopStair.steps;
    box(body,xx,workshopStair.y,.20,workshopStair.run/workshopStair.steps+.012,workshopStair.width,(i+1)*2.2/workshopStair.steps,MAT.stairs);
  }
  box(body,13,workshopStair.y,2.52,1.2,workshopStair.width,.08,MAT.path);
  stairRailX(3.3,8.2,13,.20,2.51);
  stairRailX(5.5,8.2,13,.20,2.51);
  rail(body,13,3.3,14.2,3.3,2.51);
  // The three-metre stair faces the end of Aula 1 and start of Aula 2.
  // It crosses the drainage channel and climbs the planted grade toward the court level.
  const crossY=34.5,crossWidth=3,crossX=9.2,crossRun=5,crossN=15;
  box(body,8.2,crossY,.20,1,crossWidth,.12,MAT.path); // level bridge over ditch
  for(let i=0;i<crossN;i++){
    const stepX=crossX+i*crossRun/crossN;
    box(body,stepX,crossY,.20,crossRun/crossN+.012,crossWidth,(i+1)*2.2/crossN,MAT.stairs);
  }
  // The upper stair ends directly on the terrace surface.
  stairRailX(crossY-.1,crossX,crossX+crossRun,.20,2.51);
  stairRailX(crossY+crossWidth+.1,crossX,crossX+crossRun,.20,2.51);
  // Three longitudinal ramp runs form two U turns, starting across from Maestros.
  // They stay west of the raised earth; a final right turn exits onto its terrace.
  function rampRun(x,y1,y2,w,z1,z2){
    roofSurface(body,[[x,y1,z1+.14],[x+w,y1,z1+.14],[x,y2,z2+.14],[x+w,y2,z2+.14]],MAT.path);
  }
  // Shallow paved entry connects the lower corridor to the first rising lane.
  roofSurface(body,[[8.2,26,.32],[9.2,26,.14],[8.2,27.4,.32],[9.2,27.4,.14]],MAT.path);
  box(body,9.2,26,0,1.8,1.4,.14,MAT.path);
  rampRun(9.6,27.4,33,1.4,0,.8);
  box(body,9.6,33,.8,3,1.4,.14,MAT.path);
  rampRun(11.2,33,27.4,1.4,.8,1.6);
  box(body,11.2,26,1.6,3,1.4,.14,MAT.path);
  rampRun(12.8,27.4,33,1.4,1.6,2.4);
  // The final turn reaches the terrace without overlapping the earth mesh.
  box(body,12.8,33,2.4,1.4,1.4,.14,MAT.path);
  for(const [x,y,h] of [[11.4,26.2,1.6],[14,26.2,1.6],[13,34.2,2.4],[16,34.2,2.4]])cyl(body,x,y,0,.055,h,MAT.steel);
  // The final turn joins the terrace flush at x=14.2; the adjacent stair
  // begins just beyond the ramp landing.
  // Continuous guardrail paths share their corner posts. The final east edge
  // stays open where the ramp and stair land on the upper terrace.
  railPath(body,[[9.6,27.4,.14],[9.6,33,.94],[9.6,34.4,.94],[12.6,34.4,.94],[12.6,33,.94],[12.6,27.4,1.74]]);
  railPath(body,[[11,27.4,.14],[11,33,.94]]);
  railPath(body,[[11.2,33,.94],[11.2,27.4,1.74],[11.2,26,1.74],[14.1,26,1.74]]);
  // The retaining wall is the outer boundary of the upper ramp run. Avoid
  // a second, sloping rail on top of the straight terrace guardrail.
  railPath(body,[[12.8,27.4,1.74],[12.8,33,2.54],[12.8,34.4,2.54]]);
  textSprite(body,'RAMPA EN U · SALIDA',15.2,29.8,4.4,7.8);
  // The court keeps its long axis parallel to the classroom pavilion.
  box(body,14.2,5,2.53,22,7,.15,MAT.court);
  // The first four metres from the guardrail remain uncovered on the same floor.
  for(const x of [18.2,24.2,30.2,36.2])for(const y of [5,12]){cyl(body,x,y,2.68,.115,1.15,MAT.blue);cyl(body,x,y,3.83,.10,3.35,MAT.white)}
  // Curved corrugated canopy retains the original orientation and open strip.
  const canopyMat=new THREE.MeshStandardMaterial({color:'#e0e9ea',roughness:.65,metalness:.22,side:THREE.DoubleSide});
  const arcY=t=>5+7*t,arcH=t=>7.12+1.05*(1-Math.pow(2*t-1,2));
  const roofGeo=new THREE.BufferGeometry(),roofPts=[];for(let i=0;i<24;i++){const a=i/24,b=(i+1)/24;const p=(x,t)=>[x,arcH(t),-arcY(t)];roofPts.push(...p(18.2,a),...p(36.2,a),...p(18.2,b),...p(36.2,a),...p(36.2,b),...p(18.2,b))}roofGeo.setAttribute('position',new THREE.Float32BufferAttribute(roofPts,3));roofGeo.computeVertexNormals();const canopy=new THREE.Mesh(roofGeo,canopyMat);body.add(canopy);
  canopy.castShadow=true;
  for(let i=0;i<=24;i++){const t=i/24;box(body,18.2,arcY(t)-.02,arcH(t)+.025,18,.04,.045,MAT.roofRib)}
  for(const x of [18.2,27.2,36.2])for(let i=0;i<24;i++){const a=i/24,b=(i+1)/24;const p=new THREE.Vector3(x,arcH(a),-arcY(a)),q=new THREE.Vector3(x,arcH(b),-arcY(b)),dv=q.clone().sub(p);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,dv.length(),7),MAT.steel);beam.position.copy(p.add(q).multiplyScalar(.5));beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dv.normalize());body.add(beam)}
  textSprite(body,'CANCHA TECHADA',26.6,8.5,8.8,9);
  // The second pavilion has the long bar then a short L/U-shaped end.
  room(body,'Chalet 1',30,-1,6,6,2.4,{facing:'west',height:2.7});
  room(body,'Aula 5',30,14,6,7.5,2.4,{facing:'west',roof:false,featured:PROJECTS.some(p=>p.room==='Aula 5')});
  room(body,'Aula 6',30,21.5,6,7.5,2.4,{facing:'west',roof:false,featured:PROJECTS.some(p=>p.room==='Aula 6')});
  // Aula 5/6 and the lower corridor share a single roof plane.
  gableRoof(body,28,14,8,15,5.4,.48);
  // Two flights run across the pavilion: enter from the west corridor, turn
  // against the east wall, and return west to the upper corridor.
  box(body,30,29,2.4,6,7.2,.20,MAT.stairs);
  // The corridor itself is the first part of each landing, so the extra slabs
  // start at its edge instead of creating coplanar fill over it.
  box(body,29.65,29.4,2.51,.45,2.25,.12,MAT.path);
  const uStart=30.1,uRun=5,uSteps=15,uNear=29.4,uFar=32.25,uWidth=2.25;
  for(let i=0;i<uSteps;i++){
    const step=uRun/uSteps,top=1.4*(i+1)/uSteps;
    box(body,uStart+i*step,uNear,2.6,step+.008,uWidth,top,MAT.stairs);
    box(body,uStart+uRun-(i+1)*step,uFar,4.0,step+.008,uWidth,top,MAT.stairs);
  }
  box(body,35.1,uNear,3.84,.9,5.1,.16,MAT.stairs);
  box(body,29.5,uFar,5.4,.65,uWidth,.18,MAT.path);
  stairRailX(uNear-.1,uStart,35.1,2.6,4.0);
  stairRailX(uNear+uWidth+.1,uStart,35.1,2.6,4.0);
  stairRailX(uFar-.1,35.1,uStart,4.0,5.4);
  stairRailX(uFar+uWidth+.1,35.1,uStart,4.0,5.4);
  rail(body,36,29.4,36,34.5,4.0);
  textSprite(body,'ESCALERA EN U',33,31.7,6.75,5.8);
  room(body,'Bodega de escaleras',30,35,2,1.2,2.4,{facing:'west',height:2.55,roof:false});
  room(body,'Baños femeninos 2',30,36.2,6,3,2.4,{facing:'west',roof:false});
  room(body,'Baños masculinos 2',30,39.2,6,3,2.4,{facing:'west',roof:false});
  room(body,'Aula 7',30,42.2,6,6,2.4,{facing:'west',roof:false,featured:PROJECTS.some(p=>p.room==='Aula 7')});
  // Laboratory opens toward the end of Pasillo 2; Clínica faces Aula 7.
  room(body,'Aula 8 / Laboratorio',28,48.2,8,6,2.4,{facing:'north',roof:false,doorCenters:[29.35],doorOrder:['principal'],featured:PROJECTS.some(p=>p.room==='Aula 8 / Laboratorio')});
  room(body,'Clínica',22,45.2,6,9,2.4,{facing:'east',roof:false,doorCenters:[46.85],doorOrder:['principal'],featured:PROJECTS.some(p=>p.room==='Clínica')});
  // The clinic's front wall supports the outer edge of the upper walkway.
  // This slab remains as the clinic roof when the upstairs layer is hidden.
  box(body,22,45.2,5.4,6,1.5,.18,MAT.path);
  room(body,'Chalet 2',15,49.2,4.5,5,2.4,{facing:'east',height:2.7});
  // Small service strip underneath the court edge; tank and bodega are adjacent.
  room(body,'Bodega delgada',10.5,-1,4.8,1.8,2.4,{height:2.5});
  room(body,'Planta acuífera',16.2,-1,5,4,2.4,{height:2.6});
  room(body,'Bodega',23.05,1.15,2.1,2.1,2.4,{height:2.6});
  for(const tx of [23.2,25])for(const ty of [-.8,1])cyl(body,tx,ty,2.4,.065,3.25,MAT.steel);
  box(body,23.05,-.95,5.65,2.1,2.1,.13,MAT.steel);
  const tank=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.95,24),MAT.tank);tank.position.set(24.1,6.28,-.1);tank.castShadow=true;body.add(tank);
  // Upper floor can be hidden to inspect the lower room arrangement.
  // The upper corridor also stops before OPV, preventing coplanar floor fill.
  box(upper,28,32.25,5.4,1.5,15.95,.18,MAT.path);
  box(upper,22,46.7,5.4,6,1.5,.18,MAT.path);
  room(upper,'Aula 9',30,36.2,6,6,5.4,{facing:'west',roof:false,flatExit:true,featured:PROJECTS.some(p=>p.room==='Aula 9')});
  room(upper,'Aula 10',30,42.2,6,6,5.4,{facing:'west',roof:false,doorOrder:['principal','salida'],flatExit:true,featured:PROJECTS.some(p=>p.room==='Aula 10')});
  // Aula 11 and OPV have recessed entrances side by side on the L corridor.
  room(upper,'OPV',28,48.2,8,6,5.4,{facing:'north',roof:false,doorCenters:[29.35],doorOrder:['principal'],featured:PROJECTS.some(p=>p.room==='OPV')});
  room(upper,'Aula 11',22,48.2,6,6,5.4,{facing:'north',roof:false,doorCenters:[23.5,27.05],doorOrder:['salida','principal'],featured:PROJECTS.some(p=>p.room==='Aula 11')});
  // The tall pavilion roof runs over the U stair, upstairs corridor and rooms.
  // Its short perpendicular wing also covers the turn toward Aula 11.
  gableRoof(upper,28,29,8,25.2,8.4,.56);
  gableRoof(upper,22,45.2,6,9,8.4,.56,'x');
  rail(upper,28,32.25,28,45.2,5.54);rail(upper,22,45.2,28,45.2,5.54);
  // Entrance and the route to the confirmed rooms.
  const entrance=new THREE.Mesh(new THREE.RingGeometry(.48,.68,32),new THREE.MeshBasicMaterial({color:'#06aa8f',side:THREE.DoubleSide}));entrance.rotation.x=-Math.PI/2;entrance.position.set(7.3,.37,0);body.add(entrance);
  textSprite(body,'ENTRADA',7.3,-2,2.6,5);
  const routeVisual=new THREE.Group();scene.add(routeVisual);
  const routeMat=new THREE.MeshBasicMaterial({color:'#00cfac',depthTest:false,transparent:true,opacity:.94});
  const routeNodeMat=new THREE.MeshBasicMaterial({color:'#f9db82',depthTest:false});
  let routePoints=[],placeLabel=null;
  const point=(x,y,z)=>[x,y,z];
  const workshopAccess=[point(7.3,0,.34),point(7.3,4.4,.34),point(8.2,4.4,.34),point(13.1,4.4,2.55)];
  const upperAccess=[...workshopAccess,point(15.8,4.4,2.55)];
  const upperCorridor=[...upperAccess,point(19,13.3,2.55),point(28.7,13.3,2.55)];
  const upstairsAccess=[...upperCorridor,point(28.7,30.5,2.55),point(30.1,30.5,2.55),point(35.1,30.5,4),point(35.1,33.3,4),point(30.1,33.3,5.55),point(28.7,33.3,5.55)];
  function pointsFor(item){
    const [x,y,z]=item.target;
    switch(item.route){
      case 'ground': return [point(7.3,0,.34),point(7.3,y,.34),point(x,y,.34)];
      case 'workshopStairs': return workshopAccess;
      case 'mainStairs': return [point(7.3,0,.34),point(7.3,36,.34),point(9.2,36,.34),point(x,y,z)];
      case 'ramp': return [point(7.3,0,.34),point(7.3,26.7,.34),point(9.8,26.7,.18),point(10.3,27.4,.18),point(10.3,33,.94),point(11.9,33,.94),point(11.9,27.4,1.74),point(13.5,27.4,1.74),point(13.5,33,2.54),point(x,y,z)];
      case 'upperFront': return [...upperAccess,point(28.8,4.4,2.55),point(x,y,z)];
      case 'upperRear': return [...upperAccess,point(19,13.3,2.55),point(28.7,13.3,2.55),point(28.7,43.5,2.55),point(21,43.5,2.55),point(x,y,z)];
      case 'upstairs': return [...upstairsAccess,point(28.7,y,5.55),point(x,y,z)];
      case 'upstairsL': return [...upstairsAccess,point(28.7,47.3,5.55),point(x,y,z)];
      default: return [...upperCorridor,point(28.7,y,2.55),point(x,y,z)];
    }
  }
  function updateRoute(){
    for(const part of [...routeVisual.children]){routeVisual.remove(part);part.geometry.dispose()}
    routePoints=pointsFor(current);
    for(let i=0;i<routePoints.length-1;i++){
      const a=routePoints[i],b=routePoints[i+1];
      if(a[0]===b[0]&&a[1]===b[1])continue;
      const start=new THREE.Vector3(a[0],a[2]+.17,-a[1]);
      const end=new THREE.Vector3(b[0],b[2]+.17,-b[1]);
      const line=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(start,end),Math.max(2,Math.ceil(start.distanceTo(end)*2)),.085,6,false),routeMat);
      line.renderOrder=60;routeVisual.add(line);
    }
    const last=routePoints.at(-1);
    const goal=new THREE.Mesh(new THREE.RingGeometry(.27,.40,24),routeNodeMat);
    goal.rotation.x=-Math.PI/2;goal.position.set(last[0],last[2]+.2,-last[1]);goal.renderOrder=61;routeVisual.add(goal);
    for(const mark of markers.children)if(mark.userData.room)mark.visible=mark.userData.room===current.room;
    if(placeLabel){markers.remove(placeLabel);placeLabel.material.map.dispose();placeLabel.material.dispose();placeLabel=null}
    if(!current.room){const [x,y,z]=current.target;placeLabel=textSprite(markers,current.name,x,y,z+3.7,Math.min(8,Math.max(5,current.name.length*.34)));placeLabel.material.depthTest=false;placeLabel.renderOrder=62}
  }
  const projectRooms=new Map(PROJECTS.map(p=>[p.room,p]));
  for(const [room,project] of projectRooms){
    const [x,y,z]=project.target;
    const label=textSprite(markers,`${room.toUpperCase()} · PROYECTOS`,x,y,z+4,8);label.userData.room=room;
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.75,12,8),new THREE.MeshBasicMaterial({visible:false}));
    hit.position.set(x,z+.75,-y);hit.userData.projectRoom=room;body.add(hit);clickable.push(hit);
  }
  for(const place of PLACES){
    const [x,y,z]=place.target;
    const pin=new THREE.Mesh(new THREE.SphereGeometry(.23,12,8),new THREE.MeshBasicMaterial({color:'#f3bb72'}));
    pin.position.set(x,z+.55,-y);pin.renderOrder=5;body.add(pin);
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.65,12,8),new THREE.MeshBasicMaterial({visible:false}));
    hit.position.copy(pin.position);hit.userData.place=place;body.add(hit);clickable.push(hit);
  }
  // Small trees as spatial cues, outside walkways.
  for(const [x,y] of [[-4,18],[-4,34],[-4,61],[40,9],[40,19],[40,43],[22,58]]){cyl(body,x,y,.12,.12,1.45,MAT.earth);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.13,1),mat('#638f71'));crown.position.set(x,2.3,-y);crown.castShadow=true;body.add(crown)}
  // Smaller trees follow the incline beside the ditch.
  for(const y of [19,43,48,57,61]){
    const x=11.4,z=.2+(x-9.2)/5*2.26;
    cyl(body,x,y,z,.07,.78,MAT.earth);
    const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,1),MAT.grass);
    crown.position.set(x,z+1.1,-y);crown.castShadow=true;body.add(crown);
  }
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let press=null;
  canvas.addEventListener('pointerdown',e=>{press={x:e.clientX,y:e.clientY,moved:false}});
  canvas.addEventListener('pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>6)press.moved=true});
  canvas.addEventListener('pointercancel',()=>{press=null});
  canvas.addEventListener('click',e=>{
    if(press?.moved){press=null;return}press=null;
    const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,false)[0];
    if(hit){
      if(hit.object.userData.place)selectItem(hit.object.userData.place);
      else{const p=PROJECTS.find(p=>p.room===(hit.object.userData.projectRoom||hit.object.userData.room));if(p)selectItem(p)}
    }
  });
  let tween=null,tour=null;
  function tourUI(message){
    $('tourButton').textContent=tour?'■ Detener ruta':'▶ Recorrer ruta';
    $('tourPause').hidden=!tour;
    $('tourPause').textContent=tour?.pausedAt?'Continuar':'Pausar';
    $('tourStatus').textContent=message||`Entrada → ${current.room||current.name}`;
  }
  function stopTour(arrived=false){
    if(!tour)return;
    tour=null;controls.enabled=true;
    tourUI(arrived?`Llegaste a ${current.room||current.name}`:undefined);
    controls.update();
  }
  function fly(pos,target){stopTour();tween={from:camera.position.clone(),to:pos,fromTarget:controls.target.clone(),toTarget:target,start:performance.now(),duration:1150}}
  function startTour(){
    tween=null;
    const path=new THREE.CurvePath();
    const pts=routePoints.map(([x,y,z])=>new THREE.Vector3(x,z+1.48,-y));
    for(let i=0;i<pts.length-1;i++)path.add(new THREE.LineCurve3(pts[i],pts[i+1]));
    const now=performance.now();
    tour={path,length:path.getLength(),progress:0,from:camera.position.clone(),fromTarget:controls.target.clone(),lastNow:now,entryElapsed:0,entryDuration:900,pausedAt:0};
    controls.enabled=false;
    tourUI(`Recorriendo hacia ${current.room||current.name}`);
  }
  function applySelection(p){
    workshopRoof.visible=true;$('workshopView').setAttribute('aria-pressed','false');
    const destination=p.room?'projects':'places';
    if(directory!==destination){directory=destination;$('search').value=''}
    current=p;
    list();details();updateRoute();
    const target=p.target;
    fly(new THREE.Vector3(target[0]+16,target[2]+14,-target[1]+13),new THREE.Vector3(target[0],target[2]+.5,-target[1]));
    tourUI();
  }
  const dialog=$('projectDialog'),panel=dialog.querySelector('.projectpanel');
  function closeProject(restore=true){
    const name=previewProject?.name;
    dialog.hidden=true;document.body.classList.remove('modal-open');previewProject=null;list();
    if(restore)([...$('list').children].find(el=>el.dataset.name===name)||$('showProjects')).focus();
  }
  function openProject(p){
    if(!dialog.hidden)closeProject(false);
    previewProject=p;
    $('dialogName').textContent=p.name;
    $('dialogSection').textContent=p.section||'Por confirmar';
    $('dialogRoom').textContent=p.room;
    $('dialogMembers').textContent=p.members?.length?p.members.join(', '):'Por confirmar';
    $('dialogDescription').textContent=p.description||'Descripción pendiente de confirmación por el equipo.';
    const photo=$('dialogPhoto'),safePhoto=typeof p.photo==='string'&&(/^(https:\/\/|\.\/assets\/)/).test(p.photo);
    photo.hidden=!safePhoto;$('dialogPhotoFallback').hidden=safePhoto;
    if(safePhoto){photo.src=p.photo;photo.alt=`Imagen del proyecto ${p.name}`}
    else photo.removeAttribute('src');
    dialog.hidden=false;document.body.classList.add('modal-open');list();panel.focus();
  }
  $('dialogPhoto').addEventListener('error',()=>{$('dialogPhoto').hidden=true;$('dialogPhotoFallback').hidden=false});
  $('dialogClose').addEventListener('click',()=>closeProject());
  dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>closeProject());
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeProject();return}
    if(e.key==='Tab'){
      const focusable=[...panel.querySelectorAll('button:not([disabled])')];
      if(e.shiftKey&&(document.activeElement===focusable[0]||document.activeElement===panel)){e.preventDefault();focusable.at(-1).focus()}
      else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus()}
      else if(!e.shiftKey&&document.activeElement===panel){e.preventDefault();focusable[0].focus()}
    }
  });
  $('dialogRoute').addEventListener('click',()=>{const p=previewProject;closeProject(false);applySelection(p);$('tourButton').focus()});
  $('dialogTour').addEventListener('click',()=>{const p=previewProject;closeProject(false);applySelection(p);startTour();$('tourPause').focus()});
  selectItem=p=>p.room?openProject(p):applySelection(p);
  $('tourButton').addEventListener('click',()=>{if(tour)stopTour();else startTour()});
  $('tourPause').addEventListener('click',()=>{
    if(!tour)return;
    if(tour.pausedAt){tour.pausedAt=0;tour.lastNow=performance.now();tourUI(`Recorriendo hacia ${current.room||current.name}`)}
    else{tour.pausedAt=performance.now();tourUI(`Pausa · ${current.room||current.name}`)}
  });
  $('tourSpeed').addEventListener('change',()=>{
    const speed=Number($('tourSpeed').value);
    if(tour)tourUI(`Velocidad ${speed.toFixed(1)} m/s · ${current.room||current.name}`);
  });
  $('workshopView').addEventListener('click',()=>{
    const inspect=workshopRoof.visible;
    workshopRoof.visible=!inspect;$('workshopView').setAttribute('aria-pressed',String(inspect));
    fly(inspect?new THREE.Vector3(16,12,-7):homePos,inspect?new THREE.Vector3(3,1.3,-7):homeTarget);
  });
  $('zoomIn').addEventListener('click',()=>{stopTour();camera.position.lerp(controls.target,.18)});
  $('zoomOut').addEventListener('click',()=>{stopTour();camera.position.sub(controls.target).multiplyScalar(1.22).add(controls.target)});
  $('reset').addEventListener('click',()=>{workshopRoof.visible=true;$('workshopView').setAttribute('aria-pressed','false');fly(homePos,homeTarget)});
  function floor(show){upper.visible=show;$('allFloors').classList.toggle('active',show);$('groundFloor').classList.toggle('active',!show);$('allFloors').setAttribute('aria-pressed',show);$('groundFloor').setAttribute('aria-pressed',!show)}
  $('allFloors').addEventListener('click',()=>floor(true));$('groundFloor').addEventListener('click',()=>floor(false));
  const resize=new ResizeObserver(()=>{const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});resize.observe(viewport);
  function frame(now){
    requestAnimationFrame(frame);
    if(tour){
      const dt=Math.min(.08,Math.max(0,(now-tour.lastNow)/1000));
      tour.lastNow=now;
      if(!tour.pausedAt&&tour.entryElapsed<tour.entryDuration)tour.entryElapsed+=dt*1000;
      if(tour.entryElapsed<tour.entryDuration){
        const a=Math.max(0,Math.min(1,tour.entryElapsed/tour.entryDuration)),u=a*a*(3-2*a);
        camera.position.lerpVectors(tour.from,tour.path.getPointAt(0),u);
        const entryLook=tour.path.getPointAt(Math.min(.055,1/Math.max(1,tour.length)));entryLook.y=camera.position.y-.13;
        controls.target.lerpVectors(tour.fromTarget,entryLook,u);
      }else{
        if(!tour.pausedAt)tour.progress=Math.min(1,tour.progress+dt*Number($('tourSpeed').value)/Math.max(1,tour.length));
        const desired=tour.path.getPointAt(tour.progress);
        camera.position.lerp(desired,1-Math.exp(-dt*10));
        const ahead=tour.path.getPointAt(Math.min(1,tour.progress+Math.min(.045,1/Math.max(1,tour.length))));
        const last=tour.path.getPointAt(1);
        const blend=Math.max(0,Math.min(1,(tour.progress-.96)/.04));
        ahead.lerp(new THREE.Vector3(last.x-.8,last.y-.25,last.z),blend);
        controls.target.lerp(ahead,1-Math.exp(-dt*9));
      }
      camera.lookAt(controls.target);
      if(tour.progress>=1)stopTour(true);
    }else{
      if(tween){const t=Math.min(1,(now-tween.start)/tween.duration),u=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,u);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,u);if(t===1)tween=null}
      controls.update();
    }
    renderer.render(scene,camera);
  }
  list();details();updateRoute();tourUI();requestAnimationFrame(frame);
} catch(err) {console.error(err);$('error').style.display='grid';list();details()}
