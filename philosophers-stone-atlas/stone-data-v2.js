(() => {
  'use strict';
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


  window.STONE_V2_DATA={REFERENTS,DOCTRINES,SEMANTICS};
})();
