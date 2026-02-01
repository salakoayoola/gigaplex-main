# Visual Identity

## Color Palette

### Primary Colors

| Color | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| | **Terracotta** | `#A0522D` | 160, 82, 45 | Primary brand color - headers, key UI elements, warmth |
| | **Deep Forest** | `#2D4A3E` | 45, 74, 62 | Text, contrast, nature connection |
| | **Warm Cream** | `#F5E6D3` | 245, 230, 211 | Backgrounds, cards, breathing room |

### Accent Colors

| Color | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| | **Wura Gold** | `#D4A84B` | 212, 168, 75 | Selective highlights, achievements, vocabulary callouts |
| | **Saddle Brown** | `#8B4513` | 139, 69, 19 | Depth, grounding, secondary emphasis |
| | **Warm Sand** | `#E8B87D` | 232, 184, 125 | Soft accents, hover states |

### Neutrals

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| | **Charcoal** | `#3D3D3D` | Body text |
| | **Stone Gray** | `#6B6B6B` | Secondary text, captions |
| | **Off-White** | `#FAFAF7` | Page backgrounds |

### Color Rationale

- **Terracotta**: Nigerian laterite earth, warmth, groundedness
- **Deep Forest**: Nigerian vegetation, stability, growth
- **Wura Gold**: The name's meaning (wura = gold), used sparingly as accent
- **Warm Cream**: Paper texture feel, easy on eyes for sustained reading

### Color Usage Rules

1. Terracotta and Deep Forest are the workhorses - use freely
2. Wura Gold is an accent - use it to draw attention, not as a fill color
3. Warm Cream provides breathing room - don't overcrowd backgrounds
4. Maintain sufficient contrast for accessibility (WCAG AA minimum)

---

## Typography

### Yoruba Diacritic Requirements

Yoruba uses tonal markings (acute ´, grave `, macron ¯) and subdots (ẹ, ọ, ṣ). Any font must fully support:

- **Vowels with subdots**: Ẹ ẹ Ọ ọ
- **Consonants with subdots**: Ṣ ṣ
- **Tonal marks on all vowels**: á à ā é è ē ẹ́ ẹ̀ ẹ̄ í ì ī ó ò ō ọ́ ọ̀ ọ̄ ú ù ū
- **Stacked diacritics**: Combining subdot + tone mark (e.g., ẹ́ ọ̀)

### Type System

| Role | Font | Fallback | Weights | Usage |
|------|------|----------|---------|-------|
| **Display** | Ojuju | system-ui | 200-800 | Hero headlines, brand moments |
| **Heading** | Charis SIL | Georgia, serif | 400, 700 | Page titles, section headers |
| **Body** | Andika | system-ui, sans-serif | 400, 700 | Body text, learning content |
| **UI** | Inter | system-ui, sans-serif | 400, 500, 600 | Interface elements, buttons, labels |

### Font Rationale

**Nunito** (Google Fonts)
- Friendly, rounded sans-serif
- Excellent support for extended Yoruba diacritics
- Matches the "warm/approachable" brand personality
- Use for: brand headlines, hero text, marketing

**Charis SIL** (SIL Open Font License)
- Specifically designed for African language publishing
- Excellent diacritic positioning and stacking
- Highly readable serif for extended reading
- Use for: book content, lesson headers, formal contexts

**Andika** (SIL Open Font License)
- Designed for literacy and beginning readers
- Clear letterforms that match handwriting conventions
- Complete diacritic support
- Use for: worksheets, children's content, vocabulary displays

**Inter** (Google Fonts)
- Modern, highly legible sans-serif
- Good diacritic support
- Use for: UI elements, buttons, navigation (not primary Yoruba content)

### Type Scale

```
xs:   0.75rem  (12px) - Captions, fine print
sm:   0.875rem (14px) - Small text, labels
base: 1rem    (16px) - Body text
lg:   1.125rem (18px) - Lead paragraphs
xl:   1.25rem  (20px) - Subheadings
2xl:  1.5rem   (24px) - Section titles
3xl:  1.875rem (30px) - Page titles
4xl:  2.25rem  (36px) - Hero headlines
5xl:  3rem     (48px) - Display
```

### Typography Rules

1. **Always test Yoruba text** - Render sample text with subdots and tone marks before committing to a font in any context
2. Body text at 16px minimum for readability
3. Yoruba vocabulary callouts can use Ojuju or be styled distinctly (underline, background)
4. Line height: 1.6 for body text (extra space for diacritics), 1.3 for headings
5. Never use fonts that collapse or misposition stacked diacritics

### Font Loading Strategy

```css
/* Primary fonts - preload for performance */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200..900&family=Inter:wght@400;500;600&display=swap');

/* SIL fonts - self-host for reliability */
@font-face {
  font-family: 'Charis SIL';
  src: url('/fonts/CharisSIL-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Andika';
  src: url('/fonts/Andika-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Diacritic Testing String

Use this string to verify font rendering:

```
Ẹ̀kọ́ Yorùbá: Ọjọ́ kan, àwọn ọmọdé ń kọ́ ẹ̀dè Yorùbá. Ṣé o lè ka èyí?
```

If subdots appear misaligned or tone marks float incorrectly, the font is not suitable.

---

## Imagery

### Two Visual Systems

Aunty Wúrà uses different illustration styles for different contexts:

| Context | Style | Description |
|---------|-------|-------------|
| **Books & Print** | Scientific Illustration | Modernized 19th-century watercolor + archival ink per art-direction specs |
| **Digital & Web** | Contemporary Warm | Friendly illustrations, organic shapes, hand-drawn quality |

### Digital Illustration Style

- Soft, rounded shapes
- Textured fills (subtle paper grain, watercolor wash)
- Hand-drawn linework (imperfect, human)
- Limited palette per illustration (3-4 colors)
- Organic borders when framing is needed

### Scientific Illustration Style

See [art-direction/](/art-direction/) for detailed prompts. Key characteristics:

- Archival ink outlines with watercolor washes
- Deckled/rough paper edge vignettes
- Anatomically and taxonomically accurate
- Vibrant, true-to-life color (no sepia)
- Subject as hero, clean negative space

### Photography (When Used)

- Warm color grading
- Natural lighting
- Nigerian settings and subjects
- Focus on hands, materials, learning in action
- Avoid staged "educational" photography

---

## Graphic Elements

### Patterns & Textures

- Subtle paper texture overlays for warmth
- Simplified adire-inspired line patterns (modern interpretation)
- Botanical elements for borders and dividers
- Watercolor wash backgrounds

### Iconography

- Line icons, 2px stroke
- Rounded corners and terminals
- Terracotta or Deep Forest color
- Optional: subtle watercolor fill for emphasis

### Border Treatments

- Deckled/torn paper edges for organic framing
- Soft curves over hard rectangles
- Botanical corner flourishes (sparingly)

### What to Avoid

- Generic stock illustration style
- Hard geometric borders everywhere
- Overly busy patterns that compete with content
- "African pattern" as decoration without intent
- Clip art energy
