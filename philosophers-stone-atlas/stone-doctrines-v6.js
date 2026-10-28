(() => {
  'use strict';
  const R=window.STONE_V2_READINGS;
  const D=window.STONE_V2_DATA;
  if(!R||!D) return;
  const {esc,pointValid}=R;

  const DOCTRINES={
    Nihilism:{
      mature:false,
      text:'In the strong existential form used here, the absence of given meaning is treated as the absence of meaning itself. An informational negative is made to settle the interpretive question, so contextual meaning is excluded while that thesis is retained.',
      region:{
        label:'Knowledge-dominant nihilist corridor',
        radius:.10,
        segments:[[[0,.5,-.5],[0,0,-1]],[[0,0,-1],[0,-.5,-.5]]]
      }
    },
    Existentialism:{
      mature:true,
      text:'The claim that meaning or essence is not simply given does not require excluding welfare, constraint, evidence, context, or correction. Created or chosen meaning can remain fully answerable to reality.'
    },
    Stoicism:{
      mature:true,
      text:'Acceptance of constraint and disciplined response do not inherently exclude affected welfare, context, evidence, or correction. Distortion begins only when those pressures are suppressed.'
    },
    Utilitarianism:{
      mature:true,
      text:'Consequences and affected welfare may lead the judgment while feasibility, evidence, context, uncertainty, and correction still retain the authority they warrant.'
    },
    Deontology:{
      mature:true,
      text:'A duty or rule can remain fully answerable to circumstance, competing duties, welfare, feasibility, evidence, and correction rather than being treated as self-applying.'
    },
    'Moral relativism':{
      mature:false,
      text:'In the strong form used here, contextual variation is taken to mean that shared reality cannot supply cross-context moral correction. Interpretation is therefore granted authority that informational grounding and correction are not allowed to defeat.',
      region:{
        label:'Context-dominant relativist corridor',
        radius:.10,
        segments:[[[0,.5,.5],[0,0,1]],[[0,0,1],[0,-.5,.5]]]
      }
    },
    Solipsism:{
      mature:false,
      text:'In the strong epistemic form used here, independent reality is defined so that external evidence can never genuinely count against the thesis. The stance therefore withholds corrective authority from reality.',
      region:{
        label:'Insulated interpretation region',
        radius:.085,
        segments:[[[0,-.2,.8],[0,-.55,.45]],[[0,-.55,.45],[0,-.7,.3]]]
      }
    },
    Skepticism:{
      mature:true,
      text:'Provisional doubt remains answerable when confidence tracks available evidence and new evidence can update the stance.'
    },
    Hedonism:{
      mature:false,
      text:'In the strong sole-good form used here, pleasure alone is sufficient to settle value. One welfare signal is therefore made authoritative over other materially relevant welfare, constraint, information, context, and correction.',
      region:{
        label:'Pleasure-dominant welfare corridor',
        radius:.10,
        segments:[[[.5,.5,0],[1,0,0]],[[1,0,0],[.5,-.5,0]]]
      }
    },
    Determinism:{
      mature:true,
      text:'Whether events are determined is a content thesis about reality; it does not inherently exclude welfare, agency-relevant context, evidence, practical constraint, or correction.'
    }
  };

  const REGIONS=Object.fromEntries(Object.entries(DOCTRINES).map(([name,d])=>[name,d.region||null]));
  const l1=p=>Math.abs(p[0])+Math.abs(p[1])+Math.abs(p[2]);
  const surfacePoint=p=>pointValid(p)&&Math.abs(l1(p)-1)<=.03;
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const segmentDistance=(p,a,b)=>{
    const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
    const ap=[p[0]-a[0],p[1]-a[1],p[2]-a[2]];
    const den=ab[0]*ab[0]+ab[1]*ab[1]+ab[2]*ab[2];
    const t=den<1e-12?0:Math.max(0,Math.min(1,(ap[0]*ab[0]+ap[1]*ab[1]+ap[2]*ab[2])/den));
    return dist(p,[a[0]+ab[0]*t,a[1]+ab[1]*t,a[2]+ab[2]*t]);
  };
  const inRegion=(p,spec)=>{
    if(!spec||!surfacePoint(p)) return false;
    if(spec.centers?.some(c=>dist(p,c)<=spec.radius)) return true;
    if(spec.segments?.some(([a,b])=>segmentDistance(p,a,b)<=spec.radius)) return true;
    return false;
  };

  // Fallback sampler retained in case the continuous mesh path is unavailable.
  let samples=null;
  const surfaceSamples=()=>{
    if(samples) return samples;
    const N=40,out=[],seen=new Set();
    for(let xi=-N;xi<=N;xi++){
      for(let yi=-N;yi<=N;yi++){
        const rem=N-Math.abs(xi)-Math.abs(yi);
        if(rem<0) continue;
        const zs=rem===0?[0]:[rem,-rem];
        for(const zi of zs){
          const key=`${xi},${yi},${zi}`;
          if(seen.has(key)) continue;
          seen.add(key);
          out.push([xi/N,yi/N,zi/N]);
        }
      }
    }
    samples=out;
    return samples;
  };

  const regionCache=new Map();
  const regionPoints=name=>{
    if(regionCache.has(name)) return regionCache.get(name);
    const spec=REGIONS[name];
    const pts=spec?surfaceSamples().filter(p=>inRegion(p,spec)):[];
    regionCache.set(name,pts);
    return pts;
  };

  // Continuous surface approximation. A triangle is retained only if all three
  // of its vertices satisfy the doctrine predicate, so the visual errs inward
  // rather than painting outside the region. N=64 gives a ~0.016 surface step.
  const meshCache=new Map();
  const regionTriangles=name=>{
    if(meshCache.has(name)) return meshCache.get(name);
    const spec=REGIONS[name];
    if(!spec){meshCache.set(name,[]);return [];}
    const N=64,tris=[];
    const signs=[-1,1];
    const P=(sx,sy,sz,i,j)=>[sx*(i/N),sy*(j/N),sz*((N-i-j)/N)];
    const keep=tri=>tri.every(p=>inRegion(p,spec));
    for(const sx of signs){
      for(const sy of signs){
        for(const sz of signs){
          for(let i=0;i<N;i++){
            for(let j=0;j<N-i;j++){
              const a=P(sx,sy,sz,i,j);
              const b=P(sx,sy,sz,i+1,j);
              const c=P(sx,sy,sz,i,j+1);
              const t1=[a,b,c];
              if(keep(t1)) tris.push(t1);
              if(j<N-i-1){
                const d=P(sx,sy,sz,i+1,j+1);
                const t2=[b,d,c];
                if(keep(t2)) tris.push(t2);
              }
            }
          }
        }
      }
    }
    meshCache.set(name,tris);
    return tris;
  };

  let openDoctrine='';
  const clearOverlay=()=>{
    if(window.STONE_VIEW?.setDoctrineRegionMesh) window.STONE_VIEW.setDoctrineRegionMesh([]);
    else window.STONE_VIEW?.setDoctrineRegion?.([]);
  };
  const setOverlay=name=>{
    if(!name){clearOverlay();return;}
    const tris=regionTriangles(name);
    if(tris.length&&window.STONE_VIEW?.setDoctrineRegionMesh){
      const ok=window.STONE_VIEW.setDoctrineRegionMesh(tris);
      if(ok===true) return;
    }
    window.STONE_VIEW?.setDoctrineRegion?.(regionPoints(name));
  };
  const clearSelection=()=>{
    openDoctrine='';
    clearOverlay();
  };

  R.doctrineHtml=()=>{
    const items=D.DOCTRINES.map(d=>{
      const def=DOCTRINES[d.name]||{mature:true,text:d.verdict||d.text};
      const open=openDoctrine===d.name;
      const region=REGIONS[d.name];
      const regionText=region?`Approximate Stone region: ${region.label}.`:'';
      return `<details class="stone-item stone-doctrine-item" data-doctrine="${esc(d.name)}"${open?' open':''}><summary><span>${esc(d.name)}</span></summary><div class="stone-item-body"><p>${esc(def.text)}</p>${regionText?`<p class="stone-region-note">${esc(regionText)}</p>`:''}</div></details>`;
    }).join('');
    return `<section class="stone-ref-section"><div class="stone-list">${items}</div></section>`;
  };

  document.addEventListener('click',e=>{
    const summary=e.target.closest?.('#stoneReferentContent .stone-doctrine-item > summary');
    if(!summary) return;
    const details=summary.parentElement;
    const name=details.dataset.doctrine||'';

    if(details.open){
      setTimeout(()=>{
        if(!details.open&&openDoctrine===name){
          openDoctrine='';
          clearOverlay();
        }
      },0);
      return;
    }

    for(const other of document.querySelectorAll('#stoneReferentContent .stone-doctrine-item[open]')){
      if(other!==details) other.open=false;
    }
    openDoctrine=name;
    setOverlay(name);
  },true);

  const contextSync=()=>{
    const refTab=[...document.querySelectorAll('.mode-toggle button')].find(b=>b.textContent.trim().toLowerCase()==='referent');
    const refActive=!!refTab&&(refTab.classList.contains('active')||refTab.classList.contains('selected')||refTab.getAttribute('aria-selected')==='true');
    const activeRef=document.querySelector('.stone-ref-option[aria-selected="true"]')?.dataset.ref||'';
    if(!refActive||activeRef!=='doctrines'){
      if(openDoctrine||window.STONE_VIEW?.getState?.().doctrineRegionVisible) clearSelection();
    }
  };
  new MutationObserver(contextSync).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class','aria-selected','hidden']});

  window.STONE_DOCTRINES_V6={
    DOCTRINES,
    REGIONS,
    regionPoints,
    regionTriangles,
    inRegion,
    clear:clearSelection,
    getState:()=>({
      openDoctrine,
      regionPointCount:openDoctrine?regionPoints(openDoctrine).length:0,
      regionTriangleCount:openDoctrine?regionTriangles(openDoctrine).length:0,
      mature:openDoctrine?DOCTRINES[openDoctrine]?.mature:null
    })
  };
})();
