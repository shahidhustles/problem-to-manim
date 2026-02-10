# Reverse Knowledge Tree Algorithm

The Reverse Knowledge Tree is the core innovation that eliminates the need for training data in generating educational animations.

## The Core Insight

Traditional approaches require training on example animations. This system instead uses pure reasoning:

**For any concept X, recursively ask: "What must I understand BEFORE X?"**

This builds a Directed Acyclic Graph (DAG) of knowledge dependencies that naturally produces pedagogically sound content.

## Algorithm Details

### Data Structure: KnowledgeNode

```python
@dataclass
class KnowledgeNode:
    concept: str           # The concept name
    depth: int             # 0 = target, higher = more foundational
    is_foundation: bool    # True if no further prerequisites needed
    prerequisites: List['KnowledgeNode']  # Child nodes

    # Added by enrichment agents
    equations: Optional[List[str]]        # LaTeX equations
    definitions: Optional[Dict[str, str]] # Variable definitions
    visual_spec: Optional[Dict]           # Animation specifications
    narrative: Optional[str]              # Scene description
```

### Exploration Process

```python
async def explore(concept: str, depth: int = 0) -> KnowledgeNode:
    # Check termination conditions
    if depth >= max_depth or is_foundation(concept):
        return KnowledgeNode(
            concept=concept,
            depth=depth,
            is_foundation=True,
            prerequisites=[]
        )

    # Discover prerequisites via LLM
    prerequisites = await discover_prerequisites(concept)

    # Recursively explore each prerequisite
    child_nodes = []
    for prereq in prerequisites:
        child_nodes.append(await explore(prereq, depth + 1))

    return KnowledgeNode(
        concept=concept,
        depth=depth,
        is_foundation=False,
        prerequisites=child_nodes
    )
```

### Foundation Detection

A concept is foundational if a typical high school graduate would understand it without further explanation.

**Examples of foundation concepts:**

- velocity, distance, time, acceleration
- force, mass, energy
- waves, frequency, wavelength
- numbers, addition, multiplication
- basic geometry (points, lines, angles)
- functions, graphs

**Examples of non-foundation concepts:**

- Lorentz transformations
- gauge theory
- differential geometry
- tensor calculus
- quantum operators
- Hilbert spaces

### Prerequisite Discovery Prompt

```
You are an expert educator and curriculum designer.

Your task is to identify the ESSENTIAL prerequisite concepts someone must
understand BEFORE they can grasp a given concept.

Rules:
1. Only list concepts that are NECESSARY for understanding (not just helpful)
2. Order from most to least important
3. Assume high school education as baseline
4. Focus on concepts that enable understanding, not historical context
5. Be specific - prefer "special relativity" over "relativity"
6. Limit to 3-5 prerequisites maximum

Return ONLY a JSON array of concept names.
```

## Caching Strategy

To avoid redundant API calls:

1. **In-memory cache**: Store discovered prerequisites by concept name
2. **Optional Atlas integration**: Use Nomic Atlas for semantic caching and search

```python
async def lookup_prerequisites(concept: str) -> List[str]:
    # Check cache first
    if concept in cache:
        return cache[concept]

    # Check Atlas if enabled
    if atlas_client:
        results = atlas_client.search_similar(concept)
        if exact_match_found(results):
            return results[0].prerequisites

    # Discover via LLM
    prerequisites = await discover_prerequisites(concept)

    # Cache results
    cache[concept] = prerequisites
    if atlas_client:
        atlas_client.store(concept, prerequisites)

    return prerequisites
```

## Tree Traversal for Animation

After building the tree, traverse from leaves (foundations) to root (target):

### Topological Sort

```python
def topological_sort(root: KnowledgeNode) -> List[KnowledgeNode]:
    visited = set()
    result = []

    def dfs(node):
        if node.concept in visited:
            return
        visited.add(node.concept)

        # Visit prerequisites first (foundations)
        for prereq in node.prerequisites:
            dfs(prereq)

        # Then add this node
        result.append(node)

    dfs(root)
    return result  # Foundation -> Target order
```

This ensures:

- Foundation concepts appear first in animation
- Each concept builds on previously explained ones
- Viewers have necessary background before advanced topics

## Configuration Options

| Parameter           | Default | Description                                  |
| ------------------- | ------- | -------------------------------------------- |
| `max_depth`         | 4       | Maximum tree depth before forcing foundation |
| `max_prerequisites` | 5       | Maximum prerequisites per concept            |
| `cache_enabled`     | True    | Use in-memory caching                        |
| `atlas_enabled`     | False   | Use Nomic Atlas for persistent caching       |

## Example Tree

**Input**: "Explain quantum tunneling"

**Generated Tree**:

```
quantum tunneling (depth 0)
├─ wave-particle duality (depth 1)
│   ├─ de Broglie wavelength (depth 2) [FOUNDATION]
│   └─ Heisenberg uncertainty principle (depth 2)
│       └─ wave function (depth 3) [FOUNDATION]
├─ Schrödinger equation (depth 1)
│   ├─ wave function (depth 2) [FOUNDATION]
│   └─ potential energy (depth 2) [FOUNDATION]
└─ potential barriers (depth 1) [FOUNDATION]
```

**Animation Order** (after topological sort):

1. de Broglie wavelength
2. wave function
3. Heisenberg uncertainty principle
4. wave-particle duality
5. potential energy
6. potential barriers
7. Schrödinger equation
8. quantum tunneling

Each concept builds on what came before, creating a natural learning progression.

---

## Solution Trees (Problem-Solving Mode)

When operating in **problem-solving mode** for JEE/NEET problems, the system builds a **solution tree** instead of a prerequisite knowledge tree. This represents the STEPS to solve a problem, not the prerequisite CONCEPTS.

### Key Differences

| Aspect              | Knowledge Tree (Teaching)            | Solution Tree (Problem-Solving)        |
| ------------------- | ------------------------------------ | -------------------------------------- |
| **Nodes represent** | Concepts to understand               | Solution steps to execute              |
| **Edges represent** | "Prerequisite for" relationships     | "Depends on previous step"             |
| **Foundation**      | High school concepts                 | Given values + NCERT Class 10 formulas |
| **Goal**            | Build understanding from basics      | Reach the answer from given data       |
| **Traversal**       | Foundation concepts → target concept | Given values → final answer            |

### Data Structure: SolutionNode

```python
@dataclass
class SolutionNode:
    step_number: int                      # Sequential ID (1, 2, 3, ...)
    operation: str                        # Type: "identify_given", "decompose", "apply_formula", "substitute", "solve_equation", "simplify", "verify"
    equation_before: str                  # LaTeX equation BEFORE this step
    equation_after: str                   # LaTeX equation AFTER this step
    concept_used: str                     # Which concept enables this step (NCERT Class 10 or advanced)
    visual_directive: str                 # How to visualize this step (problem-specific)
    prerequisites: List[int]              # Step numbers that must complete BEFORE this step

    # Added by enrichment agents
    variable_types: Optional[Dict[str, str]]  # Mark variables as "given"/"derived"/"unknown"
    numerical_values: Optional[Dict]          # Numbers with units
    color_spec: Optional[Dict]                # Color coding for this step
```

### Solution Tree Exploration Process

```python
async def explore_solution(problem: Dict, depth: int = 0) -> List[SolutionNode]:
    """
    Build solution tree by working BACKWARDS from answer to given values.

    Args:
        problem: {given: dict, find: list, constraints: list}
        depth: recursion depth (safety check)

    Returns:
        List of SolutionNode in dependency order
    """
    steps = []

    # Identify what we need to find
    for unknown in problem['find']:
        # Work backwards: "What do I need to calculate THIS?"
        dependencies = await discover_calculation_path(unknown, problem)

        for dep in dependencies:
            # Stop when reaching:
            # 1. Given values from problem
            # 2. NCERT Class 10 foundation formulas (no need to derive)
            if is_given(dep, problem) or is_ncert_foundation_formula(dep):
                continue

            # Recursively explore how to calculate this dependency
            sub_steps = await explore_solution(dep, depth + 1)
            steps.extend(sub_steps)

    # Reverse order to get forward solution path
    return topological_sort_forward(steps)
```

### Foundation Detection for JEE/NEET

Foundation concepts for problem-solving mode are defined in `ncert-class10-foundation.md`. These include:

**Physics Formulas** (use directly, no derivation):

- Equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as
- Newton's second law: F = ma
- Work-energy: W = Fs, KE = ½mv², PE = mgh
- Ohm's law: V = IR
- Mirror/Lens formula: 1/f = 1/v ± 1/u

**Chemistry Formulas**:

- Mole concept: n = m/M
- Stoichiometry from balanced equations

**Mathematics Formulas**:

- Quadratic formula: x = (-b ± √(b²-4ac)) / 2a
- Trigonometric ratios: sin θ = opp/hyp, etc.
- Distance formula: d = √((x₂-x₁)² + (y₂-y₁)²)
- Pythagoras: c² = a² + b²

**Foundation Detection Rule**:
If a formula/concept appears in `ncert-class10-foundation.md`, mark as `is_foundation: true` and STOP recursion. The LLM should NOT derive these formulas - students are expected to know them.

### Example Solution Tree

**Problem**:

```
A projectile is fired with initial velocity 20 m/s at an angle of 30° with the horizontal.
Given: u = 20 m/s, θ = 30°, g = 10 m/s²
Find: (a) Maximum height, (b) Range
```

**Generated Solution Tree**:

```
Problem: Projectile motion
Given: {u: "20 m/s", θ: "30°", g: "10 m/s²"}
Find: [h_max, R]

Solution Steps (DAG):

Step 1: identify_given
├─ equation_before: "..."
├─ equation_after: "u=20, θ=30°, g=10, find h_max and R"
├─ concept_used: "problem decomposition"
├─ visual_directive: "Display problem, GREEN for given, YELLOW for unknowns"
└─ prerequisites: [] (independent)

Step 2: decompose_velocity
├─ equation_before: "u = 20 m/s at 30°"
├─ equation_after: "u_x = 17.32 m/s, u_y = 10 m/s"
├─ concept_used: "trigonometric resolution (NCERT Class 10)"
├─ visual_directive: "Show vector decomposition with GREEN → ORANGE components"
└─ prerequisites: [1]

Step 3: apply_formula_height
├─ equation_before: "h_max = ?"
├─ equation_after: "h_max = u_y²/(2g)"
├─ concept_used: "kinematic equation (NCERT Class 10 FOUNDATION)"
├─ visual_directive: "Write formula, highlight in BLUE"
└─ prerequisites: [2]

Step 4: substitute_height
├─ equation_before: "h_max = u_y²/(2g)"
├─ equation_after: "h_max = 10²/(2×10) = 5 m"
├─ concept_used: "arithmetic"
├─ visual_directive: "Substitute, simplify, show answer in GOLD"
└─ prerequisites: [3]

Step 5: calculate_time_of_flight
├─ equation_before: "T = ?"
├─ equation_after: "T = 2u_y/g = 2 s"
├─ concept_used: "projectile symmetry (NCERT Class 10 FOUNDATION)"
├─ visual_directive: "Show parabolic trajectory with timer"
└─ prerequisites: [2]

Step 6: calculate_range
├─ equation_before: "R = ?"
├─ equation_after: "R = u_x × T = 34.64 m"
├─ concept_used: "horizontal motion (constant velocity)"
├─ visual_directive: "Multiply, show trajectory with range marked in GOLD"
└─ prerequisites: [2, 5]
```

**Solution Order** (forward execution after topological sort):

1. Identify given values (GREEN) and unknowns (YELLOW)
2. Decompose velocity into components (use NCERT Class 10 trig)
3. Apply kinematic formula for height (FOUNDATION - no derivation)
4. Substitute and solve for h_max → **5 m** (GOLD)
5. Calculate time of flight using symmetry (FOUNDATION)
6. Calculate range using horizontal motion → **34.64 m** (GOLD)

Each step depends on previous results, creating a clear solution progression from given data to final answers.

### Solution Tree vs Knowledge Tree Summary

**Teaching Mode (Knowledge Tree)**:

- Purpose: Explain a concept from first principles
- Structure: Recursive prerequisites (concept dependencies)
- Foundation: High school graduate baseline
- Example node: "Heisenberg uncertainty" depends on "wave function"

**Problem-Solving Mode (Solution Tree)**:

- Purpose: Solve a specific problem step-by-step
- Structure: Solution step dependencies
- Foundation: NCERT Class 10 (see `ncert-class10-foundation.md`)
- Example node: "Calculate h_max" depends on "Decompose velocity" step
