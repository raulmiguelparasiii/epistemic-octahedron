(() => {
  'use strict';
  const R=window.STONE_V2_READINGS;
  const D=window.STONE_V2_DATA;
  if(!R||!D) return;
  const {esc,pointValid}=R;

  const SHORT={
    Nihilism:'In its strong existential form, the absence of given meaning is treated as the absence of meaning itself, so informational absence settles interpretation.',
    Existentialism:'Meaning is not simply given; maturity depends on keeping created or chosen meaning answerable to evidence, constraint, welfare, and context.',
    Stoicism:'Constraint and self-command can be maturely emphasized; distortion begins when acceptance erases avoidable harm or relevant human context.',
    Utilitarianism:'Consequences and welfare are real pressures, but aggregate outcome becomes immature when it is allowed to exhaust value or erase relevant persons and context.',
    Deontology:'Principle becomes immature when a rule is treated as self-applying and context, welfare, feasibility, or consequence lose warranted authority.',
    'Moral relativism':'Context matters, but contextual variation becomes immature when it is used to deny correction that a shared referent can actually supply.',
    Solipsism:'The thesis becomes self-sealing when independent evidence is reinterpreted so that nothing external can genuinely count against it.',
    Skepticism:'Doubt is mature when proportional to evidence; it becomes collapse-like when no evidence is permitted to update the stance.',
    Hedonism:'Pleasure and suffering are real welfare signals; the strong form becomes immature when pleasure alone is allowed to settle value.',
    Determinism:'The thesis itself does not fix maturity; distortion begins when causal explanation is used to erase materially relevant agency, responsibility, welfare, or correction.'
  };

  // These regions represent only the failure form described in the doctrine entry.
  // They are deliberately conservative UI approximations, not canonical Stone boundaries
  // and not claims that everyone holding the doctrine occupies the marked region.
  const REGIONS={
    Nihilism:{
      label:'Literalism → Doctrinalism corridor',
      note:'Information is allowed to settle interpretation; the lower end adds insulation from counterexample.',
      radius:.11,
      segments:[[[0,0,-1],[0,-.5,-.5]]]
    },
    Existentialism:null,
    Stoicism:{
      label:'Two distortion corridors',
      note:'Only the failure cases are marked: constraint suppressing welfare, or information/rule-like acceptance suppressing relevant context.',
      radius:.10,
      segments:[[[-1,0,0],[-.5,-.5,0]],[[0,0,-1],[0,-.5,-.5]]]
    },
    Utilitarianism:{
      label:'Instrumentalism → Expediency corridor',
      note:'Aggregate outcome becomes structurally dominant enough that persons or other materially relevant pressures lose warranted authority.',
      radius:.11,
      segments:[[[-1,0,0],[-.5,-.5,0]]]
    },
    Deontology:{
      label:'Literalism / Moral Literalism loci',
      note:'The compact red patches mark the rule-as-self-applying failure, not deontology as such.',
      radius:.11,
      centers:[[0,0,-1],[.5,0,-.5]]
    },
    'Moral relativism':{
      label:'Narrativism → Narrative Dogmatism corridor',
      note:'Contextual variation is made authoritative over informational and cross-context correction.',
      radius:.11,
      segments:[[[0,0,1],[0,-.5,.5]]]
    },
    Solipsism:{
      label:'Insulated interpretation locus',
      note:'A narrow lower-interpretation region marks the self-sealing form in which independent correction is neutralized.',
      radius:.10,
      segments:[[[0,-.5,.5],[0,-.75,.25]]]
    },
    Skepticism:{
      label:'Collapse-near insulation cap',
      note:'Only self-sealing skepticism is marked: the small lower cap where correction has nearly lost governing authority regardless of lateral content.',
      yMax:-.78
    },
    Hedonism:{
      label:'Sentimentalism → Moralism corridor',
      note:'A welfare signal is allowed to authenticate the whole judgment and increasingly resists correction by the rest of the referent.',
      radius:.11,
      segments:[[[1,0,0],[.5,-.5,0]]]
    },
    Determinism:null
  };

  const near=(a,b,t=.00001)=>Math.abs(a-b)<=t;
  const fmt=n=>near(n,0)?'0':near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt=p=>`(${p.map(fmt).join(', ')})`;
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
    if(Number.isFinite(spec.yMax)&&p[1]<=spec.yMax) return true;
    if(spec.centers?.some(c=>dist(p,c)<=spec.radius)) return true;
    if(spec.segments?.some(([a,b])=>segmentDistance(p,a,b)<=spec.radius)) return true;
    return false;
  };

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

  let openDoctrine='';
  const setOverlay=name=>{
    const pts=name?regionPoints(name):[];
    window.STONE_VIEW?.setDoctrineRegion?.(pts);
  };
  const clearSelection=()=>{
    openDoctrine='';
    setOverlay('');
  };

  const matchesAt=p=>Object.keys(REGIONS).filter(name=>REGIONS[name]&&inRegion(p,REGIONS[name]));

  R.doctrineHtml=p=>{
    const coord=pointValid(p)?cfmt(p):'—';
    const matches=matchesAt(p);
    const currentText=matches.length
      ?`The current coordinate lies inside the conservative failure-form region for ${matches.length===1?matches[0]:matches.join(', ')}.`
      :'The current coordinate is outside the conservative failure-form regions marked for the doctrines below.';
    const intro=`<article class="stone-current-card"><h2>Doctrines</h2><div class="stone-current-coordinate">${esc(coord)}</div><p>${esc(currentText)}</p><p class="stone-footnote">Red surface areas mark only the structurally defined failure form described for an entry. They do not mean the doctrine itself has one compulsory coordinate.</p></article>`;
    const items=D.DOCTRINES.map(d=>{
      const spec=REGIONS[d.name];
      const hit=matches.includes(d.name);
      const open=openDoctrine===d.name;
      const regionText=spec
        ?`Approximate failure region: ${spec.label}. ${spec.note}`
        :'No unique surface region follows from this doctrine label alone, so no red overlay is shown.';
      return `<details class="stone-item stone-doctrine-item${hit?' stone-match':''}" data-doctrine="${esc(d.name)}"${open?' open':''}><summary><span>${esc(d.name)}</span></summary><div class="stone-item-body"><p>${esc(SHORT[d.name]||d.verdict||d.text)}</p><p class="stone-region-note">${esc(regionText)}</p></div></details>`;
    }).join('');
    return `<section class="stone-ref-section">${intro}<div class="stone-list">${items}</div></section>`;
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
          setOverlay('');
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
    REGIONS,
    regionPoints,
    inRegion,
    clear:clearSelection,
    getState:()=>({openDoctrine,regionPointCount:openDoctrine?regionPoints(openDoctrine).length:0})
  };
})();
