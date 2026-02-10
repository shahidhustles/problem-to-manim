# Verbose Prompt Format

The verbose prompt is the bridge between the knowledge tree and working Manim code. A well-structured verbose prompt produces dramatically better animations than vague descriptions.

## Why Verbose Prompts Work

1. **LaTeX forces precision**: Exact mathematical notation leaves no ambiguity
2. **Detailed cinematography**: Specific colors, positions, and timings guide code generation
3. **Sequential structure**: Clear scene ordering produces organized code
4. **Complete specifications**: Nothing left to guess or infer

## Complete Template

```markdown
# Manim Animation: {TARGET_CONCEPT}

## Overview

This animation builds {TARGET_CONCEPT} from first principles through a carefully
constructed knowledge tree. Each concept is explained with mathematical rigor
and visual clarity, building from foundational ideas to advanced understanding.

**Total Concepts**: {CONCEPT_COUNT}
**Progression**: {CONCEPT_1} -> {CONCEPT_2} -> ... -> {TARGET_CONCEPT}
**Estimated Duration**: {TOTAL_SECONDS} seconds ({MINUTES}:{SECONDS:02d})

## Animation Requirements

- Use Manim Community Edition (manim)
- All LaTeX must be in raw strings: r"$\\frac{a}{b}$"
- Use MathTex() for equations, Text() for labels
- Maintain color consistency throughout
- Ensure smooth transitions between scenes
- Include voiceover-friendly pacing (2-3 seconds per concept introduction)

## Scene Sequence

### Scene 1: {CONCEPT_1}

**Timestamp**: 0:00 - 0:15

Begin by fading in the coordinate axes using FadeIn(axes) with WHITE color.
Position the axes at ORIGIN. Next, display the foundational equation
r"$y = mx + b$" using MathTex() in BLUE color, positioning it at the TOP
of the screen using .to_edge(UP).

Create the equation using Write(equation) animation over 2 seconds. Then,
draw a sample line using Create(line) in YELLOW color, showing a concrete
example of y = 2x + 1. Label the line with Text("slope = 2") in GREEN,
positioned to the RIGHT of the line.

Wait 1 second, then fade all elements to prepare for the next concept using
FadeOut(Group(axes, equation, line, label)).

---

### Scene 2: {CONCEPT_2}

**Timestamp**: 0:15 - 0:30

{SIMILAR DETAILED DESCRIPTION}

---

### Scene N: {TARGET_CONCEPT}

**Timestamp**: {START} - {END}

This is the culminating scene. Transform the previous elements to show how
all concepts connect to {TARGET_CONCEPT}. Display the key equation
r"${MAIN_EQUATION}$" prominently in the center using MathTex() with GOLD color.

Highlight the connection to prerequisites by using Indicate() on relevant
terms. Add a final summary text explaining the core insight.

---

## Final Notes

This animation is designed to be pedagogically sound and mathematically rigorous.
The progression from {FIRST_CONCEPT} to {TARGET_CONCEPT} ensures that viewers
have all necessary prerequisites before encountering advanced concepts.

All visual elements, colors, and transitions have been specified to maintain
consistency and clarity throughout the {TOTAL_SECONDS}-second animation.

Generate complete, working Manim Community Edition Python code that implements
this scene sequence with all specified mathematical notation, visual elements,
colors, and animations.
```

## Scene Segment Structure

Each scene segment should include:

### 1. Timestamp Header

```markdown
### Scene 3: Schrödinger Equation

**Timestamp**: 0:30 - 0:45
```

### 2. Opening Action

Start with a verb describing the first animation:

- "Begin by fading in..."
- "Start with the transformation of..."
- "Open by displaying..."

### 3. Equation Display

Include exact LaTeX with positioning:

```
Display the equation r"$i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi$"
using MathTex() in BLUE color, centered at ORIGIN.
```

### 4. Visual Elements

Specify all objects with:

- Manim class: `MathTex()`, `Text()`, `Axes()`, `Circle()`
- Color: `BLUE`, `RED`, `YELLOW`, etc.
- Position: `ORIGIN`, `UP`, `LEFT`, `.to_edge()`, `.next_to()`

### 5. Animation Sequence

List animations in order:

```
1. FadeIn(axes) over 1 second
2. Write(equation) over 2 seconds
3. Create(graph) following the equation curve
4. Indicate(key_term) with YELLOW highlight
5. Wait 1 second
6. FadeOut(Group(all_elements))
```

### 6. Transition Hook

End with setup for next scene:

```
The equation remains on screen, shifted to the upper left,
as we introduce the next concept.
```

## Color Palette Guidelines

Maintain consistency across scenes:

| Element Type        | Recommended Color |
| ------------------- | ----------------- |
| Primary equations   | BLUE              |
| Secondary equations | YELLOW            |
| Axes/grids          | WHITE or GREY     |
| Graphs/curves       | YELLOW, GREEN     |
| Labels              | GREEN             |
| Highlights          | GOLD or ORANGE    |
| Warnings/errors     | RED               |
| Success/completion  | GREEN             |

## Timing Guidelines

| Content Type                      | Duration      |
| --------------------------------- | ------------- |
| Simple equation display           | 2-3 seconds   |
| Complex equation with explanation | 4-5 seconds   |
| Graph/visualization creation      | 3-4 seconds   |
| Transition between concepts       | 1-2 seconds   |
| Pause for comprehension           | 1 second      |
| Complete scene                    | 15-30 seconds |

## Example: Complete Scene Segment

```markdown
### Scene 4: Wave-Particle Duality

**Timestamp**: 0:45 - 1:05

Begin by transforming the previous probability wave into a particle
representation using ReplacementTransform(wave, particle). The particle
appears as a Dot() in YELLOW at the center of the screen.

Next, display de Broglie's equation r"$\lambda = \frac{h}{p}$" using
MathTex() in BLUE color, positioned at the TOP using .to_edge(UP).
Write the equation over 2 seconds.

Below the equation, create a Text() label explaining each variable:

- r"$\lambda$" = wavelength (GREEN)
- r"$h$" = Planck's constant (YELLOW)
- r"$p$" = momentum (ORANGE)

Position these labels in a VGroup(), arranged vertically with
.arrange(DOWN, buff=0.3), and place them at the RIGHT side of the screen.

Now demonstrate the wave-particle connection: Create a sinusoidal wave
using ParametricFunction() in PURPLE, with amplitude that varies based
on the particle's momentum. Use Create(wave) animation over 3 seconds.

Show that as momentum increases (particle moving faster), wavelength
decreases. Use ValueTracker to animate momentum from 1 to 5, with the
wave responding in real-time using always_redraw().

Conclude by highlighting the key insight: matter has wave properties.
Use Circumscribe(equation) with GOLD color to emphasize the equation,
then FadeOut all elements except the equation, which shifts to upper-left
corner for the next scene.
```

## Common Pitfalls to Avoid

1. **Vague descriptions**: "Show the equation" -> "Display r'$E=mc^2$' using MathTex() in BLUE at TOP"
2. **Missing positions**: Always specify where elements appear
3. **Unclear timing**: Include duration for each animation
4. **No transitions**: Explicitly describe how scenes connect
5. **Inconsistent colors**: Define palette and stick to it
6. **Missing LaTeX escaping**: Use raw strings with double backslashes

---

## Problem-Solving Mode Template (JEE/NEET)

For competitive exam problem solutions, use this alternative structure that emphasizes the 70% SOLVING / 30% EXPLAINING balance.

### Complete Template for Problem-Solving

````markdown
# Manim Animation: {PROBLEM_TITLE}

## Problem Statement

{FULL_PROBLEM_TEXT_IN_LATEX}

Given: {LIST_GIVEN_VALUES}
Find: {LIST_UNKNOWNS}
Constraints: {LIST_CONSTRAINTS}

## Overview

**Subject**: {Physics/Chemistry/Mathematics/Biology}
**Topic**: {specific topic, e.g., "projectile motion"}
**Solution Steps**: {N steps}
**Estimated Duration**: {N × 20} seconds (15s solving + 5s explaining per step)
**Color Coding**:

- Given values: GREEN
- Unknown values: YELLOW
- Current focus: BLUE
- Intermediate results: ORANGE
- Final answers: GOLD

## Animation Requirements

- Use Manim Community Edition (manim)
- Import GOLD color explicitly: from manim import GOLD
- All LaTeX in raw strings: r"$\\frac{a}{b}$"
- Apply color coding system consistently
- 70/30 solve-explain balance (15s solving, 5s explaining per step)
- First scene displays full problem with color-coded values
- Last scene emphasizes final answer in GOLD with Circumscribe or highlight

## Scene Sequence

### Scene 0: Problem Display (0:00 - 0:10)

Display the complete problem statement at the top of the screen using Tex().
Break into parts:

- Given values in GREEN boxes
- Unknown values in YELLOW boxes

Use VGroup to organize:

```python
problem_given = VGroup(
Tex(r"$u = 20 \text{ m/s}$").set_color(GREEN),
  Tex(r"$\theta = 30°$").set_color(GREEN),
  Tex(r"$g = 10 \text{ m/s}^2$").set_color(GREEN)
).arrange(DOWN).to_edge(LEFT)

problem_find = VGroup(
  Tex(r"Find: $h_{max} = ?$").set_color(YELLOW),
  Tex(r"$R = ?$").set_color(YELLOW)
).arrange(DOWN).to_edge(RIGHT)
```
````

FadeIn both groups over 2 seconds. Wait 1 second for comprehension.

---

### Scene 1: Step 1 - {OPERATION_NAME} (0:10 - 0:30)

#### SOLVING PHASE (15 seconds)

{DETAILED_MANIM_INSTRUCTIONS_FOR_MATHEMATICAL_WORK}

Example structure:

- Write the equation BEFORE transformation: r"$equation_before$" in standard WHITE
- Highlight the current focus term/variable in BLUE
- Show substitution step-by-step (given values in GREEN, previous results in ORANGE)
- Perform calculation with intermediate steps visible
- Display result in ORANGE box (if intermediate) or GOLD box (if final answer)

Specific instructions for this step:
{STEP_SPECIFIC_VISUAL_INSTRUCTIONS}

- Element positions (LEFT, RIGHT, UP, DOWN, ORIGIN, coordinates)
- Colors for each element
- Animation timing (Create over 2s, Transform over 1s, etc.)

#### EXPLAINING PHASE (5 seconds)

Display explanatory text using Tex() or Text() in WHITE, positioned below the equation:

"We use [CONCEPT_NAME] because [BRIEF_REASON in 1-2 sentences]."

Example:

```python
explanation = Text(
  "We resolve the velocity using trigonometry because\nhorizontal and vertical motions are independent.",
  font_size=24
).to_edge(DOWN)
FadeIn(explanation)
self.wait(4)
FadeOut(explanation)
```

Reference: "NCERT Class 10 [topic]" or "JEE/NEET [advanced topic]"

#### Transition (1 second)

{HOW_TO_TRANSITION_TO_NEXT_STEP}

- What to keep visible (e.g., component values for later use)
- What to fade out
- Repositioning if needed

---

### Scene N: Final Answer Emphasis ({timestamp} - {timestamp})

After completing all solution steps, create a final scene that:

1. Displays all final answers in GOLD:

```python
final_answers = VGroup(
  MathTex(r"h_{max} = 5 \text{ m}").set_color(GOLD),
  MathTex(r"R = 34.64 \text{ m}").set_color(GOLD)
).arrange(DOWN, buff=0.5).scale(1.5).move_to(ORIGIN)
```

2. Emphasizes with animation:

```python
answer_boxes = VGroup(
  *[SurroundingRectangle(ans, color=GOLD, buff=0.2) for ans in final_answers]
)
FadeIn(final_answers)
Create(answer_boxes)
Circumscribe(final_answers, color=GOLD, time_width=1.5)
```

3. Wait 2 seconds for final emphasis

````

### Example: Complete Problem-Solving Scene

```markdown
### Scene 2: Step 1 - Decompose Velocity (0:10 - 0:30)

#### SOLVING PHASE (15 seconds)

Display the initial velocity vector as a GREEN arrow from ORIGIN to custom coordinates:
```python
velocity_vector = Arrow(
  ORIGIN,
  np.array([3.46, 2, 0]),  # Represents 20 m/s at 30°
  buff=0,
  color=GREEN
)
velocity_label = MathTex(r"\\vec{u} = 20 \text{ m/s}").set_color(GREEN).next_to(velocity_vector, UP)
````

Create the vector with `GrowArrow(velocity_vector)` over 1 second, then Write the label over 1 second.

Draw a right triangle showing the decomposition:

- Horizontal component: DashedLine from ORIGIN to [3.46, 0, 0] in ORANGE
- Vertical component: DashedLine from [3.46, 0, 0] to [3.46, 2, 0] in ORANGE
- Right angle indicator at [3.46, 0, 0]

Write the equations at the RIGHT side of screen:

```python
equations = VGroup(
  MathTex(r"u_x = u \\cos(\\theta)").set_color(BLUE),  # Current focus
  MathTex(r"u_y = u \\sin(\\theta)").set_color(BLUE)
).arrange(DOWN).to_edge(RIGHT)
```

Highlight calculations in BLUE as you show:

- $u_x = 20 \\cos(30°) = 20 \\times 0.866 = 17.32$
- Transform equation to show numerical result

Show component arrows appearing:
-Horizontal arrow (ORANGE) along x-axis with label "u_x = 17.32 m/s" (ORANGE)

- Vertical arrow (ORANGE) along y-axis with label "u_y = 10 m/s" (ORANGE)

Display results in ORANGE rounded rectangles:

```python
result_ux = VGroup(
  RoundedRectangle(corner_radius=0.1, color=ORANGE),
  MathTex(r"u_x = 17.32 \text{ m/s}").set_color(ORANGE)
)
# Similar for u_y
```

#### EXPLAINING PHASE (5 seconds)

Display text at BOTTOM:

```python
explanation = Text(
  "We resolve the velocity vector using NCERT Class 10 trigonometry.\n"
  "Horizontal and vertical motions are independent in projectile motion.",
  font_size=22
).to_edge(DOWN)
FadeIn(explanation)
self.wait(4)
FadeOut(explanation)
```

#### Transition

Fade out the triangle and original velocity vector.
Keep the component value boxes (u_x, u_y in ORANGE) visible at top-right corner,
scaled down to 0.6 and repositioned to [5, 3, 0] for use in subsequent calculations.

````

### Problem-Specific Visual Directives

Depending on problem type, include these visualizations:

#### Physics - Projectile Motion
- **FBD**: Not always needed for projectile (unless analyzing forces)
- **Trajectory**: Parabolic path using ParametricFunction or bezier curve
- **Component vectors**: Horizontal and vertical with different colors
- **Height marker**: Dashed horizontal line at h_max in GOLD
- **Range marker**: Dashed vertical line or arrow at ground level in GOLD

#### Physics - Dynamics (Forces)
- **FBD MANDATORY**: Object as Dot, force arrows proportional to magnitude
- **Force colors**: Gravity=RED, Normal=BLUE, Friction=ORANGE, Applied=GREEN
- **Net force**: Dotted arrow showing vector sum
- **Acceleration**: Arrow in direction of net force (same direction, different color)

#### Chemistry - Stoichiometry
- **Mole grid**: Table with columns [Substance, Moles, Mass, Molar Mass]
- **Fill step-by-step**: Highlight current cell in BLUE as you calculate
- **Given**: GREEN, Derived: ORANGE, Unknown: YELLOW, Answer: GOLD
- **Chemical equation**: Display at top with mole ratio arrows between substances

#### Mathematics - Quadratic/Optimization
- **Graph**: Parabola on axes
- **Vertex**: Mark with GOLD dot, label coordinates
- **Roots**: Mark x-intercepts if applicable
- **Calculation alongside**: Show algebraic steps on right, graph updates on left

### Color Coding - Exact Manim Patterns

```python
# At top of Scene class
GIVEN_COLOR = GREEN
UNKNOWN_COLOR = YELLOW
FOCUS_COLOR = BLUE
ANSWER_COLOR = GOLD
INTERMEDIATE_COLOR = ORANGE

# Problem statement
given1 = MathTex(r"u = 20 \text{ m/s}").set_color(GIVEN_COLOR)
find1 = MathTex(r"h_{max} = ?").set_color(UNKNOWN_COLOR)

# During solving - highlight focus
equation = MathTex(r"h_{max} = \frac{u_y^2}{2g}")
equation[0][0:5].set_color(FOCUS_COLOR)  # Highlight h_max

# Intermediate result (will be used later)
u_y_value = MathTex(r"u_y = 10 \text{ m/s}").set_color(INTERMEDIATE_COLOR)

# Final answer
answer = MathTex(r"h_{max} = 5 \text{ m}").set_color(ANSWER_COLOR)
answer_box = SurroundingRectangle(answer, color=ANSWER_COLOR, buff=0.15)
````

### Timing Guidelines for Problem-Solving

| Scene Type                   | Duration                 |
| ---------------------------- | ------------------------ |
| Problem display              | 10 seconds               |
| Solution step (total)        | 20 seconds               |
| - Solving phase              | 15 seconds               |
| - Explaining phase           | 5 seconds                |
| Transition between steps     | Included in 20s          |
| Final answer emphasis        | 5 seconds                |
| **Total for N-step problem** | **10 + 20N + 5 seconds** |
