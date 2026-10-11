(() => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const $ = s => document.querySelector(s);
  const clamp = x => Math.max(0, Math.min(1, x));
  const segment = (p,a,b) => clamp((p-a)/(b-a));
  const smooth = x => x*x*(3-2*x);
  const mix = (a,b,t) => a+(b-a)*t;
  const sections = Object.fromEntries(['hero','why','showcase','manifesto','orbit','description','features','footer'].map(n=>[n,$(`.${n}`)]));
  const items = [...document.querySelectorAll('.why-item')];
  const cards = [...document.querySelectorAll('.feature-card')];
  const photos = [...document.querySelectorAll('.orbit-photo')];
  const track = $('.showcase-track'), bridge=$('.photo-bridge');
  const glow=document.createElement('div');glow.className='creation-glow';glow.setAttribute('aria-hidden','true');document.body.append(glow);
  const filmWindow=$('.film-window');
  // The same video continues behind the first incoming photographs.
  document.body.append(filmWindow);filmWindow.classList.add('film-continuity');
  // Entry poses: x/y in viewport units, followed by the resting pose and rotation.
  const poses = [
    [-70,-25,-34,-25,-16, .84], [65,-60,18,-30,12,.77],
    [80,15,39,-14,-10,.78], [-70,70,-35,20,9,.8],
    [5,80,0,35,-7,.72], [-10,-75,-7,-36,8,.64],
    [55,65,28,28,-6,1]
  ];
  let metrics={},travel=0,lenis=null,ticking=false,compareTarget={};
  function measure(){
    metrics=Object.fromEntries(Object.entries(sections).map(([n,e])=>[n,{top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}]));
    travel=Math.max(0,track.scrollWidth-innerWidth);
    const r=$('.compare').getBoundingClientRect();
    // Compare's target when its sticky frame first reaches the top of the viewport.
    const frame=$('.description-frame').getBoundingClientRect();
    compareTarget={x:r.left,y:r.top-frame.top,w:r.width,h:r.height};
    schedule();
  }
  const progress=n=>clamp((scrollY-metrics[n].top)/Math.max(1,metrics[n].height-innerHeight));
  function render(){
    ticking=false;if(!metrics.hero)return;
    const p=Object.fromEntries(Object.keys(sections).map(n=>[n,progress(n)]));
    const transitionStart=metrics.orbit.top+(metrics.orbit.height-innerHeight)*.66;
    const blend=smooth(segment(scrollY,transitionStart,metrics.description.top));
    const shade=Math.round(mix(0,239,blend));
    document.documentElement.style.setProperty('--scene-tone',`rgb(${shade} ${shade} ${shade})`);
    document.documentElement.style.setProperty('--light-blend',blend);
    $('.site-header').classList.toggle('is-light',blend>.6);
    document.body.classList.toggle('light-scene',blend>.6);
    const dispatch=()=>window.dispatchEvent(new CustomEvent('sceneprogress',{detail:{progress:p,metrics,scroll:scrollY,lightBlend:blend}}));
    if(media.matches){if(filmWindow.parentElement!==$('.manifesto-frame'))$('.manifesto-frame').prepend(filmWindow);filmWindow.classList.remove('film-continuity');filmWindow.style.opacity='1';filmWindow.style.visibility='visible';bridge.style.opacity=0;glow.style.opacity=0;$('.description').classList.add('creation-interactive');$('.description').style.setProperty('--creation-reveal',1);$('.description').style.setProperty('--canvas-reveal',1);$('.description').style.setProperty('--scan-position','50%');photos.forEach(photo=>{photo.style.pointerEvents='auto';photo.querySelector('button').tabIndex=0;});dispatch();return;}
    if(filmWindow.parentElement!==document.body)document.body.append(filmWindow);filmWindow.classList.add('film-continuity');
    const hero=clamp(scrollY/innerHeight);
    $('.hero-wordmark').style.transform=`translateY(${-hero*50}px) scale(${1+hero*.035})`;
    const leadOut=segment(p.why,.06,.14);
    $('.why-lead').style.opacity=1-leadOut;
    $('.why-lead').style.transform=`translateY(${-leadOut*35}px)`;
    items.forEach((item,i)=>{
      const local=(p.why-.14)/.86*4-i,enter=smooth(clamp(local*5)),exit=smooth(segment(local,.82,1));
      item.style.opacity=enter*(1-exit);item.style.transform=`translateY(${(1-enter)*55-exit*40}px)`;
      item.classList.toggle('is-active',local>=0&&local<1);
    });
    const entry=smooth(segment(p.showcase,.06,.23)),gallery=segment(p.showcase,.23,.96);
    track.style.transform=`translate3d(${-travel*gallery}px,0,0)`;
    $('.showcase-heading').style.transform=`translateY(${-smooth(segment(p.showcase,.04,.22))*innerHeight*.6}px)`;
    $('.showcase-heading').style.opacity=1-segment(p.showcase,.12,.23);
    $('.showcase-window').style.transform=`translate3d(${(1-entry)*innerWidth*.62}px,${(1-entry)*innerHeight*.65}px,0) rotate(${(1-entry)*9}deg)`;
    $('.showcase-window').style.opacity=segment(p.showcase,.06,.13);
    const m=p.manifesto,open=smooth(segment(m,0,.27)),exit=smooth(segment(m,.75,1));
    $('.film-window').style.clipPath=`inset(${mix(14,0,open)}% ${mix(10,0,open)}% round ${mix(30,0,open)}px)`;
    $('.film-window').style.transform=`scale(${mix(.86,1,open)})`;
    const filmStart=segment(scrollY,metrics.manifesto.top,metrics.manifesto.top+innerHeight*.2);
    const filmEnd=1-smooth(segment(p.orbit,0,.23));
    filmWindow.style.opacity=scrollY<metrics.manifesto.top?0:filmStart*filmEnd;
    filmWindow.style.visibility=scrollY>=metrics.manifesto.top&&p.orbit<.23?'visible':'hidden';
    $('.film-copy').style.opacity=segment(m,.12,.3)*(1-segment(m,.65,.89));
    $('.film-copy').style.transform=`translateY(${(1-open)*80-exit*80}px)`;
    const o=p.orbit,collapse=smooth(segment(o,.7,1));
    $('.orbit-copy').style.opacity=segment(o,0,.09)*(1-segment(o,.62,.78));
    $('.orbit-copy').style.transform=`translateY(${(1-smooth(segment(o,0,.15)))*50-collapse*60}px)`;
    photos.forEach((photo,i)=>{
      const pose=poses[i],enter=smooth(segment(o,.015+i*.045,.2+i*.045));
      const x=mix(pose[0],pose[2],enter),y=mix(pose[1],pose[3],enter),main=i===6;
      const depart=smooth(segment(o,.61+i*.009,.86+i*.009));
      photo.style.transform=`translate3d(${(x+(main?0:Math.sign(pose[2]||1)*depart*30))*innerWidth/100}px,${(y+(main?0:Math.sign(pose[3])*depart*25))*innerHeight/100}px,0) rotate(${pose[4]*enter}deg) scale(${mix(.65,pose[5],enter)})`;
      photo.style.opacity=main?(scrollY<transitionStart?enter:0):enter*(1-depart);
      photo.style.filter=main?'none':`blur(${depart*5}px)`;
      const active=enter>.85&&o<.61;
      photo.style.pointerEvents=active?'auto':'none';photo.querySelector('button').tabIndex=active?0:-1;
    });
    $('.orbit-caption').style.opacity=segment(o,.45,.55)*(1-segment(o,.6,.66));
    const arrival=metrics.description.top;
    const t=smooth(segment(scrollY,transitionStart,arrival));
    const handoff=smooth(segment(scrollY,arrival,arrival+innerHeight*.08));
    const inBridge=scrollY>=transitionStart&&scrollY<arrival+innerHeight*.08;
    const startW=photos[6].offsetWidth,startH=photos[6].offsetHeight;
    const startX=innerWidth*.78-startW/2,startY=innerHeight*.78-startH/2;
    const arc=Math.sin(t*Math.PI)*(innerWidth<600?25:65);
    const x=mix(startX,compareTarget.x,t)-arc,y=mix(startY,compareTarget.y,t)-arc;
    bridge.style.opacity=inBridge?1-handoff:0;
    bridge.style.left=`${x}px`;bridge.style.top=`${y}px`;
    bridge.style.width=`${mix(startW,compareTarget.w,t)}px`;
    bridge.style.height=`${mix(startH,compareTarget.h,t)}px`;
    bridge.style.transform=`rotate(${mix(-6,0,t)}deg)`;
    bridge.style.borderRadius=`${mix(0,4,t)}px`;
    glow.style.opacity=scrollY>=transitionStart&&scrollY<arrival?Math.sin(Math.PI*t)*.85:0;
    glow.style.setProperty('--glow-x',`${x+mix(startW,compareTarget.w,t)/2}px`);
    glow.style.setProperty('--glow-y',`${y+mix(startH,compareTarget.h,t)/2}px`);
    const reveal=smooth(segment(scrollY,arrival,arrival+innerHeight*.22));
    $('.description').classList.toggle('creation-interactive',reveal>=1);
    $('.description').style.setProperty('--creation-reveal',reveal);
    $('.description').style.setProperty('--canvas-reveal',scrollY>=arrival?1:0);
    $('.description').style.setProperty('--scan-position',`${mix(0,50,reveal)}%`);
    if(selectedExperience){const src=scrollY<arrival+innerHeight*.22?'./assets/photos/portrait.jpg':`./assets/photos/${selectedExperience}.jpg`;document.querySelectorAll('.compare img').forEach(img=>{if(img.getAttribute('src')!==src)img.src=src;});}
    const d=p.description;
    $('.description-frame').style.opacity=1-segment(d,.88,1);
    $('.description-frame').style.transform=`translateY(${-smooth(segment(d,.88,1))*45}px)`;
    cards.forEach((card,i)=>{
      const entry=smooth(segment(p.features,.035+i*.155,.19+i*.155));
      card.style.opacity=entry;
      card.style.transform=`translate3d(0,${(1-entry)*115}vh,0) rotate(${(1-entry)*(i%2?5:-5)}deg)`;
    });
    dispatch();
  }
  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(render);}}
  function configureMotion(){lenis?.destroy();lenis=!media.matches&&window.Lenis?new Lenis({autoRaf:true,anchors:true,duration:1.12,smoothWheel:true}):null;lenis?.on('scroll',schedule);measure();syncVideos();}
  track.addEventListener('focusin',event=>{
    const card=event.target.closest('.showcase-card,.showcase-end');if(!card||media.matches)return;
    const ratio=clamp((card.offsetLeft-innerWidth*.15)/Math.max(1,travel));
    $('.showcase-window').scrollLeft=0;
    const top=metrics.showcase.top+(.23+ratio*.73)*(metrics.showcase.height-innerHeight);
    if(lenis)lenis.scrollTo(top,{immediate:true});else scrollTo(0,top);
  });
  addEventListener('languagechange',()=>{
    const name=Object.keys(sections).find(n=>scrollY>=metrics[n].top&&scrollY<metrics[n].top+metrics[n].height)||'footer';
    const fraction=(scrollY-metrics[name].top)/metrics[name].height;
    requestAnimationFrame(()=>{lenis?.resize();measure();const top=metrics[name].top+fraction*metrics[name].height;if(lenis)lenis.scrollTo(top,{immediate:true});else scrollTo(0,top);updateDetail();schedule();});
  });
  const compare=$('.compare'),slider=$('#compare-slider');
  let selectedExperience=null;
  function setPreset(preset){compare.dataset.preset=preset;$('.demo-controls').dataset.preset=preset;document.querySelectorAll('.style-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===preset)));$('.demo-controls .small-label').textContent=`0${['portrait','warm','mono'].indexOf(preset)+1} / 03`;}
  slider.addEventListener('input',()=>compare.style.setProperty('--split',`${slider.value}%`));
  document.querySelectorAll('.style-tabs button').forEach(b=>b.addEventListener('click',()=>setPreset(b.dataset.preset)));
  document.querySelectorAll('.showcase-card').forEach(card=>card.addEventListener('click',()=>{
    const photo=card.dataset.photo;selectedExperience=photo;document.querySelectorAll('.compare img').forEach(img=>img.src=`./assets/photos/${photo}.jpg`);
    const original=$('.compare-original');original.dataset.i18nAlt=`photo.${photo}`;original.alt=translations[`photo.${photo}`][document.documentElement.lang==='en'?'en':'zh'];setPreset(card.dataset.preset);
  }));
  setPreset('portrait');
  // Video decoding is limited to visible work, and disabled for reduced motion/data saving.
  const videos=[...document.querySelectorAll('video[data-video]')],visible=new Set();
  function syncVideos(){
    const eligible=[...visible].filter(v=>!document.hidden&&!media.matches&&!navigator.connection?.saveData&&!v.dataset.userPaused).slice(0,2);
    videos.forEach(v=>{if(eligible.includes(v)){if(!v.getAttribute('src')){v.src=v.dataset.video;v.load();}if(v.paused)v.play().catch(()=>{});}else v.pause();});
  }
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));syncVideos();},{threshold:.15});
  videos.forEach(v=>{observer.observe(v);v.addEventListener('error',()=>v.classList.add('video-error'));});
  addEventListener('visibilitychange',syncVideos);
  // A native modal keeps keyboard focus inside the expanded card.
  const dialog=$('.feature-dialog');let selected=0,origin=null,closing=false;
  const looks=['brightness(1.06) saturate(.85)','sepia(.3) saturate(1.2)','grayscale(1) contrast(1.15)'];let look=0;
  function updateDetail(){
    $('#detail-title').textContent=cards[selected].querySelector('h3').textContent;
    $('.detail-body').textContent=cards[selected].querySelector('p').textContent;
    $('#detail-number').textContent=`0${selected+1} / 05`;
    const lang=document.documentElement.lang==='en'?'en':'zh';cards.forEach(c=>c.setAttribute('aria-label',`${c.querySelector('h3').textContent} · ${lang==='en'?'Explore':'点击探索'}`));
    $('.detail-result').alt=$('#detail-title').textContent;
  }
  function applyLook(){const exposure=Number($('.detail-adjust input').value)/100;$('.detail-result').style.filter=`${looks[look]} brightness(${exposure})`;}
  function openDetail(card,index){
    selected=index;origin=card;look=index===1||index===4?1:0;$('.detail-adjust input').value=100;$('.detail-sticker').classList.remove('is-visible');$('.sticker-toggle').setAttribute('aria-pressed','false');
    document.querySelectorAll('.detail-image img').forEach(img=>img.src=card.querySelector('img').src);
    $('.detail-image').dataset.feature=String(index);$('.detail-compare').hidden=index!==0;$('.detail-compare input').value=50;$('.detail-image').style.setProperty('--detail-split','50%');
    $('.detail-sticker').textContent='MAKE IT YOURS ✳';
    updateDetail();applyLook();
    $('.detail-presets').hidden=index===2||index===3;$('.detail-adjust').hidden=index!==2;$('.sticker-toggle').hidden=index!==3;
    document.querySelectorAll('.detail-presets button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===look)));
    const rect=card.getBoundingClientRect();dialog.showModal();lenis?.stop();
    const target=dialog.getBoundingClientRect();
    if(!media.matches)dialog.animate([{transform:`translate(${rect.left+rect.width/2-target.left-target.width/2}px,${rect.top+rect.height/2-target.top-target.height/2}px) scale(${rect.width/target.width})`,opacity:.2},{transform:'none',opacity:1}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});
    $('.detail-close').focus({preventScroll:true});
  }
  async function closeDetail(){if(closing||!dialog.open)return;closing=true;
    if(!media.matches&&origin){const a=origin.getBoundingClientRect(),b=dialog.getBoundingClientRect();await dialog.animate([{transform:'none',opacity:1},{transform:`translate(${a.left+a.width/2-b.left-b.width/2}px,${a.top+a.height/2-b.top-b.height/2}px) scale(${a.width/b.width})`,opacity:0}],{duration:330,easing:'cubic-bezier(.4,0,.8,.4)'}).finished;}
    dialog.close();lenis?.start();origin?.focus({preventScroll:true});closing=false;
  }
  cards.forEach((card,i)=>{card.addEventListener('click',()=>openDetail(card,i));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(card,i);}});});
  $('.detail-close').addEventListener('click',closeDetail);
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
  $('.detail-copy a').addEventListener('click',async e=>{e.preventDefault();await closeDetail();if(lenis)lenis.scrollTo('#footer');else $('#footer').scrollIntoView({behavior:media.matches?'instant':'smooth'});});
  document.querySelectorAll('.detail-presets button').forEach(b=>b.addEventListener('click',()=>{look=+b.dataset.look;$('.detail-presets button[aria-pressed="true"]')?.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');applyLook();}));
  $('.detail-adjust input').addEventListener('input',applyLook);
  $('.detail-compare input').addEventListener('input',e=>$('.detail-image').style.setProperty('--detail-split',`${e.target.value}%`));
  $('.sticker-toggle').addEventListener('click',e=>{const el=$('.detail-sticker');el.classList.add('is-visible');const second=el.dataset.variant!=='second';el.dataset.variant=second?'second':'first';el.textContent=second?'A LITTLE DIFFERENT ↗':'MAKE IT YOURS ✳';e.currentTarget.setAttribute('aria-pressed','true');});
  updateDetail();
  // Fine-pointer feedback is deliberately bounded so text remains stable.
  addEventListener('pointermove',e=>{if(media.matches||!fine.matches)return;document.documentElement.style.setProperty('--pointer-x',`${e.clientX/innerWidth*100}%`);document.documentElement.style.setProperty('--pointer-y',`${e.clientY/innerHeight*100}%`);window.dispatchEvent(new CustomEvent('scenepointer',{detail:{x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5}}));},{passive:true});
  document.querySelectorAll('.pill-link').forEach(b=>{b.addEventListener('pointermove',e=>{if(media.matches||!fine.matches)return;const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.025}px ${(e.clientY-r.top-r.height/2)*.05}px`;});b.addEventListener('pointerleave',()=>b.style.translate='0 0');});
  // One continuous opening, ending at the actual hero wordmark position.
  let introTimer=0,introStarted=false,introFinished=false,introAnimation;
  function finishIntro(){introFinished=true;clearTimeout(introTimer);introAnimation?.cancel();document.body.classList.remove('intro-running','intro-revealing');document.body.classList.add('intro-done');try{sessionStorage.setItem('xingtu-intro-v2','1');}catch{}}
  function revealIntro(){if(introStarted||introFinished)return;introStarted=true;clearTimeout(introTimer);
    const label=$('.intro-brand'),target=$('.brand-chinese'),r=target.getBoundingClientRect(),style=getComputedStyle(target);
    label.textContent='醒图';label.style.font=style.font;label.style.letterSpacing=style.letterSpacing;label.style.lineHeight=style.lineHeight;
    label.style.left=`${r.left}px`;label.style.top=`${r.top}px`;label.style.width=`${r.width}px`;label.style.height=`${r.height}px`;
    const scale=Math.min(.55,innerWidth*.36/r.width),x=innerWidth/2-r.left-r.width/2,y=innerHeight*.44-r.top-r.height/2;
    document.body.classList.add('intro-revealing');
    introAnimation=label.animate([{opacity:0,transform:`translate(${x}px,${y+12}px) scale(${scale})`,filter:'blur(8px)',offset:0},{opacity:1,transform:`translate(${x}px,${y}px) scale(${scale})`,filter:'blur(0px)',offset:.25},{opacity:1,transform:`translate(${x}px,${y}px) scale(${scale})`,filter:'blur(0px)',offset:.42},{opacity:1,transform:'translate(0,0) scale(1)',filter:'blur(0px)',offset:1}],{duration:2000,easing:'cubic-bezier(.22,.8,.25,1)',fill:'both'});
    introTimer=setTimeout(finishIntro,2050);
  }
  let seen=false;try{seen=!!sessionStorage.getItem('xingtu-intro-v2');}catch{}
  if(media.matches||seen||scrollY>30)finishIntro();else{document.body.classList.add('intro-running');introTimer=setTimeout(revealIntro,900);if(document.body.classList.contains('scene-ready'))document.fonts.ready.then(revealIntro);else addEventListener('handready',()=>document.fonts.ready.then(revealIntro),{once:true});}
  $('.intro-skip').addEventListener('click',finishIntro);
  media.addEventListener('change',()=>{if(media.matches)finishIntro()});
  addEventListener('resize',()=>{if(introStarted&&!introFinished)finishIntro()},{passive:true});
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('load',measure);media.addEventListener('change',configureMotion);document.fonts.ready.then(measure);configureMotion();
})();
