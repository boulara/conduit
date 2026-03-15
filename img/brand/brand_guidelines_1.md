# Conduit — Brand Guidelines
> v1.0 — Every Team. One Channel.

---

## Brand Name

**Conduit**
Tagline: *Every Team. One Channel.

---

## 1. Logo Mark

The icon is an abstract network of nodes connected by a smooth flowing curve. The nodes represent teams or stakeholders passing information through a single channel. Opacity fades left to right (from ~100% to ~35%) to suggest information in motion. Small dot markers sit along the path between nodes to reinforce the sense of flow.

- **Node count:** 4 (not labeled — count is intentionally flexible and not tied to specific teams)
- **Node style:** Circle, outlined stroke only, with a low-opacity filled background of the same color
- **Connector:** Single smooth bezier curve passing through all nodes, 2.5px stroke, ~45% opacity
- **Motion dots:** 4 small circles (r=2.5) along the path between nodes, ~30% opacity

### SVG Geometry (icon centered at 0,0)

```
Connector path:
M-108,14 C-80,14 -68,-28 -36,-28 C-4,-28 4,28 36,28 C68,28 80,-10 108,-10

Node positions:       (-108, 14)   (-36, -28)   (36, 28)   (108, -10)
Node radius:          20
Node stroke width:    2.5 (first node) → 2.0 (subsequent, fading)
Node fill opacity:    0.14 → 0.10 → 0.07 → 0.04
Node stroke opacity:  1.0 → 0.78 → 0.55 → 0.35

Motion dot positions: (-72, -8)   (-14, 10)   (32, 24)   (76, 4)
Motion dot radius:    2.5
Motion dot opacity:   0.3
```

### Dark version (on `#0B1829`)
- Teal: `#14B8A6`

### Light version (on `#F8FAFC`)
- Teal: `#0D9488` (slightly darker for contrast on white)

---

## 2. Wordmark

```
Font:       -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif
Weight:     700
Size:       40px (stacked lockup) / 38px (horizontal lockup)
Tracking:   -0.5px (slight negative letter-spacing)

Dark background:
  "C"      → #14B8A6
  "onduit" → #F1F5F9

Light background:
  "C"      → #0D9488
  "onduit" → #0F172A
```

---

## 3. Tagline

```
Text:     EVERY TEAM. ONE CHANNEL.
Font:     same family, weight 400
Size:     11px
Case:     ALL CAPS
Tracking: 3px letter-spacing

Dark background:  #334155
Light background: #94A3B8
```

---

## 4. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-teal-dark` | `#14B8A6` | Primary brand color, dark backgrounds |
| `brand-teal-light` | `#0D9488` | Primary brand color, light backgrounds |
| `bg-dark` | `#0B1829` | Dark / navy background |
| `bg-light` | `#F8FAFC` | Light / off-white background |
| `text-headline` | `#0F172A` | Headlines on light backgrounds |
| `text-body` | `#475569` | Body copy, both modes |
| `text-muted` | `#94A3B8` | Labels, captions, tagline on light |
| `border` | `#E2E8F0` | Dividers and card borders on light |
| `border-dark` | `#1E3A4A` | Dividers and card borders on dark |

### Dark mode token map
```css
background:   #0B1829
teal accent:  #14B8A6
headline:     #F1F5F9
body:         #94A3B8
muted:        #475569
border:       #1E3A4A
```

### Light mode token map
```css
background:   #F8FAFC
teal accent:  #0D9488
headline:     #0F172A
body:         #475569
muted:        #94A3B8
border:       #E2E8F0
```

---

## 5. Typography

**Primary typeface:** System UI / Inter

```
Font stack: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif
```

### Type scale

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display | 36px | 700 | -1px | Hero headlines |
| Heading | 24px | 700 | -0.3px | Section titles |
| Subheading | 18px | 500 | 0 | Card titles, subsections |
| Body | 14px | 400 | 0 | All paragraph and UI text |
| Label | 11px | 400 | 2px | ALL CAPS, UI labels |
| Small | 10px | 400 | 1px | Captions, metadata |

---

## 6. Logo Lockups

### Stacked (primary)
Icon centered above wordmark, tagline centered below wordmark.

```
Vertical spacing:
  Icon bottom → wordmark top:    16px
  Wordmark bottom → tagline top: 10px
```

### Horizontal
Icon on the left, a vertical divider line, wordmark and tagline stacked on the right. Icon and wordmark block are vertically centered on the same axis.

```
Divider color (dark bg):  #1E3A4A
Divider color (light bg): #E2E8F0
Divider width:            1px
Gap each side of divider: 24px
```

---

## 7. Favicon & App Icon

The full logo mark is replaced by a bold "C" on a solid teal rounded square at small sizes.

```
Shape:   Rounded square
Fill:    #14B8A6 (solid teal, no border)
Content: "C" in #0B1829, font-weight 800, centered
```

### Size and corner radius

| Size | Corner radius |
|---|---|
| 512px | 24px |
| 96px | 16px |
| 48px | 10px |
| 32px | 7px |
| 16px | 4px |

**Rule:** Use the C favicon at 48px and below. Use the full logo mark above 48px.

---

## 8. Spacing & Border Radius

```
--radius-sm:  4px   (inputs, tags)
--radius-md:  8px   (buttons, small cards)
--radius-lg:  12px  (cards, modals)
--radius-xl:  16px  (panels, large containers)
--radius-2xl: 20px  (hero containers, logo backgrounds)
```

---

## 9. CSS Custom Properties

Ready to paste into any project:

```css
:root {
  /* Brand colors */
  --conduit-teal:          #14B8A6;
  --conduit-teal-light:    #0D9488;

  /* Backgrounds */
  --conduit-bg-dark:       #0B1829;
  --conduit-bg-light:      #F8FAFC;

  /* Text */
  --conduit-text-headline: #0F172A;
  --conduit-text-body:     #475569;
  --conduit-text-muted:    #94A3B8;
  --conduit-text-inverse:  #F1F5F9;

  /* Borders */
  --conduit-border:        #E2E8F0;
  --conduit-border-dark:   #1E3A4A;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Inter',
               'Helvetica Neue', sans-serif;

  /* Border radius */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-2xl: 20px;
}
```

---

## 10. Usage Rules

### Do
- Use the dark logo on dark/navy backgrounds
- Use the light logo on white or off-white backgrounds
- Maintain clear space around the mark equal to the node diameter
- Use the C favicon at 48px and below
- Use the horizontal lockup in navigation bars and headers
- Keep the tagline in ALL CAPS with 3px letter-spacing
- Scale the mark proportionally only

### Don't
- Change the teal accent color
- Place the logo on busy or photographic backgrounds
- Stretch or skew the mark in any direction
- Add outlines, drop shadows, or glow effects
- Use the full mark below 48px
- Reorder or remove the tagline
- Use color variants not specified in this guide
- Add team names or labels to the nodes in the logo mark

---

*Conduit — Every Team. One Channel. — Brand Guidelines v1.0*
