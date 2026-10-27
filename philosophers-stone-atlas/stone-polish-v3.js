(() => {
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    /* Keep the wheel geometry unchanged; only enlarge the selected referent visually. */
    .stone-ref-option.active{transform:scale(1.18)!important}

    /* Match the minimal coordinate treatment already used by the Worldview referent. */
    .stone-current-card h2{margin-bottom:0!important}
    .stone-current-coordinate{
      margin:4px 0 12px;
      font-size:10.5px;
      line-height:normal;
      color:var(--muted,#64748b);
      font-family:inherit;
      font-weight:400;
      font-style:normal;
      letter-spacing:normal;
      text-transform:none;
      font-variant-numeric:tabular-nums;
    }
  `;
  (document.head||document.documentElement).appendChild(style);

  const coordinateFrom=text=>{
    const m=String(text||'').replace(/−/g,'-').match(/\(\s*-?\d+(?:\.\d+|\/\d+)?\s*,\s*-?\d+(?:\.\d+|\/\d+)?\s*,\s*-?\d+(?:\.\d+|\/\d+)?\s*\)/);
    return m?.[0]||'';
  };

  const normalizeCoordinates=root=>{
    if(!root) return;
    for(const card of root.querySelectorAll('.stone-current-card')){
      const old=card.querySelector('.stone-current-kicker');
      if(!old) continue;
      const coordinate=coordinateFrom(old.textContent);
      if(!coordinate) continue;
      old.textContent=coordinate;
      old.className='stone-current-coordinate';
      const title=card.querySelector('h2');
      if(title && old.previousElementSibling!==title) title.insertAdjacentElement('afterend',old);
    }
  };

  const boot=()=>{
    const root=document.getElementById('stoneReferentContent');
    if(!root){setTimeout(boot,50);return;}
    normalizeCoordinates(root);
    new MutationObserver(()=>normalizeCoordinates(root)).observe(root,{childList:true,subtree:true});
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
