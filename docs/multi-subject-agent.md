
# Plan: Extend Manim-AI for Chemistry & Biology (JEE/NEET Support)

## Summary

Extend the existing six-agent Math-to-Manim pipeline to support chemistry and biology visualizations for JEE/NEET students while maintaining backward compatibility with existing math/physics content.

**Key Decision**: Rename `MathematicalEnricher` (Agent 3) to `ContentEnricher` and make it **domain-aware** through prompt engineering. This maintains the six-agent architecture, preserves backward compatibility, and leverages the LLM's existing chemistry/biology knowledge.

## Why This Works

1. **Manim has excellent built-in capabilities** for chemistry/biology:
   - 3D objects (Sphere, Cylinder) for molecules
   - LaTeX support with mhchem package for chemical equations
   - Basic shapes (Circle, Line, Arrow) for biological diagrams
   - No special libraries needed - focus on schematic/diagrammatic approach

2. **Current architecture is well-suited**:
   - PrerequisiteExplorer already works for chemistry/biology concepts
   - Just need to extend ContentEnricher to output domain-specific structures
   - CodeGenerator can use new pattern libraries for visualization

3. **JEE/NEET syllabus is appropriate for this approach**:
   - Emphasis on conceptual understanding, not ultra-realistic 3D
   - Schematic diagrams are pedagogically superior for learning
   - Chemistry: reactions, mechanisms, structures
   - Biology: cellular processes, anatomy, molecular biology

---

## Implementation Approach

### Domain-Aware ContentEnricher Strategy

The enricher will detect domain from ConceptAnalyzer output and adapt its enrichment:

- **Chemistry**: Output `chemical_equations` (mhchem LaTeX), `molecular_structures`, `reaction_mechanisms`
- **Biology**: Output `biological_processes`, `diagrams`, `cellular_components`
- **Math/Physics**: Output `equations` (traditional LaTeX) - **unchanged from current behavior**
- **Biochemistry**: Output both chemistry and biology structures (hybrid mode)

### JSON Schema Extensions

```typescript
// NEW: Chemistry enrichment structures
interface ChemicalEquation {
  latex: string;                    // e.g., "\ce{H2O + CO2 -> H2CO3}"
  type: "balanced" | "mechanism" | "equilibrium" | "redox";
  reactants: string[];
  products: string[];
  conditions?: string;
}

interface MolecularStructure {
  name: string;
  representation: "skeletal" | "ball-and-stick" | "lewis";
  key_features: string[];
  coordinates_2d?: { atoms: [], bonds: [] };  // For schematic 2D
}

// NEW: Biology enrichment structures
interface BiologicalProcess {
  name: string;
  type: "metabolic" | "cellular" | "molecular" | "physiological";
  stages: Array<{
    name: string;
    description: string;
    inputs?: string[];
    outputs?: string[];
    key_enzymes?: string[];
  }>;
}

interface DiagramSpec {
  type: "cell_diagram" | "organ_system" | "molecular_diagram" | "cycle";
  components: Array<{ name, description, position, connections }>;
  arrows: Array<{ from, to, type, label }>;
}
```

---

## Implementation Steps

### Phase 1: Chemistry Foundation (Priority 1)

**Goal**: Enable chemistry equation rendering and visualization patterns

#### Step 1.1: Create Chemistry LaTeX Guide
- **File**: `/template/math-to-manim/chemistry-latex-guide.md` (NEW)
- **Content**:
  - mhchem package usage reference
  - Chemical formulas: `\ce{H2O}`, `\ce{H2SO4}`
  - Chemical equations: `\ce{2H2 + O2 -> 2H2O}`
  - Reaction arrows: `\ce{A <-> B}`, `\ce{A ->[catalyst] B}`
  - States: `\ce{NaCl (s)}`, `\ce{H2O (l)}`
  - Common JEE reactions (organic, inorganic, physical chemistry)

#### Step 1.2: Create Chemistry Patterns
- **File**: `/template/math-to-manim/chemistry-patterns.md` (NEW)
- **Content**:
  - **Molecular structure visualization**: Using VGroup for atoms/bonds, skeletal formulas, ball-and-stick models
  - **Reaction animation patterns**: Arrow animations for mechanisms, energy diagrams, electron movement
  - **Chemical equation display**: Using mhchem with MathTex, balancing animations
  - **Code examples**: `create_molecule()`, `create_energy_diagram()`, `create_benzene_ring()`

#### Step 1.3: Extend Manim Code Patterns
- **File**: `/template/math-to-manim/manim-code-patterns.md` (MODIFY)
- **Location**: After line 109 (after "Avoid Unicode Symbols in LaTeX")
- **Add**:
  - mhchem usage section with examples
  - Chemical equation rendering patterns
  - Fallback strategies if mhchem unavailable
  - Chemistry visualization examples (benzene ring, energy diagram)

---

### Phase 2: Agent 3 Update - ContentEnricher (Priority 2)

**Goal**: Make Agent 3 domain-aware to handle chemistry, biology, and math/physics

#### Step 2.1: Update Agent 3 Prompt
- **File**: `/template/math-to-manim/agent-system-prompts.md` (MODIFY)
- **Location**: Lines 81-127 (replace entire Agent 3 section)
- **Changes**:
  - Rename from "MathematicalEnricher" to "ContentEnricher"
  - Add domain detection logic:
    - Chemistry: domain contains "chemistry", "chemical", "organic", "inorganic", "reaction"
    - Biology: domain contains "biology", "cell", "anatomy", "physiology"
    - Biochemistry: hybrid mode
    - Else: mathematics/physics (unchanged behavior)
  - Add chemistry enrichment schema (chemical_equations, molecular_structures, definitions, interpretation, example)
  - Add biology enrichment schema (biological_processes, diagrams, definitions, interpretation, example)
  - Add example JSON outputs for each domain

#### Step 2.2: Update SKILL.md
- **File**: `/template/math-to-manim/SKILL.md` (MODIFY)
- **Location**: Lines 41-46 (Agent 3 section)
- **Changes**:
  - Update agent name to "ContentEnricher"
  - Add note: "Detects domain (math/physics/chemistry/biology) and provides appropriate enrichment"
  - Reference chemistry-patterns.md and biology-patterns.md

#### Step 2.3: Update System Prompt
- **File**: `/src/agent/system-prompt.ts` (MODIFY)
- **Location**: Lines 11-23 (workflow documentation)
- **Changes**:
  - Update Agent 3 description to "ContentEnricher"
  - Add references to new pattern files:
    - `template/math-to-manim/chemistry-patterns.md` (if chemistry topic)
    - `template/math-to-manim/biology-patterns.md` (if biology topic)
    - `template/math-to-manim/chemistry-latex-guide.md` (if chemistry topic)
  - Add references to new example topics

---

### Phase 3: Chemistry Example - SN2 Mechanism (Priority 3)

**Goal**: Create complete working example demonstrating chemistry pipeline

#### Step 3.1: Create SN2 Example Directory
- **Directory**: `/template/math-to-manim/examples/sn2-mechanism/` (NEW)

#### Step 3.2: Create Example Files

**File 1**: `input.md`
```markdown
# User Request
"Explain the SN2 mechanism with an animation showing backside attack"

# ConceptAnalyzer Output
{
  "core_concept": "SN2 reaction mechanism",
  "domain": "chemistry/organic chemistry",
  "level": "intermediate",
  "goal": "Understand nucleophilic substitution with backside attack and inversion"
}

# Knowledge Tree Structure
SN2 mechanism (depth 0)
├─ nucleophile (depth 1)
│   ├─ Lewis base (depth 2) [FOUNDATION]
│   └─ negative charge (depth 2) [FOUNDATION]
├─ electrophile (depth 1)
│   ├─ Lewis acid (depth 2) [FOUNDATION]
│   └─ leaving group (depth 2) [FOUNDATION]
├─ backside attack (depth 1)
│   └─ orbital overlap (depth 2) [FOUNDATION]
└─ configuration inversion (depth 1)
    └─ stereochemistry (depth 2) [FOUNDATION]
```

**File 2**: `knowledge-tree.json`
- Complete enriched knowledge tree with chemical_equations for each node
- Example:
  ```json
  {
    "concept": "SN2 mechanism",
    "domain": "chemistry",
    "chemical_equations": [
      {
        "latex": "\\ce{CH3CH2Br + OH- -> CH3CH2OH + Br-}",
        "type": "SN2",
        "reactants": ["CH3CH2Br", "OH-"],
        "products": ["CH3CH2OH", "Br-"]
      }
    ],
    "molecular_structures": [...],
    "definitions": {...}
  }
  ```

**File 3**: `verbose-prompt.txt`
- Scene-by-scene animation description (2000+ tokens)
- Example scene: "Display nucleophile (OH-) in RED at LEFT, show electrophile (CH3CH2Br) as ball-and-stick model at CENTER, animate CurvedArrow for backside attack..."

**File 4**: `output.py`
- Working Manim code generated from the verbose prompt
- Uses mhchem for chemical equations
- Uses chemistry patterns for molecular structures

---

### Phase 4: Biology Support (Priority 4)

**Goal**: Enable biology visualizations with same approach

#### Step 4.1: Create Biology Patterns
- **File**: `/template/math-to-manim/biology-patterns.md` (NEW)
- **Content**:
  - **Cell diagrams**: Organelle representation (schematic), labeled components, membrane structures
  - **Process flow diagrams**: Multi-stage processes, cyclical processes, linear pathways
  - **Molecular biology animations**: DNA structure (double helix schematic), protein synthesis, enzyme-substrate
  - **Code examples**: `create_mitochondrion()`, `create_process_flow()`, `create_dna_helix()`

#### Step 4.2: Update Agent 3 for Biology
- **File**: `/template/math-to-manim/agent-system-prompts.md` (MODIFY)
- **Location**: Agent 3 section (already modified in Phase 2)
- **Add**: Biology enrichment schema and example outputs (if not already added)

#### Step 4.3: Update Verbose Prompt Format
- **File**: `/template/math-to-manim/verbose-prompt-format.md` (MODIFY)
- **Location**: End of file (after existing examples)
- **Add**:
  - Chemistry scene example (SN2 mechanism - showing electron arrows, energy diagram)
  - Biology scene example (DNA replication - showing helicase, polymerase, base pairing)

---

### Phase 5: Biology Example - DNA Replication (Priority 5)

**Goal**: Create complete working example demonstrating biology pipeline

#### Step 5.1: Create DNA Replication Example
- **Directory**: `/template/math-to-manim/examples/dna-replication/` (NEW)
- **Files**: Similar structure to SN2 example
  - `input.md`: User request for DNA replication
  - `knowledge-tree.json`: Enriched with biological_processes, diagrams
  - `verbose-prompt.txt`: Scene descriptions for DNA unwinding, base pairing, etc.
  - `output.py`: Manim code with DNA helix, enzyme animations

**Key concepts to demonstrate**:
- DNA double helix structure (schematic, not realistic)
- Helicase unwinding
- DNA polymerase III synthesis
- Leading vs. lagging strand
- Semi-conservative replication

---

### Phase 6: Integration & Testing (Priority 6)

**Goal**: Ensure all domains work correctly and backward compatibility is preserved

#### Step 6.1: Test Existing Math/Physics
- Run existing pythagorean-theorem example end-to-end
- Verify identical output before and after changes
- Ensure Agent 3 still produces `equations` (not chemical_equations) for math topics

#### Step 6.2: Test Chemistry Pipeline
- Run SN2 mechanism example through full pipeline
- Verify chemical_equations are generated
- Verify mhchem LaTeX renders correctly
- Verify Manim code executes and produces animation

#### Step 6.3: Test Biology Pipeline
- Run DNA replication example through full pipeline
- Verify biological_processes are generated
- Verify diagram specifications are correct
- Verify Manim code produces clear educational animation

#### Step 6.4: Test Biochemistry (Hybrid)
- Create glycolysis example (optional)
- Verify both chemical_equations AND biological_processes are generated
- Tests hybrid enrichment mode

---

## Critical Files Summary

### Files to CREATE

| File | Purpose | Size |
|------|---------|------|
| `/template/math-to-manim/chemistry-latex-guide.md` | mhchem LaTeX reference for JEE chemistry | ~200 lines |
| `/template/math-to-manim/chemistry-patterns.md` | Manim patterns for chemistry visualizations | ~400 lines |
| `/template/math-to-manim/biology-patterns.md` | Manim patterns for biology visualizations | ~400 lines |
| `/template/math-to-manim/examples/sn2-mechanism/` | Complete chemistry example (4 files) | ~500 lines total |
| `/template/math-to-manim/examples/dna-replication/` | Complete biology example (4 files) | ~500 lines total |

### Files to MODIFY

| File | Location | Change |
|------|----------|--------|
| `/template/math-to-manim/agent-system-prompts.md` | Lines 81-127 | Replace Agent 3 section with ContentEnricher (domain-aware) |
| `/template/math-to-manim/manim-code-patterns.md` | After line 109 | Add mhchem section and chemistry patterns |
| `/template/math-to-manim/SKILL.md` | Lines 41-46 | Update Agent 3 name and description |
| `/template/math-to-manim/verbose-prompt-format.md` | End of file | Add chemistry and biology scene examples |
| `/src/agent/system-prompt.ts` | Lines 11-23 | Reference new pattern files and examples |

---

## Backward Compatibility Strategy

### Ensuring Existing Math/Physics Topics Work

1. **Agent 3 default behavior unchanged**:
   - When domain is NOT chemistry/biology, behaves identically to current MathematicalEnricher
   - Still outputs: `equations`, `definitions`, `interpretation`, `example`
   - No breaking changes to JSON schema

2. **Conditional pattern loading**:
   - Agent only reads chemistry-patterns.md if domain is chemistry
   - Agent only reads biology-patterns.md if domain is biology
   - Avoids token bloat for math/physics topics

3. **Testing**:
   - Verify pythagorean-theorem example produces identical output
   - Run existing heap-sort or other examples
   - Regression test suite ensures no breaking changes

---

## Example Topics for Demonstration

### Chemistry (JEE)
1. **SN2 Mechanism** (Priority 1 - organic chemistry)
   - Tests: chemical equations, molecular structures, reaction mechanisms, energy diagrams
   - Clear visual narrative: nucleophile attack → transition state → product

2. Acid-base equilibrium (physical chemistry)
3. Electrophilic aromatic substitution (organic chemistry)

### Biology (NEET)
1. **DNA Replication** (Priority 1 - molecular biology)
   - Tests: biological processes, diagrams, cellular components
   - Clear stages: initiation → elongation → termination

2. Cellular respiration (biochemistry - hybrid)
3. Mitosis (cell biology)

---

## Potential Challenges & Mitigations

### Challenge 1: mhchem LaTeX Package
- **Risk**: User's LaTeX distribution might not have mhchem
- **Mitigation**:
  - Document installation in chemistry-latex-guide.md
  - Provide fallback patterns (manual subscripts) in chemistry-patterns.md
  - Add test to verify mhchem availability

### Challenge 2: Biological Diagram Complexity
- **Risk**: Cell diagrams could become too detailed/realistic
- **Mitigation**:
  - Emphasize SCHEMATIC approach in biology-patterns.md
  - Use simple shapes (circles, ellipses, rectangles)
  - Focus on conceptual clarity over anatomical accuracy

### Challenge 3: Domain Ambiguity
- **Risk**: Topics like "electrolysis" could be chemistry or physics
- **Mitigation**:
  - ConceptAnalyzer should provide specific domain
  - If ambiguous, default to most common interpretation

---

## Verification Plan

### End-to-End Testing for Each Domain

**Math/Physics (Existing)**:
```bash
# Test pythagorean theorem example
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "pythagorean theorem"}'

# Verify output contains `equations` (not chemical_equations)
# Verify Manim code renders correctly
python3 generated/{requestId}/pythagorean_theorem_animation.py
```

**Chemistry (New)**:
```bash
# Test SN2 mechanism
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "SN2 nucleophilic substitution mechanism"}'

# Verify output contains `chemical_equations` with mhchem LaTeX
# Verify Manim code includes \ce{...} equations
# Verify molecular structures are rendered
python3 generated/{requestId}/sn2_mechanism_animation.py
```

**Biology (New)**:
```bash
# Test DNA replication
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "DNA replication"}'

# Verify output contains `biological_processes` with stages
# Verify diagram specifications are present
# Verify Manim code creates process flow animations
python3 generated/{requestId}/dna_replication_animation.py
```

### Success Criteria

1. ✅ All existing math/physics examples work identically (backward compatibility)
2. ✅ Chemistry example (SN2) generates working animation with mhchem equations
3. ✅ Biology example (DNA) generates working animation with process diagrams
4. ✅ Agent 3 correctly detects domain and produces appropriate enrichment structure
5. ✅ CodeGenerator uses new pattern libraries to create domain-specific visualizations

---

## Final Notes

This plan extends the Math-to-Manim system to support JEE/NEET chemistry and biology through a **minimal, backward-compatible approach** that:

- **Preserves the six-agent architecture** (no structural changes)
- **Adds domain awareness to Agent 3** (ContentEnricher with conditional logic)
- **Provides chemistry/biology pattern libraries** for CodeGenerator
- **Demonstrates with working examples** (SN2 mechanism, DNA replication)
- **Maintains math/physics functionality** (existing topics unchanged)

**Recommended first implementation**: Focus on Phase 1-3 to validate chemistry support with the SN2 example, then proceed to biology support in Phase 4-5.
