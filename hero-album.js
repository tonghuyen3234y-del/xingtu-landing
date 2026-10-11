(() => {
 const deck=document.querySelector('.hero-deck'),cards=[...deck.children],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let order=[...cards],busy=false,drag=null,hover=false,visible=true,timer=0,tiltX=0,tiltY=0;
 function pose(i){return `translate3d(${i*11}px,${-i*7}px,${-i*35}px) rotate(${i===0?0:(i%2?1:-1)*(5+i*2)}deg) scale(${1-i*.035})`;}
 function layout(){order.forEach((c,i)=>{c.style.zIndex=String(4-i);c.style.transform=pose(i);c.classList.toggle('is-front',i===0);});}
 function schedule(){clearTimeout(timer);if(!reduce.matches&&visible&&!document.hidden&&!hover&&!deck.contains(document.activeElement)&&!drag)timer=setTimeout(()=>next(1),5800);}
 async function next(dir=1){if(busy)return;busy=true;clearTimeout(timer);const front=order[0];
  if(!reduce.matches){await front.animate([{transform:front.style.transform},{transform:`translate3d(${dir*deck.clientWidth*.95}px,-24px,80px) rotate(${dir*20}deg)`,opacity:0}],{duration:360,easing:'cubic-bezier(.4,0,.8,.4)',fill:'forwards'}).finished;}
  order.push(order.shift());layout();front.getAnimations().forEach(a=>{if(a.effect?.target===front)a.cancel()});
  if(!reduce.matches)await Promise.all(order.map((c,i)=>c.animate([{transform:i===3?`translate3d(${dir*60}px,-30px,-150px) scale(.86)`:pose(i+1),opacity:i===3?0:1},{transform:pose(i),opacity:1}],{duration:500,easing:'cubic-bezier(.2,.8,.2,1)'}).finished));
  busy=false;schedule();
 }
 deck.addEventListener('pointerdown',e=>{if(busy||e.button!==0)return;drag={x:e.clientX,y:e.clientY,dx:0};deck.classList.add('is-dragging');deck.setPointerCapture(e.pointerId);clearTimeout(timer);});
 deck.addEventListener('pointermove',e=>{if(drag){drag.dx=e.clientX-drag.x;order[0].style.transform=`translate3d(${drag.dx}px,${(e.clientY-drag.y)*.15}px,30px) rotate(${drag.dx*.06}deg)`;}else if(!reduce.matches&&e.pointerType==='mouse'){const r=deck.getBoundingClientRect();tiltX=(e.clientX-r.left)/r.width-.5;tiltY=(e.clientY-r.top)/r.height-.5;deck.style.transform=`rotateX(${-tiltY*6}deg) rotateY(${tiltX*8}deg)`;}});
 deck.addEventListener('pointerup',()=>{if(!drag)return;const dx=drag.dx;drag=null;deck.classList.remove('is-dragging');if(Math.abs(dx)>deck.clientWidth*.2||Math.abs(dx)<5)next(dx<0?-1:1);else{order[0].animate([{transform:order[0].style.transform},{transform:pose(0)}],{duration:300,easing:'ease-out'});layout();schedule();}});
 deck.addEventListener('pointercancel',()=>{drag=null;deck.classList.remove('is-dragging');layout();schedule();});
 deck.addEventListener('pointerenter',()=>{hover=true;clearTimeout(timer);});deck.addEventListener('pointerleave',()=>{hover=false;deck.style.transform='none';schedule();});
 deck.addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();next(e.key==='ArrowLeft'?-1:1);}});
 deck.addEventListener('focus',()=>clearTimeout(timer));deck.addEventListener('blur',schedule);
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;deck.classList.toggle('is-paused',!visible);schedule();},{threshold:.3}).observe(deck);
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);layout();schedule();
})();
