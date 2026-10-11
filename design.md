---
version: alpha
name: LLMAPI Clean Tech
description: A minimal, high-contrast SaaS landing system with crisp geometry, oversized editorial type, and a single electric blue accent.
colors:
  primary: "#3F35FF"
  primary-60: "#7068FF"
  primary-10: "#E9E7FF"
  secondary: "#13151A"
  tertiary: "#D8D8D8"
  neutral: "#E5E7EB"
  surface: "#FFFFFF"
  on-surface: "#13151A"
  muted: "#6B7280"
  border: "#D8D8D8"
  error: "#D92D20"
typography:
  headline-display:
    fontFamily: "Space Grotesk"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: "67px"
    letterSpacing: "-3px"
  headline-lg:
    fontFamily: "Space Grotesk"
    fontSize: "43px"
    fontWeight: 400
    lineHeight: "56px"
    letterSpacing: "-3px"
  headline-md:
    fontFamily: "Space Grotesk"
    fontSize: "33px"
    fontWeight: 400
    lineHeight: "40px"
    letterSpacing: "-3px"
  headline-sm:
    fontFamily: "Space Grotesk"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: "29px"
    letterSpacing: "-0.06em"
  body-lg:
    fontFamily: "Rethink Sans"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "Rethink Sans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Rethink Sans"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Space Grotesk"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-md:
    fontFamily: "Space Grotesk"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "Space Grotesk"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.06em"
  nav-link:
    fontFamily: "Space Grotesk"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  button:
    fontFamily: "Space Grotesk"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "16px"
  md: "40px"
  lg: "60px"
  xl: "114px"
  gutter: "24px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 30px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 30px"
    height: "46px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
    height: "46px"
  chip:
    backgroundColor: "{colors.primary-10}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
---

# LLMAPI Clean Tech

## Overview
This system feels like a focused, technical SaaS brand built for founders and engineering teams who care about clarity, cost, and speed. The tone is confident and modern, with a restrained white canvas, large editorial headlines, and one vivid blue accent that carries all primary actions. The overall experience is spacious and minimal, but not soft: it uses crisp lines, strong contrast, and precise alignment to feel efficient and trustworthy.

## Colors
- **Primary (#3F35FF):** A vivid electric blue used for the main CTA, brand moments, active highlights, and small diagram labels. It is the single energetic accent in an otherwise neutral interface.
- **Primary-60 (#7068FF):** A lighter blue for hover states, subtle emphasis, and secondary emphasis layers when the brand needs a softer signal.
- **Primary-10 (#E9E7FF):** A pale tint for pills, tags, and quiet informational callouts. It keeps emphasis present without competing with the main CTA.
- **Secondary (#13151A):** A near-black ink used for headlines, body copy, icons, and high-contrast UI text. It gives the page its sharp editorial feel.
- **Tertiary (#D8D8D8):** A light gray border and divider tone used for structural lines, outlines, and inactive chrome.
- **Neutral (#E5E7EB):** A slightly softer gray for secondary borders and subdued surfaces where the UI needs separation without weight.
- **Surface (#FFFFFF):** Pure white background and card fill color, supporting the bright, airy layout.
- **On-surface (#13151A):** The default readable text color on white and light surfaces.
- **Muted (#6B7280):** A calm gray for supporting body copy, helper text, and less critical navigation items.
- **Border (#D8D8D8):** The default line color for cards, buttons, and containers that need a crisp outline.
- **Error (#D92D20):** Reserved for validation and destructive states; it is not prominent in the source but should remain clearly distinct.

## Typography
The hierarchy is built around two families: Space Grotesk for all display and UI labeling, and Rethink Sans for readable paragraph copy. Headlines are light-weight and highly tracked negatively, which creates a sleek, modern editorial voice rather than a heavy marketing aesthetic. Body text is simpler and more open, with comfortable line height and neutral spacing for long-form reading.

- `headline-display`, `headline-lg`, and `headline-md` should be used for hero and section headlines. They are large, geometric, and slightly compressed, with strong negative letter spacing that makes them feel contemporary and confident.
- `headline-sm` supports smaller section titles and card headers while preserving the same visual rhythm.
- `body-lg` is the preferred lead paragraph size for hero copy and explanatory messaging.
- `body-md` and `body-sm` handle supporting text, navigation helpers, and dense content areas.
- `label-lg` and `label-md` are suited to navigation, button text, and interface labels; they stay visually consistent with the display family so the brand feels unified.
- `label-sm` is useful for chips, microcopy, and badge-like labels. Uppercase treatment is not dominant, but small labels benefit from added letter spacing when used in all-caps contexts.

## Layout
The page uses a fixed, wide, editorial landing-page structure with large areas of white space and clean vertical separation between sections. Content is arranged in a two-column hero: text on the left, a diagrammatic product illustration on the right. Spacing feels generous but controlled, with the provided rhythm values aligning to clear jumps between small UI gaps, card padding, and section-scale breathing room.

Sections should favor generous horizontal padding, thin dividers, and clear alignment rather than dense modular packing. Cards and small controls use tight internal padding, while major page sections rely on much larger whitespace to keep the interface calm and premium. The visual rhythm is based on simple steps: `xs` for micro gaps, `sm` for UI spacing, `md` for component-to-component separation, `lg` for section structure, and `xl` for major layout breaks.

## Elevation & Depth
The interface is mostly flat, relying on contrast, borders, and spacing rather than layered shadows. Depth appears sparingly in the source: subtle outlined cards, light grid structure, and strong color contrast around active elements. When elevation is needed, it should remain understated and secondary to the crisp geometric framing.

Use borders and tonal tints to separate surfaces before introducing shadows. Shadows should be rare and only used for special emphasis; the default system prefers clean outlines and direct visual hierarchy over soft depth effects.

## Shapes
The shape language is architectural and restrained. Most controls are square or nearly square, with `rounded.none` used on primary buttons, secondary buttons, and the core input treatment. Small cards may use `rounded.sm` to soften larger content blocks without changing the overall sharp identity.

Avoid pill-shaped controls unless a chip or badge is explicitly meant to read as a tag. The result should feel precise, technical, and product-led rather than playful or organic.

## Components
Buttons are the strongest visual affordance in the system.
- `button-primary` is the main action style: electric blue background, white text, 46px height, and 14px by 30px padding. It should be used for the highest-priority CTA only.
- `button-primary-hover` can lighten to `primary-60` while preserving the same shape and text color.
- `button-secondary` is a quiet outlined alternative for secondary actions. It uses a white background, dark text, and a light border.
- `button-tertiary` is link-like and minimal, used for text actions and secondary navigation. Keep it unboxed and low emphasis.
- Buttons should feel compact and structured, with no shadows and no rounded corners.

Cards are clean containers with white fills, thin borders, and modest padding.
- `card` should be used for small feature blocks, form groups, and supporting content panels.
- Keep card content aligned and simple; avoid heavy shadows or decorative chrome.

Inputs should match the button geometry and system restraint.
- Use `input` with a white background, dark text, square corners, and the same 46px control height as buttons.
- Borders should stay subtle and consistent with the overall line language.
- Focus states should rely on color contrast and border color shifts rather than glow effects.

Chips and labels should remain compact and highly legible.
- `chip` uses the pale blue tint with blue text for lightweight categorization and callouts.
- Keep chips square or nearly square rather than pill-shaped to preserve the system’s technical tone.

Navigation and icon treatments should be minimal.
- Nav links use `nav-link` styling and should stay understated unless active.
- Icons are thin, monochrome, and diagrammatic; use them as functional cues rather than decoration.

## Do's and Don'ts
- Do use Space Grotesk for headlines, labels, and buttons to keep the brand cohesive.
- Do reserve `primary` for the main CTA and key highlights so the interface stays focused.
- Do keep layouts spacious, with clear section breaks and generous whitespace.
- Do use borders and contrast first when separating surfaces; keep shadows minimal.
- Don't introduce rounded, pill-heavy UI unless it is clearly a chip or badge.
- Don't use multiple bright accent colors; the design relies on one dominant blue.
- Don't make body text overly tight or condensed; Rethink Sans should stay readable and calm.
- Don't add decorative depth, gradients, or noisy effects that compete with the crisp landing-page structure.