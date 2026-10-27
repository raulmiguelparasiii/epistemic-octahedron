(() => {
  'use strict';
  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
  const {REFERENTS}=window.STONE_V2_DATA;
  const {esc,clamp,point,pointKey,doctrineHtml,communicationHtml,convictionHtml,decisionHtml,sourceHtml,renderSemantics}=window.STONE_V2_READINGS;
  function findTab(label){
    return $$('button').find(b=>b.textContent.trim().toLowerCase()===label.toLowerCase());
  }

  function replaceBranding(){
    document.title='The Philosopher\'s Stone';
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[]; let n;
    while((n=walker.nextNode())){
      if(n.parentElement?.closest('script,style')) continue;
      if(/Epistemic Octahedron|EO Mobile Atlas Beta/.test(n.nodeValue||'')) nodes.push(n);
    }
    for(const node of nodes){
      node.nodeValue=node.nodeValue.replace(/Epistemic Octahedron/g,'The Philosopher’s Stone').replace(/EO Mobile Atlas Beta/g,'The Philosopher’s Stone');
    }
  }

  function installStyles(){
    const s=document.createElement('style');
    s.textContent=`
      .mode-toggle{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      .stone-ref-selector{flex:0 0 72px;height:72px;margin:-3px 0 8px;display:grid;place-items:center;overflow:hidden}
      .stone-ref-selector[hidden]{display:none!important}
      .stone-ref-wheel{position:relative;width:min(184px,72vw);height:72px;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;scroll-behavior:smooth;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:22px 0;mask-image:linear-gradient(to bottom,transparent 0,#000 25%,#000 75%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 25%,#000 75%,transparent 100%)}
      .stone-ref-wheel::-webkit-scrollbar{display:none}
      .stone-ref-option{display:flex;width:100%;height:28px;align-items:center;justify-content:center;scroll-snap-align:center;scroll-snap-stop:always;border:0!important;background:transparent!important;box-shadow:none!important;padding:0 8px!important;color:var(--muted,#64748b);font:750 11px/1 system-ui,sans-serif;white-space:nowrap;transform:scale(var(--wheel-scale,.7));opacity:var(--wheel-opacity,.15);transition:transform 90ms linear,opacity 90ms linear,color 120ms ease;font-size:11px!important}
      .stone-ref-option.active{color:var(--text,#0f172a);font-weight:900}
      #stoneReferentContent{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable;padding:1px 2px 2px 0;color:var(--text,#0f172a)}
      #stoneReferentContent[hidden]{display:none!important}
      .stone-ref-section{padding-bottom:10px}
      .stone-current-card{border:1px solid var(--border,#e2e8f0);border-radius:14px;background:rgba(255,255,255,.78);padding:11px 12px;margin:0 0 11px}
      .stone-current-kicker{font-size:9.5px;font-weight:850;letter-spacing:.055em;text-transform:uppercase;color:var(--muted,#64748b);font-variant-numeric:tabular-nums;margin-bottom:5px}
      .stone-current-card h2{margin:0 0 8px;font-size:19px;line-height:1.14;letter-spacing:-.02em}
      .stone-current-card p{margin:0 0 8px;font-size:12.5px;line-height:1.55}.stone-current-card p:last-child{margin-bottom:0}
      .stone-ref-intro h3{margin:2px 0 6px;font-size:14px;line-height:1.2}.stone-ref-intro p,.stone-footnote{margin:0 0 11px;font-size:12px;line-height:1.52;color:var(--muted,#475569)}
      .stone-list{display:grid;gap:7px}.stone-item{border:1px solid var(--border,#e2e8f0);border-radius:12px;background:rgba(255,255,255,.72);overflow:hidden}.stone-item.stone-match{border-color:#94a3b8;box-shadow:0 0 0 1px rgba(100,116,139,.12) inset}
      .stone-item>summary{list-style:none;cursor:pointer;padding:10px 11px;display:flex;align-items:baseline;justify-content:space-between;gap:10px}.stone-item>summary::-webkit-details-marker{display:none}.stone-item>summary span{font-weight:850;font-size:13px}.stone-item>summary small{color:var(--muted,#64748b);font-size:9.5px;text-align:right}.stone-match>summary small{color:var(--text,#334155);font-weight:850}
      .stone-item-body{padding:0 11px 11px;border-top:1px solid var(--border,#e2e8f0)}.stone-item-body p{margin:9px 0 0;font-size:12px;line-height:1.55}.stone-reading{color:#475569}.stone-verdict{font-weight:750}
      .stone-tool{border-top:1px solid var(--border,#e2e8f0);margin-top:10px}.stone-tool>summary{list-style:none;cursor:pointer;padding:10px 1px;font-size:11px;font-weight:850;color:var(--muted,#475569)}.stone-tool>summary::-webkit-details-marker{display:none}.stone-tool>summary::after{content:'+';float:right;font-size:14px;font-weight:500}.stone-tool[open]>summary::after{content:'–'}
      .stone-audit{display:grid;gap:7px;padding-bottom:5px}.stone-audit article{border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:10px 11px;background:rgba(255,255,255,.72)}.stone-audit b{font-size:11.5px}.stone-audit p{margin:5px 0 0;font-size:12px;line-height:1.5}.stone-footnote{margin-top:8px}
      #stoneSemanticsPanel{overflow:auto!important;-webkit-overflow-scrolling:touch;padding:1px 2px 2px 0!important}.stone-semantics-inner{max-width:720px;margin:0 auto 40px}.stone-semantics-inner header h1{margin:2px 0 6px;font-size:22px;letter-spacing:-.025em}.stone-semantics-inner header p{font-size:12.75px;line-height:1.55;margin:0 0 13px}.stone-semantics-grid{display:grid;gap:7px}.stone-semantics-grid article{border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:10px 11px;background:rgba(255,255,255,.84)}.stone-semantics-grid h3{margin:0 0 4px;font-size:12px}.stone-semantics-grid p{margin:0;font-size:11.75px;line-height:1.5}
      @media(min-width:700px){.stone-semantics-grid{grid-template-columns:1fr 1fr}.stone-audit{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(s);
  }

  function installReferents(worldviewPanel,referentBtn){
    const nav=referentBtn.parentElement, title=nav?.closest('.mobile-title'), panelRoot=worldviewPanel.parentElement;
    if(!nav||!title||!panelRoot) return null;

    const selector=document.createElement('div');
    selector.className='stone-ref-selector';
    selector.hidden=true;
    selector.innerHTML=`<div class="stone-ref-wheel" role="listbox" aria-label="Referent">${REFERENTS.map(r=>`<button class="stone-ref-option${r.id==='worldview'?' active':''}" type="button" data-ref="${r.id}" role="option" aria-selected="${r.id==='worldview'}">${esc(r.label)}</button>`).join('')}</div>`;
    title.insertAdjacentElement('afterend',selector);

    const custom=document.createElement('div');
    custom.id='stoneReferentContent';
    custom.className='panel-page';
    custom.hidden=true;
    worldviewPanel.insertAdjacentElement('afterend',custom);

    const wheel=$('.stone-ref-wheel',selector);
    let active='worldview',wheelTimer=0,lastRender='';

    const renderCustom=(id,p)=>{
      if(id==='doctrines') return doctrineHtml(p);
      if(id==='communication') return communicationHtml(p);
      if(id==='conviction') return convictionHtml(p);
      if(id==='decision') return decisionHtml(p);
      if(id==='source') return sourceHtml(p);
      return '';
    };

    const wheelVisuals=()=>{
      const wr=wheel.getBoundingClientRect(),center=wr.top+wr.height/2;
      for(const b of $$('.stone-ref-option',selector)){
        const br=b.getBoundingClientRect(),d=Math.abs((br.top+br.height/2)-center)/28;
        b.style.setProperty('--wheel-scale',String(clamp(1-.17*d,.58,1)));
        b.style.setProperty('--wheel-opacity',String(clamp(1-.42*d,0,1)));
      }
    };

    const centerOption=(id,smooth=true)=>{
      const b=$(`.stone-ref-option[data-ref="${id}"]`,selector); if(!b) return;
      const top=b.offsetTop-(wheel.clientHeight-b.offsetHeight)/2;
      wheel.scrollTo({top,behavior:smooth?'smooth':'auto'});
      requestAnimationFrame(wheelVisuals);
    };

    const applyVisibility=()=>{
      const referentActive=referentBtn.classList.contains('active')||referentBtn.classList.contains('selected')||referentBtn.getAttribute('aria-selected')==='true';
      selector.hidden=!referentActive;
      if(!referentActive){custom.hidden=true;return;}
      if(active==='worldview'){
        worldviewPanel.hidden=false;
        custom.hidden=true;
      }else{
        worldviewPanel.hidden=true;
        custom.hidden=false;
      }
      if(!selector.hidden) requestAnimationFrame(()=>{centerOption(active,false);wheelVisuals();});
    };

    const render=()=>{
      if(active==='worldview'){applyVisibility();return;}
      const p=point(),k=active+'|'+pointKey(p);
      if(k===lastRender) return;
      lastRender=k;
      custom.innerHTML=renderCustom(active,p);
      applyVisibility();
    };

    const select=(id,{center=true,smooth=true}={})=>{
      if(!REFERENTS.some(r=>r.id===id)) return;
      active=id; lastRender='';
      for(const b of $$('.stone-ref-option',selector)){
        const on=b.dataset.ref===id;
        b.classList.toggle('active',on);
        b.setAttribute('aria-selected',String(on));
      }
      if(center) centerOption(id,smooth);
      render();
    };

    selector.addEventListener('click',e=>{const b=e.target.closest('.stone-ref-option');if(b)select(b.dataset.ref);});
    wheel.addEventListener('scroll',()=>{
      wheelVisuals();
      clearTimeout(wheelTimer);
      wheelTimer=setTimeout(()=>{
        const wr=wheel.getBoundingClientRect(),center=wr.top+wr.height/2;
        let best=null,bestD=Infinity;
        for(const b of $$('.stone-ref-option',selector)){
          const br=b.getBoundingClientRect(),d=Math.abs((br.top+br.height/2)-center);
          if(d<bestD){best=b;bestD=d;}
        }
        if(best) select(best.dataset.ref,{center:true,smooth:true});
      },85);
    },{passive:true});

    let raf=0,lastPoint='';
    const tick=()=>{
      const k=pointKey(point());
      if(k!==lastPoint){lastPoint=k;render();}
      if(!selector.hidden) wheelVisuals();
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);

    referentBtn.addEventListener('click',()=>setTimeout(()=>{applyVisibility();centerOption(active,false);wheelVisuals();render();},0));
    applyVisibility();
    return {selector,custom,select,applyVisibility,destroy:()=>cancelAnimationFrame(raf)};
  }

  function installThreeTabs(worldviewPanel,plotBtn,referentBtn,questionsBtn,editorBtn,referentUI){
    const nav=referentBtn.parentElement;
    if(!nav) return;

    let semanticsBtn=$('#stoneSemanticsTab');
    if(!semanticsBtn){
      semanticsBtn=referentBtn.cloneNode(false);
      semanticsBtn.id='stoneSemanticsTab';
      semanticsBtn.textContent='Semantics';
      semanticsBtn.removeAttribute('data-mode');
      semanticsBtn.removeAttribute('aria-controls');
      semanticsBtn.classList.remove('active','selected');
      semanticsBtn.setAttribute('aria-selected','false');
      nav.appendChild(semanticsBtn);
    }

    // Remove the beta controls from this copy rather than leaving invisible fourth/fifth slots.
    questionsBtn?.remove();
    editorBtn?.remove();
    $('#questionsPanel')?.remove();
    $('#editorPanel')?.remove();

    let semanticsPanel=$('#stoneSemanticsPanel');
    if(!semanticsPanel){
      semanticsPanel=document.createElement('div');
      semanticsPanel.id='stoneSemanticsPanel';
      semanticsPanel.className='panel-page';
      semanticsPanel.innerHTML=renderSemantics();
      semanticsPanel.hidden=true;
      referentUI.custom.insertAdjacentElement('afterend',semanticsPanel);
    }

    const setSemanticsActive=on=>{
      semanticsPanel.hidden=!on;
      if(on){
        referentUI.selector.hidden=true;
        worldviewPanel.hidden=true;
        referentUI.custom.hidden=true;
        plotBtn.classList.remove('active','selected');
        referentBtn.classList.remove('active','selected');
        plotBtn.setAttribute('aria-selected','false');
        referentBtn.setAttribute('aria-selected','false');
        semanticsBtn.classList.add('active');
        semanticsBtn.setAttribute('aria-selected','true');
      }else{
        semanticsBtn.classList.remove('active','selected');
        semanticsBtn.setAttribute('aria-selected','false');
      }
    };

    semanticsBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setSemanticsActive(true);});
    plotBtn.addEventListener('click',()=>setTimeout(()=>{setSemanticsActive(false);referentUI.selector.hidden=true;referentUI.custom.hidden=true;},0));
    referentBtn.addEventListener('click',()=>setTimeout(()=>{setSemanticsActive(false);referentUI.applyVisibility();},0));
  }

  function boot(attempt=0){
    replaceBranding();
    const worldviewPanel=$('#worldviewPanel');
    const plotBtn=findTab('Plot');
    const referentBtn=findTab('Worldview')||findTab('Referent');
    const questionsBtn=findTab('Questions');
    const editorBtn=findTab('Editor');
    if(!worldviewPanel||!plotBtn||!referentBtn){
      if(attempt<80) setTimeout(()=>boot(attempt+1),50);
      return;
    }
    installStyles();
    referentBtn.textContent='Referent';
    const referentUI=installReferents(worldviewPanel,referentBtn);
    if(!referentUI){if(attempt<80)setTimeout(()=>boot(attempt+1),50);return;}
    installThreeTabs(worldviewPanel,plotBtn,referentBtn,questionsBtn,editorBtn,referentUI);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>boot());
  else boot();
})();
