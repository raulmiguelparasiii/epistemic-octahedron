(() => {
  'use strict';

  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const near = (a,b,t=.00001) => Math.abs(a-b)<=t;
  const surface = p => p && Math.abs(p.reduce((n,v)=>n+Math.abs(v),0)-1)<=.025;
  const nfmt = n => near(n,0)?'0':near(Math.abs(n),1/3)?(n<0?'-1/3':'1/3'):near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt = p => `(${p.map(nfmt).join(', ')})`;

  const style=document.createElement('style');
  style.textContent=`
    .eo-worldview-old{display:none!important}.eo-worldview-paper{margin:8px 0 4px;color:var(--text,#0f172a)}
    .eo-worldview-paper *{box-sizing:border-box}.eo-worldview-paper h2{margin:0;font-size:21px;line-height:1.12;letter-spacing:-.025em}
    .eo-worldview-coordinate{margin:4px 0 12px;font-size:10.5px;color:var(--muted,#64748b);font-variant-numeric:tabular-nums}
    .eo-worldview-prose p{margin:0 0 10px;font-size:13px;line-height:1.56}.eo-worldview-prose p:first-child{font-size:14px;line-height:1.52}
    .eo-worldview-structure{border-top:1px solid var(--border,#e2e8f0);margin-top:12px}.eo-worldview-structure>summary{cursor:pointer;list-style:none;padding:10px 1px;font-size:11px;font-weight:800;color:var(--muted,#475569)}
    .eo-worldview-structure>summary::-webkit-details-marker{display:none}.eo-worldview-structure>summary::after{content:'+';float:right;font-size:14px;font-weight:500}.eo-worldview-structure[open]>summary::after{content:'–'}
    .eo-worldview-structure-body{padding:0 1px 10px;font-size:11.5px;line-height:1.55}.eo-worldview-structure-body p{margin:0 0 8px}
    .eo-worldview-reference{margin-top:12px;padding-top:10px;border-top:1px solid var(--border,#e2e8f0)}.eo-worldview-reference label{display:block;margin-bottom:5px;font-size:10.5px;font-weight:800;color:var(--muted,#475569)}
    .eo-worldview-reference select{width:100%;min-height:34px;padding:6px 8px;border:1px solid var(--border,#cbd5e1);border-radius:8px;background:var(--panel,#fff);color:var(--text,#0f172a);font:inherit}
    .eo-worldview-reference-body{margin-top:11px}.eo-worldview-reference-body h3{margin:0;font-size:16px}.eo-worldview-reference-body p{font-size:11.75px;line-height:1.55}
    @media(max-width:520px){.eo-worldview-paper h2{font-size:20px}.eo-worldview-prose p{font-size:12.75px}.eo-worldview-prose p:first-child{font-size:13.5px}}
  `;
  (document.head||document.documentElement).appendChild(style);

  const host=()=>document.getElementById('worldviewPanel');
  const point=()=>{
    const p=['coord-x','coord-y','coord-z'].map(id=>Number(document.getElementById(id)?.value));
    if(p.every(Number.isFinite)&&surface(p)) return p;
    const h=host(); if(!h) return null;
    for(const el of h.querySelectorAll('code,span,p,div,strong')){
      if(el.closest('.eo-worldview-paper')) continue;
      const m=el.textContent?.replace(/−/g,'-').match(/\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/);
      if(m){const q=m.slice(1).map(Number); if(surface(q)) return q;}
    }
    return null;
  };

  const exact=(p,a)=>a.find(v=>v.coordinate.every((n,i)=>near(n,p[i])))||null;
  const dist=(p,a)=>Math.sqrt(a.coordinate.reduce((s,n,i)=>s+(p[i]-n)**2,0));
  const closest=(p,a)=>[...a].sort((m,n)=>dist(p,m)-dist(p,n)).slice(0,3).map(v=>v.name);

  const horizontal=(x,z)=>{
    const ax=Math.abs(x),az=Math.abs(z),e=.0001;
    if(ax<e&&az<e) return ['No unresolved purpose or meaning displacement is represented horizontally.','The coordinate is therefore distinguished by accountability alone: integration at the peak and correction-resistant consolidation at the lower vertex.'];
    if(ax>=e&&az<e) return x>0
      ? ['Concern for affected welfare carries more of purpose than practical constraint. Feasibility, tradeoff, consequence, scarcity, or implementation therefore govern less than the situation warrants.','The recurring failure is allowing what ought to help people to settle too much of the judgment before the conditions through which help must actually succeed have done equal work.']
      : ['Practical constraint carries more of purpose than concern for affected welfare. Feasibility, efficiency, execution, or operational success therefore govern more than the human cost warrants.','The recurring failure is allowing what works to determine too much of what should count as success.'];
    if(az>=e&&ax<e) return z>0
      ? ['Contextual interpretation carries more of meaning than informational grounding. Pattern, motive, implication, significance, or the larger picture therefore outrun what the available information can fully support.','The recurring failure is overreading: an explanation begins doing work that the evidence has not yet earned.']
      : ['Informational grounding carries more of meaning than contextual interpretation. Facts, records, measurements, rules, or explicit propositions therefore govern more than circumstance, proportion, implication, and application warrant.','The recurring failure is misapplication: accurate representation is treated as though it already contains the context needed to determine what the information means here.'];
    const lead=ax>az?'The purpose displacement is larger.':az>ax?'The meaning displacement is larger.':'The two displacements carry the unresolved load together.';
    if(x>0&&z>0) return [`Concern for affected welfare and contextual interpretation reinforce one another. ${lead} Human significance and what ought to matter can therefore outrun practical constraint and informational grounding.`,'The worldview can confuse the meaningfulness of a vision with its truth, evidential support, or practical viability.'];
    if(x<0&&z<0) return [`Practical constraint and informational grounding reinforce one another. ${lead} Mechanism, explicit representation, feasibility, and operational coherence can therefore outrun welfare and contextual meaning.`,'The worldview can become highly competent inside a model while overlooking materially relevant realities that are difficult to quantify, formalize, or optimize.'];
    if(x<0&&z>0) return [`Practical constraint combines with contextual interpretation. ${lead} Incentives, motive, power, circumstance, tradeoff, and what is likely to work can therefore outrun direct informational grounding and affected welfare.`,'The worldview can read difficult realities sharply while overestimating how inevitable, justified, or universal those realities are.'];
    return [`Concern for affected welfare combines with informational grounding. ${lead} A real harm, rule, fact, or evidentially supported concern can therefore outrun contextual interpretation and practical feasibility.`,'The worldview can be right about both the harm and the evidence while still reaching an inadequate judgment about application, compromise, timing, or what can actually improve the situation.'];
  };

  const vertical=y=>y>.75
    ? 'Reality retains very strong corrective authority. This remains below Maturity because some purpose or meaning displacement is unresolved, but materially relevant evidence, consequence, welfare, constraint, or context can still revise the judgment.'
    : y>.4 ? 'Answerability still governs clearly. The favored relation can bias judgment, but failure, contradiction, consequence, or a neglected counterpart retains enough authority to force genuine revision.'
    : y>0 ? 'The position remains answerability-directed, although corrective authority is comparatively weak. Reality can still defeat the existing stance, but the unresolved relation makes correction work harder.'
    : near(y,0) ? 'Judgment has formed at the accountability midpoint before the materially relevant counterpart pressures have been integrated. This is a completed one-sided stance rather than mere indecision.'
    : y>-.4 ? 'The stance has crossed into insulation. Omitted pressures no longer merely arrive late; they increasingly lose permission to reorganize the judgment, so correction can be reframed or discounted to preserve the existing orientation.'
    : y>-.75 ? 'Insulation now has clear governing advantage. Contradiction, harm, failed prediction, or counterpressure can increasingly be rationalized inside the stance instead of revising it.'
    : 'The position lies deep in the insulation-directed half. Its smaller lateral displacement does not indicate near-integration; horizontal narrowing here is produced by correction-resistant consolidation as the worldview approaches Collapse.';

  const lower=(x,z,s)=>{
    const p=[];
    if(x>.0001)p.push('practical objections can be recast as indifference or moral failure');
    if(x<-.0001)p.push('human cost can be rationalized as the price of effectiveness');
    if(z>.0001)p.push('contrary information can be reinterpreted until it serves the explanatory frame');
    if(z<-.0001)p.push('context can be classified away when it threatens accepted facts, rules, or doctrine');
    return p.length?`${s} Under pressure, ${p.join('; ')}.`:s;
  };

  const intermediate=p=>{const [x,y,z]=p,[intro,outcome]=horizontal(x,z);return{name:'Orientation',coordinate:p,paragraphs:[intro,vertical(y),y<0?lower(x,z,outcome):outcome]};};
  const formal=p=>{const [x,y,z]=p;return `Formally: ${near(x,0)?'no unresolved signed purpose displacement':x>0?'purpose displaced toward affected welfare':'purpose displaced toward practical constraint'}; ${near(y,0)?'accountability midpoint':y>0?'answerability-directed accountability':'insulation-directed accountability'}; ${near(z,0)?'no unresolved signed meaning displacement':z>0?'meaning displaced toward contextual interpretation':'meaning displaced toward informational grounding'}.`;};
  const options=a=>a.map((v,i)=>`<option value="${i}">${esc(v.name)}</option>`).join('');

  const card=(item,p,a,isExact)=>`<article class="eo-worldview-paper" data-point="${esc(cfmt(p))}"><h2>${esc(item.name)}</h2><div class="eo-worldview-coordinate">${esc(cfmt(item.coordinate||p))}</div><div class="eo-worldview-prose">${item.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</div><details class="eo-worldview-structure"><summary>Structure</summary><div class="eo-worldview-structure-body"><p>${esc(formal(p))}</p><p>Only Maturity at (0, 1, 0) is structurally mature. Strong expression of concern, constraint, information, or interpretation does not by itself establish displacement; displacement begins when a materially relevant counterpart loses proportional governing authority.</p>${isExact?'':`<p>Closest distinguished positions: ${esc(closest(p,a).join(', '))}.</p>`}<p>The coordinate describes the declared referent. A bounded stance does not by itself establish the whole person&#39;s worldview.</p><div class="eo-worldview-reference"><label>Archetype reference</label><select aria-label="View a distinguished worldview archetype"><option value="">Choose an archetype</option>${options(a)}</select><div class="eo-worldview-reference-body"></div></div></div></details></article>`;

  const ref=(box,a)=>{box.innerHTML=a?`<h3>${esc(a.name)}</h3><div class="eo-worldview-coordinate">${esc(cfmt(a.coordinate))}</div>${a.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}`:'';};
  const archetypes=[{"name":"Maturity","coordinate":[0,1,0],"paragraphs":["Maturity is the condition in which concern and constraint no longer compete for control of purpose, and information and interpretation no longer compete for control of meaning. All four can exert their proper pressure without one having to suppress another, while correction remains fully authoritative over the resulting judgment."]},{"name":"Welfarism","coordinate":[0.5,0.5,0],"paragraphs":["Welfarism appears when affected welfare begins carrying more of purpose than practical constraint can justify."]},{"name":"Sentimentalism","coordinate":[1,0,0],"paragraphs":["At the equator, that imbalance becomes Sentimentalism."]},{"name":"Moralism","coordinate":[0.5,-0.5,0],"paragraphs":["Below the equator, the same orientation hardens into Moralism."]},{"name":"Pragmatism","coordinate":[-0.5,0.5,0],"paragraphs":["Across the same purposive relation lies Pragmatism."]},{"name":"Instrumentalism","coordinate":[-1,0,0],"paragraphs":["At the equator this becomes Instrumentalism."]},{"name":"Expediency","coordinate":[-0.5,-0.5,0],"paragraphs":["Further downward lies Expediency."]},{"name":"Interpretivism","coordinate":[0,0.5,0.5],"paragraphs":["Interpretivism begins when context, implication, motive, pattern, significance, or the larger picture carry more meaning than the available information can fully support."]},{"name":"Narrativism","coordinate":[0,0,1],"paragraphs":["At the equator sits Narrativism."]},{"name":"Dogmatism","coordinate":[0,-0.5,0.5],"paragraphs":["Below the equator, interpretation becomes Dogmatism."]},{"name":"Evidentialism","coordinate":[0,0.5,-0.5],"paragraphs":["The opposite imbalance is Evidentialism."]},{"name":"Literalism","coordinate":[0,0,-1],"paragraphs":["At the equator, this becomes Literalism."]},{"name":"Doctrinalism","coordinate":[0,-0.5,-0.5],"paragraphs":["Below the equator lies Doctrinalism."]},{"name":"Romanticism","coordinate":[0.3333333333333333,0.3333333333333333,0.3333333333333333],"paragraphs":["Romanticism combines concern with interpretation."]},{"name":"Idealism","coordinate":[0.5,0,0.5],"paragraphs":["At the equator, this becomes Idealism."]},{"name":"Fanaticism","coordinate":[0.3333333333333333,-0.3333333333333333,0.3333333333333333],"paragraphs":["Below the equator, the cause becomes Fanaticism."]},{"name":"Rationalism","coordinate":[-0.3333333333333333,0.3333333333333333,-0.3333333333333333],"paragraphs":["Opposite Romanticism is Rationalism in this structural sense."]},{"name":"Technicism","coordinate":[-0.5,0,-0.5],"paragraphs":["At the equator lies Technicism."]},{"name":"Reductionism","coordinate":[-0.3333333333333333,-0.3333333333333333,-0.3333333333333333],"paragraphs":["Below that lies Reductionism."]},{"name":"Realism","coordinate":[-0.3333333333333333,0.3333333333333333,0.3333333333333333],"paragraphs":["Realism combines practical constraint with contextual interpretation."]},{"name":"Cynicism","coordinate":[-0.5,0,0.5],"paragraphs":["At the equator, the pattern becomes Cynicism."]},{"name":"Machiavellianism","coordinate":[-0.3333333333333333,-0.3333333333333333,0.3333333333333333],"paragraphs":["Below the equator, this becomes Machiavellianism."]},{"name":"Advocacy","coordinate":[0.3333333333333333,0.3333333333333333,-0.3333333333333333],"paragraphs":["Opposite Realism is Advocacy."]},{"name":"Purism","coordinate":[0.5,0,-0.5],"paragraphs":["At the equator appears Purism."]},{"name":"Fundamentalism","coordinate":[0.3333333333333333,-0.3333333333333333,-0.3333333333333333],"paragraphs":["Below the equator, the structure becomes Fundamentalism."]},{"name":"Collapse","coordinate":[0,-1,0],"paragraphs":["Collapse is not merely the worst opinion, the strongest ideology, or the greatest factual error."]}];
  let queued=false;

  const render=()=>{
    queued=false; const h=host(),p=point(); if(!h||!p||!archetypes.length)return;
    const key=cfmt(p),old=h.querySelector('.eo-worldview-paper'); if(old?.dataset.point===key)return;
    [...h.children].forEach(el=>{if(!el.classList.contains('eo-worldview-paper'))el.classList.add('eo-worldview-old');});
    old?.remove(); const a=exact(p,archetypes),baseItem=intermediate(p),item=a?{...a,paragraphs:[...a.paragraphs,...baseItem.paragraphs.slice(1)]}:baseItem,wrap=document.createElement('div'); wrap.innerHTML=card(item,p,archetypes,!!a); h.prepend(wrap.firstElementChild);
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
  document.addEventListener('change',e=>{const s=e.target.closest?.('.eo-worldview-reference select');if(!s)return;const box=s.parentElement.querySelector('.eo-worldview-reference-body');if(s.value===''){ref(box,null);return;}ref(box,archetypes[Number(s.value)]||null);},true);

  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style']});
  document.addEventListener('click',schedule,true);document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);schedule();
})();
