(() => {
  'use strict';
  const R=window.STONE_V2_READINGS;
  const D=window.STONE_V2_DATA;
  if(!R||!D) return;
  const {esc,pointValid,isOrigin}=R;
  const near=(a,b,t=.00001)=>Math.abs(a-b)<=t;
  const dist2=(p,a)=>p.reduce((s,v,i)=>s+(v-a[i])**2,0);
  const fmt=n=>near(n,0)?'0':near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt=p=>`(${p.map(fmt).join(', ')})`;

  const DOCS={
    Nihilism:{a:[0,0,-1],t:'In its strong existential form, the absence of given meaning is treated as the absence of meaning itself, so informational absence settles interpretation.'},
    Existentialism:{a:[0,.5,.5],t:'Meaning is not simply given; maturity depends on keeping created or chosen meaning answerable to evidence, constraint, welfare, and context.'},
    Stoicism:{a:[-.5,.5,0],t:'Constraint and self-command can be maturely emphasized; distortion begins when acceptance erases avoidable harm or relevant human context.'},
    Utilitarianism:{a:[.5,.5,0],t:'Consequences and welfare are real pressures, but aggregate outcome becomes immature when it is allowed to exhaust value or erase relevant persons and context.'},
    Deontology:{a:[.5,0,-.5],t:'Principle becomes immature when a rule is treated as self-applying and context, welfare, feasibility, or consequence lose warranted authority.'},
    'Moral relativism':{a:[0,0,1],t:'Context matters, but contextual variation becomes immature when it is used to deny correction that a shared referent can actually supply.'},
    Solipsism:{a:[0,-.5,.5],t:'The thesis becomes self-sealing when independent evidence is reinterpreted so that nothing external can genuinely count against it.'},
    Skepticism:{a:[0,-1,0],t:'Doubt is mature when proportional to evidence; it becomes collapse-like when no evidence is permitted to update the stance.'},
    Hedonism:{a:[1,0,0],t:'Pleasure and suffering are real welfare signals; the strong form becomes immature when pleasure alone is allowed to settle value.'},
    Determinism:{a:[-.5,0,-.5],t:'The thesis itself does not fix maturity; distortion begins when causal explanation is used to erase materially relevant agency, responsibility, welfare, or correction.'}
  };

  const nearestDoctrine=p=>{
    if(!pointValid(p)) return ['Doctrine','Current orientation unavailable.'];
    if(isOrigin(p)) return ['No formed doctrine','No developed doctrinal orientation toward this referent is represented here.'];
    let best=null,bestD=Infinity;
    for(const [name,d] of Object.entries(DOCS)){
      const dd=dist2(p,d.a);
      if(dd<bestD-1e-12){best=[name,d];bestD=dd;}
    }
    return [best[0],best[1].t];
  };

  R.doctrineHtml=p=>{
    const [name,text]=nearestDoctrine(p);
    const coord=pointValid(p)?cfmt(p):'—';
    const current=`<article class="stone-current-card"><h2>${esc(name)}</h2><div class="stone-current-coordinate">${esc(coord)}</div><p>${esc(text)}</p></article>`;
    const items=D.DOCTRINES.map(d=>{
      const hit=d.name===name;
      const short=DOCS[d.name]?.t||d.verdict||d.text;
      return `<details class="stone-item${hit?' stone-match':''}"${hit?' open':''}><summary><span>${esc(d.name)}</span></summary><div class="stone-item-body"><p>${esc(short)}</p></div></details>`;
    }).join('');
    return `<section class="stone-ref-section">${current}<div class="stone-list">${items}</div></section>`;
  };

  const SEMANTICS=[
    {name:'Empathy',coord:[1,0,0],text:'Concern for affected welfare develops through experiencing suffering and welfare consequence. On its signed relation it tugs against real-world constraint, forming the purpose of a judgment.'},
    {name:'Practicality',coord:[-1,0,0],text:'Real-world constraint develops through experiencing consequence: what reality permits, prevents, requires, costs, or makes possible. On its signed relation it tugs against concern for affected welfare, forming the purpose of a judgment.'},
    {name:'Wisdom',coord:[0,0,1],text:'Contextual interpretation develops through experiencing complexity: proportion, circumstance, implication, exception, and application. On its signed relation it tugs against informational grounding, forming the meaning of a judgment.'},
    {name:'Knowledge',coord:[0,0,-1],text:'Informational grounding develops through experiencing evidence: what is known, unknown, supported, doubtful, or established. On its signed relation it tugs against contextual interpretation, forming the meaning of a judgment.'},
    {name:'Entity',text:'The organized subject being situated: a person, group, organization, institution, or other coherent subject.'},
    {name:'Referent',text:'The relevant reality within which that entity is being situated. Changing the referent changes the scope of the assessment.'},
    {name:'Orientation',text:'Φ(q, r) = (x, y, z): the entity–referent relation inside the Stone.'},
    {name:'Purpose',text:'The signed concern–constraint relation: affected welfare ↔ real-world constraint.'},
    {name:'Meaning',text:'The signed interpretation–information relation: contextual interpretation ↔ informational grounding.'},
    {name:'Accountability',text:'The answerability–insulation relation: whether materially relevant reality can govern and correct the stance.'},
    {name:'Absence',coord:[0,0,0],text:'No developed orientation toward the declared referent: nothing materially relevant is yet known from which a formed stance could be made.'},
    {name:'Development',text:'L1 = |x| + |y| + |z|. The interior represents developing orientation; the surface represents a formed stance.'},
    {name:'Experience',text:'L2 = √(x² + y² + z²): the direct Euclidean magnitude of the same orientation.'},
    {name:'Stance',text:'A formed orientation on the surface |x| + |y| + |z| = 1.'},
    {name:'Prejudice',text:'At y = 0, judgment is formed before materially relevant purpose and meaning pressures have been fully integrated.'},
    {name:'Maturity',coord:[0,1,0],text:'Complete purpose and meaning integration under maximal answerability to reality.'},
    {name:'Collapse',coord:[0,-1,0],text:'Maximal insulation: materially relevant reality no longer retains corrective authority over the organized whole.'},
    {name:'Reality-friction',text:'Pressure produced when reality presents a materially relevant counterpart that a one-sided stance has not integrated.'},
    {name:'Realization',text:'Further reality becomes materially apparent and can expand the referent from r to r′, requiring the entity to be situated again.'},
    {name:'Epistemic freedom',text:'Reality-governed authorship: strong judgment without surrendering correction to identity, status, ideology, fear, or interest.'}
  ];

  R.renderSemantics=()=>`<div class="stone-semantics-inner"><header><h1>Semantics</h1></header><div class="stone-semantics-grid stone-semantics-v5">${SEMANTICS.map(s=>`<details class="stone-semantic-item"${s.coord?` data-coordinate="${s.coord.join(',')}"`:''}><summary>${esc(s.name)}</summary><p>${esc(s.text)}</p></details>`).join('')}</div></div>`;

  const style=document.createElement('style');
  style.textContent=`
    .stone-semantics-v5{display:grid;gap:7px}
    .stone-semantic-item{border:1px solid var(--border,#e2e8f0);border-radius:12px;background:rgba(255,255,255,.84);overflow:hidden}
    .stone-semantic-item>summary{list-style:none;cursor:pointer;padding:10px 11px;font-size:12px;font-weight:850;color:var(--text,#0f172a)}
    .stone-semantic-item>summary::-webkit-details-marker{display:none}
    .stone-semantic-item>summary::after{content:'+';float:right;color:var(--muted,#64748b);font-weight:500;font-size:14px}
    .stone-semantic-item[open]>summary::after{content:'–'}
    .stone-semantic-item>p{margin:0;padding:0 11px 11px;font-size:11.75px;line-height:1.5;color:var(--text,#334155)}
    .stone-pole-sub{font-size:.52em;font-weight:650;opacity:.78}
  `;
  (document.head||document.documentElement).appendChild(style);

  const setPoint=coord=>{
    const ids=['coord-x','coord-y','coord-z'];
    const els=ids.map(id=>document.getElementById(id));
    if(els.some(e=>!e)) return;
    els.forEach((e,i)=>{e.value=String(coord[i]);});
    els.forEach(e=>{
      e.dispatchEvent(new Event('input',{bubbles:true}));
      e.dispatchEvent(new Event('change',{bubbles:true}));
    });
  };

  document.addEventListener('click',e=>{
    const summary=e.target.closest?.('#stoneSemanticsPanel .stone-semantic-item > summary');
    if(!summary) return;
    const details=summary.parentElement;
    if(details.open) return;
    for(const other of document.querySelectorAll('#stoneSemanticsPanel .stone-semantic-item[open]')){
      if(other!==details) other.open=false;
    }
    if(!details.dataset.coordinate) return;
    const coord=details.dataset.coordinate.split(',').map(Number);
    if(coord.length===3&&coord.every(Number.isFinite)) setTimeout(()=>setPoint(coord),0);
  });

  const POLES={E:'concern',P:'constraint',W:'context',K:'information'};
  const patchPoleLabels=()=>{
    for(const el of document.querySelectorAll('svg text')){
      if(el.dataset.stonePolePatched==='1') continue;
      const key=(el.textContent||'').trim();
      if(!(key in POLES)) continue;
      el.dataset.stonePolePatched='1';
      const x=el.getAttribute('x');
      const t=document.createElementNS('http://www.w3.org/2000/svg','tspan');
      if(x!==null) t.setAttribute('x',x);
      t.setAttribute('dy','1.15em');
      t.setAttribute('class','stone-pole-sub');
      t.textContent=`(${POLES[key]})`;
      el.appendChild(t);
    }
  };
  patchPoleLabels();
  new MutationObserver(()=>patchPoleLabels()).observe(document.body,{childList:true,subtree:true});
})();
