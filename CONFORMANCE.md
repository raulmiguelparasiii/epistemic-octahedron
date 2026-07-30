# Conformance and status claims

## Scope

This document defines repository terminology for downstream works. It does not itself validate or certify an instrument.

At present, no official psychometric instrument, validated EO assessment, or certification programme has been released by this repository.

## Status terms

### EO-based

An **EO-based** work uses, references, or draws inspiration from the Epistemic Octahedron. It may introduce substantial operational choices or departures. The term does not claim complete structural fidelity.

### EO-conformant

An **EO-conformant** work claims to preserve the canonical structure while adding a disclosed method of implementation or measurement. Such a claim should be accompanied by enough documentation for independent inspection.

A conformance claim is not equivalent to empirical validation, predictive accuracy, clinical utility, or endorsement by the author.

### Validated EO instrument

A **validated EO instrument** is an empirical claim. It requires a disclosed validation design, appropriate samples and comparison standards, reproducible analysis, stated limitations, and evidence proportionate to the claimed use.

No instrument should use this description merely because it contains EO terminology or an octahedral visualization.

### Official EO instrument

An **official EO instrument** is a provenance and authorization claim. It applies only when the instrument has been expressly designated as official in this repository or by the author through a verifiable public record.

Independent development is encouraged, but attribution alone does not establish official status.

## Minimum structural requirements for an EO-conformant claim

A work claiming EO conformance should, at minimum:

1. declare the referent being plotted or assessed;
2. preserve the octahedral surface constraint for every formed, non-null placement;
3. preserve the canonical axis semantics: empathy versus practicality, wisdom versus knowledge, and epistemic stability;
4. preserve the distinction between the pre-philosophical null origin, negative epistemic collapse, and mature integration at the top vertex;
5. preserve the role of concern for affected persons, practical constraint, informational grounding, contextual discernment, and correction-governed stability;
6. distinguish contextual emphasis from structural displacement;
7. distinguish observable expression from the underlying reasoning relevant to the declared referent;
8. avoid treating coordinates as simple quantities of personality traits;
9. identify a real displacement condition rather than inferring instability merely from uncertainty, incomplete knowledge, concise expression, contextual emphasis, or the abstract possibility of error;
10. disclose its evidence rules, scoring, weighting, uncertainty handling, assumptions, and validation method;
11. identify every modification, extension, simplification, or competing interpretation;
12. remain open to replication, criticism, error reporting, and correction.

## Surface and null discipline

The canonical geometry is:

```math
\begin{aligned}
\mathbb O
&:=
\left\{
p\in\mathbb R^3:
\lVert p\rVert_1\leq1
\right\},
\\[4pt]
\partial\mathbb O
&:=
\left\{
p\in\mathbb R^3:
\lVert p\rVert_1=1
\right\}.
\end{aligned}
```

For every nonzero semantic displacement:

```math
\Pi(d):=\frac{d}{\lVert d\rVert_1}.
```

For every formed worldview:

```math
\Phi(r)=(x_r,y_r,z_r)\in\partial\mathbb O,
\qquad
|x_r|+|y_r|+|z_r|=1.
```

The origin is reserved for the pre-philosophical null exception. It must not be treated as equivalent to mature balance, neutrality on the surface, or epistemic collapse.

The complete rendered definitions and plotting conditions are collected in [`FORMAL_CORE.md`](FORMAL_CORE.md). The DOI-bearing Version 1.0 paper remains authoritative.

## Modifications and rival models

A work that changes the geometry, axis meanings, null exception, vertical semantics, required functions, or displacement conditions should identify itself as modified, derived, or competing rather than claiming unqualified EO conformance.

A proposed improvement to the canonical theory belongs under the reciprocal structural challenge process in `CANONICAL_STATUS.md`. An improvement to measurement belongs under the open instrumentation process in `EO_INSTRUMENTATION_POLICY.md`.

## No implied endorsement

Use of EO terminology, citation of the paper, satisfaction of a self-declared checklist, or publication of source code does not imply endorsement, certification, validation, or official status.
