// Independent text treatments inspired by the references; no Pro component source used.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 let cleanups=[];
 const listen=(el,type,fn)=>{el.addEventListener(type,fn);cleanups.push(()=>el.removeEventListener(type,fn));};
 function split(el){
  el.setAttribute('aria-label',el.textContent);el.classList.add('text-effect');
  const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===3){const frag=document.createDocumentFragment();for(const value of child.textContent.split(/(\s+)/)){if(!value)continue;if(/^\s+$/.test(value)){frag.append(document.createTextNode(value));continue;}const word=document.createElement('span');word.className='fx-word';word.setAttribute('aria-hidden','true');for(const ch of value){const c=document.createElement('span');c.className='fx-char';c.textContent=ch;word.append(c);}frag.append(word);}child.replaceWith(frag);}else if(child.nodeName!=='BR')walk(child);}};walk(el);return [...el.querySelectorAll('.fx-char')];
 }
 function setup(){
  cleanups.forEach(f=>f());cleanups=[];
  if(reduce.matches)return;
  // Quiet, one-time entrances keep the chapter headings readable.
  for(const el of document.querySelectorAll('#why-title,#showcase-title,.footer-grid>h2,.footer-grid>div>p')){
   const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){el.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});io.unobserve(el);}}),{threshold:.45});io.observe(el);cleanups.push(()=>io.disconnect());
  }
  const endTitle=document.querySelector('.showcase-end h3');if(endTitle){
   endTitle.setAttribute('aria-label',endTitle.innerText);endTitle.classList.add('text-effect','fx-stagger');
   let line=0,index=0;const parts=[];
   for(const node of [...endTitle.childNodes]){if(node.nodeName==='BR'){line++;index=0;continue;}if(node.nodeType!==3)continue;
    const fragment=document.createDocumentFragment();
    // English words and Chinese phrases retain their original spacing and punctuation.
    for(const value of node.textContent.split(/(\s+|(?<=[，、。！？]))/u)){if(!value)continue;if(/^\s+$/.test(value)){fragment.append(document.createTextNode(value));continue;}
     const part=document.createElement('span');part.className='stagger-part';part.textContent=value;part.setAttribute('aria-hidden','true');part.style.setProperty('--stagger-delay',`${line*.15+index++*.065}s`);fragment.append(part);parts.push(part);
    }node.replaceWith(fragment);
   }
   let animations=[];
   function play(){if(reduce.matches||animations.some(a=>a.playState==='running'))return;animations=parts.map(part=>part.animate([{opacity:0,transform:'translateY(.35em)',filter:'blur(5px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:650,delay:parseFloat(part.style.getPropertyValue('--stagger-delay'))*1000,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));}
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){play();io.unobserve(endTitle);}}),{threshold:.65});io.observe(endTitle);cleanups.push(()=>{io.disconnect();animations.forEach(a=>a.cancel())});
  }
  const film=document.querySelector('#film-title');if(film){
   const chars=split(film);film.classList.add('fx-stroke');
   for(const c of chars){
    const ink=document.createElement('span');ink.className='stroke-measure';ink.textContent=c.textContent;c.textContent='';c.append(ink);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),t=document.createElementNS(svg.namespaceURI,'text');svg.classList.add('stroke-outline');svg.style.color=getComputedStyle(c).color;svg.setAttribute('aria-hidden','true');t.textContent=ink.textContent;t.setAttribute('x','0');t.setAttribute('y','.85em');svg.append(t);c.append(svg);
   }
   let running=false,timer,animations=[];
   function play(){if(running||reduce.matches)return;running=true;animations.forEach(a=>a.cancel());const top=chars[0].getBoundingClientRect().top;animations=[];chars.forEach((c,i)=>{const delay=(c.getBoundingClientRect().top>top+10?150:0)+Math.min(i*12,180);animations.push(c.querySelector('text').animate([
     {strokeDasharray:'2000',strokeDashoffset:2000,strokeOpacity:1,fillOpacity:0},
     {strokeDasharray:'2000',strokeDashoffset:0,strokeOpacity:1,fillOpacity:0,offset:.55},
     {strokeDasharray:'2000',strokeDashoffset:0,strokeOpacity:0,fillOpacity:1}
    ],{duration:1300,delay,fill:'backwards',easing:'ease-in-out'}));});timer=setTimeout(()=>running=false,1700);}
   let played=false;const onProgress=()=>{if(!played&&parseFloat(getComputedStyle(film.parentElement).opacity)>.7){played=true;play();}};
   listen(window,'sceneprogress',onProgress);cleanups.push(()=>{clearTimeout(timer);animations.forEach(a=>a.cancel())});onProgress();
  }

 }
 // Translation replaces the original nodes' contents before this event.
 document.fonts.ready.then(setup);addEventListener('languagechange',setup);
})();
