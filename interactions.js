(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
  const stack=document.querySelector('.feature-stack'),cards=[...stack.querySelectorAll('.feature-card')];
  function activate(card){stack.classList.toggle('has-active',!!card);cards.forEach(c=>c.classList.toggle('is-highlighted',c===card));}
  cards.forEach(card=>{card.addEventListener('pointerenter',()=>{if(fine.matches)activate(card);});card.addEventListener('focus',()=>activate(card));card.addEventListener('blur',()=>activate(null));});stack.addEventListener('pointerleave',()=>activate(null));
  // Text rollers are built from the translated content, so both languages animate alike.
  function buttonLabels(){document.querySelectorAll('.pill-link > span:not(.pill-icon)').forEach(span=>{const text=span.textContent;span.classList.add('button-label');span.replaceChildren();const front=document.createElement('span'),back=document.createElement('span');front.textContent=back.textContent=text;back.setAttribute('aria-hidden','true');span.append(front,back);});}
  buttonLabels();addEventListener('languagechange',buttonLabels);
})();
