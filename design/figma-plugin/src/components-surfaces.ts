// Surfaces and rows: the card shell and its types, the dashboard card header, grouped settings
// rows, library and diary food rows, the diary meal-card header, swipe-to-delete and the
// collapsible section header.
//
// Every value comes from SparkyFitnessMobile/DESIGN.md section 4 ("Cards and surfaces", "List rows
// and grouped settings rows") and 5, checked against the components it names: SettingsRow.tsx
// (SettingsRow + SettingsRowGroup), FoodLibraryRow.tsx / MealLibraryRow.tsx, FoodThumbnail.tsx,
// SwipeableFoodRow.tsx, SwipeableDeleteRow.tsx (DeleteRowAction), FoodSummary.tsx (MealSection and
// EmptyState), CollapsibleSection.tsx, DiaryCalorieMacroSummary.tsx (inset note) and the dashboard
// cards' header row (TrainingLoadDashboardCard.tsx, MedicationsCard.tsx, ProgressPhotosCard.tsx).
//
// Three catalog entries use the same name for a variant axis and a text property (Card Header
// "Link", Diary Food Row "Time", Meal Card Header "Meal"). Two properties with one name are
// ambiguous in Figma and in setProps(), so those text layers are exposed under distinct names
// ("Link text", "Time label") and the meal label is carried by the Meal variant itself.

import {
  COMPONENT_CATALOG,
  add,
  board,
  component,
  divider,
  effect,
  frame,
  icon,
  iconComponent,
  instance,
  paint,
  rect,
  section,
  setFrameTheme,
  setProps,
  single,
  spacer,
  text,
  variantSet,
  type ComponentName,
  type FrameOpts,
  type Pad,
  type ThemeName,
} from './core';

const PILL = 999;
/** Width of a phone content column: 375pt screen minus two 16pt gutters. */
const COLUMN = 343;
/** Content width inside a `p-4` card in that column. */
const CARD_INNER = COLUMN - 32;

type Catalog = typeof COMPONENT_CATALOG;
type CardType = Catalog['Card']['Type'][number];
type Trailing = Catalog['Settings Row']['Trailing'][number];
type Meal = Catalog['Meal Card Header']['Meal'][number];
type Flag = 'true' | 'false';

// ---------------------------------------------------------------- local helpers

/**
 * Figma's resize() (which core.style() calls when width or height is given) switches BOTH
 * auto-layout sizing modes to FIXED. Put HUG back on the axis that was not given, otherwise the
 * frame keeps the default 100px on that axis.
 */
function restoreHug(f: FrameNode | ComponentNode, o: FrameOpts): void {
  if (!o.dir) return;
  if (o.width !== undefined && o.height === undefined) f.layoutSizingVertical = 'HUG';
  if (o.height !== undefined && o.width === undefined) f.layoutSizingHorizontal = 'HUG';
}

/** core.frame() with the hugging axis restored. */
function box(o: FrameOpts, children: SceneNode[] = []): FrameNode {
  const f = frame(o, children);
  restoreHug(f, o);
  return f;
}

/** core.component() with the hugging axis restored. */
function comp(name: string, o: FrameOpts, build: (c: ComponentNode) => void): ComponentNode {
  return component(name, o, (c) => {
    restoreHug(c, o);
    build(c);
  });
}

/** Component sets built by this module, so examples can instantiate the exact variant. */
const builtSets = new Map<ComponentName, ComponentSetNode>();

/** Combines variants (core.variantSet) and lets the set hug its rows of variants. */
function makeSet(
  name: ComponentName,
  variants: ComponentNode[],
  parent: FrameNode,
  columns: number,
  description: string
): ComponentSetNode {
  const set = variantSet(name, variants, parent, { columns, description });
  // variantSet() resizes the set, which fixes its height at the pre-wrap value.
  set.counterAxisSizingMode = 'AUTO';
  builtSets.set(name, set);
  return set;
}

function variantProps(variantName: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of variantName.split(',')) {
    const [k, v] = pair.split('=');
    if (k !== undefined && v !== undefined) out[k.trim()] = v.trim();
  }
  return out;
}

/**
 * Like core.instance(), but instantiates the variant that matches props directly instead of the
 * default variant followed by a swap. Same result in Figma; it also keeps the test mock (which
 * duplicates a main component's layers on every createInstance) from inflating one variant.
 */
function use(name: ComponentName, props: Record<string, string> = {}): InstanceNode {
  const set = builtSets.get(name);
  if (!set) return instance(name, props);
  const match = set.children.find((child): child is ComponentNode => {
    if (child.type !== 'COMPONENT') return false;
    const axes = variantProps(child.name);
    return Object.keys(axes).every((axis) => props[axis] === undefined || props[axis] === axes[axis]);
  });
  if (!match) return instance(name, props);
  const inst = match.createInstance();
  setProps(inst, props);
  return inst;
}

/** Appends a text that stretches across its auto-layout parent and wraps (or truncates). */
function fillText(parent: FrameNode | ComponentNode, t: TextNode): TextNode {
  add(parent, t, { h: 'FILL' });
  t.textAutoResize = 'HEIGHT';
  return t;
}

/** An icon that belongs to the component but is not its swappable slot (core exposes only "Icon"). */
function glyph(name: string, size: number, token: string, layerName: string): InstanceNode {
  const i = icon(name, size, token);
  i.name = layerName;
  return i;
}

type Shape = VectorNode | EllipseNode | RectangleNode | BooleanOperationNode;

function isShape(n: SceneNode): n is Shape {
  return n.type === 'VECTOR' || n.type === 'ELLIPSE' || n.type === 'RECTANGLE' || n.type === 'BOOLEAN_OPERATION';
}

/** Recolors a glyph instance: stroked paths get the stroke, filled paths the fill. */
function tint(glyphInstance: InstanceNode, token: string): void {
  const p = paint(token);
  for (const s of glyphInstance.findAll(isShape).filter(isShape)) {
    if (Array.isArray(s.strokes) && s.strokes.length > 0) s.strokes = [p];
    if (Array.isArray(s.fills) && s.fills.length > 0) s.fills = [p];
  }
}

/** Swaps an instance's "Icon" slot to another app icon and tints it with a category token. */
function swapIcon(inst: InstanceNode, name: string, token: string): void {
  setProps(inst, { Icon: iconComponent(name).id });
  const slot = inst.findOne((n) => n.type === 'INSTANCE' && n.name === 'Icon');
  if (slot && slot.type === 'INSTANCE') tint(slot, token);
}

/**
 * Exposes text layers named `layer` as a TEXT property of the same name. Used for the text
 * properties whose catalog name collides with a variant axis. Call it right after the set is
 * combined, before any instance of it exists.
 */
function exposeText(set: ComponentSetNode, layer: string): void {
  const targets = set.findAll((n) => n.type === 'TEXT' && n.name === layer).filter((n): n is TextNode => n.type === 'TEXT');
  if (targets.length === 0) return;
  const key = set.addComponentProperty(layer, 'TEXT', targets[0].characters);
  for (const t of targets) t.componentPropertyReferences = { characters: key };
}

/** The standard card shell: Porcelain Card, 16px corners, shadow-sm, no border. */
function cardShell(name: string, o: { pad?: Pad; gap?: number; width?: number; clip?: boolean } = {}): FrameNode {
  const f = box({ name, dir: 'V', gap: o.gap ?? 0, pad: o.pad ?? 16, fill: 'surface', radius: 16, width: o.width ?? COLUMN, clip: o.clip });
  effect(f, 'Elevation/Card (shadow-sm)');
  return f;
}

/** A transparent column of fixed width for examples that sit straight on the canvas. */
function column(name: string, gap = 0, width = COLUMN): FrameNode {
  return box({ name, dir: 'V', gap, width });
}

/** Wraps an example on a canvas-colored plate rendered in another theme. */
function themed(child: FrameNode, mode: ThemeName, label: string): FrameNode {
  const plate = frame({ name: `${label} plate`, dir: 'V', pad: 16, fill: 'background', radius: 16 });
  add(plate, child);
  setFrameTheme(plate, mode);
  return plate;
}

/** Label + spec under a specimen (local copy of core.caption with the height left to hug). */
function note(label: string, spec: string, width: number): FrameNode {
  const f = box({ name: `Caption ${label}`, dir: 'V', gap: 2, width });
  fillText(f, text(label, { role: 'Body/Field label', width }));
  if (spec) fillText(f, text(spec, { role: 'Caption/Default', color: 'text-muted', width }));
  return f;
}

/** A node with its caption below it. */
function specimenOf(node: SceneNode, label: string, spec: string): FrameNode {
  const f = frame({ name: `Specimen ${label}`, dir: 'V', gap: 8 });
  add(f, node);
  add(f, note(label, spec, Math.max(200, node.width)));
  return f;
}

/** Adds a "Usage" block (overline, note, wrapping example row) to a section and returns the row. */
function usage(content: FrameNode, summary: string): FrameNode {
  const wrap = frame({ name: 'Usage', dir: 'V', gap: 12 });
  add(content, wrap, { h: 'FILL' });
  add(wrap, text('USAGE', { role: 'Overline/Default', color: 'text-muted' }));
  fillText(wrap, text(summary, { role: 'Body/Default', color: 'text-secondary' }));
  const row = frame({ name: 'Examples', dir: 'H', gap: 40, wrap: true });
  add(wrap, row, { h: 'FILL' });
  return row;
}

// ---------------------------------------------------------------- Card

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_CALORIES = [1720, 1950, 1610, 2240, 1880, 1540, 2010];

/** Plot placeholder for the chart card: gridlines, seven Calorie Indigo bars and day labels. */
function plot(width: number): FrameNode {
  const base = 120;
  const max = 2400;
  const f = frame({ name: 'Plot', width, height: base + 24 });
  for (const y of [0, 40, 80, base]) add(f, divider(width, 'border-subtle'), { absolute: { x: 0, y } });
  const slot = width / WEEK.length;
  const barW = 20;
  WEEK_CALORIES.forEach((v, i) => {
    const h = Math.round((v / max) * base);
    const bar = rect(barW, h, 'calories', 4);
    bar.bottomLeftRadius = 0;
    bar.bottomRightRadius = 0;
    bar.name = `Bar ${i + 1}`;
    add(f, bar, { absolute: { x: Math.round(i * slot + (slot - barW) / 2), y: base - h } });
    const label = text(WEEK[i], { role: 'Chart/Axis', color: 'text-muted', align: 'CENTER', width: slot, name: `Axis ${i + 1}` });
    add(f, label, { absolute: { x: i * slot, y: base + 8 } });
  });
  return f;
}

/**
 * A TEXT property has one default for the whole set, and Figma shows it in every variant bound to
 * it, so all four card types share these. Instances set their own copy (see Usage).
 */
const CARD_TITLE = 'Calories';
const CARD_BODY = '1,640 of 2,100 Cal eaten today';

function cardVariant(type: CardType): ComponentNode {
  const name = `Type=${type}`;
  if (type === 'Standard') {
    return comp(name, { dir: 'V', gap: 8, pad: 16, fill: 'surface', radius: 16, width: COLUMN }, (c) => {
      effect(c, 'Elevation/Card (shadow-sm)');
      fillText(c, text(CARD_TITLE, { role: 'Card/Dashboard title', color: 'text-secondary', name: 'Title' }));
      fillText(c, text(CARD_BODY, { role: 'Body/Default', color: 'text-secondary', name: 'Body' }));
    });
  }
  if (type === 'Chart') {
    return comp(name, { dir: 'V', gap: 8, pad: 16, fill: 'surface', radius: 16, width: COLUMN }, (c) => {
      effect(c, 'Elevation/Card (shadow-sm)');
      fillText(c, text(CARD_TITLE, { role: 'Title/Screen bar', color: 'text-primary', name: 'Title' }));
      add(c, plot(CARD_INNER));
      fillText(c, text(CARD_BODY, { role: 'Caption/Default', color: 'text-muted', name: 'Body' }));
    });
  }
  if (type === 'Inset') {
    return comp(name, { dir: 'V', gap: 2, pad: { x: 12, y: 8 }, fill: 'surface', radius: 12, width: COLUMN }, (c) => {
      fillText(c, text(CARD_TITLE, { size: 12, lineHeight: 16, weight: 'Semi Bold', color: 'text-primary', name: 'Title' }));
      fillText(c, text(CARD_BODY, { role: 'Caption/Default', color: 'text-secondary', name: 'Body' }));
    });
  }
  return comp(name, { dir: 'V', pad: { x: 16, y: 24 }, align: 'CENTER', cross: 'CENTER', fill: 'surface', radius: 16, width: COLUMN }, (c) => {
    effect(c, 'Elevation/Card (shadow-sm)');
    fillText(c, text(CARD_BODY, { size: 16, lineHeight: 24, weight: 'Regular', color: 'text-muted', align: 'CENTER', name: 'Body' }));
  });
}

function buildCardSection(body: FrameNode): void {
  const s = section(
    body,
    'Card',
    'One shell for content: bg-surface rounded-xl p-4 shadow-sm (Porcelain Card, 16px corners, 16px padding, small soft shadow, no border). Dashboard cards stack 12pt apart (mb-3), settings-style cards 16pt (mb-4). Chart cards keep the shell and use an 18px semibold Ink Navy title with 8px below it. The inset note is the only rounded-lg surface: px-3 py-2, no shadow. The placeholder card is FoodSummary’s empty state: py-6, centered 16px Muted Slate prompt. In Dark and AMOLED the shadow does nothing; depth comes from the surface step.'
  );
  makeSet(
    'Card',
    COMPONENT_CATALOG.Card.Type.map(cardVariant),
    s,
    2,
    'bg-surface rounded-xl (16) p-4 shadow-sm. Standard: 14px bold Slate Secondary title, mb-2, 14px Slate Secondary body. Chart: same shell, text-lg font-semibold text-text-primary title, mb-2, plot. Inset (DiaryCalorieMacroSummary): rounded-lg (12) bg-surface px-3 py-2, text-xs semibold text-primary + text-xs text-secondary, no shadow. Placeholder (FoodSummary EmptyState): items-center py-6, text-base text-text-muted; set Body to the prompt ("Tap to add photos", "Tap to add food").'
  );

  const row = usage(s, 'New cards use the standard shell; never re-create the drifted shadowless or bordered variants listed in DESIGN.md.');
  const steps = use('Card', { Type: 'Standard', Title: 'Steps', Body: '8,420 of 10,000 steps · 3.2 km walked' });
  add(row, specimenOf(steps, 'Dashboard card', 'Type=Standard'));
  const empty = use('Card', { Type: 'Placeholder', Body: 'Tap to add photos' });
  add(row, specimenOf(empty, 'Empty photos card', 'Type=Placeholder, Body is the prompt'));
  const inset = use('Card', { Type: 'Inset', Title: 'Projected TDEE: 2,410 kcal', Body: 'Goal Mode target: 1,910 kcal' });
  add(row, specimenOf(inset, 'Projected TDEE note', 'Type=Inset, under the diary summary (mt-2)'));
}

// ---------------------------------------------------------------- Card Header

function cardHeaderVariant(link: Flag): ComponentNode {
  return comp(`Link=${link}`, { dir: 'H', align: 'SPACE_BETWEEN', cross: 'CENTER', width: CARD_INNER }, (c) => {
    add(c, text('Training load', { role: 'Card/Dashboard title', color: 'text-secondary', name: 'Title' }));
    if (link === 'true') {
      const action = frame({ name: 'Action', dir: 'H', gap: 2, cross: 'CENTER' });
      add(c, action);
      add(action, text('Details', { size: 14, lineHeight: 20, weight: 'Medium', color: 'accent-primary', name: 'Link text' }));
      add(action, glyph('chevron-forward', 14, 'accent-primary', 'Chevron'));
    }
  });
}

/** A dashboard card made of a Card Header instance and hand-built content (mb-2 under the header). */
function dashboardCard(name: string, header: Record<string, string>, fill: (card: FrameNode) => void): FrameNode {
  const card = cardShell(name, { gap: 8 });
  add(card, use('Card Header', header), { h: 'FILL' });
  fill(card);
  return card;
}

function buildCardHeaderSection(body: FrameNode): void {
  const s = section(
    body,
    'Card Header',
    'Dashboard card header: flex-row justify-between items-center mb-2. Bold title on the left in Slate Secondary (14px, RN’s default size); optional “Details” or “View all” link on the right in Sparky Blue, 14px medium, with a 14px forward chevron (ml 2px). Tapping the header row usually navigates.'
  );
  const set = makeSet(
    'Card Header',
    COMPONENT_CATALOG['Card Header'].Link.map(cardHeaderVariant),
    s,
    2,
    'TrainingLoadDashboardCard / MedicationsCard header row. Title: font-bold text-text-secondary (14). Link: text-accent-primary font-medium (14) + chevron-forward 14 accent. Text properties: Title, "Link text" (the link label; "Link" is the variant axis).'
  );
  exposeText(set, 'Link text');

  const row = usage(s, 'Sits at the top of a standard card, 8pt above the card content.');
  add(
    row,
    specimenOf(
      dashboardCard('Training load card', { Link: 'true', Title: 'Training load', 'Link text': 'Details' }, (card) => {
        const value = frame({ name: 'Value', dir: 'H', gap: 4, cross: 'BASELINE' });
        add(card, value);
        add(value, text('412', { role: 'Number/Ring center' }));
        add(value, text('acute load, 7 days', { role: 'Body/Default', color: 'text-secondary' }));
      }),
      'With a link',
      'Link=true, "Details"'
    )
  );
  add(
    row,
    specimenOf(
      dashboardCard('Medications card', { Link: 'true', Title: 'Medications', 'Link text': 'View all' }, (card) => {
        fillText(card, text('Metformin 500 mg', { role: 'Row/Title' }));
        fillText(card, text('Next dose 8:00 PM · 1 of 2 taken today', { role: 'Row/Subtitle', color: 'text-secondary' }));
      }),
      'View all',
      'Link=true, "View all"'
    )
  );
  add(
    row,
    specimenOf(
      dashboardCard('Fasting card', { Link: 'false', Title: 'Fasting' }, (card) => {
        add(card, text('12:30:14', { role: 'Number/Stat tile' }));
        fillText(card, text('16:8 fast · ends at 10:00 AM', { role: 'Body/Default', color: 'text-secondary' }));
      }),
      'Title only',
      'Link=false'
    )
  );
}

// ---------------------------------------------------------------- Settings Row and group

function settingsRowVariant(trailing: Trailing): ComponentNode {
  return comp(`Trailing=${trailing}`, { dir: 'H', cross: 'CENTER', pad: 16, fill: 'surface', width: COLUMN }, (c) => {
    const tile = frame({ name: 'Icon tile', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 40, height: 40, radius: 12 });
    add(c, tile);
    add(tile, icon('measurements', 22, 'cat-teal'));
    add(c, spacer(12, 40));
    const copy = frame({ name: 'Text', dir: 'V', gap: 2, pad: { r: 8 } });
    add(c, copy, { h: 'FILL' });
    fillText(copy, text('Units', { role: 'Row/Title', singleLine: true, name: 'Title' }));
    fillText(copy, text('Weight, distance and energy', { role: 'Row/Subtitle', color: 'text-secondary', singleLine: true, name: 'Subtitle' }));
    if (trailing === 'Chevron') add(c, glyph('chevron-forward', 20, 'text-secondary', 'Chevron'));
    if (trailing === 'Switch') add(c, instance('Switch', { On: 'true' }));
    if (trailing === 'Value') {
      const value = frame({ name: 'Trailing', dir: 'H', gap: 4, cross: 'CENTER' });
      add(c, value);
      add(value, text('Metric', { role: 'Body/Default', color: 'text-secondary', name: 'Value' }));
      add(value, glyph('chevron-forward', 20, 'text-secondary', 'Chevron'));
    }
  });
}

function buildSettingsRowSection(body: FrameNode): void {
  const s = section(
    body,
    'Settings Row',
    'SettingsRow: p-4 flex-row items-center. A 40×40 icon tile (rounded-lg, transparent by default, mr-3) holds a 22px semibold glyph in a category color (Slate Secondary by default). Title 16px semibold Ink Navy, one line; subtitle 14px Slate Secondary, mt-0.5, one line cut in the middle. The trailing slot is a 20px Slate Secondary chevron when the row navigates, or a switch, a value or nothing. Pressed 70% opacity, disabled 50%.'
  );
  makeSet(
    'Settings Row',
    COMPONENT_CATALOG['Settings Row'].Trailing.map(settingsRowVariant),
    s,
    2,
    'SettingsRow.tsx · p-4 flex-row items-center; tile w-10 h-10 rounded-lg mr-3, Icon size 22 semibold, iconColor = category token; text flex-1 mr-2: text-base font-semibold text-text-primary / text-sm text-text-secondary mt-0.5. Trailing: chevron-forward 20 text-secondary, Switch, value text-sm text-secondary + chevron, or none. Swap the Icon property and recolor the glyph with a cat-* token.'
  );

  const row = usage(s, 'A lone row is its own card (bg-surface rounded-xl p-4 mb-4 shadow-sm), as Server and Health Data Sync are on the Settings tab. Rows that belong together go in one grouped card (next sections).');
  const card = cardShell('Server row card', { pad: 0, clip: true });
  const server = use('Settings Row', { Trailing: 'Chevron', Title: 'Server', Subtitle: 'sparky.home.lan · Connected' });
  swapIcon(server, 'server', 'cat-slate');
  add(card, server, { h: 'FILL' });
  add(row, specimenOf(card, 'Standalone row', 'Trailing=Chevron, icon server in cat-slate'));
}

function buildSettingsGroupHeaderSection(body: FrameNode): void {
  const s = section(
    body,
    'Settings Group Header',
    'Optional header of a SettingsRowGroup: px-4 pt-3 pb-1 with an uppercase text-xs font-bold Slate Secondary overline and wide tracking (tracking-wider, 0.05em). Only grouped settings cards use it; sheet section headers use the semibold Muted Slate overline instead.'
  );
  const header = comp('Settings Group Header', { dir: 'V', pad: { x: 16, t: 12, b: 4 }, fill: 'surface', width: COLUMN }, (c) => {
    fillText(c, text('Nutrition', { size: 12, lineHeight: 16, weight: 'Bold', color: 'text-secondary', uppercase: true, letterSpacingPercent: 5, name: 'Overline' }));
  });
  single('Settings Group Header', header, s, 'SettingsRowGroup title · px-4 pt-3 pb-1, text-xs font-bold text-text-secondary uppercase tracking-wider.');
}

/** A SettingsRowGroup: header, then rows with full-width 1px dividers between them, in one card. */
function settingsGroup(): FrameNode {
  const card = cardShell('Settings group · Nutrition', { pad: 0, clip: true });
  add(card, use('Settings Group Header', { Overline: 'Nutrition' }), { h: 'FILL' });
  const rows: { props: Record<string, string>; glyph: string; color: string }[] = [
    { props: { Trailing: 'Chevron', Title: 'Goals', Subtitle: '2,100 Cal · 30/40/30 macros' }, glyph: 'calorie-settings', color: 'calories' },
    { props: { Trailing: 'Switch', Title: 'Show net calories', Subtitle: 'Subtract exercise from intake' }, glyph: 'flame', color: 'cat-orange' },
    { props: { Trailing: 'Value', Title: 'Energy unit', Subtitle: 'Diary, dashboard and reports', Value: 'kcal' }, glyph: 'measurements', color: 'cat-teal' },
  ];
  rows.forEach((r, i) => {
    if (i > 0) add(card, divider(COLUMN, 'border-subtle'), { h: 'FILL' });
    const inst = use('Settings Row', r.props);
    swapIcon(inst, r.glyph, r.color);
    add(card, inst, { h: 'FILL' });
  });
  return card;
}

function buildSettingsGroupSection(body: FrameNode): void {
  const s = section(
    body,
    'Settings group',
    'SettingsRowGroup: one card (bg-surface rounded-xl mb-4 shadow-sm) with full-width h-px Hairline Divider lines between rows and no inset. Built from a Settings Group Header and three Settings Row instances; shown in Light and Dark.',
    'H',
    40,
    true
  );
  add(s, specimenOf(settingsGroup(), 'Light', 'Chevron, Switch and Value rows'));
  add(s, specimenOf(themed(settingsGroup(), 'dark', 'Dark'), 'Dark', 'Same instances; the card is one surface step above the canvas'));
}

// ---------------------------------------------------------------- Library Row

function libraryRowVariant(thumbnail: Flag): ComponentNode {
  return comp(
    `Thumbnail=${thumbnail}`,
    { dir: 'H', cross: 'CENTER', fill: 'surface', stroke: 'border-subtle', strokeSides: { b: 1 }, width: COLUMN },
    (c) => {
      if (thumbnail === 'true') {
        const slot = frame({ name: 'Thumbnail slot', dir: 'H', pad: { l: 16, y: 12 } });
        add(c, slot);
        const thumb = frame({ name: 'Thumbnail', dir: 'H', align: 'CENTER', cross: 'CENTER', width: 40, height: 40, radius: 8, fill: 'raised', clip: true });
        add(slot, thumb);
        add(thumb, icon('food', 20, 'text-muted'));
      }
      const content = frame({
        name: 'Content',
        dir: 'H',
        align: 'SPACE_BETWEEN',
        cross: 'CENTER',
        pad: { l: thumbnail === 'true' ? 12 : 16, r: 16, y: 12 },
      });
      add(c, content, { h: 'FILL' });
      const copy = frame({ name: 'Text', dir: 'V', gap: 2, pad: { r: 12 } });
      add(content, copy, { h: 'FILL' });
      fillText(copy, text('Greek yogurt, plain', { size: 16, lineHeight: 24, weight: 'Medium', singleLine: true, name: 'Name' }));
      fillText(copy, text('Fage Total 0%', { role: 'Row/Subtitle', color: 'text-secondary', singleLine: true, name: 'Brand' }));
      const numbers = frame({ name: 'Calories', dir: 'V', cross: 'END' });
      add(content, numbers);
      add(numbers, text('90 cal', { role: 'Row/Title', align: 'RIGHT', name: 'Calories' }));
      add(numbers, text('170 g', { role: 'Caption/Default', color: 'text-secondary', align: 'RIGHT', name: 'Serving' }));
    }
  );
}

function buildLibraryRowSection(body: FrameNode): void {
  const s = section(
    body,
    'Library Row',
    'Foods, meals and search results: a 40px thumbnail with 8px corners in pl-4 py-3 (an empty slot is Bright Control Fill with a Muted Slate food or meal glyph at half size), the name in 16px medium (one line), the brand in 14px Slate Secondary, and on the right the calories (16px semibold) over the serving (12px Slate Secondary). Rows are separated by border-b Hairline Divider and sit full width in a grouped card with overflow hidden.'
  );
  makeSet(
    'Library Row',
    COMPONENT_CATALOG['Library Row'].Thumbnail.map(libraryRowVariant),
    s,
    2,
    'FoodLibraryRow.tsx / MealLibraryRow.tsx · flex-row items-center border-b border-border-subtle; thumbnail View pl-4 py-3 + FoodThumbnail size 40 radius 8 (fallback bg-raised, glyph size/2 text-muted); body flex-1 pr-4 py-3: name text-base font-medium, brand text-sm text-text-secondary mt-0.5, calories text-base font-semibold over serving text-xs text-text-secondary. The 12px gap after the thumbnail follows FoodSearchResultRow (mx-3); FoodLibraryRow currently has none. Swap Icon to "meal" for meal rows.'
  );

  const row = usage(s, 'Library list: one grouped card, rows full width, the last row without its hairline.');
  const card = cardShell('Food library list', { pad: 0, clip: true });
  const items: { props: Record<string, string>; glyph?: string }[] = [
    { props: { Thumbnail: 'true', Name: 'Greek yogurt, plain', Brand: 'Fage Total 0%', Calories: '90 cal', Serving: '170 g' } },
    { props: { Thumbnail: 'true', Name: 'Rolled oats', Brand: 'Bob’s Red Mill', Calories: '150 cal', Serving: '40 g' } },
    { props: { Thumbnail: 'true', Name: 'Post-workout shake', Brand: '3 foods', Calories: '320 cal', Serving: '1 serving' }, glyph: 'meal' },
  ];
  items.forEach((item, i) => {
    const inst = use('Library Row', item.props);
    if (item.glyph) swapIcon(inst, item.glyph, 'text-muted');
    if (i === items.length - 1) inst.strokeBottomWeight = 0;
    add(card, inst, { h: 'FILL' });
  });
  add(row, specimenOf(card, 'Foods and meals', 'Thumbnail=true; the meal row swaps Icon to "meal"'));
}

// ---------------------------------------------------------------- Diary Food Row

function diaryRowVariant(time: Flag): ComponentNode {
  return comp(`Time=${time}`, { dir: 'H', cross: 'CENTER', pad: { y: 6 }, fill: 'surface', width: CARD_INNER }, (c) => {
    const line = frame({ name: 'Text', dir: 'H', cross: 'BASELINE', pad: { r: 8 }, clip: true });
    add(c, line, { h: 'FILL' });
    add(line, text('Oatmeal with blueberries', { role: 'Body/Default', color: 'text-primary', name: 'Name' }));
    add(line, text(' · ', { role: 'Body/Default', color: 'text-secondary', name: 'Separator' }));
    add(line, text('1 cup', { role: 'Body/Default', color: 'text-secondary', name: 'Quantity' }));
    if (time === 'true') {
      const slot = frame({ name: 'Time slot', dir: 'H', pad: { l: 6 } });
      add(line, slot);
      add(slot, text('8:15 AM', { role: 'Caption/Default', color: 'text-link', name: 'Time label' }));
    }
    add(c, text('310 Cal ▾', { size: 14, lineHeight: 20, weight: 'Medium', color: 'text-secondary', name: 'Calories' }));
  });
}

function buildDiaryRowSection(body: FrameNode): void {
  const s = section(
    body,
    'Diary Food Row',
    'Dense diary rows inside a meal card: py-1.5, no dividers, bg-surface. The name is 14px regular Ink Navy, followed by “ · quantity unit” in 14px Slate Secondary and an optional logged time in 12px Link Blue (ml-1.5). On the right is a plain “N Cal ▾” text button in 14px medium Slate Secondary (not Sparky Blue) that opens the serving sheet. An optional 56px photo with 8px corners leads the row only when the entry has one.'
  );
  const set = makeSet(
    'Diary Food Row',
    COMPONENT_CATALOG['Diary Food Row'].Time.map(diaryRowVariant),
    s,
    2,
    'SwipeableFoodRow.tsx · py-1.5 flex-row items-center bg-surface; text flex-1 mr-2, flex-row items-baseline: name text-text-primary (14), " · qty unit" text-sm text-text-secondary, time text-xs text-text-link ml-1.5; right: ghost button text-sm text-text-secondary font-medium "N Cal ▾". Text properties: Name, Quantity, Calories, "Time label" ("Time" is the variant axis).'
  );
  exposeText(set, 'Time label');

  const row = usage(s, 'Rows stack with no gap or divider; swipe left to delete, long-press for Adjust serving and Delete.');
  const card = cardShell('Breakfast rows', { width: COLUMN });
  add(card, use('Diary Food Row', { Time: 'true', Name: 'Scrambled eggs', Quantity: '2 large', 'Time label': '7:45 AM', Calories: '182 Cal ▾' }), { h: 'FILL' });
  add(card, use('Diary Food Row', { Time: 'false', Name: 'Whole wheat toast', Quantity: '1 slice', Calories: '80 Cal ▾' }), { h: 'FILL' });
  add(row, specimenOf(card, 'Logged foods', 'Time=true then Time=false'));
}

// ---------------------------------------------------------------- Meal Card Header

const MEAL_GLYPH: Record<Meal, string> = {
  Breakfast: 'meal-breakfast',
  Lunch: 'meal-lunch',
  Dinner: 'meal-dinner',
  Snacks: 'meal-snack',
};

function mealHeaderVariant(meal: Meal): ComponentNode {
  return comp(`Meal=${meal}`, { dir: 'H', gap: 8, cross: 'CENTER', fill: 'surface', width: CARD_INNER }, (c) => {
    add(c, glyph(MEAL_GLYPH[meal], 18, 'accent-primary', 'Meal icon'));
    fillText(c, text(meal, { role: 'Card/Diary title', color: 'text-secondary', name: 'Meal label' }));
    // Same spec as the Meal Calorie Chip component (bg-accent-primary/5 rounded-full px-2.5 py-0.5,
    // text-xs font-semibold accent), drawn in place so its label can be the "Calories" property.
    const chip = frame({ name: 'Meal Calorie Chip', dir: 'H', pad: { x: 10, y: 2 }, cross: 'CENTER', fill: 'accent-primary', fillOpacity: 0.05, radius: PILL });
    add(c, chip);
    add(chip, text('420 / 600 Cal', { size: 12, lineHeight: 16, weight: 'Semi Bold', color: 'accent-primary', name: 'Calories' }));
    add(c, glyph('chevron-forward', 14, 'accent-primary', 'Chevron'));
  });
}

function buildMealHeaderSection(body: FrameNode): void {
  const s = section(
    body,
    'Meal Card Header',
    'Diary meal-card header (FoodSummary MealSection): flex-row gap-2 items-center mb-3. An 18px Sparky Blue meal glyph (meal-breakfast, meal-lunch, meal-dinner, meal-snack; custom meals use meal-snack), the meal name in 16px bold Slate Secondary (flex-1), the calorie chip “eaten / target Cal” (just “eaten Cal” without a target) and a 14px Sparky Blue chevron when the header opens the meal breakdown.'
  );
  makeSet(
    'Meal Card Header',
    COMPONENT_CATALOG['Meal Card Header'].Meal.map(mealHeaderVariant),
    s,
    2,
    'FoodSummary.tsx MealSection header · flex-row gap-2 mb-3 items-center; Icon MEAL_CONFIG[meal].icon size 18 accent-primary; text-base font-bold text-text-secondary flex-1; chip bg-accent-primary/5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-accent-primary; chevron-forward 14 accent-primary. The Meal variant sets glyph and label (edit the label text for custom meals); Calories is the chip text.'
  );

  const row = usage(s, 'Breakfast with a meal target, and Snacks without one (the chip shows only the eaten calories).');
  const breakfast = cardShell('Breakfast header');
  add(breakfast, use('Meal Card Header', { Meal: 'Breakfast', Calories: '262 / 600 Cal' }), { h: 'FILL' });
  add(row, specimenOf(breakfast, 'With a target', 'Meal=Breakfast, "262 / 600 Cal"'));
  const snacks = cardShell('Snacks header');
  add(snacks, use('Meal Card Header', { Meal: 'Snacks', Calories: '180 Cal' }), { h: 'FILL' });
  add(row, specimenOf(snacks, 'No target', 'Meal=Snacks, "180 Cal"'));
}

/** A diary meal card: MealSection shell (bg-surface rounded-xl p-4 shadow-sm), header mb-3, rows. */
function mealCard(): FrameNode {
  const card = cardShell('Meal card · Lunch', { gap: 12, clip: true });
  add(card, use('Meal Card Header', { Meal: 'Lunch', Calories: '540 / 700 Cal' }), { h: 'FILL' });
  const rows = column('Rows', 0, CARD_INNER);
  add(card, rows, { h: 'FILL' });
  const entries: Record<string, string>[] = [
    { Time: 'true', Name: 'Grilled chicken salad', Quantity: '1 bowl', 'Time label': '12:40 PM', Calories: '420 Cal ▾' },
    { Time: 'false', Name: 'Sourdough bread', Quantity: '1 slice', Calories: '120 Cal ▾' },
    { Time: 'false', Name: 'Sparkling water', Quantity: '330 ml', Calories: '0 Cal ▾' },
  ];
  for (const e of entries) add(rows, use('Diary Food Row', e), { h: 'FILL' });
  return card;
}

function buildMealCardSection(body: FrameNode): void {
  const s = section(
    body,
    'Meal card',
    'FoodSummary MealSection assembled from a Meal Card Header and three Diary Food Rows: bg-surface rounded-xl p-4 overflow-hidden shadow-sm, header mb-3, rows straight below. Meal cards stack 8pt apart (gap-2). Shown in Light and AMOLED.',
    'H',
    40,
    true
  );
  add(s, specimenOf(mealCard(), 'Light', 'Lunch, 540 of 700 Cal'));
  add(s, specimenOf(themed(mealCard(), 'amoled', 'AMOLED'), 'AMOLED', 'Near-black card on the pure black canvas'));
}

// ---------------------------------------------------------------- Swipe Delete Row

const DELETE_ACTION_WIDTH = 80;

function buildSwipeDeleteSection(body: FrameNode): void {
  const s = section(
    body,
    'Swipe Delete Row',
    'Swiping a row left reveals an 80px Danger Fill panel with a near-white text-sm font-semibold “Delete” label (Danger Fill Ink). A confirmation alert follows; long-press offers the same actions. The row is drawn fully open: content shifted 80pt left, clipped by the list.'
  );
  const height = 48;
  const swipe = comp('Swipe Delete Row', { width: COLUMN, height, fill: 'surface', clip: true }, (c) => {
    const content = box({ name: 'Row (swiped open)', dir: 'H', cross: 'CENTER', pad: { x: 16, y: 12 }, fill: 'surface', width: COLUMN });
    add(c, content, { absolute: { x: -DELETE_ACTION_WIDTH, y: 0 } });
    fillText(content, text('Cycle started Oct 3, 2026', { size: 16, lineHeight: 24, weight: 'Medium', singleLine: true, name: 'Name' }));
    const action = frame({ name: 'Delete action', dir: 'V', align: 'CENTER', cross: 'CENTER', fill: 'bg-danger', width: DELETE_ACTION_WIDTH, height });
    add(c, action, { absolute: { x: COLUMN - DELETE_ACTION_WIDTH, y: 0 } });
    add(action, text('Delete', { size: 14, lineHeight: 20, weight: 'Semi Bold', color: 'text-danger', name: 'Delete' }));
  });
  single(
    'Swipe Delete Row',
    swipe,
    s,
    'SwipeableDeleteRow.tsx · DeleteRowAction: bg-bg-danger justify-center items-center, width 80 (DELETE_ACTION_WIDTH), label text-text-danger font-semibold text-sm "Delete". SwipeableFoodRow adds ml-4 before the panel.'
  );

  const row = usage(s, 'Cycle history list: one row swiped open between resting rows.');
  const card = cardShell('Cycle history', { pad: 0, clip: true });
  const resting = (label: string): FrameNode => {
    const r = box({ name: label, dir: 'H', cross: 'CENTER', pad: { x: 16, y: 12 }, fill: 'surface', width: COLUMN });
    fillText(r, text(label, { size: 16, lineHeight: 24, weight: 'Medium', singleLine: true }));
    return r;
  };
  add(card, resting('Cycle started Nov 1, 2026'), { h: 'FILL' });
  add(card, divider(COLUMN, 'border-subtle'), { h: 'FILL' });
  add(card, use('Swipe Delete Row', { Name: 'Cycle started Oct 3, 2026' }));
  add(card, divider(COLUMN, 'border-subtle'), { h: 'FILL' });
  add(card, resting('Cycle started Sep 5, 2026'), { h: 'FILL' });
  add(row, specimenOf(card, 'Swiped open', 'Name "Cycle started Oct 3, 2026"'));
}

// ---------------------------------------------------------------- Collapsible Header

function collapsibleVariant(open: Flag): ComponentNode {
  return comp(
    `Open=${open}`,
    { dir: 'H', align: 'SPACE_BETWEEN', cross: 'CENTER', pad: { y: 12 }, stroke: 'border-subtle', strokeSides: { b: 0.5 }, width: COLUMN },
    (c) => {
      const lead = frame({ name: 'Lead', dir: 'H', gap: 8, cross: 'CENTER' });
      add(c, lead);
      // The app rotates chevron-down by -90deg over 200ms when collapsing; chevron-forward is the same glyph at rest.
      add(lead, glyph(open === 'true' ? 'chevron-down' : 'chevron-forward', 20, 'text-secondary', 'Chevron'));
      add(lead, text('Activity', { role: 'Row/Title', name: 'Title' }));
      add(c, text('(4 items)', { role: 'Body/Default', color: 'text-muted', name: 'Count' }));
    }
  );
}

function buildCollapsibleSection(body: FrameNode): void {
  const s = section(
    body,
    'Collapsible Header',
    'CollapsibleSection header: py-3 with a hairline bottom border (Hairline Divider), a 20px Slate Secondary chevron that rotates from down (open) to right (closed) over 200ms, a 16px semibold Ink Navy title and a 14px Muted Slate “(count)”. Content follows mt-1; sections are mt-2 apart, straight on the canvas.'
  );
  makeSet(
    'Collapsible Header',
    COMPONENT_CATALOG['Collapsible Header'].Open.map(collapsibleVariant),
    s,
    2,
    'CollapsibleSection.tsx · flex-row justify-between items-center py-3 border-b border-border-subtle (hairlineWidth); chevron-down 20 text-secondary rotated -90deg when closed; title text-base font-semibold text-text-primary; count text-sm text-text-muted "(N items)".'
  );

  const row = usage(s, 'Health data sync categories: one open section with its rows, two collapsed below.');
  const list = column('Health data categories', 8);
  add(list, use('Collapsible Header', { Open: 'true', Title: 'Activity', Count: '(2 items)' }), { h: 'FILL' });
  const group = cardShell('Activity rows', { pad: 0, clip: true });
  add(list, group, { h: 'FILL' });
  const steps = use('Settings Row', { Trailing: 'Switch', Title: 'Steps', Subtitle: 'Synced every hour' });
  swapIcon(steps, 'exercise-walking', 'cat-green');
  add(group, steps, { h: 'FILL' });
  add(group, divider(COLUMN, 'border-subtle'), { h: 'FILL' });
  const energy = use('Settings Row', { Trailing: 'Switch', Title: 'Active energy', Subtitle: 'Synced every hour' });
  swapIcon(energy, 'flame', 'cat-orange');
  add(group, energy, { h: 'FILL' });
  add(list, use('Collapsible Header', { Open: 'false', Title: 'Body measurements', Count: '(3 items)' }), { h: 'FILL' });
  add(list, use('Collapsible Header', { Open: 'false', Title: 'Sleep', Count: '(2 items)' }), { h: 'FILL' });
  add(row, specimenOf(list, 'Health Data Sync', 'Open=true, then Open=false ×2'));
}

// ---------------------------------------------------------------- boards

function buildCardsBoard(): FrameNode {
  const { root, body } = board(
    'Cards',
    'Screens are stacks of soft, rounded cards on the cool canvas. One shell carries almost everything: Porcelain Card, 16px corners, 16px padding and the small soft shadow, no border. Dashboard cards open with a Slate Secondary title and an optional Sparky Blue “Details” link. In Dark and AMOLED, depth comes from the surface steps (canvas, card, raised control), not from shadows.'
  );
  buildCardSection(body);
  buildCardHeaderSection(body);
  return root;
}

function buildRowsBoard(): FrameNode {
  const { root, body } = board(
    'Rows & lists',
    'Lists come in two forms: full-bleed rows with bottom hairlines, or rows inside one grouped card with overflow hidden and full-width 1px dividers. Settings rows are 56–78pt (p-4), library rows about 64pt, diary food rows compact (py-1.5). Tappable rows dim to 70% while pressed; there is no ripple or scale.'
  );
  buildSettingsRowSection(body);
  buildSettingsGroupHeaderSection(body);
  buildSettingsGroupSection(body);
  buildLibraryRowSection(body);
  buildDiaryRowSection(body);
  buildMealHeaderSection(body);
  buildMealCardSection(body);
  buildSwipeDeleteSection(body);
  buildCollapsibleSection(body);
  return root;
}

/** Builds the Cards and Rows & lists boards and their components. */
export function buildSurfaces(): FrameNode[] {
  return [buildCardsBoard(), buildRowsBoard()];
}
