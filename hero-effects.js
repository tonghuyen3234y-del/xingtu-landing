// Original Canvas implementation inspired by pixel-dither trails and electric outlines.
(() => {
 const hero=document.querySelector('.hero'),brand=document.querySelector('.brand-switch');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 const trail=document.createElement('canvas');trail.className='hero-dither';trail.setAttribute('aria-hidden','true');document.body.append(trail);
 const ctx=trail.getContext('2d'),electric=brand.querySelector('canvas'),ec=electric.getContext('2d');
 const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 let width=0,height=0,dpr=1,points=[],frame=0,last=0,inside=false,hover=false,enterTimer=0,eFrame=0,edges=[],mask=null;
 function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio,2);trail.width=width*dpr;trail.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);sample();}
 function draw(now){const dt=Math.min(40,now-last||16);last=now;ctx.clearRect(0,0,width,height);points=points.filter(p=>(p.life-=dt)>0);
  const cells=new Map();
  for(const p of points){const radius=p.radius;for(let y=Math.max(0,Math.floor((p.y-radius)/5)*5);y<Math.min(height,p.y+radius);y+=5)for(let x=Math.max(0,Math.floor((p.x-radius)/5)*5);x<Math.min(width,p.x+radius);x+=5){const fall=Math.max(0,1-Math.hypot(x-p.x,y-p.y)/radius),v=fall*fall*(p.life/800)*p.power;if(v<.01)continue;const key=y*100000+x;if((cells.get(key)?.v||0)<v)cells.set(key,{x,y,v});}}
  ctx.fillStyle=document.body.classList.contains('light-scene')?'#52662b':'#bcff32';for(const {x,y,v} of cells.values()){const threshold=(bayer[(Math.floor(y/5)%4)*4+Math.floor(x/5)%4]+.5)/16;if(v>threshold*.7){ctx.globalAlpha=Math.min(.65,v*.8);ctx.fillRect(x,y,3,3);}}ctx.globalAlpha=1;
  if(points.length)frame=requestAnimationFrame(draw);else{frame=0;last=0;}
 }
 document.addEventListener('pointermove',e=>{if(document.body.classList.contains('intro-running')||reduce.matches||!fine.matches||e.buttons||document.querySelector('.hero-deck.is-dragging'))return;const weak=!!e.target.closest('a,button,input,.hero-album,.brand-switch,.text-effect');points.push({x:e.clientX,y:e.clientY,life:800,radius:weak?32:58,power:weak?.25:.85});if(points.length>22)points.shift();if(!frame)frame=requestAnimationFrame(draw);},{passive:true});
 function sample(){
  const r=brand.getBoundingClientRect();if(!r.width)return;
  electric.width=Math.ceil((r.width+48)*dpr);electric.height=Math.ceil((r.height+48)*dpr);ec.setTransform(dpr,0,0,dpr,0,0);
  mask=document.createElement('canvas');mask.width=Math.ceil(r.width+48);mask.height=Math.ceil(r.height+48);const m=mask.getContext('2d',{willReadFrequently:true});const label=brand.querySelector(hover?'.brand-hpic':'.brand-chinese'),s=getComputedStyle(label);m.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;m.textBaseline='middle';m.textAlign=hover?'center':'left';if('letterSpacing'in m)m.letterSpacing=s.letterSpacing;m.fillStyle='#fff';m.fillText(hover?'Hypic':'醒图',hover?mask.width/2:24,mask.height/2);
  const data=m.getImageData(0,0,mask.width,mask.height).data,w=mask.width;edges=[];
  for(let y=3;y<mask.height-3;y+=3)for(let x=3;x<w-3;x+=3){const n=(y*w+x)*4+3;if(data[n]>100&&[n-12,n+12,n-w*12,n+w*12].some(j=>data[j]<80))edges.push({x,y});}
 }
 let pulseEnd=0;
 function electricDraw(now){ec.clearRect(0,0,electric.width/dpr,electric.height/dpr);if(reduce.matches||(!hover&&now>pulseEnd)){eFrame=0;return;}
  ec.strokeStyle='#ddffa1';ec.fillStyle='#bcff32';ec.lineWidth=1;ec.shadowColor='#bcff32';ec.shadowBlur=8;
  const strength=now<pulseEnd?1:.35;
  for(let i=0;i<edges.length;i++){const p=edges[i];if(Math.random()>.12*strength)continue;ec.globalAlpha=.45+Math.random()*.5;ec.fillRect(p.x,p.y,1.4,1.4);if(Math.random()<.055){ec.beginPath();ec.moveTo(p.x,p.y);ec.lineTo(p.x+Math.random()*10-5,p.y-5);ec.lineTo(p.x+Math.random()*18-9,p.y-15);ec.stroke();}}
  ec.globalAlpha=1;ec.shadowBlur=0;eFrame=requestAnimationFrame(electricDraw);
 }
 function setHover(value){clearTimeout(enterTimer);hover=value;pulseEnd=performance.now()+450;sample();if(!eFrame)eFrame=requestAnimationFrame(electricDraw);if(value)enterTimer=setTimeout(()=>{brand.classList.add('is-hpic');sample();},reduce.matches?0:220);else{brand.classList.remove('is-hpic');sample();}}
 brand.addEventListener('pointerenter',()=>{if(fine.matches)setHover(true)});brand.addEventListener('pointerleave',()=>setHover(false));brand.addEventListener('focus',()=>setHover(true));brand.addEventListener('blur',()=>setHover(false));
 function reset(){points=[];cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height);setHover(false);}
 reduce.addEventListener('change',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});addEventListener('resize',resize);document.fonts.ready.then(resize);resize();
})();
