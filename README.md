# The Epistemic Octahedron

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21688197.svg)](https://doi.org/10.5281/zenodo.21688197)
[![Version](https://img.shields.io/badge/version-1.0-2f363d)](#versioning)
[![Paper rights](https://img.shields.io/badge/paper-all%20rights%20reserved-2f363d)](LICENSE-PAPER.txt)

**Official repository for the Epistemic Octahedron**  
**Author:** Raul Miguel Pascual Paras III  
**Affiliation:** Independent Research  
**Canonical paper:** Version 1.0, published July 29, 2026

## Canonical record

**The Epistemic Octahedron: An Objective Surface-Based Model of Philosophical Maturity and Worldview Development**

- [Read the fixed Version 1.0 record on Zenodo](https://doi.org/10.5281/zenodo.21688197)
- [Open the repository copy of the paper](paper/v1.0/Epistemic_Octahedron_Objective_Philosophical_Maturity_v1.0.pdf)
- [View the complete LaTeX source](paper/v1.0/main.tex)
- [See citation metadata](CITATION.cff)

The Zenodo record is the canonical, fixed publication. This repository carries the matching paper, its complete source, figures, citation metadata, and downstream implementation work as that work is released.

## Abstract

The Epistemic Octahedron is a surface-based, three-dimensional model of philosophical maturity and worldview development. It represents empathy versus practicality and wisdom versus knowledge as two horizontal tensions governed by epistemic stability. The coordinate origin is reserved as a pre-philosophical null reference, the lower vertex represents epistemic collapse, and the upper vertex represents objective philosophical maturity.

The paper’s central discovery is the structural separation of pre-philosophical absence, negative epistemic instability, mature integration, and epistemic collapse. It argues that every formed worldview has a determinate position because every worldview necessarily stands in some relation to affected persons, practical constraint, informational grasp, contextual discernment, and epistemic stability.

Version 1.0 fixes the geometry, semantic axes, null exception, referent discipline, universality claim, formal syntax, epistemic regions, and principal implications of the model. Psychometric instrumentation and empirical validation are downstream work. A later instrument would measure the proposed structure; it would not create it.

## Formal core

The model uses the closed unit ball and boundary of the \(L^1\) norm:

```tex
\mathbb O := \{p\in\mathbb R^3 : \|p\|_1\le 1\},
\qquad
\partial\mathbb O := \{p\in\mathbb R^3 : \|p\|_1=1\}.
```

For nonzero semantic displacement \(d\), the canonical surface projection is:

```tex
\Pi(d) := \frac{d}{\|d\|_1}.
```

The full definitions of \(E_r\), \(P_r\), \(K_r\), \(W_r\), \(S_r\), the balance function, the pre-philosophical null exception, and the plotting map are stated in the paper. The compact equations are not intended to replace the paper’s semantic definitions.

## Repository structure

```text
.
├── .github/workflows/verify-v1-paper.yml
├── README.md
├── CITATION.cff
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE-PAPER.txt
└── paper/
    └── v1.0/
        ├── Epistemic_Octahedron_Objective_Philosophical_Maturity_v1.0.pdf
        ├── Epistemic_Octahedron_v1.0_Source_Package.zip
        ├── main.tex
        ├── README.md
        ├── CITATION.cff
        ├── LICENSE-PAPER.txt
        ├── CHECKSUMS.sha256
        └── figures/
```

Interactive visualizers and later measurement instruments will be placed in separate directories with their own status labels and licensing terms. Their presence in this repository will not alter the rights attached to the paper.

## Build the paper

A standard TeX Live installation with `pdflatex` is sufficient:

```bash
cd paper/v1.0
pdflatex main.tex
pdflatex main.tex
```

Two passes resolve the table of contents and internal references. The source expects the two image assets in `paper/v1.0/figures/`.

## Integrity verification

The fixed source, PDF, and figure files have committed SHA-256 values:

```bash
cd paper/v1.0
sha256sum --check CHECKSUMS.sha256
```

The repository workflow independently compiles the source, confirms both PDFs contain 54 pages, compares every rendered page against the canonical publication, checks the source archive, validates the citation files as YAML, and rejects prior-account identifiers.

## Citation

> Paras, Raul Miguel Pascual III. 2026. *The Epistemic Octahedron: An Objective Surface-Based Model of Philosophical Maturity and Worldview Development*. Version 1.0. Zenodo. https://doi.org/10.5281/zenodo.21688197

GitHub should also expose this citation through the repository’s **Cite this repository** control using [`CITATION.cff`](CITATION.cff).

## Correction and refutation

Version 1.0 remains fixed as published. Reports of typographical mistakes, source-build failures, citation problems, formal contradictions, false premises, or materially incomplete structure may be submitted through repository issues. A substantive correction will be released as a new, separately versioned record rather than silently rewriting Version 1.0.

The paper states its own standards for successful criticism and refutation. Copyright does not restrict lawful criticism, analysis, testing, or attempted refutation.

## Versioning

- **1.0 — July 29, 2026:** canonical first public release, DOI `10.5281/zenodo.21688197`.
- Later corrections or substantive revisions will receive explicit version numbers and preserved records.
- The DOI-bearing Version 1.0 PDF and matching source in `paper/v1.0/` are immutable historical artifacts.

## Rights

The paper, its source text, diagrams, arrangement, and presentation are **all rights reserved**. Citation, lawful quotation, criticism, review, analysis, testing, and attempted refutation remain permitted under applicable law. Reproduction, redistribution, translation, adaptation, modification, or republication requires prior written permission except where applicable law provides otherwise.

See [`LICENSE-PAPER.txt`](LICENSE-PAPER.txt). Software, visualizers, datasets, and downstream instruments may be released separately under different terms.
