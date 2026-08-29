# Contributing and reporting problems

The DOI-bearing canonical paper is frozen. Pull requests should not silently rewrite its definitions, geometry, proof architecture, diagrams, or conclusions.

The current canonical theory, correction standard, and distinction between theory and downstream instruments are defined in:

- [`CANONICAL_STATUS.md`](CANONICAL_STATUS.md)
- [`EO_INSTRUMENTATION_POLICY.md`](EO_INSTRUMENTATION_POLICY.md)
- [`CONFORMANCE.md`](CONFORMANCE.md)

## Appropriate reports

Use an issue to report a specific, reproducible problem such as:

- a broken repository link or incorrect citation record;
- a mismatch between a repository reader reference and the canonical paper;
- a typographical or bibliographic error;
- a formally identified contradiction;
- a false premise supported by evidence;
- a failure in the derivation of a necessary function;
- a formed worldview that escapes the five-function structure;
- a missing necessary and irreducible maturity function;
- a failure of the objective-dominance relation;
- a correspondence failure in which the geometry cannot preserve a maturity-relevant distinction;
- a security, privacy, scoring, validation, or reproducibility problem in a downstream instrument or software implementation.

State the exact page, section, equation, claim, file, instrument release, or dataset involved. For formal objections, show the premises, evidence, counterexample, and inferential steps rather than submitting a conclusion alone.

## Canonical challenges

A proposed change to the EO theory is a reciprocal structural challenge under [`CANONICAL_STATUS.md`](CANONICAL_STATUS.md), rather than an ordinary feature request.

Preference, alternative terminology, popularity, institutional status, or the existence of a different instrument do not establish a canonical defect. A serious challenge must demonstrate a defect in the structure actually claimed by the paper.

Because the main paper is frozen, any genuine substantive correction should be documented publicly as a distinct publication record while preserving the existing DOI-bearing paper as provenance.

## Downstream instruments and software

Independent instrument development is open. Contributions involving visualizers, measurement instruments, datasets, scoring systems, or software should:

- preserve a clear boundary between canonical EO theory and operational choices;
- disclose scoring, weighting, evidence, uncertainty, assumptions, limitations, and validation status;
- preserve the completion constraint and avoid ray-normalizing arbitrary interior triples into EO coordinates;
- distinguish structural location from evidential identification;
- preserve referent scope and burden in comparative uses;
- identify modifications or departures;
- avoid unsupported claims of official status, conformance, or validation;
- use a licence appropriate to the contributed software, data, or documentation.

Component-specific contribution and licensing rules may be added inside downstream instrument or software directories. Their licences do not alter the all-rights-reserved canonical paper.

## Repository policy changes

Repository documentation may be corrected or clarified without altering the frozen theory. Such changes must remain faithful to DOI `10.5281/zenodo.22164942` and must not silently redefine the EO.