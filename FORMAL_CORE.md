# Rendered formal core of the Epistemic Octahedron

**Canonical publication:** [DOI 10.5281/zenodo.22164942](https://doi.org/10.5281/zenodo.22164942)

This document is a reader-facing rendering of the formal semantic kernel in the canonical paper. If this reference conflicts with the DOI-bearing paper, the paper governs and this reference should be corrected.

## Octahedral geometry and worldview surface

```math
\begin{aligned}
\mathbb O
&:=\{p\in\mathbb R^3:\lVert p\rVert_1\le 1\},\\
\partial\mathbb O
&:=\{p\in\mathbb R^3:\lVert p\rVert_1=1\},\\
\lVert p\rVert_1&=|x|+|y|+|z|.
\end{aligned}
```

Only the boundary `\partial\mathbb O` contains completed surface plots of formed whole-worldview referents and plot-eligible bounded referents. The origin is reserved for pure pre-philosophical nullity.

The surface constraint is a formation and completion constraint. It is not a normalization instruction. No radial or ray projection is part of the Epistemic Octahedron's semantics.

## Necessary functions and higher-order relations

For a declared referent `r`, the five necessary functions are represented semantically by:

```math
\begin{aligned}
E_r&:=\deg_r(\text{concern for affected welfare}),\\
P_r&:=\deg_r(\text{real-world constraint}),\\
K_r&:=\deg_r(\text{informational grounding}),\\
W_r&:=\deg_r(\text{contextual interpretation and discernment}),\\
S_r&:=\deg_r(\text{reality-governed epistemic organization under pressure}).
\end{aligned}
```

`\deg_r` denotes a latent semantic degree relative to the declared referent. It does not define a finalized measurement scale.

Knowledge and wisdom are reciprocal but non-identical:

```math
K_r\xrightarrow{\mathrm{feeds}}W_r,
\qquad
W_r\xrightarrow{\mathrm{governs}}K_r.
```

The higher-order explanatory semantics are:

```math
\boxed{
\begin{aligned}
E_r\leftrightarrow P_r&:\quad\text{purposive relation},\\
K_r\leftrightarrow W_r&:\quad\text{meaning-forming relation},\\
S_r&:\quad\text{reality-answerability under pressure}.
\end{aligned}}
```

## Structural displacement and complete semantic coordinate

For opposed functions `A` and `B`:

```math
\Delta_r(A,B)\in[-1,1],
\qquad
\Delta_r(A,B)=-\Delta_r(B,A).
```

`\Delta_r(A,B)` is the signed unresolved structural displacement of `r` toward `A` relative to `B`. A zero displacement means that no unresolved structural displacement between the pair is established. It does not imply absence, equal visibility, or equal contextual emphasis.

Let

```math
\Sigma_r\in[-1,1]
```

denote the signed epistemic-stability coordinate. Positive values indicate positive epistemic stability, `\Sigma_r=0` marks maximal epistemic instability, and negative values indicate increasingly consolidated negative epistemic stability toward collapse.

For every surface-eligible referent `r\in\mathcal R_{\partial}`:

```math
\sigma(r)
:=
\left(
\Delta_r(E,P),
\Sigma_r,
\Delta_r(W,K)
\right).
```

Define represented completion magnitude:

```math
\mathcal C(r)
:=
|\Delta_r(E,P)|+|\Sigma_r|+|\Delta_r(W,K)|.
```

A completed EO orientation satisfies:

```math
\boxed{
|\Delta_r(E,P)|+|\Sigma_r|+|\Delta_r(W,K)|=1.
}
```

The numerical value `1` is the coordinate scale of completed representation. It is not a finite psychological stock of traits.

If `\mathcal C(r)<1`, the description is underresolved rather than a completed worldview coordinate. The underdetermination may belong to the evaluator's specification or, when it belongs to the referent itself, to a real state of formation or re-formation. If `\mathcal C(r)>1`, the triple is incompatible with the completed coordinate semantics. Neither case is repaired by normalizing the triple outward.

## Plot domain and plotting map

Let:

- `\mathcal W_0` be whole-agent referents prior to worldview formation;
- `\mathcal W_f` be formed whole-worldview referents;
- `\mathcal B` be plot-eligible bounded referents;
- `\mathcal R_{\partial}:=\mathcal W_f\cup\mathcal B`;
- `\mathcal R_{\Phi}:=\mathcal W_0\cup\mathcal R_{\partial}`.

Then:

```math
\boxed{
\Phi:\mathcal R_{\Phi}\longrightarrow\{O\}\cup\partial\mathbb O,
\qquad
\Phi(r):=
\begin{cases}
O,&r\in\mathcal W_0,\\[4pt]
\sigma(r),&r\in\mathcal R_{\partial}.
\end{cases}}
```

For every surface-eligible referent:

```math
r\in\mathcal R_{\partial}
\Longrightarrow
\Phi(r)=(x_r,y_r,z_r)\in\partial\mathbb O,
\qquad
|x_r|+|y_r|+|z_r|=1.
```

A bounded referent does not map to the null origin merely because it is not itself a worldview. Lack of evaluator knowledge also does not map a referent to the origin.

## Fixed directional semantics

```math
(+x,-x,+z,-z,+y,-y)=(E,P,W,K,S^{+},S^{-}).
```

Equivalently:

```text
+x = Empathy                 -x = Practicality
+z = Wisdom                  -z = Knowledge
+y = positive stability      -y = negative stability
```

## Distinguished reference states

```math
\begin{aligned}
O=(0,0,0)&:=\text{pre-philosophical null},\\
M=(0,1,0)&:=\text{mature integration under maximal positive stability},\\
C=(0,-1,0)&:=\text{epistemic collapse}.
\end{aligned}
```

At the peak, `y=1` and the surface equation forces `x=z=0`. The unique point of maximal positive epistemic stability is therefore also the unique point of zero unresolved lateral displacement under positive reality-governed integration.

## Structural reality-friction and answerability display

For any completed surface coordinate `p=(x,y,z)`:

```math
F_R(p):=|x|+|z|=1-|y|
```

is total unresolved lateral displacement, or structural reality-friction in the explanatory reading.

A normalized display coordinate for vertical reality-answerability is:

```math
A_R(p):=\frac{y+1}{2}.
```

Therefore:

```math
F_R(p)=1-|2A_R(p)-1|.
```

This is a derived projection of the existing EO surface relation. It introduces no new coordinate.

## Structural closure and objective dominance

Let the necessary function set be:

```math
\mathfrak F:=\{E,P,K,W,S\}.
```

A proposed maturity-relevant feature is already structurally represented when its philosophical effect changes one or more members of `\mathfrak F`. A genuinely additional EO dimension would have to establish a further function that is both necessary to formed worldview reasoning and irreducible to every member of `\mathfrak F`.

The Five-Function Invariance Test gives the falsification condition: if two worldview orientations are identical across all five functions and one is nevertheless genuinely philosophically superior to the other relative to the declared referent, the five-function exhaustion claim is false.

Objective dominance is non-loss plus correction: for a fixed referent, a judgment objectively dominates another when it preserves every maturity-relevant success of the other, corrects at least one additional maturity-relevant failure, and introduces no offsetting maturity-relevant failure.

## Evidence-warranted identification

For referent `r` and evidence `e`:

```math
\Omega(r\mid e)
```

denotes the set of EO positions still compatible with the established evidence under the fixed semantics.

An exact point may be reported only when:

```math
\Omega(r\mid e)=\{p\}
```

for a single `p`. Otherwise the warranted output is a faithful region, face, sign constraint, vertical gate interval, or underdetermined result. Additional sound evidence can narrow `\Omega(r\mid e)` without changing the referent's actual structural location.

## Contextual emphasis

Visible or operative contextual emphasis is distinct from structural displacement. Unequal use of empathy, practicality, wisdom, or knowledge in a particular context does not by itself move a mature referent away from the peak. Departure requires a materially relevant pressure to be absent, suppressed, distorted, or insulated from correction.

## Source and authority

- [Canonical paper on Zenodo](https://doi.org/10.5281/zenodo.22164942)
- [Canonical status and challenge standard](CANONICAL_STATUS.md)
- [Open downstream instrumentation policy](EO_INSTRUMENTATION_POLICY.md)
- [Conformance requirements](CONFORMANCE.md)

The rendered equations above use GitHub's mathematical-expression syntax. The DOI-bearing paper remains authoritative.