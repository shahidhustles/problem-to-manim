# Indian NCERT Class 10 Foundation Baseline

This document defines the foundational knowledge baseline for JEE/NEET problem-solving mode. When building solution trees, **STOP** prerequisite/concept recursion at this level - assume students have solid understanding of these concepts from Indian NCERT Class 10 curriculum.

## Purpose

In JEE/NEET problem-solving mode, the **SolutionExplorer agent** (Agent 2) must know when to STOP looking for deeper prerequisites. This baseline represents what a student preparing for competitive exams is expected to know without further derivation.

**Foundation Detection Rule**: If a concept or formula appears in this document, do NOT recursively explore its prerequisites. Treat it as foundational.

---

## Physics Foundations

### 1. Motion in a Straight Line

**Concepts**:

- Displacement, velocity, acceleration
- Uniform and non-uniform motion
- Distance vs displacement, speed vs velocity

**Equations of Motion** (for constant acceleration):

```latex
v = u + at
s = ut + \frac{1}{2}at^2
v^2 = u^2 + 2as
```

Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement

**Graphical Analysis**:

- Position-time graphs (slope = velocity)
- Velocity-time graphs (slope = acceleration, area = displacement)

### 2. Force and Newton's Laws

**Newton's Three Laws**:

1. **First Law**: Object at rest stays at rest, object in motion stays in motion (unless external force acts)
2. **Second Law**: F = ma (Force = mass × acceleration)
3. **Third Law**: Action and reaction forces are equal and opposite

**Concepts**:

- Inertia, momentum (p = mv)
- Friction (static and kinetic)
- Weight = mg

### 3. Work, Energy, and Power

**Definitions**:

- Work: W = F × s × cos(θ) (force component in direction of displacement)
- Energy: Capacity to do work
- Power: P = W/t (rate of doing work)

**Types of Energy**:

- Kinetic Energy: KE = ½mv²
- Potential Energy (gravitational): PE = mgh
- **Law of Conservation of Energy**: Total energy remains constant in an isolated system

**Work-Energy Theorem**: Work done = Change in kinetic energy

### 4. Electricity

**Ohm's Law**:

```latex
V = IR
```

Where: V = potential difference (voltage), I = current, R = resistance

**Resistance**:

- Depends on material, length, cross-sectional area: R = ρL/A
- **Series combination**: R_total = R₁ + R₂ + R₃ + ...
- **Parallel combination**: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...

**Electrical Power**:

```latex
P = VI = I^2R = V^2/R
```

**Electrical Energy**:

```latex
E = P \times t = VIt
```

### 5. Light - Reflection and Refraction

**Laws of Reflection**:

- Angle of incidence = Angle of reflection
- Incident ray, reflected ray, and normal lie in the same plane

**Mirror Formula**:

```latex
\frac{1}{f} = \frac{1}{v} + \frac{1}{u}
```

Where: f = focal length, v = image distance, u = object distance

**Magnification**:

```latex
m = \frac{h'}{h} = \frac{v}{u}
```

**Snell's Law** (Refraction):

```latex
n_1 \sin\theta_1 = n_2 \sin\theta_2
```

Where: n = refractive index, θ = angle with normal

**Lens Formula** (same as mirror formula):

```latex
\frac{1}{f} = \frac{1}{v} - \frac{1}{u}
```

---

## Mathematics Foundations

### 1. Real Numbers

**Concepts**:

- Rational and irrational numbers
- Euclid's division algorithm
- Fundamental theorem of arithmetic (prime factorization)
- HCF (GCD) and LCM

### 2. Polynomials

**Quadratic Polynomial**: ax² + bx + c = 0 (a ≠ 0)

**Quadratic Formula**:

```latex
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

**Discriminant**: Δ = b² - 4ac

- Δ > 0: Two distinct real roots
- Δ = 0: One repeated real root
- Δ < 0: No real roots (complex roots)

**Relationship Between Roots and Coefficients**:

- Sum of roots: α + β = -b/a
- Product of roots: αβ = c/a

**Factorization Methods**:

- Middle term splitting
- Completing the square
- Using quadratic formula

### 3. Linear Equations

**Two Variables**: ax + by = c

**Methods of Solution**:

- Graphical method (intersection of lines)
- Substitution method
- Elimination method
- Cross-multiplication method

### 4. Trigonometry

**Basic Trigonometric Ratios** (for right triangle):

```latex
\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}}, \quad \cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}}, \quad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}
```

```latex
\csc\theta = \frac{1}{\sin\theta}, \quad \sec\theta = \frac{1}{\cos\theta}, \quad \cot\theta = \frac{1}{\tan\theta}
```

**Fundamental Identity**:

```latex
\sin^2\theta + \cos^2\theta = 1
```

**Other Identities**:

```latex
1 + \tan^2\theta = \sec^2\theta
```

```latex
1 + \cot^2\theta = \csc^2\theta
```

**Standard Angle Values** (must be memorized):

| θ     | 0°  | 30°  | 45°  | 60°  | 90° |
| ----- | --- | ---- | ---- | ---- | --- |
| sin θ | 0   | 1/2  | 1/√2 | √3/2 | 1   |
| cos θ | 1   | √3/2 | 1/√2 | 1/2  | 0   |
| tan θ | 0   | 1/√3 | 1    | √3   | ∞   |

### 5. Coordinate Geometry

**Distance Formula** (between two points):

```latex
d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
```

**Section Formula** (point dividing line segment in ratio m:n):

```latex
x = \frac{mx_2 + nx_1}{m + n}, \quad y = \frac{my_2 + ny_1}{m + n}
```

**Midpoint Formula**:

```latex
x = \frac{x_1 + x_2}{2}, \quad y = \frac{y_1 + y_2}{2}
```

**Area of Triangle** (vertices at (x₁,y₁), (x₂,y₂), (x₃,y₃)):

```latex
A = \frac{1}{2} |x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|
```

### 6. Geometry

**Pythagoras Theorem**:

```latex
(\text{hypotenuse})^2 = (\text{base})^2 + (\text{perpendicular})^2
```

**Similar Triangles**:

- Corresponding angles are equal
- Corresponding sides are proportional
- AAA, SAS, SSS similarity criteria

**Thales' Theorem** (Basic Proportionality Theorem):
If a line is drawn parallel to one side of a triangle, it divides the other two sides proportionally.

**Circle Properties**:

- Tangent perpendicular to radius at point of contact
- Equal chords subtend equal angles at center
- Angle in semicircle = 90°

### 7. Mensuration (Area and Volume)

**Areas**:

- Square: a²
- Rectangle: l × w
- Triangle: ½ × base × height
- Circle: πr²
- Sector: (θ/360°) × πr²

**Volumes**:

- Cube: a³
- Cuboid: l × w × h
- Cylinder: πr²h
- Cone: (1/3)πr²h
- Sphere: (4/3)πr³

**Surface Areas**:

- Cube: 6a²
- Cylinder: 2πr(r + h)
- Cone: πr(r + l), where l = slant height
- Sphere: 4πr²

---

## Chemistry Foundations

### 1. Mole Concept

**Avogadro's Number**:

```latex
N_A = 6.022 \times 10^{23} \text{ particles/mole}
```

**Mole Definition**:

- 1 mole = Molar mass in grams = 6.022×10²³ particles

**Key Relationships**:

```latex
\text{Number of moles (n)} = \frac{\text{Mass (m)}}{\text{Molar mass (M)}} = \frac{\text{Number of particles (N)}}{N_A}
```

**Molar Mass**: Sum of atomic masses of all atoms in a molecule (in g/mol)

- Example: H₂O → M = 2(1) + 16 = 18 g/mol

### 2. Chemical Reactions and Equations

**Law of Conservation of Mass**: Mass is neither created nor destroyed in a chemical reaction

**Balancing Chemical Equations**:

- Same number of atoms of each element on both sides
- Coefficients (not subscripts) are adjusted

**Types of Reactions**:

- Combination: A + B → AB
- Decomposition: AB → A + B
- Displacement: A + BC → AC + B
- Double Displacement: AB + CD → AD + CB
- Redox: Involving oxidation and reduction

### 3. Stoichiometry Basics

**Mole Ratio**: From balanced equation coefficients

- Example: 2H₂ + O₂ → 2H₂O
  - Mole ratio: H₂ : O₂ : H₂O = 2 : 1 : 2

**Mass-Mole-Particles Conversions**:

```
Mass (g) ←→ Moles (n) ←→ Particles (N)
  ÷M      ×M      ÷Nₐ    ×Nₐ
```

### 4. Periodic Table and Atomic Structure

**Periodic Trends** (NCERT Class 10 level):

- **Atomic size**: Decreases across period, increases down group
- **Metallic character**: Decreases across period, increases down group
- **Valency**: Varies across period (1,2,3,4,3,2,1,0 for main groups)

**Electronic Configuration** (first 20 elements):

- K, L, M, N shells (2, 8, 8, 2 for first 20)
- Valence electrons determine chemical properties

**Valency**: Number of electrons lost, gained, or shared

- Group 1: Valency 1 (lose 1 electron)
- Group 2: Valency 2 (lose 2 electrons)
- Group 17: Valency 1 (gain 1 electron)
- Group 18: Valency 0 (stable, noble gases)

### 5. Chemical Bonding (Basics)

**Ionic Bonding**: Transfer of electrons (metal + non-metal)

- Example: NaCl (Na⁺ + Cl⁻)

**Covalent Bonding**: Sharing of electrons (non-metal + non-metal)

- Example: H₂, O₂, H₂O, CO₂

**Properties**:

- Ionic compounds: High melting point, conduct electricity in solution
- Covalent compounds: Lower melting point, usually don't conduct electricity

### 6. Acids, Bases, and Salts

**Definitions**:

- **Acid**: Produces H⁺ ions in water (e.g., HCl, H₂SO₄, HNO₃)
- **Base**: Produces OH⁻ ions in water (e.g., NaOH, KOH)

**pH Scale**:

- pH < 7: Acidic
- pH = 7: Neutral
- pH > 7: Basic (Alkaline)

**Neutralization**:

```latex
\text{Acid} + \text{Base} \rightarrow \text{Salt} + \text{Water}
```

Example: HCl + NaOH → NaCl + H₂O

**Common Acids and Bases**:

- Acids: HCl (hydrochloric), H₂SO₄ (sulfuric), HNO₃ (nitric), CH₃COOH (acetic)
- Bases: NaOH (sodium hydroxide), Ca(OH)₂ (calcium hydroxide), NH₄OH (ammonium hydroxide)

---

## Biology Foundations (NEET-specific)

### 1. Cell Structure

**Basic Components**:

- Cell membrane (selectively permeable)
- Cytoplasm
- Nucleus (contains DNA)
- Mitochondria (powerhouse of cell)
- Chloroplasts (in plant cells, photosynthesis)

**Plant vs Animal Cells**:

- Plant cells: Cell wall, chloroplasts, large vacuole
- Animal cells: No cell wall, no chloroplasts, small vacuoles

### 2. Life Processes (Basic)

**Nutrition**:

- Autotrophic (plants - photosynthesis)
- Heterotrophic (animals - ingestion)

**Respiration**:

- Aerobic: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)
- Anaerobic: Glucose → Lactic acid (in muscles) or Ethanol + CO₂ (in yeast)

**Transportation**:

- Blood circulatory system (heart, blood vessels)
- Xylem and phloem (in plants)

### 3. Heredity and Evolution (Basic)

**Mendel's Laws** (basic understanding):

- Law of Dominance
- Law of Segregation

**DNA and Genes**:

- DNA carries genetic information
- Genes are units of inheritance
- Chromosomes contain DNA

---

## How to Use This Baseline

### For Agent 2 (SolutionExplorer)

When building a solution tree:

1. **Identify concepts/formulas used in each solution step**
2. **Check if they appear in this document**:
   - **YES** → Mark as `is_foundation: true`, do NOT explore prerequisites further
   - **NO** → This is an advanced concept, may need brief explanation in the "Explaining Phase" (30% of time)

3. **Example**:
   - Problem uses: v² = u² + 2as
   - Check this document → Found in "Equations of Motion"
   - Action: Mark as foundation, no need to derive this equation
   - In explaining phase: Just say "Using the equation of motion for constant acceleration"

### For Agent 5 (SolutionComposer)

When composing explanations:

1. **Foundation concepts**: Reference with "NCERT Class 10 [topic]"
   - Example: "Using NCERT Class 10 trigonometry, sin(30°) = 1/2"

2. **Advanced concepts**: Provide brief explanation
   - Example: "We use vector resolution here - breaking a single vector into perpendicular components makes calculations easier"

### For Agent 3 (MathematicalEnricher)

When enriching solution steps:

1. **Foundation formulas**: State directly without derivation
2. **Advanced formulas**: Include brief justification or reference to foundation

---

## Exam-Specific Additions

### JEE Main/Advanced

Students are expected to know:

- All of the above NCERT Class 10 content
- NCERT Class 11-12 concepts (not covered here - those will need explanation)

### NEET

Students are expected to know:

- Physics and Chemistry from above
- Biology basics from above
- NCERT Class 11-12 Biology (not covered here)

---

## Version and Updates

**Current Version**: Based on NCERT Class 10 curriculum (2023-24)

If NCERT curriculum changes, this document should be updated accordingly to reflect the current standard.
