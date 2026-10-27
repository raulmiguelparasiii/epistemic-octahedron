(() => {
  'use strict';

  const E=.00001, near=(a,b,t=E)=>Math.abs(a-b)<=t;
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
  const surface=p=>p&&Math.abs(p.reduce((n,v)=>n+Math.abs(v),0)-1)<=.025;
  const origin=p=>p&&p.every(v=>near(v,0));
  const fmt=n=>near(n,0)?'0':near(Math.abs(n),1/3,.001)?(n<0?'-1/3':'1/3'):near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt=p=>`(${p.map(fmt).join(', ')})`;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp01=v=>Math.max(0,Math.min(1,v));
  const rgb=([r,g,b])=>`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  const mix=(a,b,t)=>rgb([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);
  const Y_BLUE=[45,62,163],Y_GREY=[66,66,66],Y_RED=[147,47,47];
  const yColor=y=>y>=0?mix(Y_GREY,Y_BLUE,clamp01(y)):mix(Y_GREY,Y_RED,clamp01(-y));

  const PAPER={
    Maturity:{c:[0,1,0],d:'A worldview in which concern and constraint, information and interpretation are fully integrated, while materially relevant reality retains maximal corrective authority.'},
    Collapse:{c:[0,-1,0],d:'A worldview so fully insulated that materially relevant reality no longer retains corrective authority over its organized whole.'},
    Humanitarianism:{c:[.5,.5,0],d:'A worldview that gives unusual priority to affected welfare while still allowing real constraints and consequences to correct it.'},
    Sentimentalism:{c:[1,0,0],d:'A worldview in which concern for affected welfare settles judgment before real constraints have been adequately integrated.'},
    Moralism:{c:[.5,-.5,0],d:'A worldview in which concern has begun protecting itself through moral justification, so practical counterpressure increasingly loses authority.'},
    Pragmatism:{c:[-.5,.5,0],d:'A worldview that gives unusual priority to feasibility, consequence, and what can actually work, while affected welfare still retains corrective authority.'},
    Instrumentalism:{c:[-1,0,0],d:'A worldview in which things are primarily judged by whether they function, achieve an end, solve the problem, or produce the desired result, before affected welfare has been adequately integrated.'},
    Expediency:{c:[-.5,-.5,0],d:'A worldview in which effectiveness increasingly overrides affected welfare, so what achieves the objective begins to justify itself.'},
    Contextualism:{c:[0,.5,.5],d:'A worldview that gives unusual weight to context, proportion, implication, application, and the larger picture while information can still force revision.'},
    Narrativism:{c:[0,0,1],d:'A worldview in which the explanatory frame or larger interpretation settles meaning before adequate informational grounding has been integrated.'},
    'Narrative Dogmatism':{c:[0,-.5,.5],d:'A worldview in which the explanatory frame increasingly controls what contrary information is allowed to mean.'},
    Empiricism:{c:[0,.5,-.5],d:'A worldview that gives unusual authority to observation, evidence, and informational grounding while context can still correct what the evidence appears to establish.'},
    Literalism:{c:[0,0,-1],d:'A worldview in which represented facts, rules, statements, data, or propositions are treated as sufficient before their context, proportion, implications, and application have been adequately integrated.'},
    Doctrinalism:{c:[0,-.5,-.5],d:'A worldview in which accepted facts, rules, classifications, or propositions have hardened so that contextual reinterpretation increasingly loses corrective authority.'},
    Humanism:{c:[1/3,1/3,1/3],d:'A worldview organized strongly around human welfare and interpretive meaning while factual grounding and practical constraint remain underintegrated but still capable of correction.'},
    Idealism:{c:[.5,0,.5],d:'A worldview in which concern and interpretive meaning settle judgment before informational grounding and practical constraint have been adequately integrated.'},
    Utopianism:{c:[1/3,-1/3,1/3],d:'A worldview in which a morally compelling interpretation of how reality should be increasingly protects itself against inconvenient facts and constraints.'},
    Realism:{c:[-1/3,1/3,1/3],d:'A worldview that gives unusual weight to circumstances, limits, incentives, consequences, and practical possibility while affected welfare and informational grounding still retain corrective authority.'},
    Cynicism:{c:[-.5,0,.5],d:'A worldview in which interpretation of motives and circumstances combines with practical calculation before sufficient concern or informational grounding has been integrated.'},
    Machiavellianism:{c:[-1/3,-1/3,1/3],d:'A worldview in which strategic interpretation and practical effectiveness increasingly insulate themselves from corrective welfare and evidence.'},
    Rationalism:{c:[-1/3,1/3,-1/3],d:'A worldview organized strongly around explicit reasons, factual structure, feasibility, and workable order while affected welfare and broader interpretation remain underintegrated but still corrective.'},
    Technicism:{c:[-.5,0,-.5],d:'A worldview that approaches reality primarily as factual and operational problems to be solved, before human welfare and contextual meaning have been adequately integrated.'},
    Reductionism:{c:[-1/3,-1/3,-1/3],d:'A worldview in which the factual-operational model becomes increasingly insulated, so whatever does not fit that model loses corrective authority.'},
    'Empirical Humanism':{c:[1/3,1/3,-1/3],d:'A worldview organized strongly around factual grounding and affected welfare while contextual interpretation and practical constraint remain underintegrated but still capable of correction.'},
    'Moral Literalism':{c:[.5,0,-.5],d:'A worldview in which morally significant facts, principles, rules, or claims are applied before sufficient context and feasibility have been integrated.'},
    Fundamentalism:{c:[1/3,-1/3,-1/3],d:'A worldview in which morally charged truths become increasingly protected against contextual and practical correction.'}
  };

  // Developer notes only: the 24 non-pole paper archetypes temporarily divide the
  // 402-point lattice by nearest full 3D archetype anchor. This gives every named
  // archetype surrounding territory instead of confining the eight y=0 names to the
  // equator. Maturity and Collapse remain exclusive to their exact poles.
  const TERRITORY_ANCHORS=Object.entries(PAPER).filter(([n])=>n!=='Maturity'&&n!=='Collapse');
  const dist2=(p,a)=>p.reduce((s,v,i)=>s+(v-a[i])**2,0);
  const nearestName=p=>{
    let best='',bestD=Infinity;
    for(const [n,a] of TERRITORY_ANCHORS){
      const d=dist2(p,a.c);
      if(d<bestD-E||(near(d,bestD,1e-12)&&n<best)){best=n;bestD=d;}
    }
    return best;
  };

  // Developer note: these groups exist only to compose readable prose. They are not
  // shown as tags, families, axes, or categories in the interface.
  const THEMES=[
    {id:'E',n:['Humanitarianism','Sentimentalism','Moralism']},
    {id:'P',n:['Pragmatism','Instrumentalism','Expediency']},
    {id:'W',n:['Contextualism','Narrativism','Narrative Dogmatism']},
    {id:'K',n:['Empiricism','Literalism','Doctrinalism']},
    {id:'EW',n:['Humanism','Idealism','Utopianism']},
    {id:'PW',n:['Realism','Cynicism','Machiavellianism']},
    {id:'PK',n:['Rationalism','Technicism','Reductionism']},
    {id:'EK',n:['Empirical Humanism','Moral Literalism','Fundamentalism']}
  ];
  const themeFor=n=>THEMES.find(t=>t.n.includes(n));

  // Developer note: guidance is referent-relative and follows the first-principles
  // correction rule: preserve what is warranted, restore any materially relevant
  // pressure that has lost warranted authority, and keep the stance corrigible.
  const GUIDANCE={
    Humanitarianism:'Keep the concern. Do not weaken it merely to look balanced. Instead, let feasibility, tradeoffs, consequences, scarcity, and implementation carry whatever authority the situation warrants. A humane aim becomes better when the realities required to realize it are allowed to correct it.',
    Sentimentalism:'Do not treat humane appearance or good intention as enough. Ask what must actually be true for the intended welfare to occur, and let feasibility, tradeoffs, and consequences change the judgment when they materially bear on it.',
    Moralism:'Do not use moral seriousness to disqualify practical correction. A constraint objection is not answered by questioning the objector’s compassion. Let feasibility and consequences count even when they threaten a valued moral picture.',
    Pragmatism:'Keep what actually works in view, but ask whether the result should count as success once the people affected by it are fully included. Efficiency and feasibility are means; they do not by themselves settle what outcome is worth achieving.',
    Instrumentalism:'Treat people, relationships, institutions, and processes as more than means whenever their welfare is materially relevant. A functioning system is not yet a good system if its human costs have been excluded from the definition of success.',
    Expediency:'Do not let necessity become self-justifying. Reopen the question of who bears the cost and whether the objective remains worth achieving in that way. Effectiveness must remain answerable to affected welfare.',
    Contextualism:'Keep context, motive, proportion, implication, and the larger picture in view, but require the interpretation to remain constrained by what is actually supported. A broader explanation earns authority only to the extent the information can bear it.',
    Narrativism:'Do not let coherence finish the judgment. Separate what the story explains from what the information establishes, and allow missing or contrary information to break the narrative rather than being absorbed by it.',
    'Narrative Dogmatism':'Give contrary information permission to change the explanatory frame itself. If every objection can be reinterpreted as support for the same narrative, the narrative is no longer being governed by reality.',
    Empiricism:'Keep evidence primary where evidence should lead, but ask what the evidence means here, in proportion, with its limits, implications, and application. More information does not remove the need for contextual judgment.',
    Literalism:'Do not assume that an accurate statement, rule, measurement, or classification applies itself. Ask what changes when circumstance, scale, exception, purpose, and consequence are included.',
    Doctrinalism:'Allow context to revise how accepted propositions apply. Precision is not preserved by forcing every case into an inherited classification when the case itself supplies materially relevant differences.',
    Humanism:'Preserve concern for people and human meaning, but require the vision to survive factual and practical correction. Meaningfulness and moral importance do not by themselves establish what is true or what will work.',
    Idealism:'Do not let the desirability or coherence of an ideal settle whether it is grounded or viable. Ask what information supports it, what conditions it requires, and what actually happens when it is implemented.',
    Utopianism:'Do not protect a morally compelling vision from the facts or constraints that threaten it. If failure can always be blamed on insufficient commitment, the ideal has stopped learning from reality.',
    Realism:'Keep incentives, tradeoffs, power, motives, and limits in view, but do not confuse what is common with what is necessary, or what is effective with what is acceptable. Direct information and affected welfare must still be able to correct the hard reading.',
    Cynicism:'Treat suspicion as a hypothesis, not a verdict. Look for information that could distinguish bad faith from good faith, and let genuine welfare, principle, trust, or cooperation count when reality supports them.',
    Machiavellianism:'Do not let strategic effectiveness or distrust exempt the stance from truth and welfare. People are not merely variables to be managed; information and human cost must retain authority even when they complicate the strategy.',
    Rationalism:'Keep clarity, mechanism, explicit reasoning, and feasibility, but actively look for materially relevant realities that the model does not represent well. What is difficult to formalize can still be real and governing.',
    Technicism:'Do not assume a technical solution has solved the human problem. Ask what the metric leaves out, whose experience is not represented, and whether optimizing the proxy actually improves the thing the proxy was meant to track.',
    Reductionism:'Let excluded reality challenge the model instead of being dismissed as noise. A simpler account is better only while it continues to preserve everything materially relevant to the judgment.',
    'Empirical Humanism':'Keep both the evidence and the concern, but do not jump from “this harm is real” to “therefore this remedy follows.” Context, feasibility, tradeoffs, and downstream consequences must be able to revise the response without erasing the underlying concern.',
    'Moral Literalism':'Do not treat a true principle or rule as self-applying. Preserve the moral fact while asking how context, competing goods, feasibility, and consequence determine what faithful application requires here.',
    Fundamentalism:'Separate truth commitment from the need to protect the doctrine. A belief is not made truer by making doubt immoral; allow context, information, consequence, and practical reality to correct both interpretation and application.'
  };

  const style=document.createElement('style');
  style.textContent=`.eo-worldview-old{display:none!important}.eo-worldview-paper{margin:8px 0 4px;color:var(--text,#0f172a)}.eo-worldview-paper *{box-sizing:border-box}.eo-worldview-paper h2{margin:0;font-size:21px;line-height:1.12;letter-spacing:-.025em;color:var(--wv-name-color,var(--text,#0f172a))}.eo-worldview-coordinate{margin:4px 0 12px;font-size:10.5px;color:var(--muted,#64748b);font-variant-numeric:tabular-nums}.eo-worldview-prose p{margin:0 0 10px;font-size:13px;line-height:1.56}.eo-worldview-prose p:first-child{font-size:14px;line-height:1.52}.eo-worldview-guidance{border-top:1px solid var(--border,#e2e8f0);margin-top:12px}.eo-worldview-guidance>summary{cursor:pointer;list-style:none;padding:10px 1px;font-size:11px;font-weight:800;color:var(--muted,#475569)}.eo-worldview-guidance>summary::-webkit-details-marker{display:none}.eo-worldview-guidance>summary::after{content:'+';float:right;font-size:14px;font-weight:500}.eo-worldview-guidance[open]>summary::after{content:'–'}.eo-worldview-guidance-body{padding:0 1px 10px;font-size:11.5px;line-height:1.55}.eo-worldview-guidance-body p{margin:0 0 8px}@media(max-width:520px){.eo-worldview-paper h2{font-size:20px}.eo-worldview-prose p{font-size:12.75px}.eo-worldview-prose p:first-child{font-size:13.5px}}`;
  (document.head||document.documentElement).appendChild(style);

  const host=()=>document.getElementById('worldviewPanel');
  const point=()=>{
    const p=['coord-x','coord-y','coord-z'].map(id=>Number(document.getElementById(id)?.value));
    if(p.every(Number.isFinite)&&(surface(p)||origin(p)))return p;
    const h=host(); if(!h)return null;
    for(const el of h.querySelectorAll('code,span,p,div,strong')){
      if(el.closest('.eo-worldview-paper'))continue;
      const m=el.textContent?.replace(/−/g,'-').match(/\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/);
      if(m){const q=m.slice(1).map(Number);if(surface(q)||origin(q))return q;}
    }
    return null;
  };

  const exactName=p=>Object.entries(PAPER).find(([,a])=>a.c.every((v,i)=>near(v,p[i],.001)))?.[0]||'';
  const name=p=>origin(p)?'Absence':near(p[1],1)&&near(p[0],0)&&near(p[2],0)?'Maturity':near(p[1],-1)&&near(p[0],0)&&near(p[2],0)?'Collapse':nearestName(p);

  const emphasis=(p,t)=>{
    const [x,,z]=p,ax=Math.abs(x),az=Math.abs(z);
    const m={
      E:['Concern for affected welfare is doing more of the deciding than practical constraint. Feasibility, tradeoffs, consequences, scarcity, and implementation therefore receive less weight than the situation warrants.','The recurring danger is allowing the moral force of helping people to settle too much of the judgment before the conditions through which help must actually succeed have done equal work.'],
      P:['Practical constraint is doing more of the deciding than concern for affected welfare. Feasibility, efficiency, execution, and operational success therefore receive more weight than the human cost warrants.','The recurring danger is allowing what works to determine too much of what should count as success.'],
      W:['Context and interpretation are doing more of the deciding than the available information can fully support. Pattern, motive, implication, significance, and the larger picture therefore gain more authority than the evidence has earned.','The recurring danger is overreading: an explanation can become more compelling than the information that is supposed to discipline it.'],
      K:['Facts, measurements, rules, records, and explicit propositions are doing more of the deciding than context warrants. Circumstance, proportion, implication, and application therefore receive too little weight.','The recurring danger is misapplication: accurate information is treated as though it already contains everything needed to know what it means in this case.'],
      EW:['Concern for people and interpretive meaning reinforce one another. What ought to matter and what the situation is taken to mean carry the judgment together, while practical limits and factual grounding receive less authority.','The worldview can be humane and meaning-rich while confusing the moral force or significance of a vision with its factual support or practical viability.'],
      PW:['Practical constraint and interpretation reinforce one another. Incentives, circumstance, motive, tradeoff, power, and what is likely to work carry the judgment, while direct welfare and factual grounding receive less authority.','The worldview can read difficult realities sharply while overestimating how inevitable, justified, or universal those realities are.'],
      PK:['Practical constraint and factual grounding reinforce one another. Mechanism, explicit reasons, evidence, feasibility, and workable order carry the judgment, while human welfare and broader context receive less authority.','The worldview can become highly competent inside a model while overlooking materially relevant realities that resist quantification, formalization, or optimization.'],
      EK:['Concern for affected welfare and factual grounding reinforce one another. A real harm, rule, fact, principle, or supported concern carries the judgment, while context and practical feasibility receive less authority.','The worldview can be right about both the harm and the evidence while still reaching an inadequate judgment about application, compromise, timing, or what can actually improve the situation.']
    };
    let [a,b]=m[t.id];
    if(t.id.length===2&&!near(ax,az,.001))a+=` In this position, ${ax>az?(x>0?'concern for people':'practical constraint'):(z>0?'interpretation and context':'factual grounding')} is the stronger of the two tendencies.`;
    return[a,b];
  };

  const accountability=y=>{
    if(near(y,0))return 'The judgment is fully formed, but relevant counterpressures have neither been fully integrated nor shut out. What has been left out can still matter, but it has not yet been given its warranted place in the judgment.';
    if(y>=.8)return 'Reality retains very strong corrective authority. The remaining one-sidedness is narrow and readily revisable, but it still keeps this position below Maturity.';
    if(y>=.6)return 'Answerability clearly governs. Contradiction, failed consequences, neglected welfare, practical impossibility, or missing context can still reorganize the worldview rather than merely being explained away.';
    if(y>=.4)return 'The stance remains corrigible, though its preferred way of judging has enough weight to bias the conclusion before all relevant pressures have been integrated.';
    if(y>=.2)return 'Correction still has net authority, but it must work against a substantial preference. The worldview can revise, although it does not yet meet reality from an integrated position.';
    if(y>0)return 'Corrigibility is thin but still real. Reality can still defeat the stance, but the preferred interpretation strongly controls what gets noticed first and what must fight to be admitted.';
    if(y<=-.8)return 'The stance is deep in insulation. Its apparent settlement should not be mistaken for integration: it comes from increasing resistance to correction as the worldview approaches Collapse.';
    if(y<=-.6)return 'Insulation clearly governs. Contradiction, harm, failed prediction, or counterpressure can increasingly be absorbed without forcing genuine revision.';
    if(y<=-.4)return 'The worldview is becoming self-protecting. Missing pressures are increasingly recoded as irrelevant, hostile, naive, immoral, subjective, or otherwise unfit to change the conclusion.';
    if(y<=-.2)return 'Insulation has gained the advantage. Reality can still make contact, but the existing stance increasingly controls the terms under which correction is allowed to count.';
    return 'The stance has begun protecting itself from correction. Counterpressure can still appear, but it is starting to lose the authority to reorganize the judgment.';
  };

  const correctionGuidance=y=>{
    if(y>=.67)return 'Because the stance remains strongly corrigible, the task is mainly integrative: do not weaken what is already warranted. Let the neglected pressure change only what it genuinely bears on, while preserving everything that survives correction.';
    if(y>=.34)return 'Use contradiction, consequences, and new information as tests rather than threats. When they materially bear on the referent, let them alter the judgment without discarding what remains supported.';
    if(y>0)return 'Before increasing confidence, actively seek the strongest materially relevant counterpressure. The stance is still correctable, but its present preference is strong enough that uninvited correction may arrive too late.';
    if(near(y,0))return 'Do not let the present judgment close the question. Deliberately bring in the materially relevant pressure it leaves out before treating the conclusion as settled.';
    if(y>-.34)return 'First stop filtering correction through the need to preserve the stance. Let a materially relevant objection count on its own terms before deciding whether it fails.';
    if(y>-.67)return 'Restore correction before refining the conclusion. Ask what evidence, consequence, welfare effect, constraint, or context would genuinely be allowed to change the judgment, then give that reality real authority to do so.';
    return 'Treat self-protection as the immediate problem. If every contradiction can be reclassified, explained away, or moralized, first create a condition under which some materially relevant reality can actually defeat part of the stance.';
  };

  const guidance=(p,n)=>{
    if(n==='Absence')return[
      'Begin by establishing genuine contact with the referent. Learn what is known and unknown, what the information means in context, who or what is affected, and what real constraints bear on the matter. Do not manufacture a position before there is enough relevant reality to form one.',
      'If a stance is being presented despite genuine absence, identify what is producing the performance. Possible motives include belonging, conformity, status, fear of exclusion, imitation, role-performance, compliance, persuasion, concealment, or strategic interest. Deliberately presenting a stance one does not actually hold or understand is misrepresentation; sincere repetition of borrowed language without understanding is not necessarily deception, but it is still not a formed stance. In either case, the correction is to stop performing certainty and acquire genuine contact with the referent.'
    ];
    if(n==='Maturity')return[
      'Keep reality in charge. Strong emphasis on welfare, practicality, information, or interpretation is compatible with maturity so long as every materially relevant counterpart still retains the authority it warrants. Corrigibility does not require weak conviction: preserve the judgment when reality supports it, qualify it when reality qualifies it, revise it when reality revises it, and abandon it when reality defeats it.',
      'Do not manufacture balance for its own sake. Maturity at (0, 1, 0) is not equal weighting; it is complete integration relative to the referent, with nothing materially relevant neglected, distorted, exaggerated, or insulated from correction.'
    ];
    if(n==='Collapse')return[
      'Begin by restoring the possibility of correction. Identify what materially relevant evidence, consequence, welfare effect, constraint, or context would be allowed to change the stance, and grant it genuine authority to do so. A worldview cannot move toward maturity while it decides in advance that nothing outside its present organization can count against it.',
      'Once correction is possible again, preserve whatever remains valid and rebuild the judgment by reintegrating the realities it had excluded, neutralized, or explained away.'
    ];
    return[GUIDANCE[n],correctionGuidance(p[1])];
  };

  const card=p=>{
    const n=name(p),ex=exactName(p),t=themeFor(n);
    let paras;
    if(n==='Absence')paras=[
      'Absence is the pre-stance condition at (0, 0, 0): the person knows nothing materially relevant about the referent from which a formed judgment could be made. There is not yet a substantive appraisal of affected welfare, real-world constraint, informational grounding, or contextual meaning.',
      'It is not neutrality, balance, indecision, uncertainty, or maturity. There is simply no formed worldview about that referent yet. An assertion by itself does not change that if no substantive relation to the referent exists behind it.'
    ];
    else if(n==='Maturity')paras=[PAPER.Maturity.d,'Maturity at (0, 1, 0) is the unique point at which no partial tendency has to rule the whole and reality retains maximal authority to correct the judgment.'];
    else if(n==='Collapse')paras=[PAPER.Collapse.d,'Contradiction, harm, failure, evidence, and consequence can still be encountered, but they no longer retain reliable authority to reorganize the worldview.'];
    else if(ex===n)paras=[PAPER[n].d,accountability(p[1])];
    else {const [a,b]=emphasis(p,t);paras=[a,accountability(p[1]),b];}
    const g=guidance(p,n);
    const color=n==='Absence'?'#000000':yColor(p[1]);
    return `<article class="eo-worldview-paper" data-point="${esc(cfmt(p))}" style="--wv-name-color:${esc(color)}"><h2>${esc(n)}</h2><div class="eo-worldview-coordinate">${esc(cfmt(p))}</div><div class="eo-worldview-prose">${paras.map(v=>`<p>${esc(v)}</p>`).join('')}</div><details class="eo-worldview-guidance"><summary>Guidance</summary><div class="eo-worldview-guidance-body">${g.map(v=>`<p>${esc(v)}</p>`).join('')}</div></details></article>`;
  };

  let queued=false;
  const render=()=>{queued=false;const h=host(),p=point();if(!h||!p)return;const k=cfmt(p),old=h.querySelector('.eo-worldview-paper');if(old?.dataset.point===k)return;[...h.children].forEach(el=>{if(!el.classList.contains('eo-worldview-paper'))el.classList.add('eo-worldview-old');});old?.remove();const w=document.createElement('div');w.innerHTML=card(p);h.prepend(w.firstElementChild);};
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style']});
  document.addEventListener('click',schedule,true);document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);schedule();
})();