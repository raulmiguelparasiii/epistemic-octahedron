# Conformance and status claims

## Scope

This document defines repository terminology for downstream works. It does not itself validate or certify an instrument.

At present, no official psychometric instrument, validated EO assessment, or certification programme has been released by this repository.

## Status terms

### EO-based

An **EO-based** work uses, references, or draws inspiration from the Epistemic Octahedron. It may introduce substantial operational choices or departures. The term does not claim complete structural fidelity.

### EO-conformant

An **EO-conformant** work claims to preserve the frozen canonical structure while adding a disclosed method of implementation or measurement. Such a claim should be accompanied by enough documentation for independent inspection.

A conformance claim is not equivalent to empirical validation, predictive accuracy, clinical utility, or endorsement by the author.

### Validated EO instrument

A **validated EO instrument** is an empirical claim. It requires a disclosed validation design, appropriate samples and comparison standards, reproducible analysis, stated limitations, and evidence proportionate to the claimed use.

### Official EO instrument

An **official EO instrument** is a provenance and authorization claim. It applies only when the instrument has been expressly designated as official in this repository or by the author through a verifiable public record.

## Minimum structural requirements for an EO-conformant claim

A work claiming EO conformance should, at minimum:

1. declare the referent being plotted or assessed;
2. preserve the distinction between whole-worldview referents and plot-eligible bounded referents;
3. preserve the octahedral completion constraint `|x|+|y|+|z|=1` for completed surface placements;
4. treat the surface equation as a completion constraint rather than a ray-normalization rule;
5. preserve the canonical axis semantics: empathy versus practicality, wisdom versus knowledge, and epistemic stability;
6. preserve the higher-order relations of purpose, meaning, and answerability to reality under pressure;
7. preserve the distinction between the pre-philosophical null origin, orientation underdetermination, maximal instability at the equator, consolidated negative stability, epistemic collapse, and mature integration at the top vertex;
8. preserve concern for affected welfare, real-world constraint, informational grounding, contextual interpretation, and reality-governed epistemic stability as the five necessary functions;
9. distinguish contextual emphasis from structural displacement;
10. distinguish expression from underlying reasoning and acquisition from integration where those distinctions matter to the referent;
11. distinguish structural location from evidential identification and use evidence-warranted regions when an exact point is not justified;
12. avoid treating coordinates as independent quantities of personality traits or as raw scores that may be normalized into EO positions;
13. preserve the Five-Function Invariance Test and the objective-dominance logic of non-loss plus correction;
14. preserve referent and scope burden when comparing unequal contributions in shared inquiry;
15. disclose evidence rules, scoring, weighting, uncertainty handling, assumptions, and validation method for any operational instrument;
16. identify every modification, extension, simplification, or competing interpretation;
17. remain open to replication, criticism, error reporting, and correction.

## Surface and null discipline

The canonical geometry is:

```math
\mathbb O:=\{p\in\mathbb R^3:\lVert p\rVert_1\le1\},
\qquad
\partial\mathbb O:=\{p\in\mathbb R^3:\lVert p\rVert_1=1\}.
```

For a surface-eligible referent:

```math
\sigma(r)=\left(\Delta_r(E,P),\Sigma_r,\Delta_r(W,K)\right)\in\partial\mathbb O,
```

and therefore:

```math
|\Delta_r(E,P)|+|\Sigma_r|+|\Delta_r(W,K)|=1.
```

No radial or ray projection is part of the canonical EO semantics. An arbitrary interior triple must not be normalized outward and presented as a completed EO coordinate.

The origin is reserved for whole-agent referents prior to worldview formation. A bounded referent does not map to the origin merely because it is not itself a worldview, and lack of evaluator knowledge does not map a referent to the origin.

When evidence does not determine an exact surface point, the proper output is an evidence-warranted region `\Omega(r\mid e)` or another faithful constrained report rather than invented decimal precision.

The complete rendered definitions and plotting conditions are collected in [`FORMAL_CORE.md`](FORMAL_CORE.md). The authoritative paper is DOI `10.5281/zenodo.22164942`.

## Modifications and rival models

A work that changes the geometry, completion law, axis meanings, null semantics, vertical semantics, required functions, closure test, dominance relation, or referent discipline should identify itself as modified, derived, or competing rather than claiming unqualified EO conformance.

A proposed change to the canonical theory belongs under the reciprocal structural challenge process in [`CANONICAL_STATUS.md`](CANONICAL_STATUS.md). An improvement to measurement belongs under the open instrumentation process in [`EO_INSTRUMENTATION_POLICY.md`](EO_INSTRUMENTATION_POLICY.md).

## No implied endorsement

Use of EO terminology, citation of the paper, satisfaction of a self-declared checklist, or publication of source code does not imply endorsement, certification, validation, or official status.