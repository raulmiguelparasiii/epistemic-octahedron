(() => {
  'use strict';
  const R=window.STONE_V2_READINGS;
  const D=window.STONE_V2_DATA;
  if(!R||!D) return;
  const {esc,pointValid,isOrigin,isPeak,isCollapse}=R;
  const near=(a,b,t=.00001)=>Math.abs(a-b)<=t;
  const dist2=(p,a)=>p.reduce((s,v,i)=>s+(v-a[i])**2,0);

  // Developer note: these 24 anchors mirror the paper-grounded 24 non-pole
  // worldview territories. The labels below are referent-specific UI vocabulary,
  // not additional canonical Stone coordinates or claims that the paper named them.
  const ANCHORS=[
    ['E','upper',[.5,.5,0]],['E','mid',[1,0,0]],['E','lower',[.5,-.5,0]],
    ['P','upper',[-.5,.5,0]],['P','mid',[-1,0,0]],['P','lower',[-.5,-.5,0]],
    ['W','upper',[0,.5,.5]],['W','mid',[0,0,1]],['W','lower',[0,-.5,.5]],
    ['K','upper',[0,.5,-.5]],['K','mid',[0,0,-1]],['K','lower',[0,-.5,-.5]],
    ['EW','upper',[1/3,1/3,1/3]],['EW','mid',[.5,0,.5]],['EW','lower',[1/3,-1/3,1/3]],
    ['PW','upper',[-1/3,1/3,1/3]],['PW','mid',[-.5,0,.5]],['PW','lower',[-1/3,-1/3,1/3]],
    ['PK','upper',[-1/3,1/3,-1/3]],['PK','mid',[-.5,0,-.5]],['PK','lower',[-1/3,-1/3,-1/3]],
    ['EK','upper',[1/3,1/3,-1/3]],['EK','mid',[.5,0,-.5]],['EK','lower',[1/3,-1/3,-1/3]]
  ];
  const territory=p=>{
    let best=ANCHORS[0],bestD=Infinity;
    for(const a of ANCHORS){
      const d=dist2(p,a[2]);
      if(d<bestD-1e-12 || (near(d,bestD,1e-12) && `${a[0]}.${a[1]}`<`${best[0]}.${best[1]}`)){best=a;bestD=d;}
    }
    return {family:best[0],phase:best[1],key:`${best[0]}.${best[1]}`};
  };

  const PHASE={
    upper:'The emphasis remains open to correction.',
    mid:'The imbalance has settled before its counterpart is fully integrated.',
    lower:'The imbalance is increasingly protected from correction.'
  };
  const FAMILY={
    E:'Affected welfare is carrying more authority than real-world constraint.',
    P:'Real-world constraint or effectiveness is carrying more authority than affected welfare.',
    W:'Contextual interpretation is carrying more authority than informational grounding.',
    K:'Informational grounding is carrying more authority than contextual interpretation.',
    EW:'Affected welfare and interpretation are carrying more authority than constraint and information.',
    PW:'Constraint and interpretation are carrying more authority than welfare and information.',
    PK:'Constraint and information are carrying more authority than welfare and interpretation.',
    EK:'Affected welfare and information are carrying more authority than constraint and interpretation.'
  };

  const LABELS={
    communication:{
      'E.upper':'Protective','E.mid':'People-pleasing','E.lower':'Enabling',
      'P.upper':'Direct','P.mid':'Insensitive','P.lower':'Callous',
      'W.upper':'Perceptive','W.mid':'Overreading','W.lower':'Spin',
      'K.upper':'Precise','K.mid':'Pedantic','K.lower':'Literalist',
      'EW.upper':'Tactful','EW.mid':'Patronizing','EW.lower':'Paternalistic',
      'PW.upper':'Strategic','PW.mid':'Manipulative','PW.lower':'Propagandistic',
      'PK.upper':'Technical','PK.mid':'Clinical','PK.lower':'Dehumanizing',
      'EK.upper':'Advocative','EK.mid':'Moralizing','EK.lower':'Shaming'
    },
    conviction:{
      'E.upper':'Compassionate','E.mid':'Sentimental','E.lower':'Moralized',
      'P.upper':'Practical','P.mid':'Instrumental','P.lower':'Expedient',
      'W.upper':'Contextual','W.mid':'Narrative','W.lower':'Dogmatic',
      'K.upper':'Empirical','K.mid':'Literal','K.lower':'Doctrinal',
      'EW.upper':'Humane','EW.mid':'Idealized','EW.lower':'Utopian',
      'PW.upper':'Realistic','PW.mid':'Cynical','PW.lower':'Machiavellian',
      'PK.upper':'Rational','PK.mid':'Technicist','PK.lower':'Reductionist',
      'EK.upper':'Principled','EK.mid':'Moral-literal','EK.lower':'Fundamentalist'
    },
    decision:{
      'E.upper':'Care-led','E.mid':'Compassion-first','E.lower':'Paternalistic',
      'P.upper':'Practical','P.mid':'Instrumental','P.lower':'Expedient',
      'W.upper':'Contextual','W.mid':'Intuitive','W.lower':'Narrative-bound',
      'K.upper':'Evidence-led','K.mid':'Rule-bound','K.lower':'Doctrinaire',
      'EW.upper':'Human-centered','EW.mid':'Idealistic','EW.lower':'Utopian',
      'PW.upper':'Realist','PW.mid':'Calculating','PW.lower':'Machiavellian',
      'PK.upper':'Analytical','PK.mid':'Technocratic','PK.lower':'Reductionist',
      'EK.upper':'Principled','EK.mid':'Moral-literal','EK.lower':'Fundamentalist'
    },
    source:{
      'E.upper':'Trusting','E.mid':'Sympathetic','E.lower':'Loyalist',
      'P.upper':'Utility-aware','P.mid':'Authority-led','P.lower':'Opportunistic',
      'W.upper':'Context-aware','W.mid':'Motive-reading','W.lower':'Suspicious',
      'K.upper':'Evidence-led','K.mid':'Text-bound','K.lower':'Proof-fixated',
      'EW.upper':'Relational','EW.mid':'Affinity-led','EW.lower':'Tribal',
      'PW.upper':'Strategic','PW.mid':'Cynical','PW.lower':'Paranoid',
      'PK.upper':'Expertise-led','PK.mid':'Credentialist','PK.lower':'Technocratic',
      'EK.upper':'Integrity-led','EK.mid':'Moral-trust','EK.lower':'Partisan'
    }
  };

  const fmt=n=>near(n,0)?'0':near(Math.abs(n),1/3,.001)?(n<0?'-1/3':'1/3'):near(Math.abs(n),.5)?(n<0?'-.5':'.5'):near(Math.abs(n),1)?(n<0?'-1':'1'):String(Math.round(n*1000)/1000);
  const cfmt=p=>`(${p.map(fmt).join(', ')})`;
  const card=(label,p,text,foot='')=>`<section class="stone-ref-section"><article class="stone-current-card"><h2>${esc(label)}</h2><div class="stone-current-coordinate">${esc(pointValid(p)?cfmt(p):'—')}</div><p>${esc(text)}</p></article>${foot?`<p class="stone-footnote">${esc(foot)}</p>`:''}</section>`;

  const special=(kind,p)=>{
    if(!pointValid(p)) return {label:kind[0].toUpperCase()+kind.slice(1),text:'Current orientation unavailable.'};
    if(isOrigin(p)) return {label:'Absence',text:'No formed orientation toward this referent is represented here.'};
    if(isPeak(p)){
      const peak={communication:'Mature communication',conviction:'Mature conviction',decision:'Mature decision',source:'Mature source judgment'};
      const text={
        communication:'Expression may be blunt, gentle, tactful, technical, warm, concise, formal, or direct as the situation warrants; emphasis is not displacement while materially relevant welfare, constraint, information, context, and correction remain governing.',
        conviction:'The conviction can be strong without becoming untouchable: all materially relevant pressures are integrated and reality remains able to preserve, qualify, revise, or defeat it.',
        decision:'Whichever consideration needs to lead can do so without excluding the other materially relevant pressures, and the choice remains correctable by reality.',
        source:'Trust or distrust is proportioned to access, competence, content, context, consequence, and independent correction rather than being protected as an identity commitment.'
      };
      return {label:peak[kind],text:text[kind]};
    }
    if(isCollapse(p)){
      const label={communication:'Communicative collapse',conviction:'Conviction collapse',decision:'Decision collapse',source:'Source-judgment collapse'}[kind];
      return {label,text:'The stance is maximally insulated: materially relevant reality no longer retains corrective authority over the organized whole.'};
    }
    return null;
  };

  const conciseReading=(kind,p)=>{
    const s=special(kind,p); if(s) return s;
    const t=territory(p),label=LABELS[kind][t.key];
    let text=`${FAMILY[t.family]} ${PHASE[t.phase]}`;
    if(kind==='communication'){
      const local={
        'P.mid':'The problem is not bluntness itself; it is directness becoming insensitive because materially relevant human effect is under-governed.',
        'P.lower':'Efficiency or blunt utility is protected even when human cost should correct it.',
        'E.mid':'Comfort or approval begins deciding what may be said before practical correction is integrated.',
        'W.mid':'Subtext, motive, or tone is allowed to settle meaning before the information can bear it.',
        'K.mid':'Correct detail is allowed to settle the exchange before relevance and context are integrated.'
      };
      if(local[t.key]) text=local[t.key];
    }
    return {label,text};
  };

  R.communicationHtml=p=>{const v=conciseReading('communication',p);return card(v.label,p,v.text,'This reads the communication referent, not the whole person.');};
  R.convictionHtml=p=>{const v=conciseReading('conviction',p);return card(v.label,p,v.text);};
  R.decisionHtml=p=>{const v=conciseReading('decision',p);return card(v.label,p,v.text);};
  R.sourceHtml=p=>{const v=conciseReading('source',p);return card(v.label,p,v.text);};

  const DOC_SHORT={
    Nihilism:'Treats the absence of given meaning as the absence of meaning itself, letting informational absence settle interpretation.',
    Existentialism:'No fixed displacement: maturity depends on how meaning, evidence, constraint, welfare, and correction are integrated.',
    Stoicism:'Can maturely integrate constraint; it distorts when acceptance is used to erase avoidable harm or relevant context.',
    Utilitarianism:'Can overreduce value to aggregate outcome when persons, uncertainty, or context become secondary.',
    Deontology:'Can become literalist when a rule is treated as self-applying without sufficient context, welfare, or feasibility.',
    'Moral relativism':'Becomes immature when contextual variation is used to deny correction that the shared referent can actually supply.',
    Solipsism:'Becomes self-sealing when independent evidence is reinterpreted so it can never count against the thesis.',
    Skepticism:'Mature when doubt tracks evidence; immature when no evidence is ever allowed to update it.',
    Hedonism:'Becomes immature when pleasure alone is allowed to settle value.',
    Determinism:'No fixed displacement: the truth of the thesis and the maturity of how it is held are separate questions.'
  };
  const doctrineMatches=p=>{
    if(!pointValid(p)||isOrigin(p)||isPeak(p)||isCollapse(p)) return [];
    const [x,y,z]=p,out=[];
    if(z<=-.25) out.push('Nihilism');
    if(z<=-.25&&x>=.15) out.push('Deontology');
    if(z>=.25) out.push('Moral relativism');
    if(z>=.15&&y<=-.15) out.push('Solipsism');
    if(y<=-.35) out.push('Skepticism');
    if(x>=.4) out.push('Hedonism');
    return [...new Set(out)];
  };
  R.doctrineHtml=p=>{
    const matches=doctrineMatches(p),coord=pointValid(p)?cfmt(p):'—';
    const intro=`<article class="stone-current-card"><h2>Doctrines</h2><div class="stone-current-coordinate">${esc(coord)}</div><p>${matches.length?`The current geometry overlaps ${matches.length===1?matches[0]:matches.join(', ')} in the defined failure form below.`:'No listed doctrine is structurally singled out by this coordinate.'}</p></article>`;
    const items=D.DOCTRINES.map(d=>{
      const hit=matches.includes(d.name);
      return `<details class="stone-item${hit?' stone-match':''}"${hit?' open':''}><summary><span>${esc(d.name)}</span></summary><div class="stone-item-body"><p>${esc(DOC_SHORT[d.name]||d.verdict||d.text)}</p></div></details>`;
    }).join('');
    return `<section class="stone-ref-section">${intro}<div class="stone-list">${items}</div></section>`;
  };

  window.STONE_V4={territory,LABELS};
})();
