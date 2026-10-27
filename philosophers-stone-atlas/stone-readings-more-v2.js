(() => {
  'use strict';
  const {SEMANTICS}=window.STONE_V2_DATA;
  const R=window.STONE_V2_READINGS;
  const {esc,pointValid,isOrigin,isPeak,isCollapse,verticalReading,horizontalReading,currentCard}=R;
  function convictionHtml(p){
    const current=currentCard('Conviction referent',p,[...horizontalReading(p),verticalReading(pointValid(p)?p[1]:0),'This reads the organization of one sufficiently consolidated belief-commitment, not the person’s entire worldview.']);
    return `<section class="stone-ref-section">${current}<details class="stone-tool"><summary>Pressure test</summary><div class="stone-audit"><article><b>Information</b><p>What is actually known, unknown, supported, doubtful, assumed, or repeated?</p></article><article><b>Interpretation</b><p>What does that information mean here, in proportion, with its limits and alternatives?</p></article><article><b>Constraint</b><p>What does reality permit, prevent, require, or make costly if this conviction guides action?</p></article><article><b>Welfare</b><p>Who or what is materially affected, and has that effect been given the authority it warrants?</p></article><article><b>Correction</b><p>What evidence, consequence, contradiction, or realization would genuinely be allowed to qualify, revise, or defeat the conviction?</p></article></div></details></section>`;
  }

  function decisionHtml(p){
    const [x=0,y=0,z=0]=pointValid(p)?p:[0,0,0];
    const effects=[];
    if(isPeak(p)) effects.push('This is the mature source-structure for a decision: whichever consideration needs to lead in action can do so without excluding the other materially relevant pressures.');
    else if(isOrigin(p)) effects.push('No developed decision orientation is represented yet.');
    else if(isCollapse(p)) effects.push('The decision structure is maximally insulated from correction; outcome, motive, information, or concern can be selectively used without restoring reciprocal governance by reality.');
    else {
      if(x>.025) effects.push('The decision is over-led by affected welfare relative to feasibility, tradeoffs, or consequence.');
      if(x<-.025) effects.push('The decision is over-led by feasibility, effectiveness, or constraint relative to affected welfare.');
      if(z>.025) effects.push('The decision is over-led by interpretation, context, motive, or narrative relative to direct information.');
      if(z<-.025) effects.push('The decision is over-led by explicit information, rules, metrics, or records relative to contextual meaning and application.');
      effects.push(verticalReading(y));
    }
    const current=currentCard('Decision referent',p,effects);
    return `<section class="stone-ref-section">${current}<details class="stone-tool"><summary>Decision audit</summary><div class="stone-audit"><article><b>What matters?</b><p>Identify affected welfare without assuming that good intention guarantees a good result.</p></article><article><b>What is possible?</b><p>Identify real constraints, tradeoffs, resources, timing, and consequences.</p></article><article><b>What is known?</b><p>Separate evidence from assumption, uncertainty, and missing information.</p></article><article><b>What does it mean here?</b><p>Interpret the information in context rather than applying facts, rules, or metrics blindly.</p></article><article><b>What can still correct the choice?</b><p>Keep a route open for materially relevant reality to change the decision before and after action.</p></article></div></details></section>`;
  }

  function sourceHtml(p){
    const [x=0,y=0,z=0]=pointValid(p)?p:[0,0,0];
    const effects=[];
    if(isPeak(p)) effects.push('Source weight is maturely proportioned: access, competence, message content, context, practical stakes, affected welfare, and independent correction can all retain the authority the case warrants.');
    else if(isOrigin(p)) effects.push('No developed orientation toward this source is represented yet.');
    else if(isCollapse(p)) effects.push('The source judgment is maximally insulated: trust or distrust has become correction-resistant, so contrary evidence is unable to regain governing authority.');
    else {
      if(x>.025) effects.push('Concern, affinity, benevolence, or perceived human impact is carrying more authority than practical source constraints such as access, competence, incentives, or consequences.');
      if(x<-.025) effects.push('Practical source utility, status, competence, or strategic usefulness is carrying more authority than affected welfare or human consequence.');
      if(z>.025) effects.push('Interpretation of motive, identity, context, or reputation is outrunning the direct informational content available from the source.');
      if(z<-.025) effects.push('Statements, records, credentials, measurements, or explicit claims are being treated with more authority than their context and application warrant.');
      effects.push(verticalReading(y));
    }
    const current=currentCard('Source referent',p,effects);
    return `<section class="stone-ref-section">${current}<details class="stone-tool"><summary>Source audit</summary><div class="stone-audit"><article><b>Access</b><p>Was the source actually positioned to know the relevant thing?</p></article><article><b>Competence</b><p>Does the source reliably distinguish the domain’s important differences?</p></article><article><b>Transparency</b><p>Does the source distinguish observation, inference, uncertainty, and limitation?</p></article><article><b>Track record</b><p>How does the source perform across prediction, consequence, changing incentives, and independent evidence?</p></article><article><b>Correction history</b><p>What happens when the source is contradicted?</p></article><article><b>Proportionate verification</b><p>Raise verification when stakes and error costs rise without demanding impossible universal verification.</p></article></div></details></section>`;
  }

  const renderSemantics=()=>`<div class="stone-semantics-inner"><header><h1>Semantics</h1><p>The Philosopher’s Stone describes one entity in relation to one declared referent. The same geometry can therefore be used at worldview scale or at a bounded scale without confusing one scope for another.</p></header><div class="stone-semantics-grid">${SEMANTICS.map(([k,v])=>`<article><h3>${esc(k)}</h3><p>${esc(v)}</p></article>`).join('')}</div></div>`;

  Object.assign(R,{convictionHtml,decisionHtml,sourceHtml,renderSemantics});
})();
