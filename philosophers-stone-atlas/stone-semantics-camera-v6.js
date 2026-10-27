(() => {
  'use strict';

  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
  const R=window.STONE_V2_READINGS||{};

  const style=document.createElement('style');
  style.textContent=`.stone-semantics-suppressed{display:none!important}`;
  (document.head||document.documentElement).appendChild(style);

  const point=()=>{
    if(typeof R.point==='function') return R.point();
    const p=['coord-x','coord-y','coord-z'].map(id=>Number(document.getElementById(id)?.value));
    return p.every(Number.isFinite)?p:null;
  };

  const setPoint=coord=>{
    if(!Array.isArray(coord)||coord.length!==3||!coord.every(Number.isFinite)) return false;
    const els=['coord-x','coord-y','coord-z'].map(id=>document.getElementById(id));
    if(els.some(e=>!e)) return false;
    els.forEach((e,i)=>{e.value=String(coord[i]);});
    els.forEach(e=>{
      e.dispatchEvent(new Event('input',{bubbles:true}));
      e.dispatchEvent(new Event('change',{bubbles:true}));
    });
    return true;
  };

  const frictionPoint=()=>{
    const p=point();
    if(p){
      const x=Number(p[0])||0,z=Number(p[2])||0,m=Math.abs(x)+Math.abs(z);
      if(m>.025) return [x/m,0,z/m];
    }
    return [1,0,0];
  };

  const controlText=el=>[
    el.getAttribute?.('data-view'),el.getAttribute?.('data-camera-view'),el.getAttribute?.('data-camera'),
    el.getAttribute?.('aria-label'),el.getAttribute?.('title'),el.id,el.className,el.textContent
  ].filter(Boolean).join(' ').replace(/\s+/g,' ').trim().toLowerCase();

  const controlCandidates=()=>$$('button,[role="button"],[data-view],[data-camera-view],[data-camera],[aria-label],[title]')
    .filter(el=>!el.closest('#stoneSemanticsPanel,.stone-ref-selector,.mode-toggle'));

  const viewControl=kind=>{
    let best=null,bestScore=0;
    for(const el of controlCandidates()){
      const s=controlText(el);
      let score=0;
      if(kind==='top'){
        if(/\btop view\b|\boverhead\b/.test(s)) score=120;
        else if(/\btop\b/.test(s)) score=100;
        if(/data-view[^ ]*top|camera[^ ]*top/.test(s)) score+=15;
      }else{
        if(/\bside view\b/.test(s)) score=120;
        else if(/\bside\b/.test(s)) score=110;
        else if(/\bfront view\b|\bfront\b/.test(s)) score=95;
        else if(/\bprofile\b/.test(s)) score=85;
        else if(/\bright view\b|\bleft view\b/.test(s)) score=70;
      }
      if(score>bestScore){best=el;bestScore=score;}
    }
    return best;
  };

  const activateView=kind=>{
    const ctl=viewControl(kind);
    if(!ctl) return false;
    try{ctl.click();return true;}catch{return false;}
  };

  const zoomOutControl=()=>{
    let best=null,bestScore=0;
    for(const el of controlCandidates()){
      const s=controlText(el);
      let score=0;
      if(/zoom out/.test(s)) score=120;
      else if(/\bminus\b/.test(s)) score=80;
      else if(/^\s*[−–-]\s*$/.test(el.textContent||'')) score=70;
      if(score>bestScore){best=el;bestScore=score;}
    }
    return best;
  };

  const zoomOut=(steps=2)=>{
    const ctl=zoomOutControl();
    if(ctl){
      for(let i=0;i<steps;i++) setTimeout(()=>{try{ctl.click();}catch{}},i*45);
      return;
    }
    const canvas=$$('canvas').find(c=>c.getBoundingClientRect().width>0&&c.getBoundingClientRect().height>0)||$('canvas');
    if(!canvas) return;
    const r=canvas.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    for(let i=0;i<steps;i++) setTimeout(()=>{
      try{canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:260,bubbles:true,cancelable:true,clientX:cx,clientY:cy}));}catch{}
    },i*45);
  };

  const ACTIONS={
    Empathy:{coord:[1,0,0],view:'top',zoomOut:true},
    Practicality:{coord:[-1,0,0],view:'top',zoomOut:true},
    Wisdom:{coord:[0,0,1],view:'top',zoomOut:true},
    Knowledge:{coord:[0,0,-1],view:'top',zoomOut:true},
    Collapse:{coord:[0,-1,0],view:'side'},
    Maturity:{coord:[0,1,0],view:'top'},
    'Epistemic freedom':{coord:[0,1,0],view:'top'},
    'Reality-friction':{friction:true,view:'side'}
  };

  const applySemanticAction=action=>{
    if(!action) return;
    if(action.view) activateView(action.view);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const coord=action.friction?frictionPoint():action.coord;
      if(coord) setPoint(coord);
      if(action.zoomOut) requestAnimationFrame(()=>zoomOut(2));
    }));
  };

  const installSemanticsAccordion=panel=>{
    panel.addEventListener('click',e=>{
      const summary=e.target.closest('.stone-semantic-item > summary');
      if(!summary||!panel.contains(summary)) return;
      const details=summary.parentElement;
      const wasOpen=details.open;
      for(const other of $$('.stone-semantic-item[open]',panel)) if(other!==details) other.open=false;
      if(wasOpen) return;
      const name=(summary.textContent||'').trim();
      const action=ACTIONS[name];
      if(action) setTimeout(()=>applySemanticAction(action),0);
    });
  };

  const installModeIsolation=panel=>{
    const root=panel.parentElement;
    if(!root) return;
    const suppressed=()=>[...root.children].filter(el=>el!==panel&&el.nodeType===1);
    const sync=()=>{
      const on=!panel.hidden;
      for(const el of suppressed()) el.classList.toggle('stone-semantics-suppressed',on);
      panel.classList.remove('stone-semantics-suppressed');
    };
    sync();
    new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['hidden','class','style']});
  };

  const boot=(attempt=0)=>{
    const panel=$('#stoneSemanticsPanel');
    if(!panel){if(attempt<120)setTimeout(()=>boot(attempt+1),50);return;}
    installSemanticsAccordion(panel);
    installModeIsolation(panel);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  else boot();
})();
