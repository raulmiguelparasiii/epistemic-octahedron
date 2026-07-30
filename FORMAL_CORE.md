# Rendered formal core of the Epistemic Octahedron

**Version 1.0 reader reference**  
**Canonical publication:** [DOI 10.5281/zenodo.21688197](https://doi.org/10.5281/zenodo.21688197)

This document presents the formal semantic kernel of Version 1.0 in rendered form for convenient reading on GitHub. It is an exact reader-facing reference to the canonical paper, not a new version, independent specification, psychometric instrument, or alteration of the theory.

If wording or notation in this reference is ever found to conflict with the DOI-bearing Version 1.0 paper, the paper governs and this reference must be corrected.

## Octahedral state-space

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
\right\},
\\[4pt]
\lVert p\rVert_1
&=|x|+|y|+|z|.
\end{aligned}
```

Only the boundary $\partial\mathbb O$ contains formed-worldview plots. The interior is not plotted space. The origin is reserved for the pre-philosophical null state.

For every nonzero raw interpretive direction $d\in\mathbb R^3\setminus\{0\}$, the canonical $L^1$ ray-projection is:

```math
\boxed{
\Pi(d):=\frac{d}{\lVert d\rVert_1}
}
```

Every nonzero ray from the origin intersects the surface once:

```math
\Pi(d)\in\partial\mathbb O.
```

## Referent-relative semantic functions

For a declared referent $r$:

```math
\begin{aligned}
E_r
&:=
\deg_r(\text{concern for affected persons}),
\\
P_r
&:=
\deg_r(\text{functional demands, execution, and real-world constraint}),
\\
K_r
&:=
\deg_r(\text{informational grasp materially grounding }r),
\\
W_r
&:=
\deg_r(\text{contextual discernment that interprets }K_r,\text{ weighs context, recognizes limits,}
\\
&\qquad\text{preserves proportion, anticipates consequences, and governs application}),
\\
S_r
&:=
\deg_r(\text{coherence, reality-tracking, self-correction, and resistance to delusion under pressure}).
\end{aligned}
```

Here, $\deg_r$ is a latent semantic degree relative to the declared referent. It does not define a finalized measurement scale.

Knowledge and wisdom are reciprocal but non-identical:

```math
K_r\xrightarrow{\mathrm{feeds}}W_r,
\qquad
W_r\xrightarrow{\mathrm{governs}}K_r.
```

## Structural displacement

For two opposed functions $A$ and $B$:

```math
\Delta_r(A,B)\in[-1,1],
\qquad
\Delta_r(A,B)=-\Delta_r(B,A).
```

$\Delta_r(A,B)$ is the signed unresolved structural displacement of $r$ toward $A$ relative to $B$.

```math
\Delta_r(A,B)=0
```

means that no unresolved structural displacement is established. It does not mean that both functions are absent, equally visible, or equally emphasized in every context.

Let $\widetilde S_r\in\mathbb R$ be the signed raw epistemic-stability orientation. The raw interpretive direction is:

```math
d(r)
:=
\left(
\Delta_r(E,P),
\widetilde S_r,
\Delta_r(W,K)
\right).
```

## Formation boundary and plotting map

```math
F(r):=
\begin{cases}
0,&r\text{ has not crossed the worldview-formation boundary},
\\
1,&r\text{ is a formed worldview referent}.
\end{cases}
```

The complete plotting function is:

```math
\boxed{
\Phi(r):=
\begin{cases}
(0,0,0),
&F(r)=0,
\\[6pt]
\Pi(d(r)),
&F(r)=1\text{ and }d(r)\neq(0,0,0).
\end{cases}
}
```

For every formed worldview:

```math
\Phi(r)=(x_r,y_r,z_r)\in\partial\mathbb O,
\qquad
|x_r|+|y_r|+|z_r|=1.
```

## Fixed directional semantics

```math
(+x,-x,+z,-z,+y,-y)
=
(E,P,W,K,S^{+},S^{-}).
```

Equivalently:

```math
\begin{aligned}
+x&=\text{Empathy},
&-x&=\text{Practicality},
\\
+z&=\text{Wisdom},
&-z&=\text{Knowledge},
\\
+y&=\text{positive epistemic stability},
&-y&=\text{negative epistemic stability}.
\end{aligned}
```

## Exceptional reference states

```math
\begin{aligned}
O=(0,0,0)
&:=\text{pre-philosophical null},
\\[4pt]
M=(0,1,0)
&:=\text{mature integration of }E,P,W,K\text{ under maximal positive }S,
\\[4pt]
C=(0,-1,0)
&:=\text{collapse of reality-governed integration and correction}.
\end{aligned}
```

The normalized vertical coordinate is:

```math
y_r
=
\frac{\widetilde S_r}
{|\Delta_r(E,P)|+|\widetilde S_r|+|\Delta_r(W,K)|}.
```

The raw orientation $\widetilde S_r$ and the normalized surface coordinate $y_r$ are not interchangeable quantities.

## Contextual emphasis is not structural displacement

For context $c$:

```math
A(r,c)
:=
\left(
\alpha_E(r,c),
\alpha_P(r,c),
\alpha_W(r,c),
\alpha_K(r,c)
\right),
```

with:

```math
\alpha_i(r,c)\geq0,
\qquad
\alpha_E+\alpha_P+\alpha_W+\alpha_K=1.
```

The visible or operative emphasis distribution is distinct from structural displacement:

```math
A(r,c)
\neq
\left(
\Delta_r(E,P),
\Delta_r(W,K)
\right),
```

and therefore:

```math
\alpha_A(r,c)>\alpha_B(r,c)
\not\Longrightarrow
\Delta_r(A,B)\neq0.
```

A peak-level referent may remain at $M$ under strongly asymmetric contextual emphasis, provided every materially relevant pressure continues to govern:

```math
\boxed{
\Phi(r)=M
\text{ remains warranted under context }c
\iff
\forall q\in\mathcal Q_{r,c},
\;q\text{ continues to govern}.
}
```

Departure from the peak requires an actual displacement condition:

```math
\Phi(r)\neq M
\Longrightarrow
\exists q\in\mathcal Q_{r,c}
\text{ such that }q
\text{ is absent, suppressed, distorted, or insulated from correction}.
```

Mere unequal emphasis, limited information, fallibility, compressed expression, or the possibility of future revision does not by itself establish departure from the peak.

## Source and authority

- [Canonical Version 1.0 PDF](paper/v1.0/Epistemic_Octahedron_Objective_Philosophical_Maturity_v1.0.pdf)
- [Exact LaTeX source](paper/v1.0/main.tex)
- [Canonical status and reciprocal challenge standard](CANONICAL_STATUS.md)
- [Open downstream instrumentation policy](EO_INSTRUMENTATION_POLICY.md)
- [Conformance requirements](CONFORMANCE.md)

The rendered equations above use GitHub's supported mathematical-expression syntax. The underlying equation source remains visible in the raw Markdown and in the canonical LaTeX file.
