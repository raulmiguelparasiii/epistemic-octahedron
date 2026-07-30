# Contributing and reporting problems

The DOI-bearing Version 1.0 paper is a fixed publication. Pull requests that rewrite or replace its PDF, source text, definitions, diagrams, or conclusions will not be merged into the `paper/v1.0/` record.

The current canonical theory, correction standard, and distinction between theory and downstream instruments are defined in:

- [`CANONICAL_STATUS.md`](CANONICAL_STATUS.md)
- [`EO_INSTRUMENTATION_POLICY.md`](EO_INSTRUMENTATION_POLICY.md)
- [`CONFORMANCE.md`](CONFORMANCE.md)

## Appropriate reports

Use an issue to report a specific, reproducible problem such as:

- a LaTeX build failure;
- a mismatch between the published PDF and repository source;
- a broken link or incorrect citation record;
- a typographical or bibliographic error;
- a formally identified contradiction;
- a false premise supported by evidence;
- a formed worldview that cannot be located through the five functions;
- a missing necessary and irreducible maturity function;
- a correspondence failure in which the geometry cannot preserve a maturity-relevant distinction;
- a security, privacy, scoring, validation, or reproducibility problem in a downstream instrument or software implementation.

State the exact page, section, equation, claim, file, instrument version, or dataset involved. For formal objections, show the premises, evidence, counterexample, and inferential steps rather than submitting a conclusion alone.

## Canonical challenges

A proposed change to the EO theory is not an ordinary feature request. It must be framed as a reciprocal structural challenge under `CANONICAL_STATUS.md`.

Preference, alternative terminology, popularity, institutional status, or the existence of a different instrument do not establish a canonical defect. A serious challenge must demonstrate a specific displacement condition such as contradiction, non-locatability, missing irreducible function, or correspondence failure.

Accepted substantive corrections will be released under a new version number and preserved as a separate record. Version 1.0 will remain available as originally issued.

## Downstream instruments and software

Independent instrument development is open. Contributions involving visualizers, measurement instruments, datasets, scoring systems, or software should:

- preserve a clear boundary between canonical EO theory and operational choices;
- disclose scoring, weighting, evidence, uncertainty, assumptions, limitations, and validation status;
- identify modifications or departures;
- avoid unsupported claims of official status, conformance, or validation;
- use a licence appropriate to the contributed software, data, or documentation.

Component-specific contribution and licensing rules may be added inside later instrument or software directories. Their licences will not alter the all-rights-reserved Version 1.0 paper.

## Repository policy changes

Pull requests may clarify stewardship, documentation, verification, or contribution procedure without changing the paper version. Such changes must not silently redefine the EO or weaken the preserved Version 1.0 publication record.
