(() => {
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    /* Keep wheel spacing unchanged; enlarge only the selected label visually. */
    .stone-ref-option.active{transform:scale(2)!important}

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

    /* Edge fades indicate additional scrollable content without adding layout space. */
    #stoneReferentContent.stone-fade-top{
      mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 100%);
      -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 100%);
    }
    #stoneReferentContent.stone-fade-bottom{
      mask-image:linear-gradient(to bottom,#000 0,#000 calc(100% - 14px),transparent 100%);
      -webkit-mask-image:linear-gradient(to bottom,#000 0,#000 calc(100% - 14px),transparent 100%);
    }
    #stoneReferentContent.stone-fade-both{
      mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 calc(100% - 14px),transparent 100%);
      -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 calc(100% - 14px),transparent 100%);
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

  const updateFade=root=>{
    if(!root) return;
    const top=root.scrollTop>1;
    const bottom=root.scrollTop+root.clientHeight<root.scrollHeight-1;
    root.classList.toggle('stone-fade-both',top&&bottom);
    root.classList.toggle('stone-fade-top',top&&!bottom);
    root.classList.toggle('stone-fade-bottom',!top&&bottom);
    if(!top&&!bottom) root.classList.remove('stone-fade-top','stone-fade-bottom','stone-fade-both');
  };

  const boot=()=>{
    const root=document.getElementById('stoneReferentContent');
    if(!root){setTimeout(boot,50);return;}
    const refresh=()=>requestAnimationFrame(()=>{normalizeCoordinates(root);updateFade(root);});
    refresh();
    root.addEventListener('scroll',()=>updateFade(root),{passive:true});
    new MutationObserver(refresh).observe(root,{childList:true,subtree:true});
    if('ResizeObserver' in window) new ResizeObserver(refresh).observe(root);
    window.addEventListener('resize',refresh,{passive:true});
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
