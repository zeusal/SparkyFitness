// Foundations: color, typography, spacing and radius, elevation, iconography and themes.
// Every value comes from SparkyFitnessMobile/DESIGN.md sections 1-5 and 9, global.css (through
// src/data/tokens.ts) and Icon.tsx (through src/data/icons.ts).

import * as core from './core';
import { COLOR_TOKENS, RADIUS_TOKENS, SPACING_TOKENS, type ColorToken, type ColorValue } from './data/tokens';
import { ICONS } from './data/icons';

type Mode = core.ThemeName;

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
  { mode: 'amoled', label: 'AMOLED' },
];

// ---------------------------------------------------------------- local helpers

/**
 * core.frame() resizes a frame when width or height is given, and Figma's resize() resets
 * BOTH auto-layout sizing modes to FIXED. Restore HUG on the axis that was not given so the
 * frame still grows with its content (otherwise it stays at the default 100px).
 */
function box(o: core.FrameOpts, children: SceneNode[] = []): FrameNode {
  const f = core.frame(o, children);
  if (o.dir) {
    if (o.width !== undefined && o.height === undefined) f.layoutSizingVertical = 'HUG';
    if (o.height !== undefined && o.width === undefined) f.layoutSizingHorizontal = 'HUG';
  }
  return f;
}

/** Label + spec + usage stacked under a specimen, wrapping at a fixed width. */
function note(label: string, spec: string, usage: string, width: number): FrameNode {
  const f = box({ name: `Caption ${label}`, dir: 'V', gap: 2, width });
  core.add(f, core.text(label, { role: 'Body/Field label', width, name: 'Label' }), { h: 'FILL' });
  if (spec) core.add(f, core.text(spec, { role: 'Caption/Default', color: 'text-secondary', width, name: 'Spec' }), { h: 'FILL' });
  if (usage) core.add(f, core.text(usage, { role: 'Caption/Default', color: 'text-muted', width, name: 'Usage' }), { h: 'FILL' });
  return f;
}

/** A small titled group inside a section (title over a wrapping row). */
function group(parent: FrameNode, title: string, width: number, gap = 12): FrameNode {
  const g = box({ name: title, dir: 'V', gap: 10 });
  core.add(parent, g, { h: 'FILL' });
  core.add(g, core.text(title, { role: 'Body/Field label', color: 'text-secondary', width }), { h: 'FILL' });
  const row = box({ name: `${title} / items`, dir: 'H', gap, wrap: true, cross: 'CENTER' });
  core.add(g, row, { h: 'FILL' });
  return row;
}

function hexLabel(v: ColorValue): string {
  return v.a < 1 ? `${v.hex} · ${Math.round(v.a * 100)}%` : v.hex;
}

function tokenByKey(key: string): ColorToken {
  const t = COLOR_TOKENS.find((c) => core.tokenKey(c.token) === key);
  if (!t) throw new Error(`Unknown color token ${key}`);
  return t;
}

/** Utility classes as DESIGN.md section 2 lists them; JS-only tokens fall back to the CSS variable. */
const TOKEN_CLASSES: Record<string, string> = {
  background: 'bg-background',
  surface: 'bg-surface',
  raised: 'bg-raised',
  chrome: 'bg-chrome',
  border: 'border-border, bg-border',
  'border-subtle': 'border-border-subtle, bg-border-subtle',
  'chrome-border': 'border-chrome-border, bg-chrome-border',
  'text-primary': 'text-text-primary',
  'text-secondary': 'text-text-secondary',
  'text-muted': 'text-text-muted, bg-text-muted',
  'text-link': 'text-text-link',
  'accent-primary': 'bg-accent-primary, text-accent-primary, border-accent-primary',
  'form-disabled': '--color-form-disabled (mostly JS)',
  exercise: 'bg-exercise',
  'progress-track': 'bg-progress-track',
  'progress-rail': 'bg-progress-rail',
  'bg-success': 'bg-bg-success',
  'text-success': 'text-text-success',
  'bg-warning': 'bg-bg-warning',
  'text-warning': 'text-text-warning',
  'bg-danger': 'bg-bg-danger',
  'text-danger': 'text-text-danger',
  'bg-danger-subtle': 'bg-bg-danger-subtle',
  'text-danger-subtle': 'text-text-danger-subtle',
  'icon-danger': 'text-icon-danger',
};

function tokenClass(key: string): string {
  return TOKEN_CLASSES[key] ?? `--color-${key} (JS only)`;
}

const GROUP_NOTES: Record<string, string> = {
  'Surfaces and chrome':
    'In Light, the canvas is the darkest surface and controls are white. In Dark, raised is the lightest surface, so a control on a card always looks lifted. Chrome is for persistent bars only.',
  'Borders and dividers':
    'Hairline Divider is the default border (row dividers, input resting border, menu outline). Standard Border has the same value as subtle in Light and is stronger in Dark.',
  'Text and icons':
    'Three text colors carry nearly everything: Ink Navy, Slate Secondary and Muted Slate. Decorative Glyph is for icons only.',
  'Accent and controls':
    'A single blue accent marks the primary action, the selected state and the focused field, and is the default color for action glyphs. Navigation chrome stays neutral.',
  'Nutrition and activity metrics':
    'Most color on screen carries data meaning. Every metric has one token; ring arcs run protein, carbs, fat.',
  'Category palette':
    'Eight balanced hues for things that need a distinct color but no fixed meaning. Seven of them (all but amber) tint Settings row icons, and all eight color workout superset rails and the workout-complete confetti.',
  'Progress tracks': 'The empty part of rings, bars and rails, plus the overfill color past a goal.',
  Status:
    'Status colors come in pairs: a wash with its ink, or the solid red fill with near-white ink. Standalone status text, dots and icons use the glyph colors.',
  'Wellness and date tints': 'Cycle phases and pregnancy, plus the date pill tint for days before and after today.',
};

// ---------------------------------------------------------------- 1. Color

const CARD_W = 350;
const CARD_INNER = CARD_W - 32;

function swatchCell(token: ColorToken, mode: Mode, label: string): FrameNode {
  const key = core.tokenKey(token.token);
  const cell = box({ name: `${label} swatch`, dir: 'V', gap: 4, width: 100 });
  // The frame's explicit mode makes the same variable resolve to this theme's value.
  const themed = box({ name: `Theme ${label}`, dir: 'H', pad: 6, fill: 'background', radius: 10, stroke: 'border-subtle' });
  core.setFrameTheme(themed, mode);
  const r = core.rect(88, 48, key, 8);
  r.name = key;
  core.bindStroke(r, 'border-subtle');
  core.add(themed, r);
  core.add(cell, themed);
  core.add(cell, core.text(label, { role: 'Caption/Default', color: 'text-secondary', name: 'Mode' }));
  core.add(cell, core.text(hexLabel(token[mode]), { role: 'Caption/Default', name: 'Hex' }));
  return cell;
}

function swatchCard(token: ColorToken): FrameNode {
  const key = core.tokenKey(token.token);
  const card = box({ name: token.name, dir: 'V', gap: 12, pad: 16, fill: 'surface', radius: 16, stroke: 'border-subtle', width: CARD_W });
  const head = box({ name: 'Head', dir: 'V', gap: 2 });
  core.add(card, head, { h: 'FILL' });
  core.add(head, core.text(token.name, { role: 'Row/Title', width: CARD_INNER, name: 'Role' }), { h: 'FILL' });
  core.add(head, core.text(tokenClass(key), { role: 'Caption/Default', color: 'text-secondary', width: CARD_INNER, name: 'Token class' }), { h: 'FILL' });
  core.add(head, core.text(`Variable ${token.group}/${key}`, { role: 'Caption/Micro', color: 'text-muted', width: CARD_INNER, name: 'Variable' }), { h: 'FILL' });
  const row = box({ name: 'Swatches', dir: 'H', gap: 9 });
  core.add(card, row, { h: 'FILL' });
  for (const m of MODES) core.add(row, swatchCell(token, m.mode, m.label));
  core.add(card, core.text(token.usage, { role: 'Caption/Default', color: 'text-muted', width: CARD_INNER, name: 'Usage' }), { h: 'FILL' });
  return card;
}

function colorRules(body: FrameNode, width: number): void {
  const content = core.section(
    body,
    'Color rules',
    'From DESIGN.md section 2. Components bind tokens, never hex values; a new color goes into global.css in all three theme blocks first.'
  );
  const rules = [
    'Semantic tokens only. A new color goes into SparkyFitnessMobile/global.css in all three theme blocks (light, dark, amoled) before any component uses it. No hex values, palette classes or dark: variants in components; JS-only tokens are read with useCSSVariable and alpha is added with withAlpha.',
    'Status colors come in pairs: a wash with its ink (bg-bg-success + text-text-success, warning, info, bg-bg-danger-subtle + text-text-danger-subtle), or the solid red fill with near-white ink (bg-bg-danger + text-text-danger). Ink is only legible on its wash: in Dark and AMOLED it reads near-white. Standalone status text, dots and icons use the icon-* glyph colors, and a destructive text button uses text-icon-danger.',
    'Metric mapping: calories use Calorie Indigo; protein, carbs, fat and fiber use the macro tokens, with ring arcs in the order protein, carbs, fat; hydration uses Hydration Steel Blue; training load uses Exercise Mint; watch heart rate and active energy use their own tokens; personal records use PR Gold. Trend charts draw their main series in Sparky Blue.',
    'Opacity modifiers are uncommon. Most are accent tints (accent-primary at 5, 10, 15 and 20%), softened borders (border at 30, 40 and 50%), accent borders at 20 and 40% and black scrims (40 to 70%). The date pill uses its tint at 12% for the fill and 35% for the 1px border.',
    'Fixed colors that do not follow the theme: white text and icons on accent or red fills, the white switch thumb, white or black controls over camera feeds and photos, black scrims and shadow color #000.',
  ];
  const list = box({ name: 'Rules', dir: 'V', gap: 8 });
  core.add(content, list, { h: 'FILL' });
  for (const r of rules) core.add(list, core.text(`•  ${r}`, { role: 'Body/Default', color: 'text-secondary', width }), { h: 'FILL' });

  // Status pairs.
  const pairs = group(content, 'Status pairs: wash + ink, or solid fill + near-white ink', width);
  const pairDefs: [string, string, string][] = [
    ['bg-success', 'text-success', 'Synced 2 min ago'],
    ['bg-info', 'text-info', 'New: run programs'],
    ['bg-warning', 'text-warning', 'Server update needed'],
    ['bg-danger-subtle', 'text-danger-subtle', 'Contains peanuts'],
    ['bg-danger', 'text-danger', 'Could not save'],
  ];
  for (const [wash, ink, label] of pairDefs) {
    const chip = box({ name: `${wash} + ${ink}`, dir: 'V', gap: 2, pad: { x: 14, y: 10 }, fill: wash, radius: 12 });
    core.add(chip, core.text(label, { role: 'Toast/Title', color: ink }));
    core.add(chip, core.text(`${tokenByKey(wash).name} + ${tokenByKey(ink).name}`, { role: 'Caption/Default', color: ink, opacity: 0.85 }));
    core.add(pairs, chip);
  }
  const glyphs: [string, string, string][] = [
    ['checkmark-circle', 'icon-success', 'Success Glyph'],
    ['warning', 'icon-warning', 'Warning Glyph'],
    ['alert-circle', 'icon-danger', 'Danger Glyph'],
  ];
  for (const [name, token, label] of glyphs) {
    const g = box({ name: label, dir: 'H', gap: 6, cross: 'CENTER', pad: { x: 4, y: 10 } });
    core.add(g, core.icon(name, 20, token));
    core.add(g, core.text(label, { role: 'Body/Default', color: token }));
    core.add(pairs, g);
  }

  // Metric mapping.
  const metrics = group(content, 'Metric mapping', width, 20);
  const metricDefs: [string, string][] = [
    ['calories', 'Calories'],
    ['macro-protein', 'Protein'],
    ['macro-carbs', 'Carbs'],
    ['macro-fat', 'Fat'],
    ['macro-fiber', 'Fiber'],
    ['hydration', 'Hydration'],
    ['exercise', 'Training load'],
    ['heart-rate', 'Heart rate'],
    ['active-energy', 'Active energy'],
    ['pr', 'Personal record'],
    ['accent-primary', 'Trend series'],
  ];
  for (const [token, label] of metricDefs) {
    const m = box({ name: label, dir: 'H', gap: 6, cross: 'CENTER' });
    core.add(m, core.ellipse(10, token));
    core.add(m, core.text(label, { role: 'Caption/Default', color: 'text-secondary' }));
    core.add(metrics, m);
  }

  // Opacity modifiers.
  const opacity = group(content, 'Opacity modifiers', width, 16);
  for (const pct of [5, 10, 15, 20]) {
    const cell = box({ name: `accent-primary/${pct}`, dir: 'V', gap: 4 });
    core.add(cell, core.rect(72, 40, 'accent-primary', 8, pct / 100));
    core.add(cell, core.text(`accent /${pct}`, { role: 'Caption/Default', color: 'text-secondary' }));
    core.add(opacity, cell);
  }
  for (const pct of [30, 40, 50]) {
    const cell = box({ name: `border/${pct}`, dir: 'V', gap: 4 });
    const r = core.rect(72, 40, 'raised', 8);
    core.bindStroke(r, 'border', 1, 'INSIDE', pct / 100);
    core.add(cell, r);
    core.add(cell, core.text(`border /${pct}`, { role: 'Caption/Default', color: 'text-secondary' }));
    core.add(opacity, cell);
  }
  const scrimCell = box({ name: 'Scrim', dir: 'V', gap: 4 });
  const scrim = core.rect(72, 40, null, 8);
  scrim.fills = [core.solid('#000000', 0.5)];
  core.add(scrimCell, scrim);
  core.add(scrimCell, core.text('black /40–70', { role: 'Caption/Default', color: 'text-secondary' }));
  core.add(opacity, scrimCell);
  const pillCell = box({ name: 'Date pill', dir: 'V', gap: 4 });
  const pill = box({ name: 'Date pill (past)', dir: 'H', gap: 4, cross: 'CENTER', pad: { x: 10, y: 4 }, radius: 999, fill: 'date-past', fillOpacity: 0.12, stroke: 'date-past', strokeOpacity: 0.35 });
  core.add(pill, core.text('Yesterday', { size: 18, weight: 'Medium', lineHeight: 28, color: 'date-past' }));
  core.add(pill, core.icon('chevron-down', 14, 'date-past'));
  core.add(pillCell, pill);
  core.add(pillCell, core.text('date tint /12 fill, /35 border', { role: 'Caption/Default', color: 'text-secondary' }));
  core.add(opacity, pillCell);
}

function buildColorBoard(): FrameNode {
  const changed = COLOR_TOKENS.filter((t) => t.amoled.hex !== t.dark.hex || t.amoled.a !== t.dark.a).length;
  const width = 1600;
  const { root, body } = core.board(
    'Color',
    `${COLOR_TOKENS.length} color variables in the "SparkyFitness / Color" collection (Light, Dark and AMOLED modes), generated from global.css. Each swatch is a rectangle bound to the variable inside a frame set to that mode, so it always shows the live value. Token classes follow Tailwind v4 naming (utility prefix + token name); tokens marked JS only are read as CSS variables for icons, charts and switch tracks. AMOLED reuses the Dark value for ${COLOR_TOKENS.length - changed} tokens; only ${changed} change (pure-black canvas, darker surfaces and borders).`,
    width
  );
  const groups: string[] = [];
  for (const t of COLOR_TOKENS) if (groups.indexOf(t.group) < 0) groups.push(t.group);
  for (const g of groups) {
    const content = core.section(body, g, GROUP_NOTES[g] ?? '', 'H', 24, true);
    for (const t of COLOR_TOKENS.filter((c) => c.group === g)) core.add(content, swatchCard(t));
  }
  colorRules(body, width - 128);
  return root;
}

// ---------------------------------------------------------------- 2. Typography

interface TypeSpecimen {
  sample: string;
  color: string;
  colorLabel: string;
  /** Draws the sample on its real background (button fill or toast wash). */
  on?: 'button' | 'toast';
}

const TYPE_SPECIMENS: Record<core.TypeRole, TypeSpecimen> = {
  'Title/Tab root': { sample: 'Dashboard', color: 'text-primary', colorLabel: 'Ink Navy (text-text-primary)' },
  'Title/Detail hero': { sample: 'Greek Yogurt, Plain', color: 'text-primary', colorLabel: 'Ink Navy' },
  'Title/Screen bar': { sample: 'Edit Food Entry', color: 'text-primary', colorLabel: 'Ink Navy, centered, 1 line' },
  'Title/Section': { sample: 'Create', color: 'text-primary', colorLabel: 'Ink Navy' },
  'Card/Dashboard title': { sample: 'Fasting', color: 'text-secondary', colorLabel: 'Slate Secondary (text-text-secondary)' },
  'Card/Diary title': { sample: 'Breakfast', color: 'text-secondary', colorLabel: 'Slate Secondary' },
  'Overline/Default': { sample: 'RECENT FOODS', color: 'text-muted', colorLabel: 'Muted Slate, uppercase' },
  'Overline/Settings group': { sample: 'PREFERENCES', color: 'text-secondary', colorLabel: 'Slate Secondary, uppercase, tracking-wider' },
  'Row/Title': { sample: 'Notifications', color: 'text-primary', colorLabel: 'Ink Navy, 1 line (Medium in food rows)' },
  'Row/Subtitle': { sample: 'Rest timer, hydration reminders', color: 'text-secondary', colorLabel: 'Slate Secondary, 1 line, middle ellipsis' },
  'Body/Default': { sample: 'Log your first meal to see today’s totals here.', color: 'text-secondary', colorLabel: 'Slate Secondary' },
  'Body/Field label': { sample: 'Serving size', color: 'text-secondary', colorLabel: 'Slate Secondary' },
  'Body/Input': { sample: '150 g', color: 'text-primary', colorLabel: 'Ink Navy' },
  'Label/Button': { sample: 'Log food', color: 'accent-primary', colorLabel: 'White on primary; accent on secondary, outline, ghost; link; icon-danger on destructive', on: 'button' },
  'Label/Header action': { sample: 'Edit', color: 'text-primary', colorLabel: 'Ink Navy, or Sparky Blue Semi Bold for Save' },
  'Label/Segmented': { sample: 'Week', color: 'text-primary', colorLabel: 'Ink Navy selected, Muted Slate otherwise' },
  'Label/Tab': { sample: 'Diary', color: 'tab-active', colorLabel: 'Active Tab / Inactive Tab' },
  'Caption/Default': { sample: 'Source: USDA FoodData Central', color: 'text-muted', colorLabel: 'Muted Slate (or Slate Secondary)' },
  'Caption/Micro': { sample: '66% · 48g left', color: 'text-muted', colorLabel: 'Muted Slate' },
  'Number/Ring center': { sample: '760', color: 'text-primary', colorLabel: 'Ink Navy' },
  'Number/Stat tile': { sample: '2,180', color: 'text-primary', colorLabel: 'Ink Navy' },
  'Number/Timer': { sample: '14:32:08', color: 'text-primary', colorLabel: 'Ink Navy, tabular digits (rest countdown: Sparky Blue running, Muted Slate paused)' },
  'Chart/Axis': { sample: 'Mon    Tue    Wed    Thu    Fri    Sat    Sun', color: 'text-muted', colorLabel: 'Muted Slate, no font scaling' },
  'Toast/Title': { sample: 'Entry saved', color: 'text-success', colorLabel: 'Toast ink (Success Ink on Success Wash here)', on: 'toast' },
  'Toast/Body': { sample: 'Greek Yogurt added to Breakfast.', color: 'text-success', colorLabel: 'Toast ink at 85%', on: 'toast' },
};

function typeSample(role: core.TypeRole, s: TypeSpecimen): SceneNode {
  if (s.on === 'button') {
    const b = box({ name: 'Primary button', dir: 'H', pad: { x: 16, y: 14 }, fill: 'accent-primary', radius: 16 });
    const t = core.text(s.sample, { role, color: null });
    t.fills = [core.solid('#FFFFFF')];
    core.add(b, t);
    return b;
  }
  if (s.on === 'toast') {
    const toast = box({ name: 'Success toast', dir: 'V', pad: { x: 14, y: 10 }, fill: 'bg-success', radius: 8 });
    core.effect(toast, 'Elevation/Toast');
    core.add(toast, core.text(s.sample, { role, color: s.color, opacity: role === 'Toast/Body' ? 0.85 : 1 }));
    return toast;
  }
  return core.text(s.sample, { role, color: s.color });
}

function buildTypographyBoard(): FrameNode {
  const { root, body } = core.board(
    'Typography',
    'Role-based type scale from DESIGN.md section 3. Every role is a shared text style (Tailwind v4 default sizes and line heights; global.css defines no font or size tokens). The app uses the platform system font only: SF Pro on iOS and Roboto on Android. This file uses Inter as the stand-in.'
  );
  const font = core.section(body, 'Font and weights');
  const weights = box({ name: 'Weights', dir: 'H', gap: 32, wrap: true });
  core.add(font, weights, { h: 'FILL' });
  const weightDefs: [core.Weight, string][] = [
    ['Regular', 'Regular 400 · body, captions'],
    ['Medium', 'Medium 500 · labels (341 uses)'],
    ['Semi Bold', 'Semi Bold 600 · default emphasis (682 uses)'],
    ['Bold', 'Bold 700 · titles, numbers (282 uses)'],
    ['Extra Bold', 'Extra Bold 800 · timers'],
  ];
  for (const [w, label] of weightDefs) {
    const cell = box({ name: w, dir: 'V', gap: 4 });
    core.add(cell, core.text('Aa 1,240', { size: 24, lineHeight: 32, weight: w }));
    core.add(cell, core.text(label, { role: 'Caption/Default', color: 'text-muted' }));
    core.add(weights, cell);
  }
  core.add(
    font,
    core.text(
      'Three sizes carry the UI: 14 (text-sm), 12 (text-xs) and 16 (text-base). Three colors carry nearly everything: Ink Navy, Slate Secondary and Muted Slate. Light and thin weights are never used. Ticking values use tabular digits; numbers and dates follow the user’s locale (formatLocalizedNumber). Text grows with the OS text size with no cap, so rows clamp to one line instead of using fixed heights.',
      { role: 'Body/Default', color: 'text-secondary', width: 1072 }
    ),
    { h: 'FILL' }
  );

  const list = core.section(body, 'Type roles', 'Sample in the role’s style and color, with size / line height, weight, color role and where it is used.', 'V', 0);
  for (const r of core.TYPE_ROLES) {
    const s = TYPE_SPECIMENS[r.name];
    const row = box({ name: r.name, dir: 'H', gap: 32, cross: 'CENTER', pad: { y: 16 }, stroke: 'border-subtle', strokeSides: { b: 1 } });
    core.add(list, row, { h: 'FILL' });
    const left = box({ name: 'Sample', dir: 'V', width: 520 });
    core.add(row, left);
    core.add(left, typeSample(r.name, s));
    const spec = `${r.size}/${r.lineHeight} px · ${r.weight} · ${s.colorLabel}`;
    core.add(row, note(r.name, spec, r.use, 520));
  }
  return root;
}

// ---------------------------------------------------------------- 3. Spacing & Radius

const SPACING: [number, string, string][] = [
  [4, '1', 'gap-1, p-1: icon-to-label gaps, tight stacks'],
  [6, '1.5', 'py-1.5, gap-1.5: compact diary food rows, gaps inside rows'],
  [8, '2', 'gap-2, mb-2: diary meal cards, chips, chart card title spacing'],
  [10, '2.5', 'py-2.5, px-2.5: search fields, picker triggers, AddSheet gutter'],
  [12, '3', 'mb-3, p-3, py-3: Dashboard card gap, grid cards, menu rows, gaps in cards'],
  [14, '3.5', 'py-3.5: button and picker or action-sheet row padding (about 52pt rows)'],
  [16, '4', 'px-4, p-4, mb-4: screen gutter, card padding, Settings card gap'],
  [20, '5', 'px-5, py-5: form sheets, AddSheet tiles'],
  [24, '6', 'px-6: StatusView and wider form sheets'],
  [32, '8', 'py-8: centered loading and empty blocks inside sheets and cards'],
];

const RADII: { px: number; cls: string; meaning: string }[] = [
  { px: 4, cls: 'rounded-sm / rounded', meaning: 'Tiny marks and a few small inline badges.' },
  { px: 8, cls: 'rounded-md', meaning: 'Small rectangular tag badges, selected segment, rating buttons; thumbnails, toasts and wheel bands.' },
  { px: 12, cls: 'rounded-lg', meaning: 'Inputs, search fields, pickers, steppers, segmented track, icon tiles.' },
  { px: 16, cls: 'rounded-xl (= rounded-2xl)', meaning: 'Cards, grouped rows, buttons, menus, AddSheet tiles (379 uses).' },
  { px: 999, cls: 'rounded-full', meaning: 'Chips, pill badges, the date pill, dots, avatars, the Add button, glass pills.' },
];

function buildSpacingBoard(): FrameNode {
  const { root, body } = core.board(
    'Spacing & Radius',
    'Tailwind’s 4pt base. global.css defines --spacing-1 to --spacing-4 (4, 8, 12, 16px, equal to Tailwind’s defaults); half steps (6, 10, 14) are common in controls. Rhythm comes from the 16pt screen gutter, 16pt card padding and 12–16pt gaps between cards, and spacing is set with margins and gap, not space-y. Spacing and radius tokens are also FLOAT variables in "SparkyFitness / Dimension".'
  );
  const content = core.section(body, 'Spacing scale', 'Bars are drawn at 10× the value so small steps stay readable.', 'V', 12);
  for (const [px, step, usage] of SPACING) {
    const tok = SPACING_TOKENS.find((s) => s.px === px);
    const row = box({ name: `${px}px`, dir: 'H', gap: 16, cross: 'CENTER' });
    core.add(content, row, { h: 'FILL' });
    core.add(row, core.text(`${px} px`, { role: 'Row/Title', width: 64 }));
    core.add(row, core.text(tok ? `${step} · ${tok.token}` : step, { role: 'Caption/Default', color: 'text-secondary', width: 180 }));
    const lane = core.frame({ name: 'Bar lane', width: 320, height: 16 });
    const bar = core.rect(px * 10, 16, 'accent-primary', 4);
    bar.name = `${px}px bar`;
    core.add(lane, bar);
    core.add(row, lane);
    core.add(row, core.text(usage, { role: 'Caption/Default', color: 'text-muted', width: 460 }));
  }

  const radius = core.section(
    body,
    'Radius',
    'The app remaps the radius scale: rounded-md = 8px, rounded-lg = 12px, rounded-xl = 16px (web Tailwind: 6, 8, 12). Translate web mockups by pixel value, not by class name, and prefer the four overridden tokens for new work.',
    'H',
    24,
    true
  );
  for (const r of RADII) {
    const tok = RADIUS_TOKENS.find((t) => t.px === r.px);
    const pill = r.px === 999;
    const cell = box({ name: pill ? 'pill' : `${r.px}px`, dir: 'V', gap: 12, width: 192 });
    const stage = box({ name: 'Stage', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 192, height: 112, fill: 'surface', radius: 12 });
    const sample = core.rect(pill ? 152 : 120, pill ? 48 : 80, 'raised', pill ? 24 : r.px);
    sample.name = r.cls;
    core.bindStroke(sample, 'border');
    core.add(stage, sample);
    core.add(cell, stage, { h: 'FILL' });
    core.add(cell, note(pill ? 'Pill' : `${r.px} px`, tok ? `${r.cls} · ${tok.token}` : r.cls, r.meaning, 192), { h: 'FILL' });
    core.add(radius, cell);
  }
  return root;
}

// ---------------------------------------------------------------- 4. Elevation

const EFFECT_USAGE: Record<core.EffectName, string> = {
  'Elevation/Card (shadow-sm)': 'Standard cards, stat mini-cards and the Ask Sparky launcher row (214 uses). Cards normally have no border.',
  'Elevation/Popover (shadow-lg)': 'AnchoredMenu popover, always with a Hairline Divider border.',
  'Elevation/Add button': 'Center Add button in the custom tab bar (elevation 4 on Android).',
  'Elevation/Toast': 'Toasts, set inline with an 8px radius.',
};

function effectSpec(name: core.EffectName): string {
  return core.EFFECTS[name]
    .map((l) => `x ${'x' in l ? l.x : 0}, y ${l.y}, blur ${l.blur}, spread ${l.spread}, #000 ${Math.round(l.a * 100)}%`)
    .join(' + ');
}

function effectSample(name: core.EffectName): SceneNode {
  if (name === 'Elevation/Popover (shadow-lg)') {
    const menu = box({ name: 'Popover', dir: 'V', pad: { y: 4 }, fill: 'surface', radius: 16, stroke: 'border-subtle', width: 192 });
    core.effect(menu, name);
    const items: [string, string][] = [
      ['pencil', 'Edit'],
      ['copy', 'Duplicate'],
    ];
    for (const [i, label] of items) {
      const row = box({ name: label, dir: 'H', gap: 12, cross: 'CENTER', pad: { x: 16, y: 12 } });
      core.add(row, core.icon(i, 20, 'accent-primary'));
      core.add(row, core.text(label, { role: 'Body/Default', color: 'text-primary' }));
      core.add(menu, row, { h: 'FILL' });
    }
    return menu;
  }
  if (name === 'Elevation/Add button') {
    const btn = box({ name: 'Add button', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 56, height: 56, radius: 28, fill: 'accent-primary' });
    core.effect(btn, name);
    core.add(btn, core.icon('add', 28, null, '#FFFFFF'));
    return btn;
  }
  if (name === 'Elevation/Toast') {
    const toast = box({ name: 'Toast', dir: 'V', gap: 2, pad: { x: 14, y: 10 }, fill: 'bg-success', radius: 8, width: 192 });
    core.effect(toast, name);
    core.add(toast, core.text('Entry saved', { role: 'Toast/Title', color: 'text-success' }));
    core.add(toast, core.text('Added to Breakfast.', { role: 'Toast/Body', color: 'text-success', opacity: 0.85 }));
    return toast;
  }
  const card = box({ name: 'Card', dir: 'V', gap: 4, pad: 16, fill: 'surface', radius: 16, width: 192 });
  core.effect(card, name);
  core.add(card, core.text('Steps', { role: 'Card/Dashboard title', color: 'text-secondary' }));
  core.add(card, core.text('8,412', { role: 'Number/Stat tile' }));
  return card;
}

function surfaceStack(mode: Mode, label: string): FrameNode {
  const col = box({ name: `Surfaces ${label}`, dir: 'V', gap: 12, pad: 24, fill: 'background', radius: 16, width: 330 });
  core.setFrameTheme(col, mode);
  core.add(col, core.text(label, { role: 'Title/Section' }));
  core.add(col, core.text(`Canvas · background ${tokenByKey('background')[mode].hex}`, { role: 'Caption/Default', color: 'text-muted' }));
  const card = box({ name: 'Card', dir: 'V', gap: 12, pad: 16, fill: 'surface', radius: 16 });
  if (mode === 'light') core.effect(card, 'Elevation/Card (shadow-sm)');
  core.add(col, card, { h: 'FILL' });
  core.add(card, core.text('Card · surface', { role: 'Card/Dashboard title', color: 'text-secondary' }));
  const control = box({ name: 'Control', dir: 'H', gap: 8, cross: 'CENTER', pad: { x: 12, y: 10 }, fill: 'raised', radius: 12, stroke: 'border-subtle' });
  core.add(card, control, { h: 'FILL' });
  core.add(control, core.icon('search', 18, 'text-muted'));
  core.add(control, core.text('Search foods', { role: 'Body/Input', color: 'text-muted' }));
  core.add(card, core.text(`Control · raised ${tokenByKey('raised')[mode].hex}`, { role: 'Caption/Default', color: 'text-muted' }));
  return col;
}

function buildElevationBoard(): FrameNode {
  const { root, body } = core.board(
    'Elevation',
    'One level for content. Cards use shadow-sm and normally no border; the popover adds shadow-lg plus a hairline border; the Add button and toasts set their shadow inline (black, 8–25%). Each shadow is a shared effect style.'
  );
  const content = core.section(body, 'Shadows', '', 'H', 24, true);
  for (const name of Object.keys(core.EFFECTS) as core.EffectName[]) {
    const cell = box({ name, dir: 'V', gap: 12, width: 248 });
    const stage = box({ name: 'Stage', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 248, height: 168, fill: 'background', radius: 12, stroke: 'border-subtle' });
    core.add(stage, effectSample(name));
    core.add(cell, stage, { h: 'FILL' });
    core.add(cell, note(name.replace('Elevation/', ''), effectSpec(name), EFFECT_USAGE[name], 248), { h: 'FILL' });
    core.add(content, cell);
  }
  const dark = core.section(
    body,
    'Depth in Dark and AMOLED',
    'In Dark and AMOLED, depth comes from the surface steps (canvas → card → raised control), not from shadows: each layer is lighter than the one under it. Shadows stay in code but read as nothing on a dark canvas. In Light the canvas is the darkest surface and the shadow separates the card.',
    'H',
    24,
    true
  );
  for (const m of MODES) core.add(dark, surfaceStack(m.mode, m.label));
  return root;
}

// ---------------------------------------------------------------- 5. Iconography

const ICON_SIZES: { px: number; icon: string; color: string; use: string }[] = [
  { px: 14, icon: 'chevron-forward', color: 'accent-primary', use: 'Card header “Details” chevron, date pill down-chevron' },
  { px: 18, icon: 'search', color: 'text-muted', use: 'Search field glyph, date-navigator and calendar chevrons, verified badge in rows' },
  { px: 20, icon: 'chevron-forward', color: 'text-secondary', use: 'Row chevrons, collapsible headers, stepper ±, banner and AddSheet button glyphs' },
  { px: 22, icon: 'chevron-back', color: 'text-primary', use: 'Header back or close glyph, SettingsRow leading glyph' },
  { px: 24, icon: 'tab-dashboard', color: 'tab-active', use: 'Tab bar icons, header icon actions; Icon’s default size' },
  { px: 28, icon: 'add-circle', color: 'hydration', use: 'Add button plus (white), hydration ± circles, upcoming set ring' },
  { px: 32, icon: 'food', color: 'accent-primary', use: 'AddSheet tile glyphs' },
];

/** Selection swaps the glyph as well as its color (DESIGN.md sections 4 and 7). */
const ICON_PAIRS: { label: string; px: number; off: [string, string]; on: [string, string]; use: string }[] = [
  { label: 'Check circle', px: 22, off: ['checkmark-circle', 'text-muted'], on: ['checkmark-circle-filled', 'accent-primary'], use: 'Multi-select food results (FoodResultRow)' },
  { label: 'Radio', px: 24, off: ['radio-button-off', 'form-disabled'], on: ['radio-button-on', 'accent-primary'], use: 'Single-choice settings rows (cycle mode)' },
  { label: 'Tab', px: 24, off: ['tab-dashboard', 'tab-inactive'], on: ['tab-dashboard', 'tab-active'], use: 'Custom tab bar: same glyph, color only on Android' },
];

function buildIconographyBoard(temp: FrameNode): FrameNode {
  const width = 1600;
  const { root, body } = core.board(
    'Iconography',
    `${core.ICON_NAMES.length} semantic icons from Icon.tsx. The app draws SF Symbols on iOS and Ionicons on Android; these components use the Ionicons glyphs (the Android set) at 24px. Each icon is a component set with a State property, so selected and inactive glyphs are a property change rather than a recolor. Every icon takes an explicit token color: action glyphs default to Sparky Blue, navigation chrome stays neutral (Ink Navy, Slate Secondary, Muted Slate); other colors are a fill override on the instance.`,
    width
  );

  const states = core.section(body, 'States', 'Pick the State on any icon instance, including icons nested in other components. Sparky Blue is the only selected color in the app.', 'H', 24, true);
  for (const s of core.ICON_STATES) {
    const cell = box({ name: s.state, dir: 'V', gap: 12, width: 248 });
    const stage = box({ name: 'Stage', dir: 'H', gap: 20, align: 'CENTER', cross: 'CENTER', width: 248, height: 72, fill: 'surface', radius: 12 });
    for (const n of ['tab-dashboard', 'bookmark', 'checkmark-circle', 'settings']) {
      const i = core.iconComponent(n, s.state).createInstance();
      i.name = 'Icon';
      core.add(stage, i);
    }
    core.add(cell, stage, { h: 'FILL' });
    core.add(cell, note(s.state, `${s.token}${s.opacity < 1 ? ` at ${Math.round(s.opacity * 100)}%` : ''}`, s.use, 248), { h: 'FILL' });
    core.add(states, cell);
  }

  const pairs = core.section(body, 'Selected glyphs', 'Check circles and radios switch to the filled glyph when selected; tabs keep the glyph and change color.', 'H', 24, true);
  for (const pair of ICON_PAIRS) {
    const cell = box({ name: pair.label, dir: 'V', gap: 12, width: 248 });
    const stage = box({ name: 'Stage', dir: 'H', gap: 16, align: 'CENTER', cross: 'CENTER', width: 248, height: 72, fill: 'surface', radius: 12 });
    core.add(stage, core.icon(pair.off[0], pair.px, pair.off[1]));
    core.add(stage, core.icon('chevron-forward', 16, 'text-muted'));
    core.add(stage, core.icon(pair.on[0], pair.px, pair.on[1]));
    core.add(cell, stage, { h: 'FILL' });
    core.add(cell, note(pair.label, `${pair.off[0]} (${pair.off[1]}) → ${pair.on[0]} (${pair.on[1]}) · ${pair.px}px`, pair.use, 248), { h: 'FILL' });
    core.add(pairs, cell);
  }

  const grid = core.section(body, 'Icon set', 'Icon/<name> component sets: Default, Active, Inactive and Disabled. Swap the glyph through the Icon property on any component instance.', 'H', 12, true);
  for (const name of core.ICON_NAMES) {
    const glyph = ICONS[name];
    const cell = box({ name, dir: 'V', gap: 6, pad: 12, width: 160, fill: 'surface', radius: 12, cross: 'CENTER' });
    core.add(cell, core.iconSet(name));
    core.add(cell, core.text(name, { role: 'Caption/Default', width: 136, align: 'CENTER', name: 'Name' }));
    core.add(cell, core.text(`SF: ${glyph.sf} · Ion: ${glyph.ion}`, { role: 'Caption/Micro', color: 'text-muted', width: 136, align: 'CENTER', name: 'Platform names' }));
    core.add(grid, cell);
  }
  temp.remove();

  const sizes = core.section(body, 'Size guide', 'Sizes from DESIGN.md sections 4 and 5. Small glyph buttons keep a 44pt touch target through an 8–10pt hit slop.', 'H', 24, true);
  for (const s of ICON_SIZES) {
    const cell = box({ name: `${s.px}px`, dir: 'V', gap: 8, width: 168 });
    const stage = box({ name: 'Stage', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 168, height: 72, fill: 'surface', radius: 12 });
    core.add(stage, core.icon(s.icon, s.px, s.color));
    core.add(cell, stage, { h: 'FILL' });
    core.add(cell, note(`${s.px} px`, '', s.use, 168), { h: 'FILL' });
    core.add(sizes, cell);
  }
  return root;
}

// ---------------------------------------------------------------- 6. Themes

function themeCard(mode: Mode, label: string): FrameNode {
  const col = box({ name: `Theme ${label}`, dir: 'V', gap: 16, pad: 24, fill: 'background', radius: 16, width: 340 });
  core.setFrameTheme(col, mode);
  core.add(col, core.text(label, { role: 'Title/Section' }));

  const card = box({ name: 'Nutrients card', dir: 'V', gap: 12, pad: 16, fill: 'surface', radius: 16 });
  core.effect(card, 'Elevation/Card (shadow-sm)');
  core.add(col, card, { h: 'FILL' });

  const head = box({ name: 'Card header', dir: 'H', align: 'SPACE_BETWEEN', cross: 'CENTER' });
  core.add(card, head, { h: 'FILL' });
  core.add(head, core.text('Nutrients', { role: 'Card/Dashboard title', color: 'text-secondary' }));
  const link = box({ name: 'Details link', dir: 'H', gap: 2, cross: 'CENTER' });
  core.add(link, core.text('Details', { size: 14, weight: 'Medium', lineHeight: 20, color: 'accent-primary' }));
  core.add(link, core.icon('chevron-forward', 14, 'accent-primary'));
  core.add(head, link);

  core.add(card, core.text('1,240 of 2,000 kcal eaten today. 760 kcal left for dinner.', { role: 'Body/Default', color: 'text-secondary', width: 260 }), { h: 'FILL' });

  const macro = box({ name: 'Macro bar', dir: 'V', gap: 4 });
  core.add(card, macro, { h: 'FILL' });
  const top = box({ name: 'Label row', dir: 'H', align: 'SPACE_BETWEEN', cross: 'CENTER' });
  core.add(macro, top, { h: 'FILL' });
  core.add(top, core.text('Protein', { role: 'Body/Field label', color: 'text-secondary' }));
  core.add(top, core.text('92 / 140 g', { role: 'Body/Field label', color: 'text-primary' }));
  const track = core.frame({ name: 'Track', width: 260, height: 8, radius: 4, fill: 'progress-track', clip: true });
  const fill = core.rect(Math.round(260 * (92 / 140)), 8, 'macro-protein', 4);
  fill.name = 'Fill';
  core.add(track, fill);
  core.add(macro, track);
  core.add(macro, core.text('66% · 48g left', { role: 'Caption/Micro', color: 'text-muted' }));

  const pill = box({ name: 'Accent pill', dir: 'H', gap: 8, cross: 'CENTER', pad: { x: 20, y: 8 }, fill: 'accent-primary', radius: 20 });
  core.add(pill, core.icon('add', 18, null, '#FFFFFF'));
  const lbl = core.text('Log food', { role: 'Label/Button', color: null });
  lbl.fills = [core.solid('#FFFFFF')];
  core.add(pill, lbl);
  core.add(card, pill);

  const hexes = (['background', 'surface', 'raised'] as const).map((k) => `${k} ${hexLabel(tokenByKey(k)[mode])}`).join(' · ');
  core.add(col, core.text(hexes, { role: 'Caption/Default', color: 'text-muted', width: 292 }), { h: 'FILL' });
  return col;
}

function buildThemesBoard(): FrameNode {
  const { root, body } = core.board(
    'Themes',
    'Light, Dark and AMOLED, plus System (follows the OS light/dark setting only, so AMOLED must be picked explicitly). The same card is rendered three times; each frame takes its theme’s values (the color collection’s mode, or the theme’s own collection on plans with one mode per collection), so every bound token switches together. Light is near-white cards on a pale cool-gray canvas with a soft shadow; Dark is charcoal blue-gray with depth from lighter surfaces; AMOLED is Dark with a pure black canvas, near-black cards and darker borders.'
  );
  const content = core.section(body, 'Same card, three themes', 'Check every screen in all three before shipping (DESIGN.md section 9, Theming).', 'H', 24, true);
  for (const m of MODES) core.add(content, themeCard(m.mode, m.label));
  return root;
}

// ---------------------------------------------------------------- entry

export function buildFoundations(): FrameNode[] {
  // Icon components first: the other boards (and every later module) draw instances of them.
  const temp = core.frame({ name: 'Icons (temp)' });
  core.createIconComponents(temp);
  const color = buildColorBoard();
  const type = buildTypographyBoard();
  const spacing = buildSpacingBoard();
  const elevation = buildElevationBoard();
  const icons = buildIconographyBoard(temp);
  const themes = buildThemesBoard();
  return [color, type, spacing, elevation, icons, themes];
}
