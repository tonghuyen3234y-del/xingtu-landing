(() => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const $ = s => document.querySelector(s);
  const clamp = x => Math.max(0, Math.min(1, x));
  const segment = (p,a,b) => clamp((p-a)/(b-a));
  const smooth = x => x*x*(3-2*x);
  const mix = (a,b,t) => a+(b-a)*t;
  const sections = Object.fromEntries(['hero','why','description','showcase','manifesto','features','footer'].map(n=>[n,$(`.${n}`)]));
  const cards = [...document.querySelectorAll('.feature-card')];
  const track = $('.showcase-track');
  const filmWindow=$('.film-window');
  document.body.append(filmWindow);filmWindow.classList.add('film-continuity');
  let metrics={},travel=0,lenis=null,ticking=false;
  function measure(){
    metrics=Object.fromEntries(Object.entries(sections).map(([n,e])=>[n,{top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}]));
    travel=Math.max(0,track.scrollWidth-innerWidth);
    schedule();
  }
  const progress=n=>clamp((scrollY-metrics[n].top)/Math.max(1,metrics[n].height-innerHeight));
  function render(){
    ticking=false;if(!metrics.hero)return;
    const p=Object.fromEntries(Object.keys(sections).map(n=>[n,progress(n)]));
    const blend=0;
    document.documentElement.style.setProperty('--scene-tone','#000');
    document.documentElement.style.setProperty('--light-blend',0);
    $('.site-header').classList.remove('is-light');
    document.body.classList.remove('light-scene');
    const dispatch=()=>window.dispatchEvent(new CustomEvent('sceneprogress',{detail:{progress:p,metrics,scroll:scrollY,lightBlend:blend}}));
    if(media.matches){if(filmWindow.parentElement!==$('.manifesto-frame'))$('.manifesto-frame').prepend(filmWindow);filmWindow.classList.remove('film-continuity');filmWindow.style.opacity='1';filmWindow.style.visibility='visible';$('.description').classList.add('creation-interactive');$('.description').style.setProperty('--creation-reveal',1);$('.description').style.setProperty('--canvas-reveal',1);dispatch();return;}
    if(filmWindow.parentElement!==document.body)document.body.append(filmWindow);filmWindow.classList.add('film-continuity');
    const hero=clamp(scrollY/innerHeight);
    $('.hero-wordmark').style.transform=`translateY(${-hero*50}px) scale(${1+hero*.035})`;
    const entry=smooth(segment(p.showcase,0,.14)),gallery=segment(p.showcase,.14,.9);
    track.style.transform=`translate3d(${-travel*gallery}px,0,0)`;
    $('.showcase-heading').style.transform=`translateY(${-smooth(segment(p.showcase,.02,.14))*32}px)`;
    $('.showcase-heading').style.opacity=1-smooth(segment(p.showcase,.04,.14));
    $('.showcase-window').style.transform=`translate3d(${(1-entry)*innerWidth*.06}px,${(1-entry)*36}px,0)`;
    const galleryExit=1-smooth(segment(scrollY,metrics.manifesto.top-innerHeight*.22,metrics.manifesto.top+innerHeight*.12));
    $('.showcase-window').style.opacity=entry*galleryExit;
    const m=p.manifesto;
    const filmArrival=metrics.manifesto.top-innerHeight*.26;
    const open=smooth(segment(scrollY,filmArrival,metrics.manifesto.top+innerHeight*.28));
    filmWindow.style.clipPath=`inset(${mix(5,0,open)}% ${mix(4,0,open)}% round ${mix(16,0,open)}px)`;
    filmWindow.style.transform=`scale(${mix(.97,1,open)})`;
    const filmStart=smooth(segment(scrollY,filmArrival,metrics.manifesto.top+innerHeight*.08));
    const filmEnd=1-smooth(segment(scrollY,metrics.features.top-innerHeight*.3,metrics.features.top+innerHeight*.12));
    filmWindow.style.opacity=filmStart*filmEnd;
    filmWindow.style.visibility=scrollY>=filmArrival&&filmEnd>0?'visible':'hidden';
    $('.film-copy').style.opacity=smooth(segment(m,.05,.16))*(1-smooth(segment(m,.8,1)));
    $('.film-copy').style.transform=`translateY(${(1-smooth(segment(m,0,.16)))*20}px)`;
    // The style lab now enters independently as the third chapter.
    $('.description').classList.add('creation-interactive');
    $('.description').style.setProperty('--creation-reveal',1);
    $('.description').style.setProperty('--canvas-reveal',1);
    $('.description-frame').style.opacity=1;
    $('.description-frame').style.transform='none';
    cards.forEach((card,i)=>{
      const entry=innerWidth<=900?1:smooth(segment(p.features,i*.12,.16+i*.12));
      card.style.opacity=entry;
      card.style.transform=`translate3d(0,${(1-entry)*48}px,0)`;
      card.style.pointerEvents=entry>.8?'auto':'none';
      card.tabIndex=entry>.8?0:-1;
    });
    dispatch();
  }
  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(render);}}
  function configureMotion(){lenis?.destroy();lenis=!media.matches&&window.Lenis?new Lenis({autoRaf:true,anchors:true,duration:.85,smoothWheel:true}):null;lenis?.on('scroll',schedule);measure();syncVideos();}
  track.addEventListener('focusin',event=>{
    const card=event.target.closest('.showcase-card,.showcase-end');if(!card||media.matches)return;
    const rect=card.getBoundingClientRect();if(rect.left>=0&&rect.right<=innerWidth)return;
    const ratio=clamp((card.offsetLeft-innerWidth*.15)/Math.max(1,travel));
    $('.showcase-window').scrollLeft=0;
    const top=metrics.showcase.top+(.14+ratio*.76)*(metrics.showcase.height-innerHeight);
    if(lenis)lenis.scrollTo(top,{immediate:true});else scrollTo(0,top);
  });
  addEventListener('languagechange',()=>{
    const name=Object.keys(sections).find(n=>scrollY>=metrics[n].top&&scrollY<metrics[n].top+metrics[n].height)||'footer';
    const fraction=(scrollY-metrics[name].top)/metrics[name].height;
    requestAnimationFrame(()=>{lenis?.resize();measure();const top=metrics[name].top+fraction*metrics[name].height;if(lenis)lenis.scrollTo(top,{immediate:true});else scrollTo(0,top);updateDetail();schedule();});
  });
  const compare=$('.compare'),slider=$('#compare-slider');
  let selectedExperience=null;
  function setPreset(preset){compare.dataset.preset=preset;$('.demo-controls').dataset.preset=preset;document.querySelectorAll('.style-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===preset)));}
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
    const eligible=[...visible].filter(v=>!document.hidden&&!media.matches&&!navigator.connection?.saveData&&!v.dataset.userPaused).sort((a,b)=>Number(b.classList.contains('portrait-film'))-Number(a.classList.contains('portrait-film'))).slice(0,2);
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
