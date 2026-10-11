import * as THREE from './vendor/three/three.module.js';
import { GLTFLoader } from './vendor/three/GLTFLoader.js';

const canvas = document.querySelector('#hand-scene');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = x => Math.max(0,Math.min(1,x));
const lerp = (a,b,t) => a+(b-a)*t;
const rad = THREE.MathUtils.degToRad;
// Positions and rotations observed in the reference site's public runtime.
const states = [
  {p:[-.1,-1.75],s:.045,r:[0,90,0],type:0},
  {p:[.15,-.4],s:.02,r:[-45,-135,-45],type:0},
  {p:[.15,-.4],s:.02,r:[45,-315,-45],type:0},
  {p:[-.2,-.35],s:.02,r:[-90,-405,-45],type:0},
  {p:[-1.2,-.6],s:.05,r:[-90,-405,-45],type:0},
  {p:[-1.6,-.6],s:.05,r:[-90,-405,-45],type:0},
  {p:[.16,-1.38],s:.05,r:[0,200,-16],type:1},
  {p:[0,-.68],s:.04,r:[0,-14,-16],type:1},
  {p:[.2,-.46],s:.03,r:[0,-700,-16],type:1}
];
let renderer;
try {renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}
catch(error){document.body.classList.add('scene-unavailable');console.warn('Hand scene unavailable',error);}
if(renderer) initialize();
function initialize(){
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-innerWidth/2,innerWidth/2,innerHeight/2,-innerHeight/2,.01,10000);
  camera.position.z=1000;
  const ambient=new THREE.AmbientLight('#bcff32',1);
  const light1=new THREE.DirectionalLight('#bcff32',.35);light1.position.set(-200,150,50);
  const light2=new THREE.DirectionalLight('#bcff32',.15);light2.position.set(300,-100,150);
  scene.add(ambient,light1,light2);
  const material=new THREE.MeshStandardMaterial({color:'#b0b0b0',roughness:.4,metalness:1,side:THREE.DoubleSide,transparent:true});
  const arm=new THREE.Group();scene.add(arm);
  let introStart=performance.now();
  const models=[];
  const loader=new GLTFLoader();
  Promise.all(['arm','arm2'].map(async(name,i)=>{
    const gltf=await loader.loadAsync(`./assets/models/${name}.glb`);
    gltf.scene.traverse(child=>{if(child.isMesh) child.material=material;});
    models[i]=gltf.scene;arm.add(gltf.scene);gltf.scene.visible=false;
  })).then(()=>{introStart=performance.now();document.body.classList.add('scene-ready');window.dispatchEvent(new Event('handready'));update();}).catch(error=>{
    document.body.classList.add('scene-unavailable');console.warn('Hand model failed to load',error);
  });
  const geometry=new THREE.BufferGeometry();
  const positions=new Float32Array(100*3);
  let seed=42;
  function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  for(let i=0;i<positions.length;i+=3){positions[i]=(random()-.5)*2400;positions[i+1]=(random()-.5)*1500;positions[i+2]=(random()-.5)*400;}
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({color:'#a4b896',size:1.2,transparent:true,opacity:.35,depthWrite:false}));scene.add(points);
  let data=null, currentType=0, frame=0, last=0, baseY=0, baseX=0, baseRotation=0, baseRX=0, baseRY=0, needsRender=true;
  const pointer={x:0,y:0}, eased={x:0,y:0};
  const darkColor=new THREE.Color('#b0b0b0'),lightColor=new THREE.Color('#efefef'),lime=new THREE.Color('#bcff32'),grey=new THREE.Color('#b0b0b0'),pointGrey=new THREE.Color('#888888');
  addEventListener('scenepointer',e=>{pointer.x=e.detail.x;pointer.y=e.detail.y;needsRender=true;});
  function update(){
    needsRender=true;
    if(!models.length||!data)return;
    const {metrics:m,scroll:y}=data;
    const thresholds=[0,m.why.top,m.why.top+(m.why.height-innerHeight)*.65,m.showcase.top,m.showcase.top+(m.showcase.height-innerHeight)*.75,m.manifesto.top,m.description.top,m.features.top,m.footer.top];
    let index=thresholds.findIndex(t=>t>y)-1;if(index<0)index=thresholds.length-1;
    const a=states[index],b=states[Math.min(index+1,states.length-1)];
    const t=index===states.length-1?0:clamp((y-thresholds[index])/(thresholds[index+1]-thresholds[index]));
    const blend=data.lightBlend??0,light=blend>.5;
    material.color.copy(darkColor).lerp(lightColor,blend);material.metalness=lerp(1,.6,blend);
    ambient.color.copy(lime).lerp(grey,blend);
    light1.color.copy(lime).lerp(lightColor,blend);light2.color.copy(light1.color);
    light1.intensity=lerp(.35,1,blend);light2.intensity=lerp(.15,1,blend);
    points.material.color.set('#a4b896').lerp(pointGrey,blend);points.material.opacity=lerp(.35,.18,blend);
    const inFilm=y>=m.manifesto.top&&y<m.orbit.top;
    const filmProgress=data.progress.manifesto;
    material.opacity=inFilm?1-Math.sin(Math.PI*filmProgress)*.88:1;
    if(motion.matches){
      models.forEach((model,i)=>{model.visible=i===1;});
      arm.visible=light;arm.scale.setScalar(innerHeight*.035);
      arm.position.set(innerWidth*.1,-innerHeight*.65,0);arm.rotation.set(0,rad(-14),rad(-16));
      baseY=arm.position.y;baseX=arm.position.x;baseRotation=arm.rotation.z;baseRX=arm.rotation.x;baseRY=arm.rotation.y;
      return;
    }
    currentType=a.type===b.type?a.type:(t<.5?a.type:b.type);
    models.forEach((model,i)=>{model.visible=i===currentType;});
    arm.visible=true;
    if(a.type!==b.type)material.opacity*=Math.min(1,Math.abs(t-.5)*5);
    const mobile=innerWidth<700;
    arm.scale.setScalar(innerHeight*lerp(a.s,b.s,t)*(mobile?.82:1));
    arm.position.set(innerWidth*lerp(a.p[0],b.p[0],t),innerHeight*lerp(a.p[1],b.p[1],t),0);
    arm.rotation.set(...a.r.map((r,i)=>rad(lerp(r,b.r[i],t))));
    baseY=arm.position.y;baseX=arm.position.x;baseRotation=arm.rotation.z;baseRX=arm.rotation.x;baseRY=arm.rotation.y;
  }
  addEventListener('sceneprogress',event=>{data=event.detail;update();});
  function resize(){
    needsRender=true;
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));
    renderer.setSize(innerWidth,innerHeight,false);
    camera.left=-innerWidth/2;camera.right=innerWidth/2;camera.top=innerHeight/2;camera.bottom=-innerHeight/2;camera.updateProjectionMatrix();update();
  }
  addEventListener('resize',resize,{passive:true});resize();
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();document.body.classList.add('scene-unavailable');cancelAnimationFrame(frame);});
  function draw(time){
    frame=requestAnimationFrame(draw);
    if(document.hidden||time-last<1000/60||(motion.matches&&!needsRender))return;last=time;
    const t=motion.matches?0:time*.0005;
    const interactive=!motion.matches&&matchMedia('(pointer:fine)').matches;
    eased.x=lerp(eased.x,interactive?pointer.x:0,.065);eased.y=lerp(eased.y,interactive?pointer.y:0,.065);
    const intro=document.body.classList.contains('intro-running');
    const reveal=intro?Math.min(1,(time-introStart)/1800):1;
    arm.position.x=baseX+eased.x*innerWidth*.025;
    arm.position.y=baseY+Math.sin(t)*innerHeight*.005-eased.y*innerHeight*.018-(1-reveal)*innerHeight*.06;
    arm.rotation.x=baseRX+eased.y*.12;
    arm.rotation.y=baseRY+eased.x*.18+(1-reveal)*.12;
    arm.rotation.z=baseRotation+Math.sin(t*.8)*.012;
    light1.position.x=-200+eased.x*450+(intro?(1-reveal)*650:0);light1.position.y=150-eased.y*300;
    points.rotation.z=Math.sin(t*.1)*.025;
    renderer.render(scene,camera);needsRender=false;
  }
  draw(0);
}
