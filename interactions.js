(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
  // Captions belong to the photograph: hover/focus on desktop, tap on touch.
  const surfaces=[...document.querySelectorAll('.orbit-surface')];
  surfaces.forEach(button=>{
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';surfaces.forEach(b=>b.setAttribute('aria-expanded','false'));button.setAttribute('aria-expanded',String(open));});
    button.addEventListener('keydown',e=>{if(e.key==='Escape')button.setAttribute('aria-expanded','false');});
  });
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.orbit-surface'))surfaces.forEach(b=>b.setAttribute('aria-expanded','false'));},{passive:true});
  const stack=document.querySelector('.feature-stack'),cards=[...stack.querySelectorAll('.feature-card')];
  function activate(card){stack.classList.toggle('has-active',!!card);cards.forEach(c=>c.classList.toggle('is-highlighted',c===card));}
  cards.forEach(card=>{card.addEventListener('pointerenter',()=>{if(fine.matches)activate(card);});card.addEventListener('focus',()=>activate(card));card.addEventListener('blur',()=>activate(null));});stack.addEventListener('pointerleave',()=>activate(null));
  // Text rollers are built from the translated content, so both languages animate alike.
  function buttonLabels(){document.querySelectorAll('.pill-link > span:not(.pill-icon)').forEach(span=>{const text=span.textContent;span.classList.add('button-label');span.replaceChildren();const front=document.createElement('span'),back=document.createElement('span');front.textContent=back.textContent=text;back.setAttribute('aria-hidden','true');span.append(front,back);});}
  buttonLabels();addEventListener('languagechange',buttonLabels);
})();
