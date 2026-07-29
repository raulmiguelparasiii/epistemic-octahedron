# Epistemic Octahedron — Version 1.0 source package

This directory contains the exact source package corresponding to the canonical Version 1.0 preprint:

**Raul Miguel Pascual Paras III. _The Epistemic Octahedron: An Objective Surface-Based Model of Philosophical Maturity and Worldview Development_. Version 1.0. Zenodo, 2026.**

DOI: https://doi.org/10.5281/zenodo.21688197

## Contents

- `Epistemic_Octahedron_Objective_Philosophical_Maturity_v1.0.pdf` — DOI-bearing published paper
- `main.tex` — complete LaTeX source
- `figures/` — required figure assets
- `CITATION.cff` — machine-readable citation metadata
- `LICENSE-PAPER.txt` — paper rights notice
- `CHECKSUMS.sha256` — SHA-256 integrity values for the fixed paper, source, and figures
- `Epistemic_Octahedron_v1.0_Source_Package.zip` — self-contained archive of the publication materials

## Build

```bash
pdflatex main.tex
pdflatex main.tex
```

A standard TeX Live installation is sufficient. Two passes resolve the table of contents and internal references.

## Integrity verification

From this directory, verify the fixed files with:

```bash
sha256sum --check CHECKSUMS.sha256
```

The repository workflow also compiles the source, confirms both PDFs contain 54 pages, and compares every rendered page of the compiled output against the canonical publication.

## Version status

Version 1.0 is fixed as published on July 29, 2026. Later substantive corrections will be issued as separately versioned records. This directory should not be silently rewritten to represent a later version.
