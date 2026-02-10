# JEE/NEET Problem-Solving Mode

This document contains ALL problem-solving specific logic for the Math-to-Manim system when operating in JEE/NEET problem-solving mode.

## Mode Comparison

| Aspect                  | Teaching Mode                                        | Problem-Solving Mode                                     |
| ----------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| **Input**               | Concept name (e.g., "quantum tunneling")             | LaTeX problem statement with Given/Find                  |
| **Output Structure**    | Concept tree (prerequisites)                         | Solution tree (steps)                                    |
| **Foundation Baseline** | High school graduate level                           | Indian NCERT Class 10                                    |
| **Primary Flow**        | Foundation → prerequisite → concept                  | Problem → steps → answer                                 |
| **Video Style**         | Pedagogical explanation                              | 70% solving, 30% explaining (interleaved)                |
| **Agent 1**             | **ConceptAnalyzer** - Extract concept, domain, level | **ProblemAnalyzer** - Extract given, find, constraints   |
| **Agent 2**             | **PrerequisiteExplorer** - Recursive prerequisites   | **SolutionExplorer** - Build solution step tree          |
| **Agent 5**             | **NarrativeComposer** - Pedagogical narrative        | **SolutionComposer** - 70/30 solve-explain pattern       |
| **Visuals**             | Generic educational (equations, diagrams)            | Problem-specific (FBD, trajectory, circuit, color-coded) |
| **Color Coding**        | Conceptual emphasis                                  | Given=GREEN, Unknown=YELLOW, Focus=BLUE, Answer=GOLD     |

## Solution Tree Structure

Unlike teaching mode's **concept tree** (prerequisite graph), problem-solving mode uses a **solution tree** (step dependency graph).

### Solution Node Schema

```json
{
  "step_number": int,
  "operation": string,
  "equation_before": string (LaTeX),
  "equation_after": string (LaTeX),
  "concept_used": string,
  "visual_directive": string,
  "prerequisites": [int] (array of step numbers this depends on)
}
```

### Field Descriptions

- **step_number**: Sequential identifier (1, 2, 3...)
- **operation**: Type of mathematical operation
  - `"identify_given"` - Extract given values from problem
  - `"decompose"` - Break vector/complex quantity into components
  - `"apply_formula"` - Use a specific formula or law
  - `"substitute"` - Plug values into equation
  - `"solve_equation"` - Algebraic manipulation to find unknown
  - `"simplify"` - Reduce expression to simpler form
  - `"verify"` - Check answer with alternative method
- **equation_before**: State of equation BEFORE this step (LaTeX with double backslashes)
- **equation_after**: State of equation AFTER this step
- **concept_used**: Which NCERT Class 10+ concept enables this step (e.g., "trigonometric resolution", "quadratic formula")
- **visual_directive**: How to visualize this step in Manim (specific to problem type)
- **prerequisites**: Which previous step numbers must be completed first (empty array `[]` for independent steps)

### Example Solution Tree

```json
{
  "problem": "Projectile motion with u=20m/s, θ=30°, g=10m/s². Find max height, range, time of flight.",
  "mode": "problem-solving",
  "subject": "Physics",
  "topic": "Projectile Motion",
  "steps": [
    {
      "step_number": 1,
      "operation": "identify_given",
      "equation_before": "u = 20 \\text{ m/s}, \\theta = 30°, g = 10 \\text{ m/s}^2",
      "equation_after": "u_x = ?, u_y = ?, h_{max} = ?, R = ?, T = ?",
      "concept_used": "problem decomposition",
      "visual_directive": "Display problem statement. Highlight given values in GREEN boxes. Highlight unknowns in YELLOW boxes.",
      "prerequisites": []
    },
    {
      "step_number": 2,
      "operation": "decompose",
      "equation_before": "\\vec{u} = 20 \\text{ m/s at } 30°",
      "equation_after": "u_x = u \\cos\\theta = 20 \\cos(30°) = 17.32 \\text{ m/s}, \\quad u_y = u \\sin\\theta = 20 \\sin(30°) = 10 \\text{ m/s}",
      "concept_used": "trigonometric resolution of vectors",
      "visual_directive": "Animate vector decomposition. Show initial velocity vector in GREEN splitting into horizontal (ORANGE) and vertical (ORANGE) components with right triangle.",
      "prerequisites": [1]
    },
    {
      "step_number": 3,
      "operation": "apply_formula",
      "equation_before": "h_{max} = ?",
      "equation_after": "h_{max} = \\frac{u_y^2}{2g}",
      "concept_used": "kinematic equation at maximum height (v_y = 0)",
      "visual_directive": "Write formula for maximum height. Highlight it in BLUE. Show brief explanation: 'At max height, vertical velocity = 0'.",
      "prerequisites": [2]
    },
    {
      "step_number": 4,
      "operation": "substitute",
      "equation_before": "h_{max} = \\frac{u_y^2}{2g}",
      "equation_after": "h_{max} = \\frac{(10)^2}{2(10)} = \\frac{100}{20} = 5 \\text{ m}",
      "concept_used": "arithmetic substitution",
      "visual_directive": "Step-by-step substitution. Highlight substituted values in GREEN. Final answer in GOLD box.",
      "prerequisites": [3]
    },
    {
      "step_number": 5,
      "operation": "apply_formula",
      "equation_before": "T = ?",
      "equation_after": "T = \\frac{2u_y}{g}",
      "concept_used": "time of flight for projectile (symmetry of trajectory)",
      "visual_directive": "Write time of flight formula. Show parabolic trajectory with timer animation showing symmetry.",
      "prerequisites": [2]
    },
    {
      "step_number": 6,
      "operation": "substitute",
      "equation_before": "T = \\frac{2u_y}{g}",
      "equation_after": "T = \\frac{2(10)}{10} = 2 \\text{ s}",
      "concept_used": "arithmetic",
      "visual_directive": "Substitute and solve. Final answer in GOLD box.",
      "prerequisites": [5]
    },
    {
      "step_number": 7,
      "operation": "apply_formula",
      "equation_before": "R = ?",
      "equation_after": "R = u_x \\cdot T = 17.32 \\times 2 = 34.64 \\text{ m}",
      "concept_used": "horizontal motion with constant velocity",
      "visual_directive": "Write range formula R = u_x × T. Substitute values. Final answer in GOLD box. Show complete trajectory with range marked.",
      "prerequisites": [2, 6]
    }
  ]
}
```

## Problem Type Visual Strategies

Different types of problems require different visual approaches. The **VisualDesigner agent** must recognize problem type and apply appropriate strategies.

### Physics Problems

#### Projectile Motion

- **Visuals**: Coordinate system (x-y axes), parabolic trajectory, initial velocity vector, decomposed components
- **Free Body Diagram (FBD)**: At launch, show velocity components
- **Animation Sequence**:
  1. Draw coordinate axes
  2. Show projectile path as dotted curve
  3. Animate ball moving along trajectory
  4. Mark maximum height, range with dimensions
- **Color Coding**: Initial velocity GREEN, trajectory BLUE, final positions GOLD

#### Dynamics (Forces, Newton's Laws)

- **Visuals**: Free Body Diagram (FBD) is MANDATORY
- **Elements**: Object as dot or simple shape, force arrows with labels
- **Arrow Convention**: Length proportional to magnitude, color by type (gravity=RED, normal=BLUE, friction=ORANGE, applied=GREEN)
- **Animation**: Show net force, then show acceleration in same direction

#### Circuits

- **Visuals**: Circuit schematic with standard symbols
- **Elements**: Battery (parallel lines), resistor (zigzag), wire (straight lines), current direction (arrows)
- **Color Coding**: Given resistance values GREEN, unknown currents/voltages YELLOW, current flow animated with moving dots
- **Annotations**: Label each component with value, mark nodes

#### Energy Conservation

- **Visuals**: Energy bar charts, position diagrams
- **Elements**: KE bar (BLUE), PE bar (RED), Total E line (GOLD)
- **Animation**: Transform between KE and PE as object moves

### Chemistry Problems

#### Stoichiometry

- **Visuals**: Mole calculation grid (table format)
- **Elements**:
  ```
  | Substance | Moles | Mass | Molar Mass |
  |-----------|-------|------|------------|
  | Given: CaCO₃ | ? | 5g (GREEN) | 100 g/mol |
  | Find: CO₂ | ? (YELLOW) | ? (YELLOW) | 44 g/mol |
  ```
- **Animation**: Fill table step-by-step, show ratio calculations
- **Chemical Equation**: Display balanced equation, show mole ratio arrows

#### Balancing Equations

- **Visuals**: Equation with coefficient boxes
- **Animation**: Incrementally adjust coefficients, count atoms on each side, balance

#### Molecular Structure

- **Visuals**: Ball-and-stick or Lewis dot structures
- **Color by Atom**: H=WHITE, C=BLACK, O=RED, N=BLUE (standard CPK coloring)

### Mathematics Problems

#### Quadratic Equations / Optimization

- **Visuals**: Parabola on coordinate axes
- **Elements**: Vertex (max/min point), roots (x-intercepts), axis of symmetry
- **Animation**: Plot parabola, mark critical points, show calculation alongside graph
- **Color Coding**: Given coefficients GREEN, roots/vertex GOLD

#### Trigonometry

- **Visuals**: Unit circle, right triangle
- **Elements**: Angle arc, sides labeled (opposite, adjacent, hypotenuse)
- **Animation**: Sweep angle, show ratio calculations

#### Geometry

- **Visuals**: Figures to scale
- **Animation**: Construct step-by-step (given → construct → derive)
- **Labels**: All given measurements GREEN, unknowns YELLOW, answer GOLD

## Color Coding System

Consistent color coding helps students distinguish given information, unknowns, work-in-progress, and final answers.

### Standard Color Palette

```python
# Define at top of Manim Scene class
GIVEN_COLOR = GREEN       # Information provided in problem
UNKNOWN_COLOR = YELLOW    # What we need to find
FOCUS_COLOR = BLUE        # Current step/focus area
ANSWER_COLOR = GOLD       # Final ans wers
INTERMEDIATE_COLOR = ORANGE  # Results used in later steps
NEUTRAL_COLOR = WHITE     # General text/labels
```

### Application Rules

1. **Problem Statement Display**:
   - Given values: GREEN text or GREEN surrounding box
   - Find/Unknown: YELLOW text or YELLOW surrounding box

2. **During Solution Steps**:
   - Equation/term being worked on: BLUE highlight
   - Values substituted from given: Keep GREEN
   - Intermediate results: ORANGE (will be used later)

3. **Final Answer**:
   - Answer value: GOLD text
   - Surrounding box or underline: GOLD
   - Consider: `Circumscribe` animation in GOLD for emphasis

### Manim Code Pattern

```python
# Problem statement with color coding
given_velocity = MathTex(r"u = 20 \text{ m/s}").set_color(GREEN)
given_angle = MathTex(r"\theta = 30°").set_color(GREEN)
find_height = MathTex(r"\text{Find: } h_{max} = ?").set_color(YELLOW)
find_range = MathTex(r"R = ?").set_color(YELLOW)

# During solving - highlight current focus
equation = MathTex(r"h_{max} = \frac{u_y^2}{2g}")
equation[0][0:5].set_color(BLUE)  # Highlight h_max term we're solving for

# Intermediate result
u_y_result = MathTex(r"u_y = 10 \text{ m/s}").set_color(ORANGE)

# Final answer
final_answer = MathTex(r"h_{max} = 5 \text{ m}").set_color(GOLD)
answer_box = SurroundingRectangle(final_answer, color=GOLD, buff=0.2)
```

## Modified Agent Behaviors for Problem-Solving Mode

The 6-agent pipeline adapts as follows for problem-solving:

### Agent 1: ProblemAnalyzer (replaces ConceptAnalyzer)

**Task**: Parse the LaTeX problem statement and extract metadata.

**Output JSON Schema**:

```json
{
  "subject": "Physics" | "Chemistry" | "Mathematics" | "Biology",
  "topic": "specific topic name (e.g., 'projectile motion', 'stoichiometry', 'quadratic equations')",
  "problem_type": "numerical" | "conceptual" | "derivation" | "graphical" | "proof",
  "given": {
    "key": "value with units"
  },
  "find": ["list of unknowns to solve for"],
  "constraints": ["list of conditions (e.g., 'no air resistance', 'ideal gas', 'real number solutions')"],
  "difficulty": "JEE Main" | "JEE Advanced"| "NEET" | "NCERT"
}
```

**Example**:
Input: "A projectile is fired with initial velocity 20 m/s at 30° to the horizontal. Find the maximum height and range. (g = 10 m/s²)"

Output:

```json
{
  "subject": "Physics",
  "topic": "projectile motion",
  "problem_type": "numerical",
  "given": {
    "initial_velocity": "20 m/s",
    "angle": "30°",
    "acceleration_due_to_gravity": "10 m/s²"
  },
  "find": ["maximum height", "range"],
  "constraints": ["no air resistance", "flat horizontal ground"],
  "difficulty": "JEE Main"
}
```

### Agent 2: SolutionExplorer (replaces PrerequisiteExplorer)

**Task**: Build a solution tree (step dependency graph) instead of a concept tree (prerequisite graph).

**Key Differences from PrerequisiteExplorer**:

1. **Ask**: "What are the solution steps for this problem?" NOT "What are the prerequisites for this concept?"
2. **Foundation**: Stop at NCERT Class 10 concepts (see `ncert-class10-foundation.md`) NOT high school graduate level
3. **Structure**: DAG of solution steps, NOT prerequisite concepts
4. **Node Type**: Solution step with operation and equations, NOT concept with prerequisites

**Algorithm**:

1. Identify the final answer (what we need to find)
2. Work backwards: "What do I need to calculate THIS?"
3. For each dependency, recursively ask: "What do I need to calculate THIS?"
4. Stop when reaching:
   - Given values from problem statement
   - NCERT Class 10 foundation formulas (no further derivation needed)
5. Reverse the graph to get forward solution order

**Output**: JSON solution tree (see "Solution Tree Structure" section above)

### Agent 3: MathematicalEnricher (mostly unchanged)

**Task**: For each solution step, add mathematical detail.

**Additions for Problem-Solving Mode**:

- Explicitly mark which variables are **given** (from problem) vs **derived** (from previous steps)
- Include numerical values alongside algebraic expressions
- Show units at each step

### Agent 4: VisualDesigner (enhanced for problems)

**Task**: For each solution step, specify visual elements and animations.

**Additions for Problem-Solving Mode**:

1. **Problem Type Recognition**: Identify (projectile, circuit, stoichiometry, etc.) and apply appropriate visual strategy (see "Problem Type Visual Strategies")
2. **Color Coding**: Apply standard color system (given=GREEN, unknown=YELLOW, etc.)
3. **Problem-Specific Visuals**:
   - FBDs for force problems
   - Circuit diagrams for electricity problems
   - Mole grids for stoichiometry
   - Graphs for optimization/functions

**Output Additions**:

```json
{
  "step_number": 2,
  "visual_spec": {
    "problem_visual_type": "free_body_diagram" | "trajectory" | "circuit" | "mole_grid" | "graph" | "molecular_structure",
    "elements": ["list of visual elements to create"],
    "color_coding": {
      "given_values": "GREEN",
      "unknowns": "YELLOW",
      "current_focus": "BLUE"
    },
    "animations": ["FadeIn", "Create", "Transform", ...],
    "duration": 20
  }
}
```

### Agent 5: SolutionComposer (replaces NarrativeComposer)

**Task**: Generate verbose prompt with 70% solving, 30% explaining (interleaved).

**70/30 Solve-Explain Pattern**:

For EACH solution step:

1. **Solving Phase (15 seconds)**:
   - Show the mathematical operation
   - Perform substitution/simplification
   - Display result

2. **Explaining Phase (5 seconds)**:
   - Brief conceptual explanation
   - Why this step is valid
   - Reference to underlying concept

**Structure**:

```markdown
## Scene N: Step K - [Operation Name] (timestamp - timestamp)

### Solving Phase (15s)

[Detailed Manim instructions for mathematical work]

- Write equation: [LaTeX]
- Highlight focus term in BLUE
- Substitute values (GREEN for given, ORANGE for previous results)
- Show simplification steps
- Display result in ORANGE box (intermediate) or GOLD box (final answer)

### Explaining Phase (5s)

Display text or narration: "We use [concept name] because [brief reason in 1 sentence]."
Reference: NCERT Class 10 [topic] or JEE [topic]

Transition: [How to move to next step]
```

**Example**:

```markdown
## Scene 3: Step 2 - Decompose Velocity (0:10 - 0:30)

### Solving Phase (15s)

- Display the initial velocity vector: u = 20 m/s at 30° (GREEN arrow)
- Draw right triangle showing decomposition
- Write equations:
  - u_x = u cos(θ) = 20 cos(30°) = 20 × 0.866 = 17.32 m/s
  - u_y = u sin(θ) = 20 sin(30°) = 20 × 0.5 = 10 m/s
- Animate horizontal component appearing (ORANGE arrow along x-axis)
- Animate vertical component appearing (ORANGE arrow along y-axis)
- Show results in ORANGE boxes: u_x = 17.32 m/s, u_y = 10 m/s

### Explaining Phase (5s)

Display text: "We resolve the velocity vector using trigonometry to separate horizontal and vertical motion, which are independent."
Reference: NCERT Class 11 Physics - Motion in a Plane

Transition: Fade out triangle, keep component values on screen for next step
```

### Agent 6: CodeGenerator (mostly unchanged)

**Task**: Generate working Manim Python code from the verbose prompt.

**Additions for Problem-Solving Mode**:

1. Import color constants: `GREEN, YELLOW, BLUE, GOLD, ORANGE`
2. Apply color coding as specified in verbose prompt
3. Implement problem-specific visual patterns (FBD, trajectory, etc.) using helper methods
4. Ensure clean scene transitions between solve and explain phases

## LaTeX Problem Statement Parsing

When the input is a LaTeX problem statement, extract the following:

### Pattern Recognition

Look for keywords:

- **Given**: "Given:", "Let", "A … with …", numerical values with units
- **Find**: "Find:", "Calculate:", "Determine:", "Solve for:", "Prove that:", question mark at end
- **Constraints**: "assuming", "neglecting", "ideal", "no [air resistance/friction]", "at equilibrium"

### Extraction Example

**Input**:

```
A ball is thrown vertically upward with a speed of 25 m/s.
Given: Initial velocity u = 25 m/s, g = 10 m/s²
Find: (a) Maximum height reached, (b) Time to return to ground
Assume no air resistance.
```

**Extracted**:

```json
{
  "problem_statement": "A ball is thrown vertically upward with a speed of 25 m/s.",
  "given": {
    "initial_velocity_u": "25 m/s",
    "acceleration_due_to_gravity_g": "10 m/s²"
  },
  "find": ["maximum height reached", "time to return to ground"],
  "constraints": ["no air resistance", "vertical motion only"]
}
```

## 70/30 Solve-Explain Balance

The hallmark of JEE/NEET revision videos is the balance between **doing** and **understanding**.

### Timing Guidelines

For a solution with **N steps**:

- Total duration ≈ **N × 20 seconds** (15s solving + 5s explaining per step)
- Plus 10s for problem statement display
- Plus 5s for final answer emphasis

### Scene Structure Pattern

```
Scene 0: Problem Statement (10s)
  - Display complete problem
  - Color code: Given=GREEN, Find=YELLOW

Scene 1: Step 1 (20s)
  - Solving (15s): Mathematical work
  - Explaining (5s): Why this step works

Scene 2: Step 2 (20s)
  - Solving (15s): Mathematical work
  - Explaining (5s): Concept reference

...

Scene N: Step N (20s)
  - Solving (15s): Final calculation
  - Explaining (5s): Sanity check / verification

Scene N+1: Final Answer Emphasis (5s)
  - Display all answers in GOLD
  - Circumscribe or highlight
```

### Explanation Content Guidelines

Explaining phases should:

1. **Be concise**: 1 sentence, max 2 sentences
2. **Reference foundation**: "Using NCERT Class 10 [concept]" or "Applying JEE [concept]"
3. **Justify the step**: "We use X because Y" not just "This is X"
4. **Avoid redundancy**: Don't re-explain basic arithmetic or obvious algebra

**Good Examples**:

- "We resolve the vector using trigonometry because horizontal and vertical motions are independent."
- "At maximum height, vertical velocity becomes zero according to the kinematic equations."
- "Using the mole ratio from the balanced equation, 1 mole of CaCO₃ produces 1 mole of CO₂."

**Bad Examples** (too long, redundant):

- "Now we are going to substitute the values we found earlier into this equation and then we will simplify it step by step."
- "Using the formula for maximum height which we derived from the equations of motion..."
- "Two plus two equals four." (obvious arithmetic)

## Integration with Teaching Mode

When both modes coexist:

1. **Mode Detection**: System prompt checks for:
   - LaTeX problem statement with numerical values
   - Keywords: "JEE", "NEET", "solve", "Given:", "Find:"
   - If detected → Problem-Solving Mode
   - Else → Teaching Mode

2. **Conditional Reading**: System reads:
   - **Both modes**: `SKILL.md`, `manim-code-patterns.md`
   - **Teaching only**: Standard agent prompts, concept tree algorithm
   - **Problem only**: THIS file (`jee-neet-problem-solving.md`), `ncert-class10-foundation.md`

3. **Shared Agents**: Agents 3 and 6 are largely shared (with minor additions for problem mode)

4. **Different Agents**: Agents 1, 2, 5 have distinct variants for each mode
