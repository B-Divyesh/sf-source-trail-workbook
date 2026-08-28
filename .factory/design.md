# Source Trail Workbook — visual thesis

## Direction and reason

**Neo-brutalist utility, styled as a marked-up seminar handout.** The app should
feel like a rigorous working document passed between a student and instructor,
not a polished reference-manager database. Heavy rules and offset shadows make
each claim/source relationship explicit. Highlighter color marks action and
review state. A compact evidence-path illustration teaches the product model at
a glance rather than decorating the page.

This is intentionally a **single light treatment**. The warm paper canvas is a
semantic part of the workbook metaphor, and painting it explicitly gives the
product a consistent classroom-print identity in browsers and installed mode.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Background | `--paper` | `#F2EEDF` | warm recycled worksheet stock |
| Surface | `--sheet` | `#FFFDF6` | fields and working sheets |
| Text | `--ink` | `#141414` | carbon-black body and outlines |
| Muted text | `--muted` | `#59564F` | support copy; ≥ 6:1 on paper |
| Accent | `--cobalt` | `#1745D1` | links and primary action |
| Accent contrast | `--white` | `#FFFFFF` | copy on cobalt; ≥ 7:1 |
| Marker | `--marker` | `#FFDA45` | selected states and annotations |
| Success | `--success` | `#176B3A` | supported / saved status |
| Warning | `--warning` | `#8A4B00` | partial trail status |
| Danger | `--danger` | `#B42318` | destructive/error state |
| Contradiction | `--coral` | `#E95C48` | contradicting-evidence label |

No gradients. Borders are 2–3 px carbon black. Primary blocks cast a hard
`6px 6px 0 #141414` offset shadow. Color is always paired with words or symbols.

## Typography

- Interface and headings: `Arial, Helvetica, sans-serif`; heavy weights,
  narrow tracking, uppercase only for micro-labels. System-hosted and immediate.
- Questions and quotations: `Georgia, 'Times New Roman', serif`; the scholarly
  voice contrasts with the mechanical interface without an external font file.
- Scale: 12 / 14 / 16 / 20 / 28 / clamp(36–64) px. Body is 16 px minimum,
  line-height 1.55, measure capped near 72 characters. Tabular figures are used
  for counts and dates.

## Spacing and shape

- 4 px base rhythm; common gaps: 8, 12, 16, 24, 32, 48, 64 px.
- Desktop shell maxes at 1240 px. Workbook view is a 280 px index rail plus
  flexible editing sheet. At ≤ 800 px the rail becomes a horizontal summary
  and every field stacks; nonessential help copy collapses.
- Corners stay nearly square (0–4 px). Independent trail records may be boxed;
  closely related form fields are grouped by proximity instead of card nesting.
- All controls are at least 44 px tall with an 8 px separation and a custom
  cobalt/marker focus ring.

## Interaction grammar

- Start screen: one dominant “Start a workbook” action, plus import. A three-step
  diagram names the mental model: question → search decision → claim + evidence.
- Inside a workbook: the left/index region answers “where am I?”; the sheet
  answers “what do I write next?” Autosave status sits beside the workbook title.
- Trail status is computed from content and labeled “Started”, “Needs evidence”,
  or “Ready to review”. Unsupported claims remain visibly called out.
- Destructive actions name their target and use a native confirmation dialog.
  Export/import actions report success or a repairable error in a live region.
- Keyboard: standard form sequence; `Ctrl/Cmd+S` saves immediately;
  `Ctrl/Cmd+Enter` adds a new trail when editing.

## Motion policy

- 180 ms for press/shadow changes and 220 ms for sheet entry; only transform and
  opacity animate. New sheets enter from the index edge, matching their origin.
- Save feedback is text/state, not motion dependent. No loops or flashing.
- Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling become
  instant while hierarchy and status remain fully visible.

## Asset plan and provenance

- **Hero illustration:** an original, generated editorial still-life of loose
  research slips connected through a single visible path: question card, search
  result fragments, inspected source, quotation slip, claim card. It explains
  the product structure and appears only in the empty/start state.
- **App icons:** hand-authored SVG mark: three offset paper slips joined by a
  cobalt trail. Raster PNG install icons are rendered locally from this mark.
- UI icons are small inline SVGs authored for this product; no icon library.

### Hero prompt sheet

Use case: `illustration-story`

Asset type: offline research-workbook landing illustration.

Primary request: a tactile editorial still-life that explains an auditable
research trail, moving through a question note, search fragments, an inspected
source, a short quotation slip, and a final claim card.

World/materials: warm recycled paper, black printer ink, blue pencil arrows,
yellow highlighter, coral correction marks, torn deckled edges, subtle halftone
grain; entirely hand-made print-collage feeling.

Composition: landscape, top-down, five paper fragments forming one clear zigzag
path; bold black outlines, generous warm-paper negative space, no screen mockup.

Light/lens: flat soft daylight, top-down 50 mm editorial scan, minimal shadows.

Palette words: warm paper, carbon ink, library cobalt, highlighter yellow,
correction coral.

Negative list: no people, hands, faces, logos, brands, legible text, letters,
watermarks, gradients, glossy 3D, laptop, phone, generic dashboard UI, clutter.

Generation: Azure factory image generator (`factory-image` deployment via
`/opt/fleet/lib/gen-image.sh`), 2026-08-28. Generated work is original to this
product; selected source and exact prompt are stored in `assets/src/`.

The 1200×630 social preview in `public/og-source-trail.jpg` is a centered crop
of that same original hero asset. The SVG favicon is hand-authored from the
three-paper trail mark; the 180 px touch icon is resized from the same mark.
