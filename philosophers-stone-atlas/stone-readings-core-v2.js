(() => {
  'use strict';
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
  const {DOCTRINES}=window.STONE_V2_DATA;
  const near=(a,b,t=.00001)=>Math.abs(a-b)<=t;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=n=>near(n,0)?'0':near(Math.abs(n),1/3,.001)?(n<0?'-1/3':'1/3'):near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt=p=>`(${p.map(fmt).join(', ')})`;
  const point=()=>['coord-x','coord-y','coord-z'].map(id=>Number(document.getElementById(id)?.value));
  const pointValid=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)&&p.reduce((s,v)=>s+Math.abs(v),0)<=1.025;
  const pointKey=p=>pointValid(p)?p.map(v=>Math.round(v*1000)/1000).join('|'):'';
  const isOrigin=p=>pointValid(p)&&p.every(v=>Math.abs(v)<.025);
  const isPeak=p=>pointValid(p)&&Math.abs(p[0])<.025&&p[1]>.975&&Math.abs(p[2])<.025;
  const isCollapse=p=>pointValid(p)&&Math.abs(p[0])<.025&&p[1]<-.975&&Math.abs(p[2])<.025;

  function verticalReading(y){
    if(y>.975) return 'Maximal answerability: materially relevant reality retains full corrective authority.';
    if(y>.05) return 'The orientation is answerability-directed. The unresolved displacement is still open to correction, and the omitted counterpart can revise the stance.';
    if(y>=-.05) return 'The orientation is at the accountability midpoint: judgment is formed before the materially relevant counterpart pressures have been fully integrated.';
    if(y>-.975) return 'The orientation is insulation-directed. Correction increasingly loses authority, so the existing displacement becomes harder to revise rather than merely remaining incomplete.';
    return 'Maximal insulation: correction-resistant consolidation has reached epistemic collapse.';
  }

  function horizontalReading(p){
    const [x,,z]=p, parts=[];
    if(x>.025) parts.push('Affected welfare carries more governing authority than real-world constraint.');
    else if(x<-.025) parts.push('Real-world constraint, effectiveness, or feasibility carries more governing authority than affected welfare.');
    else parts.push('Purpose shows no unresolved concern–constraint displacement at this coordinate.');
    if(z>.025) parts.push('Contextual interpretation carries more governing authority than informational grounding.');
    else if(z<-.025) parts.push('Informational grounding carries more governing authority than contextual interpretation.');
    else parts.push('Meaning shows no unresolved interpretation–information displacement at this coordinate.');
    return parts;
  }

  function structuralTitle(p){
    if(!pointValid(p)) return 'Current orientation unavailable';
    if(isOrigin(p)) return 'Absence';
    if(isPeak(p)) return 'Maturity';
    if(isCollapse(p)) return 'Collapse';
    const [x,y,z]=p;
    const axes=[];
    if(x>.025) axes.push('welfare-heavy');
    else if(x<-.025) axes.push('constraint-heavy');
    if(z>.025) axes.push('interpretation-heavy');
    else if(z<-.025) axes.push('information-heavy');
    const body=axes.length?axes.join(' + '):'laterally integrated';
    if(y>.05) return `Answerable ${body} orientation`;
    if(y<-.05) return `Insulated ${body} orientation`;
    return `${body[0].toUpperCase()+body.slice(1)} prejudice`;
  }

  function currentCard(title,p,paragraphs,extra=''){
    const coord=pointValid(p)?cfmt(p):'—';
    return `<article class="stone-current-card"><div class="stone-current-kicker">${esc(title)} · ${esc(coord)}</div><h2>${esc(structuralTitle(p))}</h2>${paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}${extra}</article>`;
  }

  function doctrineMatches(p){
    if(!pointValid(p)||isOrigin(p)||isPeak(p)||isCollapse(p)) return [];
    const [x,y,z]=p, out=[];
    // These are overlaps with the defined failure form, never identities between a doctrine and a coordinate.
    if(z<=-.25) out.push('Nihilism');
    if(z<=-.25&&x>=.15) out.push('Deontology');
    if(z>=.25) out.push('Moral relativism');
    if(z>=.15&&y<=-.15) out.push('Solipsism');
    if(y<=-.35) out.push('Skepticism');
    if(x>=.4) out.push('Hedonism');
    return [...new Set(out)];
  }

  function doctrineHtml(p){
    const matches=doctrineMatches(p);
    const current=currentCard('Doctrine referent',p,[
      ...horizontalReading(p),
      verticalReading(pointValid(p)?p[1]:0),
      matches.length
        ? `This location overlaps the defined structural failure used below for: ${matches.join(', ')}. That is a structural overlap, not a claim that the doctrine itself has one fixed coordinate.`
        : 'No doctrine below is being identified with this coordinate. Doctrine names are content labels; the Stone evaluates the displacement and accountability structure of the way a doctrine is held.'
    ]);
    return `<section class="stone-ref-section">${current}<div class="stone-ref-intro"><h3>Philosophical doctrines</h3><p>Move the Stone to change the structural reading. Entries whose defined failure overlaps the current displacement are emphasized. The label itself never substitutes for the entity–referent analysis.</p></div><div class="stone-list">${DOCTRINES.map(d=>{
      const hit=matches.includes(d.name);
      return `<details class="stone-item${hit?' stone-match':''}"><summary><span>${esc(d.name)}</span><small>${hit?'structural overlap':esc(d.kind)}</small></summary><div class="stone-item-body"><p>${esc(d.text)}</p><p class="stone-reading"><strong>Stone displacement:</strong> ${esc(d.displacement)}</p><p class="stone-verdict">${esc(d.verdict)}</p></div></details>`;
    }).join('')}</div></section>`;
  }

  function communicationLabel(p){
    if(!pointValid(p)) return 'Communication';
    if(isOrigin(p)) return 'No formed communication orientation';
    if(isPeak(p)) return 'Mature communication';
    if(isCollapse(p)) return 'Communicative collapse';
    const [x,,z]=p, sx=x>.025?1:x<-.025?-1:0, sz=z>.025?1:z<-.025?-1:0;
    if(sx<0&&sz===0) return 'Insensitive';
    if(sx>0&&sz===0) return 'People-pleasing';
    if(sx===0&&sz>0) return 'Overreading';
    if(sx===0&&sz<0) return 'Pedantic';
    if(sx<0&&sz>0) return 'Manipulative';
    if(sx<0&&sz<0) return 'Clinical';
    if(sx>0&&sz>0) return 'Patronizing';
    if(sx>0&&sz<0) return 'Moralizing';
    return 'Communication bias';
  }

  function communicationHtml(p){
    const [x=0,y=0,z=0]=pointValid(p)?p:[0,0,0];
    let paragraphs=[];
    if(isOrigin(p)){
      paragraphs=['No developed orientation toward this communication referent is represented here.'];
    }else if(isPeak(p)){
      paragraphs=[
        'At maturity, no partial communication function needs to rule the whole. Truth, affected welfare, practical constraint, context, and correction remain integrated.',
        'The outward expression can therefore be blunt, gentle, tactful, warm, technical, concise, humorous, formal, diplomatic, or direct as the situation warrants. Those are contextual emphases rather than displacement because the rest of the materially relevant reality remains governing.'
      ];
    }else if(isCollapse(p)){
      paragraphs=[
        'Communication has become maximally insulated from correction. Individual facts, rhetorical skill, warmth, confidence, or strategic competence can still appear, but the communicative stance no longer permits materially relevant reality to revise its organized whole.'
      ];
    }else{
      if(x<-.025) paragraphs.push('Practicality, efficiency, directness, order, or getting the point across is carrying more authority than affected welfare. In communication this is where insensitivity appears: a message can be efficient or factually useful while the human effect that materially should matter is under-governed. Bluntness itself is not the error; bluntness can remain fully mature when welfare is still integrated.');
      else if(x>.025) paragraphs.push('Affected welfare, comfort, approval, or the wish to avoid distress is carrying more authority than practical constraint. In communication this can become people-pleasing, over-accommodation, cushioning, or withholding a necessary correction because immediate comfort is being allowed to settle the exchange.');
      if(z>.025) paragraphs.push('Contextual interpretation is outrunning informational grounding. Communication can become overreading: motives, implications, subtext, tone, or the larger story are inferred with more authority than the available information has earned.');
      else if(z<-.025) paragraphs.push('Informational grounding is outrunning contextual interpretation. Communication can become pedantic or context-blind: exact wording, facts, rules, or corrections are treated as if their relevance and application were self-evident.');
      if(Math.abs(x)<=.025&&Math.abs(z)<=.025) paragraphs.push('No lateral communication displacement is represented at this coordinate; the remaining distinction is how answerability or insulation governs the stance.');
      paragraphs.push(verticalReading(y));
    }
    const coord=pointValid(p)?cfmt(p):'—';
    return `<section class="stone-ref-section"><article class="stone-current-card"><div class="stone-current-kicker">Communication · ${esc(coord)}</div><h2>${esc(communicationLabel(p))}</h2>${paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</article><p class="stone-footnote">The label describes the declared communication referent at this location. It does not infer a whole personality from one utterance, and compressed expression is not automatically evidence of missing reasoning.</p></section>`;
  }

  window.STONE_V2_READINGS={esc,clamp,point,pointKey,pointValid,isOrigin,isPeak,isCollapse,verticalReading,horizontalReading,structuralTitle,currentCard,doctrineHtml,communicationHtml};
})();
