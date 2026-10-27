(() => {
  'use strict';

  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  const REFERENTS = [
    {id:'worldview', label:'Worldview'},
    {id:'doctrines', label:'Doctrines'},
    {id:'communication', label:'Communication'},
    {id:'conviction', label:'Conviction'},
    {id:'decision', label:'Decision'},
    {id:'source', label:'Source'}
  ];

  const DOCTRINES = [
    {
      name:'Nihilism',
      kind:'Strong existential form',
      displacement:'Informational absence is made to settle interpretation; insulation appears if counterexamples are excluded.',
      text:'The immature move is not merely noticing that meaning is not externally given. It is treating the absence of given meaning as proof that meaning itself cannot exist. That turns a negative premise about what is supplied or established into a conclusion about what is possible or significant. In Stone terms, informational grounding is being allowed to overrule contextual interpretation. If lived, relational, created, or otherwise reality-grounded meaning is dismissed by definition, correction is also being insulated.',
      verdict:'Objectively immature in this defined form because a materially relevant interpretive pressure is excluded rather than integrated.'
    },
    {
      name:'Existentialism',
      kind:'Not fixed by the label',
      displacement:'No necessary displacement.',
      text:'Recognizing that meaning or essence is not simply handed to a person does not require denying meaning. An existentialist stance can remain answerable to evidence, human consequence, real constraint, and context, or it can become romantic, dogmatic, or nihilistic. The doctrine name alone does not settle maturity.',
      verdict:'Maturity depends on how the thesis is integrated and corrected in the declared referent.'
    },
    {
      name:'Stoicism',
      kind:'Not fixed by the label',
      displacement:'No necessary displacement; distortion can suppress affected welfare or context.',
      text:'Emotional discipline, acceptance of constraint, and control of one’s response can be compatible with mature judgment. The failure begins when “accept what you cannot control” is used to make avoidable harm, relationship context, or legitimate welfare irrelevant. The same practice can therefore support maturity or rationalize under-response.',
      verdict:'Potentially mature; not self-authenticating.'
    },
    {
      name:'Utilitarianism',
      kind:'Not fixed by the label',
      displacement:'Can drift toward Instrumentalism or Expediency when aggregate outcome makes persons, truth, or context merely instrumental.',
      text:'Consequences and affected welfare are genuinely relevant pressures. A utilitarian calculation becomes immature when the metric is allowed to define the whole referent, especially when individual costs, uncertainty, rights-relevant context, or practical side effects are excluded because they complicate the aggregate.',
      verdict:'The doctrine does not have one coordinate; its use must remain answerable to the whole relevant reality.'
    },
    {
      name:'Deontology',
      kind:'Not fixed by the label',
      displacement:'Can drift toward Literalism or Moral Literalism when a rule is treated as self-applying.',
      text:'A valid duty or rule can carry real moral information. Immaturity begins when the rule is assumed to contain its own application without circumstance, competing duties, affected welfare, feasibility, or consequence being allowed to alter what faithful application requires.',
      verdict:'A principle can be true while its application remains immature.'
    },
    {
      name:'Moral relativism',
      kind:'Strong form',
      displacement:'Contextual interpretation is allowed to overrule informational grounding and cross-context correction.',
      text:'Context genuinely changes meaning and application, but the fact that judgments arise in cultures or perspectives does not itself establish that no cross-context moral truth or improvement is possible. When contextual variation is turned into immunity from evidence, consequence, or comparison, interpretation has been made absolute.',
      verdict:'Objectively immature when context is used to deny correction that the shared referent can actually supply.'
    },
    {
      name:'Solipsism',
      kind:'Strong epistemic form',
      displacement:'Interpretation is insulated from independent informational correction.',
      text:'Treating only one’s own mind as knowable can convert a legitimate limit on direct access into a rule that neutralizes the evidential force of other persons, stable external constraint, and independent convergence. Once every counterpressure is reinterpreted as merely another appearance inside the same thesis, the stance becomes self-sealing.',
      verdict:'Immature to the extent the thesis removes materially relevant external correction from authority.'
    },
    {
      name:'Skepticism',
      kind:'Not fixed by the label',
      displacement:'None when doubt is proportional; insulation when no evidence is ever allowed to count.',
      text:'Suspending judgment when evidence is insufficient is compatible with answerability. Skepticism becomes immature when doubt itself becomes protected—when every source, observation, or correction is rejected in advance and uncertainty is treated as a reason never to update.',
      verdict:'Provisional doubt can be mature; self-sealing doubt cannot.'
    },
    {
      name:'Hedonism',
      kind:'Strong sole-good form',
      displacement:'A valued welfare signal is made to authenticate the whole judgment.',
      text:'Pleasure and suffering are real parts of affected welfare. The failure occurs when pleasure is treated as sufficient to settle value while longer-term welfare, constraint, information, context, other persons, or correction lose authority. A genuine good becomes a maturity proxy for the whole referent.',
      verdict:'Immature when pleasure is made absolute rather than integrated.'
    },
    {
      name:'Determinism',
      kind:'Content thesis',
      displacement:'No necessary displacement.',
      text:'Whether events are determined is a claim about reality, not a Stone maturity coordinate by itself. A determinist can be well grounded, context-sensitive, humane, practical, and corrigible, or can use the thesis to dismiss agency-relevant evidence, responsibility, welfare, or correction.',
      verdict:'The truth or falsity of the doctrine and the maturity of how it is held are separate questions.'
    }
  ];

  const COMMUNICATION = [
    {name:'Blunt', status:'Not inherently immature', text:'Bluntness is a property of expression: compressed, direct, or minimally softened communication. It does not by itself show that welfare or context was neglected. A mature speaker can be blunt when the purpose, stakes, shared context, or urgency warrants it, while still allowing truth, consequence, and the other person’s welfare to govern the judgment.'},
    {name:'Insensitive', status:'Maturity-relevant failure', text:'Insensitivity is different from bluntness. It exists when affected welfare or relevant human context actually should bear on the communication but is not given its warranted authority. The problem is not that the words are sharp; it is that a materially relevant pressure has been excluded or underweighted.'},
    {name:'Tactful', status:'Mature-compatible, not self-authenticating', text:'Tact can integrate truth with context and affected welfare by choosing a form the situation can responsibly bear. It becomes immature when tact turns into concealment, false reassurance, or avoidance of a truth that materially needs to be communicated.'},
    {name:'Diplomatic', status:'Depends on purpose', text:'Diplomacy can preserve cooperation while keeping truth and constraint intact. It becomes distortion when maintaining harmony or strategic advantage is allowed to determine what may be said, admitted, or corrected.'},
    {name:'People-pleasing', status:'Typical displacement', text:'The desire to preserve approval or immediate comfort can make affected welfare—or the appearance of caring—overrule truth, constraint, or longer-term consequence. Mature concern does not require telling people only what they want to hear.'},
    {name:'Pedantic', status:'Typical displacement', text:'Pedantry often preserves informational correctness while losing proportion, purpose, or context. A correction can be factually right and still be immature if the detail is treated as more governing than what the conversation is actually about.'},
    {name:'Evasive', status:'Accountability risk', text:'Evasion becomes maturity-relevant when the form of communication prevents a materially relevant challenge from reaching the underlying judgment. Changing subjects, redefining claims after criticism, or answering a weaker question can function as insulation.'},
    {name:'Manipulative', status:'Accountability failure', text:'Manipulation organizes expression around controlling another person’s response rather than allowing the shared reality to govern both sides. Strategic context and practicality may be sophisticated while truth, affected welfare, or correction are selectively subordinated.'}
  ];

  const SEMANTICS = [
    ['Entity','The organized subject being situated: a person, group, organization, institution, or other coherent subject.'],
    ['Referent','The relevant reality within which that entity is being situated. Changing the referent changes the scope of the assessment.'],
    ['Orientation','Φ(q, r) = (x, y, z): the entity–referent relation inside the Stone.'],
    ['Purpose','The concern–constraint relation: affected welfare ↔ real-world constraint.'],
    ['Accountability','The answerability–insulation relation: whether materially relevant reality can govern and correct the stance.'],
    ['Meaning','The interpretation–information relation: contextual interpretation ↔ informational grounding.'],
    ['Absence','(0, 0, 0): no developed orientation of the entity toward the declared referent.'],
    ['Development','L1 = |x| + |y| + |z|. Null is 0; the interior is developing orientation; the surface reaches 1.'],
    ['Experience','L2 = √(x² + y² + z²): the direct Euclidean magnitude of the same orientation.'],
    ['Stance','A formed orientation on the surface |x| + |y| + |z| = 1.'],
    ['Prejudice','At y = 0, judgment is formed before materially relevant purpose and meaning pressures have been fully integrated.'],
    ['Maturity','(0, 1, 0): complete purpose and meaning integration under maximal answerability to reality.'],
    ['Collapse','(0, −1, 0): maximal insulation and correction-resistant consolidation.'],
    ['Reality-friction','The pressure produced when reality presents a materially relevant counterpart that a one-sided stance has not integrated.'],
    ['Realization','Further reality becomes materially apparent and can expand the referent from r to r′, requiring the entity to be situated again.'],
    ['Epistemic freedom','The peak condition of reality-governed authorship: strong judgment without surrendering correction to identity, status, ideology, fear, or interest.']
  ];

  const doctrineHtml = () => `
    <section class="stone-ref-section">
      <div class="stone-ref-intro">
        <h2>Philosophical doctrines</h2>
        <p>A doctrine is content, not an extra Stone coordinate. The entries below evaluate the structural implication of a doctrine only where a defined form necessarily privileges, excludes, or insulates a maturity-relevant pressure. Otherwise the label alone does not fix maturity.</p>
      </div>
      <div class="stone-list">${DOCTRINES.map(d=>`
        <details class="stone-item">
          <summary><span>${esc(d.name)}</span><small>${esc(d.kind)}</small></summary>
          <div class="stone-item-body">
            <p>${esc(d.text)}</p>
            <p class="stone-reading"><strong>Stone displacement:</strong> ${esc(d.displacement)}</p>
            <p class="stone-verdict">${esc(d.verdict)}</p>
          </div>
        </details>`).join('')}
      </div>
    </section>`;

  const communicationHtml = () => `
    <section class="stone-ref-section">
      <div class="stone-ref-intro">
        <h2>Communication</h2>
        <p>Expression and underlying reasoning are related but not identical. A short, blunt, warm, technical, or polished sentence is evidence about the reasoning behind it; it is not the reasoning itself. The maturity question is what the communicative act actually includes, neglects, and allows to correct it.</p>
      </div>
      <div class="stone-list">${COMMUNICATION.map(d=>`
        <details class="stone-item">
          <summary><span>${esc(d.name)}</span><small>${esc(d.status)}</small></summary>
          <div class="stone-item-body"><p>${esc(d.text)}</p></div>
        </details>`).join('')}</div>
    </section>`;

  const convictionHtml = () => `
    <section class="stone-ref-section">
      <div class="stone-ref-intro"><h2>Conviction</h2><p>A sufficiently consolidated conviction is a useful bounded referent because its grounding, interpretation, practical consequences, affected welfare, and response to correction can all be pressure-tested without pretending the result describes the person’s entire worldview.</p></div>
      <div class="stone-audit">
        <article><b>1 · Information</b><p>What is actually known, unknown, supported, doubtful, assumed, or merely repeated?</p></article>
        <article><b>2 · Interpretation</b><p>What does that information mean here, in proportion, with its limits, implications, and alternatives?</p></article>
        <article><b>3 · Constraint</b><p>What does reality permit, prevent, require, or make costly if the conviction guides action?</p></article>
        <article><b>4 · Welfare</b><p>Who or what is materially affected, and has that effect been given the authority it warrants?</p></article>
        <article><b>5 · Correction</b><p>What evidence, consequence, contradiction, or realization would genuinely be allowed to preserve, qualify, revise, or defeat the conviction?</p></article>
      </div>
      <p class="stone-footnote">A locally mature conviction does not certify the whole worldview; a locally distorted conviction does not by itself establish whole-worldview collapse.</p>
    </section>`;

  const decisionHtml = () => `
    <section class="stone-ref-section">
      <div class="stone-ref-intro"><h2>Decision</h2><p>A mature decision does not give every pressure equal visible weight. The situation may require practicality, welfare, information, or contextual judgment to lead. Maturity requires that the leading pressure remain governed by the rest of the materially relevant reality.</p></div>
      <div class="stone-audit">
        <article><b>What matters?</b><p>Identify affected welfare without assuming that good intention guarantees a good result.</p></article>
        <article><b>What is possible?</b><p>Identify real constraints, tradeoffs, resources, timing, and consequences.</p></article>
        <article><b>What is known?</b><p>Separate evidence from assumption, uncertainty, and missing information.</p></article>
        <article><b>What does it mean here?</b><p>Interpret the information in context rather than applying facts, rules, or metrics blindly.</p></article>
        <article><b>What can still correct the choice?</b><p>Keep a route open for materially relevant reality to change the decision before and after action.</p></article>
      </div>
    </section>`;

  const sourceHtml = () => `
    <section class="stone-ref-section">
      <div class="stone-ref-intro"><h2>Source</h2><p>Human knowledge is socially distributed. Mature reception is neither blind acceptance nor universal distrust. Source, message, recipient, and reality remain distinct, and confidence should remain proportional and revisable.</p></div>
      <div class="stone-audit">
        <article><b>Access</b><p>Was the source actually positioned to know the relevant thing?</p></article>
        <article><b>Competence</b><p>Does the source reliably distinguish the domain’s important differences?</p></article>
        <article><b>Transparency</b><p>Does the source distinguish observation, inference, uncertainty, and limitation?</p></article>
        <article><b>Track record</b><p>How does the source perform across prediction, consequence, changing incentives, and independent evidence?</p></article>
        <article><b>Correction history</b><p>What happens when the source is contradicted? Does reality revise the claim, or does the claim reorganize reality to protect itself?</p></article>
        <article><b>Proportionate verification</b><p>Raise verification when stakes and error costs rise; do not require impossible total verification merely to avoid learning from better-positioned observers.</p></article>
      </div>
    </section>`;

  const renderSemantics = () => `
    <div class="stone-semantics-inner">
      <header><h1>Semantics</h1><p>The Philosopher’s Stone describes one entity in relation to one declared referent. The same geometry can therefore be used at worldview scale or at a bounded scale without confusing one scope for another.</p></header>
      <div class="stone-semantics-grid">${SEMANTICS.map(([k,v])=>`<article><h3>${esc(k)}</h3><p>${esc(v)}</p></article>`).join('')}</div>
    </div>`;

  function findTab(label){
    return $$('button').find(b => b.textContent.trim().toLowerCase() === label.toLowerCase());
  }

  function replaceBranding(){
    document.title = 'The Philosopher\'s Stone';
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; let n;
    while((n=walker.nextNode())){
      if(n.parentElement?.closest('script,style')) continue;
      if(/Epistemic Octahedron|EO Mobile Atlas Beta/.test(n.nodeValue||'')) nodes.push(n);
    }
    for(const node of nodes){
      node.nodeValue=node.nodeValue
        .replace(/Epistemic Octahedron/g,'The Philosopher’s Stone')
        .replace(/EO Mobile Atlas Beta/g,'The Philosopher’s Stone');
    }
  }

  function installStyles(){
    const s=document.createElement('style');
    s.textContent=`
      .stone-hidden-tab{display:none!important}
      .stone-ref-selector{position:sticky;top:0;z-index:8;margin:-2px -2px 10px;padding:6px 0 8px;background:linear-gradient(to bottom,var(--card,#fff) 72%,rgba(255,255,255,0));}
      .stone-ref-strip{display:flex;gap:7px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px calc(50% - 52px) 4px;}
      .stone-ref-strip::-webkit-scrollbar{display:none}
      .stone-ref-chip{flex:0 0 auto;min-width:104px;scroll-snap-align:center;scroll-snap-stop:always;border:1px solid var(--border,#d7dee8);border-radius:999px;background:#fff;color:var(--muted,#64748b);padding:7px 12px;font:700 11px/1 system-ui,sans-serif;letter-spacing:.01em;box-shadow:0 1px 2px rgba(15,23,42,.04)}
      .stone-ref-chip.active{color:var(--text,#0f172a);border-color:#94a3b8;box-shadow:0 2px 7px rgba(15,23,42,.09)}
      .stone-ref-content{display:none;padding:0 1px 12px;color:var(--text,#0f172a)}
      .stone-ref-content.active{display:block}
      .stone-ref-section{padding-bottom:8px}
      .stone-ref-intro h2{margin:2px 0 7px;font-size:20px;line-height:1.15;letter-spacing:-.02em}
      .stone-ref-intro p,.stone-footnote{margin:0 0 12px;font-size:12.75px;line-height:1.56;color:var(--text,#334155)}
      .stone-list{display:grid;gap:7px}
      .stone-item{border:1px solid var(--border,#e2e8f0);border-radius:12px;background:rgba(255,255,255,.72);overflow:hidden}
      .stone-item>summary{list-style:none;cursor:pointer;padding:10px 11px;display:flex;align-items:baseline;justify-content:space-between;gap:10px}
      .stone-item>summary::-webkit-details-marker{display:none}
      .stone-item>summary span{font-weight:850;font-size:13px}
      .stone-item>summary small{color:var(--muted,#64748b);font-size:9.5px;text-align:right}
      .stone-item-body{padding:0 11px 11px;border-top:1px solid var(--border,#e2e8f0)}
      .stone-item-body p{margin:9px 0 0;font-size:12px;line-height:1.55}
      .stone-reading{color:#475569}.stone-verdict{font-weight:750}
      .stone-audit{display:grid;gap:7px}
      .stone-audit article{border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:10px 11px;background:rgba(255,255,255,.72)}
      .stone-audit b{font-size:11.5px}.stone-audit p{margin:5px 0 0;font-size:12px;line-height:1.5}
      .stone-footnote{margin-top:11px;color:var(--muted,#64748b)}
      #stoneSemanticsPanel{overflow:auto!important;-webkit-overflow-scrolling:touch;padding:12px!important}
      .stone-semantics-inner{max-width:720px;margin:0 auto 40px}
      .stone-semantics-inner header h1{margin:2px 0 6px;font-size:22px;letter-spacing:-.025em}
      .stone-semantics-inner header p{font-size:12.75px;line-height:1.55;margin:0 0 13px}
      .stone-semantics-grid{display:grid;gap:7px}
      .stone-semantics-grid article{border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:10px 11px;background:rgba(255,255,255,.84)}
      .stone-semantics-grid h3{margin:0 0 4px;font-size:12px}.stone-semantics-grid p{margin:0;font-size:11.75px;line-height:1.5}
      @media(min-width:700px){.stone-semantics-grid{grid-template-columns:1fr 1fr}.stone-audit{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(s);
  }

  function installReferents(worldviewPanel){
    let selector=$('.stone-ref-selector',worldviewPanel);
    if(selector) return;

    selector=document.createElement('div');
    selector.className='stone-ref-selector';
    selector.innerHTML=`<div class="stone-ref-strip" role="tablist" aria-label="Referent">${REFERENTS.map(r=>`<button class="stone-ref-chip${r.id==='worldview'?' active':''}" type="button" data-ref="${r.id}" role="tab" aria-selected="${r.id==='worldview'}">${esc(r.label)}</button>`).join('')}</div>`;
    const custom=document.createElement('div');
    custom.className='stone-ref-content';
    custom.id='stoneReferentContent';
    worldviewPanel.prepend(custom);
    worldviewPanel.prepend(selector);

    const strip=$('.stone-ref-strip',selector);
    let active='worldview',scrollTimer=0,changing=false;

    const renderCustom=id=>{
      if(id==='doctrines') return doctrineHtml();
      if(id==='communication') return communicationHtml();
      if(id==='conviction') return convictionHtml();
      if(id==='decision') return decisionHtml();
      if(id==='source') return sourceHtml();
      return '';
    };

    const keepExtrasVisible=()=>{
      selector.classList.remove('eo-worldview-old');
      custom.classList.remove('eo-worldview-old');
      selector.style.display='';
      if(active==='worldview'){
        custom.classList.remove('active');
        $$('.eo-worldview-paper',worldviewPanel).forEach(el=>el.style.display='');
      }else{
        custom.classList.add('active');
        $$('.eo-worldview-paper',worldviewPanel).forEach(el=>el.style.display='none');
      }
    };

    const select=id=>{
      if(!REFERENTS.some(r=>r.id===id)) return;
      active=id;
      $$('.stone-ref-chip',selector).forEach(b=>{
        const on=b.dataset.ref===id;
        b.classList.toggle('active',on);
        b.setAttribute('aria-selected',String(on));
      });
      custom.innerHTML=id==='worldview'?'':renderCustom(id);
      keepExtrasVisible();
      const btn=$(`.stone-ref-chip[data-ref="${id}"]`,selector);
      if(btn && !changing){ changing=true; btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}); setTimeout(()=>changing=false,220); }
    };

    selector.addEventListener('click',e=>{const b=e.target.closest('.stone-ref-chip');if(b)select(b.dataset.ref);});
    strip.addEventListener('scroll',()=>{
      clearTimeout(scrollTimer);
      scrollTimer=setTimeout(()=>{
        if(changing) return;
        const r=strip.getBoundingClientRect(),center=r.left+r.width/2;
        let best=null,bestD=Infinity;
        for(const b of $$('.stone-ref-chip',selector)){
          const br=b.getBoundingClientRect(),d=Math.abs((br.left+br.width/2)-center);
          if(d<bestD){best=b;bestD=d;}
        }
        if(best && best.dataset.ref!==active) select(best.dataset.ref);
      },110);
    },{passive:true});

    new MutationObserver(keepExtrasVisible).observe(worldviewPanel,{childList:true,subtree:false,attributes:true});
    keepExtrasVisible();
    requestAnimationFrame(()=>$('.stone-ref-chip[data-ref="worldview"]',selector)?.scrollIntoView({block:'nearest',inline:'center'}));
  }

  function installSemantics(worldviewPanel,plotBtn,referentBtn,questionsBtn,editorBtn){
    if(questionsBtn) questionsBtn.classList.add('stone-hidden-tab');
    if(editorBtn) editorBtn.classList.add('stone-hidden-tab');

    const nav=(plotBtn||referentBtn)?.parentElement;
    if(!nav) return;
    let semanticsBtn=$('#stoneSemanticsTab');
    if(!semanticsBtn){
      semanticsBtn=(questionsBtn||referentBtn||plotBtn).cloneNode(false);
      semanticsBtn.id='stoneSemanticsTab';
      semanticsBtn.removeAttribute('data-mode');
      semanticsBtn.removeAttribute('aria-controls');
      semanticsBtn.textContent='Semantics';
      semanticsBtn.hidden=false;
      semanticsBtn.classList.remove('active','selected','stone-hidden-tab');
      if(questionsBtn) nav.insertBefore(semanticsBtn,questionsBtn); else nav.appendChild(semanticsBtn);
    }

    let panel=$('#stoneSemanticsPanel');
    if(!panel){
      panel=document.createElement(worldviewPanel.tagName||'section');
      panel.id='stoneSemanticsPanel';
      panel.className=worldviewPanel.className;
      panel.innerHTML=renderSemantics();
      panel.hidden=true;
      worldviewPanel.parentElement?.insertBefore(panel,worldviewPanel.nextSibling);
    }

    let semanticsActive=false;
    const deactivate=()=>{
      if(!semanticsActive) return;
      semanticsActive=false;
      panel.hidden=true;
      panel.style.display='none';
      semanticsBtn.classList.remove('active','selected');
      semanticsBtn.setAttribute('aria-selected','false');
    };
    const activate=()=>{
      semanticsActive=true;
      panel.hidden=false;
      panel.style.display='';
      worldviewPanel.hidden=true;
      for(const b of $$('button',nav)){
        if(b!==semanticsBtn){b.classList.remove('active','selected');b.setAttribute('aria-selected','false');}
      }
      semanticsBtn.classList.add('active');
      semanticsBtn.setAttribute('aria-selected','true');
    };

    semanticsBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activate();});
    for(const b of [plotBtn,referentBtn].filter(Boolean)) b.addEventListener('click',()=>{deactivate();setTimeout(()=>{worldviewPanel.hidden = b===plotBtn;},0);},true);
  }

  function boot(attempt=0){
    replaceBranding();
    const worldviewPanel=$('#worldviewPanel');
    const plotBtn=findTab('Plot');
    const worldviewBtn=findTab('Worldview')||findTab('Referent');
    const questionsBtn=findTab('Questions');
    const editorBtn=findTab('Editor');
    if(!worldviewPanel || !plotBtn || !worldviewBtn){
      if(attempt<80) setTimeout(()=>boot(attempt+1),50);
      return;
    }
    installStyles();
    worldviewBtn.textContent='Referent';
    installReferents(worldviewPanel);
    installSemantics(worldviewPanel,plotBtn,worldviewBtn,questionsBtn,editorBtn);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>boot());
  else boot();
})();
