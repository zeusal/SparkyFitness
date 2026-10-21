// Core helpers shared by every module of the SparkyFitness design-system builder.
// Every value comes from SparkyFitnessMobile/DESIGN.md (see src/data for generated tokens).
//
// Figma rules this file encodes so modules do not have to remember them:
// - Fonts are loaded once in loadFonts(); always create text through text().
// - layoutSizingHorizontal/Vertical can only be set on a child of an auto-layout
//   frame, so use add(parent, child, sizing) instead of appendChild + sizing.
// - Colors are bound to variables (paint(), bindFill(), bindStroke()); never hard-code
//   a hex except for the fixed colors DESIGN.md lists (white on accent, black scrims).
// - Components are registered by name; screens and patterns instantiate them with
//   instance(name, props) so names in COMPONENT_CATALOG are a contract.

import { COLOR_TOKENS, RADIUS_TOKENS, SPACING_TOKENS, type ColorValue } from './data/tokens';
import { ICONS } from './data/icons';

// ---------------------------------------------------------------- fonts

export const FONT_FAMILY = 'Inter';
export type Weight = 'Regular' | 'Medium' | 'Semi Bold' | 'Bold' | 'Extra Bold' | 'Black';
const WEIGHTS: Weight[] = ['Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'];

export async function loadFonts(): Promise<void> {
  for (const style of WEIGHTS) {
    await figma.loadFontAsync({ family: FONT_FAMILY, style });
  }
}

// ---------------------------------------------------------------- colors and variables

export type ThemeName = 'light' | 'dark' | 'amoled';

interface ThemeState {
  collection: VariableCollection;
  modeIds: Partial<Record<ThemeName, string>>;
  vars: Map<string, Variable>;
  hasModes: boolean;
}

let theme: ThemeState | null = null;

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function toRgba(v: ColorValue): RGBA {
  return { ...hexToRgb(v.hex), a: v.a };
}

/** Short token key: '--color-text-primary' and 'text-primary' both become 'text-primary'. */
export function tokenKey(token: string): string {
  return token.replace(/^--color-/, '');
}

/**
 * Creates the "SparkyFitness / Color" collection with Light, Dark and AMOLED modes and one
 * COLOR variable per token, named "<Group>/<token>". If the Figma plan does not allow more
 * than one mode, the collection keeps Light only and hasModes is false.
 */
export function createColorVariables(): ThemeState {
  const collection = figma.variables.createVariableCollection('SparkyFitness / Color');
  const lightId = collection.modes[0].modeId;
  collection.renameMode(lightId, 'Light');
  const modeIds: Partial<Record<ThemeName, string>> = { light: lightId };
  let hasModes = true;
  try {
    modeIds.dark = collection.addMode('Dark');
    modeIds.amoled = collection.addMode('AMOLED');
  } catch (e) {
    hasModes = false;
  }
  const vars = new Map<string, Variable>();
  for (const t of COLOR_TOKENS) {
    const key = tokenKey(t.token);
    const v = figma.variables.createVariable(`${t.group}/${key}`, collection, 'COLOR');
    v.description = `${t.name}. ${t.usage}`.trim();
    v.scopes = scopesFor(key);
    v.setVariableCodeSyntax('WEB', `var(${t.token})`);
    v.setValueForMode(lightId, toRgba(t.light));
    if (modeIds.dark) v.setValueForMode(modeIds.dark, toRgba(t.dark));
    if (modeIds.amoled) v.setValueForMode(modeIds.amoled, toRgba(t.amoled));
    vars.set(key, v);
  }
  theme = { collection, modeIds, vars, hasModes };
  return theme;
}

/** Variable scopes by token role, so each color only shows up in the pickers it belongs to. */
function scopesFor(key: string): VariableScope[] {
  if (['background', 'surface', 'raised', 'chrome'].includes(key)) return ['FRAME_FILL', 'SHAPE_FILL'];
  if (key.startsWith('border') || key === 'chrome-border') return ['STROKE_COLOR', 'SHAPE_FILL'];
  if (key.startsWith('text-') || key.startsWith('icon-')) return ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
  return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR', 'TEXT_FILL'];
}

/** Spacing and radius variables ("SparkyFitness / Dimension"), mirroring global.css. */
export function createDimensionVariables(): VariableCollection {
  const collection = figma.variables.createVariableCollection('SparkyFitness / Dimension');
  const mode = collection.modes[0].modeId;
  collection.renameMode(mode, 'Value');
  for (const s of SPACING_TOKENS) {
    const v = figma.variables.createVariable(`spacing/${s.token.replace('--spacing-', '')}`, collection, 'FLOAT');
    v.scopes = ['GAP', 'WIDTH_HEIGHT'];
    v.setVariableCodeSyntax('WEB', `var(${s.token})`);
    v.setValueForMode(mode, s.px);
  }
  for (const r of RADIUS_TOKENS) {
    const v = figma.variables.createVariable(`radius/${r.token.replace('--radius-', '')}`, collection, 'FLOAT');
    v.scopes = ['CORNER_RADIUS'];
    v.setVariableCodeSyntax('WEB', `var(${r.token})`);
    v.setValueForMode(mode, r.px);
  }
  return collection;
}

export function getTheme(): ThemeState {
  if (!theme) throw new Error('createColorVariables() must run first');
  return theme;
}

export function colorVar(token: string): Variable {
  const v = getTheme().vars.get(tokenKey(token));
  if (!v) throw new Error(`Unknown color token: ${token}`);
  return v;
}

/** Light-mode value of a token, for places that cannot bind a variable (effects, previews). */
export function tokenValue(token: string, mode: ThemeName = 'light'): RGBA {
  const t = COLOR_TOKENS.find((c) => tokenKey(c.token) === tokenKey(token));
  if (!t) throw new Error(`Unknown color token: ${token}`);
  return toRgba(t[mode]);
}

/** A solid paint bound to a color variable. opacity applies on top of the token (e.g. accent at 10%). */
export function paint(token: string, opacity = 1): SolidPaint {
  const base: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity };
  return figma.variables.setBoundVariableForPaint(base, 'color', colorVar(token));
}

/** A fixed, unbound paint for the fixed colors DESIGN.md allows (white on accent, black scrim). */
export function solid(hex: string, opacity = 1): SolidPaint {
  return { type: 'SOLID', color: hexToRgb(hex), opacity };
}

export function bindFill(node: MinimalFillsMixin, token: string | null, opacity = 1): void {
  node.fills = token ? [paint(token, opacity)] : [];
}

export function bindStroke(
  node: MinimalStrokesMixin & { strokeWeight: number | typeof figma.mixed },
  token: string,
  weight = 1,
  align: 'INSIDE' | 'OUTSIDE' | 'CENTER' = 'INSIDE',
  opacity = 1
): void {
  node.strokes = [paint(token, opacity)];
  node.strokeWeight = weight;
  node.strokeAlign = align;
}

/** Sets the theme a frame (and its children) renders in. No-op when the plan has a single mode. */
export function setFrameTheme(node: FrameNode | ComponentNode | InstanceNode, mode: ThemeName): void {
  const t = getTheme();
  const id = t.modeIds[mode];
  if (id) node.setExplicitVariableModeForCollection(t.collection, id);
}

// ---------------------------------------------------------------- typography

/** Role-based type scale from DESIGN.md section 3 (Tailwind v4 sizes and line heights). */
export const TYPE_ROLES = [
  { name: 'Title/Tab root', size: 24, lineHeight: 32, weight: 'Bold' as Weight, use: 'Tab-root and date-navigator title (text-2xl font-bold)' },
  { name: 'Title/Detail hero', size: 30, lineHeight: 36, weight: 'Bold' as Weight, use: 'Food and exercise detail name (text-3xl)' },
  { name: 'Title/Screen bar', size: 18, lineHeight: 28, weight: 'Semi Bold' as Weight, use: 'Custom header bar title, sheet title, chart card title (text-lg font-semibold)' },
  { name: 'Title/Section', size: 18, lineHeight: 28, weight: 'Semi Bold' as Weight, use: 'In-screen section heading' },
  { name: 'Card/Dashboard title', size: 14, lineHeight: 20, weight: 'Bold' as Weight, use: 'Dashboard card title, Slate Secondary' },
  { name: 'Card/Diary title', size: 16, lineHeight: 24, weight: 'Bold' as Weight, use: 'Diary card title, Slate Secondary' },
  { name: 'Overline/Default', size: 12, lineHeight: 16, weight: 'Semi Bold' as Weight, use: 'Uppercase overline, Muted Slate' },
  { name: 'Overline/Settings group', size: 12, lineHeight: 16, weight: 'Bold' as Weight, use: 'Uppercase, wide tracking, Slate Secondary' },
  { name: 'Row/Title', size: 16, lineHeight: 24, weight: 'Semi Bold' as Weight, use: 'Settings and library row title' },
  { name: 'Row/Subtitle', size: 14, lineHeight: 20, weight: 'Regular' as Weight, use: 'Row subtitle, one line' },
  { name: 'Body/Default', size: 14, lineHeight: 20, weight: 'Regular' as Weight, use: 'Body and supporting copy' },
  { name: 'Body/Field label', size: 14, lineHeight: 20, weight: 'Medium' as Weight, use: 'Form field label above the field' },
  { name: 'Body/Input', size: 16, lineHeight: 20, weight: 'Regular' as Weight, use: 'Text in inputs' },
  { name: 'Label/Button', size: 16, lineHeight: 24, weight: 'Semi Bold' as Weight, use: 'Button label' },
  { name: 'Label/Header action', size: 17, lineHeight: 22, weight: 'Medium' as Weight, use: 'Header text action (Save is Semi Bold)' },
  { name: 'Label/Segmented', size: 14, lineHeight: 20, weight: 'Medium' as Weight, use: 'Segmented control label' },
  { name: 'Label/Tab', size: 12, lineHeight: 16, weight: 'Semi Bold' as Weight, use: 'Focused tab label (unfocused is Medium)' },
  { name: 'Caption/Default', size: 12, lineHeight: 16, weight: 'Regular' as Weight, use: 'Captions and footnotes, Muted Slate' },
  { name: 'Caption/Micro', size: 10, lineHeight: 14, weight: 'Regular' as Weight, use: 'Macro bar caption, quick-add header' },
  { name: 'Number/Ring center', size: 24, lineHeight: 32, weight: 'Bold' as Weight, use: 'Calorie ring remaining value' },
  { name: 'Number/Stat tile', size: 20, lineHeight: 28, weight: 'Bold' as Weight, use: 'Side stats and stat tile values' },
  { name: 'Number/Timer', size: 48, lineHeight: 48, weight: 'Extra Bold' as Weight, use: 'Fasting and live timers (30 to 48px)' },
  { name: 'Chart/Axis', size: 12, lineHeight: 16, weight: 'Regular' as Weight, use: 'Chart axis labels, Muted Slate' },
  { name: 'Toast/Title', size: 14, lineHeight: 20, weight: 'Semi Bold' as Weight, use: 'Toast title' },
  { name: 'Toast/Body', size: 13, lineHeight: 18, weight: 'Regular' as Weight, use: 'Toast body at 85% opacity' },
] as const;

export type TypeRole = (typeof TYPE_ROLES)[number]['name'];
const textStyles = new Map<string, TextStyle>();
const pendingTextStyles: [TextNode, string][] = [];
const pendingEffectStyles: [BlendMixin, string][] = [];

/** Links every text node and effect created so far to its shared style. Call once at the end. */
export async function linkStyles(): Promise<number> {
  let n = 0;
  for (const [node, id] of pendingTextStyles) {
    if (!('removed' in node) || !node.removed) {
      await node.setTextStyleIdAsync(id);
      n++;
    }
  }
  for (const [node, id] of pendingEffectStyles) {
    if (!(node as unknown as SceneNode).removed) {
      await node.setEffectStyleIdAsync(id);
      n++;
    }
  }
  pendingTextStyles.length = 0;
  pendingEffectStyles.length = 0;
  return n;
}

export function createTextStyles(): void {
  for (const r of TYPE_ROLES) {
    const s = figma.createTextStyle();
    s.name = r.name;
    s.fontName = { family: FONT_FAMILY, style: r.weight };
    s.fontSize = r.size;
    s.lineHeight = { unit: 'PIXELS', value: r.lineHeight };
    if (r.name === 'Overline/Settings group') s.letterSpacing = { unit: 'PERCENT', value: 5 };
    s.description = r.use;
    textStyles.set(r.name, s);
  }
}

export interface TextOpts {
  /** A TYPE_ROLES name; sets size, weight and line height through the shared text style. */
  role?: TypeRole;
  size?: number;
  weight?: Weight;
  lineHeight?: number;
  /** Color token, default 'text-primary'. Use null for no fill. */
  color?: string | null;
  opacity?: number;
  align?: 'LEFT' | 'CENTER' | 'RIGHT';
  uppercase?: boolean;
  letterSpacingPercent?: number;
  /** Fixed width with wrapping; omit for auto width. */
  width?: number;
  /** Truncate to one line with an ellipsis (needs width or FILL sizing). */
  singleLine?: boolean;
  name?: string;
}

/** Creates a text node. Prefer role; size/weight override it for one-offs. */
export function text(content: string, opts: TextOpts = {}): TextNode {
  const t = figma.createText();
  const style = opts.role ? textStyles.get(opts.role) : undefined;
  const roleDef = opts.role ? TYPE_ROLES.find((r) => r.name === opts.role) : undefined;
  t.fontName = { family: FONT_FAMILY, style: opts.weight ?? roleDef?.weight ?? 'Regular' };
  t.characters = content;
  t.fontSize = opts.size ?? roleDef?.size ?? 14;
  const lh = opts.lineHeight ?? roleDef?.lineHeight;
  if (lh) t.lineHeight = { unit: 'PIXELS', value: lh };
  if (style && opts.size === undefined && opts.weight === undefined && opts.lineHeight === undefined) {
    // Linked to the shared text style in linkStyles() (async API under dynamic-page).
    pendingTextStyles.push([t, style.id]);
  }
  if (opts.uppercase) t.textCase = 'UPPER';
  if (opts.letterSpacingPercent !== undefined) t.letterSpacing = { unit: 'PERCENT', value: opts.letterSpacingPercent };
  t.textAlignHorizontal = opts.align ?? 'LEFT';
  const color = opts.color === undefined ? 'text-primary' : opts.color;
  t.fills = color ? [paint(color, opts.opacity ?? 1)] : [];
  if (opts.width !== undefined) {
    t.textAutoResize = 'HEIGHT';
    t.resize(opts.width, t.height);
  } else {
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  if (opts.singleLine) {
    t.textTruncation = 'ENDING';
    t.maxLines = 1;
  }
  t.name = opts.name ?? content.slice(0, 40);
  return t;
}

// ---------------------------------------------------------------- effects

export const EFFECTS = {
  'Elevation/Card (shadow-sm)': [
    { y: 1, blur: 3, spread: 0, a: 0.1 },
    { y: 1, blur: 2, spread: -1, a: 0.1 },
  ],
  'Elevation/Popover (shadow-lg)': [
    { y: 10, blur: 15, spread: -3, a: 0.1 },
    { y: 4, blur: 6, spread: -4, a: 0.1 },
  ],
  'Elevation/Add button': [{ x: 2, y: 4, blur: 6, spread: 0, a: 0.25 }],
  'Elevation/Toast': [{ y: 2, blur: 8, spread: 0, a: 0.12 }],
} as const;
export type EffectName = keyof typeof EFFECTS;
const effectStyles = new Map<string, EffectStyle>();

function effectLayers(name: EffectName): DropShadowEffect[] {
  return EFFECTS[name].map(
    (l): DropShadowEffect => ({
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: l.a },
      offset: { x: 'x' in l ? l.x : 0, y: l.y },
      radius: l.blur,
      spread: l.spread,
      visible: true,
      blendMode: 'NORMAL',
    })
  );
}

export function createEffectStyles(): void {
  for (const name of Object.keys(EFFECTS) as EffectName[]) {
    const s = figma.createEffectStyle();
    s.name = name;
    s.effects = effectLayers(name);
    effectStyles.set(name, s);
  }
}

/** Applies a shadow now and links it to the shared effect style in linkStyles(). */
export function effect(node: BlendMixin, name: EffectName): void {
  node.effects = effectLayers(name);
  const s = effectStyles.get(name);
  if (s) pendingEffectStyles.push([node, s.id]);
}

// ---------------------------------------------------------------- layout

export type Sizing = 'FIXED' | 'HUG' | 'FILL';
export type Pad = number | { x?: number; y?: number; t?: number; r?: number; b?: number; l?: number };

export interface FrameOpts {
  name?: string;
  /** Auto layout direction; omit for a plain (absolute) frame. */
  dir?: 'H' | 'V';
  gap?: number;
  pad?: Pad;
  /** Main-axis alignment. */
  align?: 'START' | 'CENTER' | 'END' | 'SPACE_BETWEEN';
  /** Cross-axis alignment. */
  cross?: 'START' | 'CENTER' | 'END' | 'BASELINE';
  wrap?: boolean;
  /** Fill color token, or null for transparent (default transparent). */
  fill?: string | null;
  fillOpacity?: number;
  stroke?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  /** Stroke only on some sides, e.g. { b: 1 } for a bottom hairline. */
  strokeSides?: { t?: number; r?: number; b?: number; l?: number };
  radius?: number | { tl: number; tr: number; br: number; bl: number };
  /** Fixed width; otherwise width hugs content (or use add(..., { h: 'FILL' })). */
  width?: number;
  height?: number;
  clip?: boolean;
  opacity?: number;
}

function applyPad(f: FrameNode | ComponentNode, pad: Pad | undefined) {
  if (pad === undefined) return;
  if (typeof pad === 'number') {
    f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = pad;
    return;
  }
  f.paddingTop = pad.t ?? pad.y ?? 0;
  f.paddingBottom = pad.b ?? pad.y ?? 0;
  f.paddingLeft = pad.l ?? pad.x ?? 0;
  f.paddingRight = pad.r ?? pad.x ?? 0;
}

/** Configures an existing frame or component with FrameOpts. */
export function style(f: FrameNode | ComponentNode, o: FrameOpts): void {
  if (o.name) f.name = o.name;
  if (o.dir) {
    f.layoutMode = o.dir === 'H' ? 'HORIZONTAL' : 'VERTICAL';
    f.itemSpacing = o.gap ?? 0;
    applyPad(f, o.pad);
    const axis = { START: 'MIN', CENTER: 'CENTER', END: 'MAX', SPACE_BETWEEN: 'SPACE_BETWEEN', BASELINE: 'BASELINE' } as const;
    f.primaryAxisAlignItems = axis[o.align ?? 'START'];
    f.counterAxisAlignItems = axis[o.cross ?? 'START'];
    if (o.wrap) {
      f.layoutWrap = 'WRAP';
      f.counterAxisSpacing = o.gap ?? 0;
    }
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'AUTO';
  }
  if (o.width !== undefined || o.height !== undefined) {
    f.resize(o.width ?? f.width, o.height ?? f.height);
    if (o.dir) {
      if (o.width !== undefined) f.layoutSizingHorizontal = 'FIXED';
      if (o.height !== undefined) f.layoutSizingVertical = 'FIXED';
    }
  }
  f.fills = o.fill ? [paint(o.fill, o.fillOpacity ?? 1)] : [];
  if (o.stroke) {
    f.strokes = [paint(o.stroke, o.strokeOpacity ?? 1)];
    if (o.strokeSides) {
      f.strokeTopWeight = o.strokeSides.t ?? 0;
      f.strokeRightWeight = o.strokeSides.r ?? 0;
      f.strokeBottomWeight = o.strokeSides.b ?? 0;
      f.strokeLeftWeight = o.strokeSides.l ?? 0;
    } else {
      f.strokeWeight = o.strokeWeight ?? 1;
    }
    f.strokeAlign = 'INSIDE';
  }
  if (o.radius !== undefined) {
    if (typeof o.radius === 'number') f.cornerRadius = o.radius;
    else {
      f.topLeftRadius = o.radius.tl;
      f.topRightRadius = o.radius.tr;
      f.bottomRightRadius = o.radius.br;
      f.bottomLeftRadius = o.radius.bl;
    }
  }
  f.clipsContent = o.clip ?? false;
  if (o.opacity !== undefined) f.opacity = o.opacity;
}

/** Creates a frame. children are appended in order (use add() for FILL sizing). */
export function frame(o: FrameOpts = {}, children: SceneNode[] = []): FrameNode {
  const f = figma.createFrame();
  style(f, { name: 'Frame', ...o });
  for (const c of children) f.appendChild(c);
  return f;
}

/**
 * Appends child to parent and, if parent uses auto layout, sets the child's sizing.
 * h/v: 'FILL' stretches along that axis, 'HUG' wraps content, 'FIXED' keeps the size.
 */
export function add<T extends SceneNode>(
  parent: FrameNode | ComponentNode | GroupNode | PageNode | SectionNode,
  child: T,
  sizing: { h?: Sizing; v?: Sizing; grow?: boolean; absolute?: { x: number; y: number } } = {}
): T {
  parent.appendChild(child);
  const isAuto = 'layoutMode' in parent && parent.layoutMode !== 'NONE';
  if (isAuto && 'layoutSizingHorizontal' in child) {
    const c = child as unknown as FrameNode;
    if (sizing.absolute) {
      c.layoutPositioning = 'ABSOLUTE';
      c.x = sizing.absolute.x;
      c.y = sizing.absolute.y;
    } else {
      if (sizing.h) c.layoutSizingHorizontal = sizing.h;
      if (sizing.v) c.layoutSizingVertical = sizing.v;
      if (sizing.grow) c.layoutGrow = 1;
      // A FILL-width text must wrap: WIDTH_AND_HEIGHT text ignores FILL and collapses.
      if (child.type === 'TEXT' && sizing.h === 'FILL') {
        const t = child as unknown as TextNode;
        if (t.textTruncation !== 'ENDING') t.textAutoResize = 'HEIGHT';
      }
    }
  } else if (sizing.absolute) {
    child.x = sizing.absolute.x;
    child.y = sizing.absolute.y;
  }
  return child;
}

/** Fixed-size spacer for auto layout. */
export function spacer(w: number, h: number): FrameNode {
  const s = figma.createFrame();
  s.name = 'Spacer';
  s.resize(Math.max(w, 0.01), Math.max(h, 0.01));
  s.fills = [];
  return s;
}

/** A 1px divider line in a token color (hairline by default). */
export function divider(width: number, token = 'border-subtle', thickness = 1): RectangleNode {
  const r = figma.createRectangle();
  r.name = 'Divider';
  r.resize(width, thickness);
  r.fills = [paint(token)];
  return r;
}

export function rect(w: number, h: number, token: string | null, radius = 0, opacity = 1): RectangleNode {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.cornerRadius = radius;
  r.fills = token ? [paint(token, opacity)] : [];
  return r;
}

export function ellipse(size: number, token: string | null, opacity = 1): EllipseNode {
  const e = figma.createEllipse();
  e.resize(size, size);
  e.fills = token ? [paint(token, opacity)] : [];
  return e;
}

// ---------------------------------------------------------------- icons

const iconComponents = new Map<string, ComponentNode>();

/** Names of every icon glyph available (the app's semantic Icon names). */
export const ICON_NAMES = Object.keys(ICONS);

/**
 * Builds one 24px component per app icon on the given parent ("Icon/<name>"), each glyph
 * bound to text-primary so instances can recolor through their fill override.
 */
export function createIconComponents(parent: FrameNode): void {
  for (const name of ICON_NAMES) {
    const g = ICONS[name];
    const svgFrame = figma.createNodeFromSvg(g.svg);
    // Ionicons use a 512 viewBox; rescale scales geometry and stroke widths together.
    svgFrame.rescale(24 / svgFrame.width);
    const c = figma.createComponent();
    c.name = `Icon/${name}`;
    c.description = `iOS: SF Symbol ${g.sf} · Android: Ionicons ${g.ion}`;
    c.resize(24, 24);
    c.fills = [];
    c.clipsContent = false;
    for (const child of [...svgFrame.children]) {
      const x = child.x;
      const y = child.y;
      c.appendChild(child);
      child.x = x;
      child.y = y;
      if ('constraints' in child) child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    }
    svgFrame.remove();
    recolorGlyph(c, paint('text-primary'));
    parent.appendChild(c);
    iconComponents.set(name, c);
  }
}

/** Recolors every vector in an icon: stroked paths get the stroke, filled paths the fill. */
function recolorGlyph(root: ComponentNode | InstanceNode, p: SolidPaint): void {
  const shapes = root.findAll((n) => 'fills' in n && 'strokes' in n && n.type !== 'INSTANCE' && n.type !== 'COMPONENT') as (VectorNode | EllipseNode | RectangleNode | BooleanOperationNode)[];
  for (const s of shapes) {
    if (Array.isArray(s.strokes) && s.strokes.length > 0) s.strokes = [p];
    if (Array.isArray(s.fills) && s.fills.length > 0) s.fills = [p];
  }
}

/** The icon component for a name, for INSTANCE_SWAP defaults. */
export function iconComponent(name: string): ComponentNode {
  const c = iconComponents.get(name);
  if (!c) throw new Error(`Unknown icon: ${name}`);
  return c;
}

/** Instance of an app icon at size px, colored with a token (or a fixed hex via solidHex). */
export function icon(name: string, size: number, colorToken: string | null, solidHex?: string): InstanceNode {
  const i = iconComponent(name).createInstance();
  i.name = 'Icon';
  i.resize(size, size);
  const p = solidHex ? solid(solidHex) : colorToken ? paint(colorToken) : null;
  if (p) recolorGlyph(i, p);
  return i;
}

// ---------------------------------------------------------------- components

/**
 * Contract between modules: every component (or component set) a module creates is
 * registered here by name, and screens/patterns instantiate it by the same name.
 * Variant property names and values are listed so instance(name, { Prop: 'Value' }) works.
 */
export const COMPONENT_CATALOG = {
  // components-controls.ts
  Button: { Variant: ['Primary', 'Secondary', 'Outline', 'Ghost', 'Link', 'Destructive'], State: ['Default', 'Pressed', 'Disabled', 'Loading'], text: ['Label'] },
  'Text Field': { State: ['Empty', 'Focused', 'Filled', 'Error'], text: ['Label', 'Value', 'Helper'] },
  'Search Field': { State: ['Rest', 'Focused', 'Typing'], text: ['Placeholder'] },
  Stepper: { Size: ['Default', 'Compact'], text: ['Value'] },
  'Segmented Control': { Segments: ['2', '3'], Selected: ['1', '2', '3'], text: ['Segment 1', 'Segment 2', 'Segment 3'] },
  Switch: { On: ['true', 'false'], text: [] },
  'Picker Trigger': { State: ['Default', 'Pressed'], text: ['Value'] },
  Chip: { Style: ['Selected solid', 'Selected tint', 'Unselected'], text: ['Label'] },
  'Meal Calorie Chip': { text: ['Label'] },
  'AI Estimate Pill': { text: ['Label'] },
  'Allergen Chip': { Strength: ['Contains', 'Trace'], text: ['Label'] },
  'Tag Badge': { text: ['Label'] },
  // components-surfaces.ts
  'Card Header': { Link: ['true', 'false'], text: ['Title', 'Link'] },
  Card: { Type: ['Standard', 'Chart', 'Inset', 'Placeholder'], text: ['Title', 'Body'] },
  'Settings Row': { Trailing: ['Chevron', 'Switch', 'Value', 'None'], text: ['Title', 'Subtitle', 'Value'] },
  'Settings Group Header': { text: ['Overline'] },
  'Library Row': { Thumbnail: ['true', 'false'], text: ['Name', 'Brand', 'Calories', 'Serving'] },
  'Diary Food Row': { Time: ['true', 'false'], text: ['Name', 'Quantity', 'Time', 'Calories'] },
  'Meal Card Header': { Meal: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], text: ['Meal', 'Calories'] },
  'Swipe Delete Row': { text: ['Name'] },
  'Collapsible Header': { Open: ['true', 'false'], text: ['Title', 'Count'] },
  // components-navigation.ts
  'Tab Bar': { Active: ['Dashboard', 'Diary', 'Library', 'Settings'], text: [] },
  'Top Bar': { Type: ['Back', 'Dismiss + Save', 'Back + Actions'], text: ['Title'] },
  'Date Navigator': { Day: ['Today', 'Past', 'Future'], text: ['Title', 'Date'] },
  'Footer Action Bar': { text: ['Label'] },
  'Footer Save Bar': { text: ['Label'] },
  'Bottom Sheet Picker': { text: ['Title'] },
  'Action Sheet': { text: [] },
  'Add Sheet': { text: [] },
  'Dropdown Menu': { text: [] },
  // components-feedback.ts
  Toast: { Type: ['Success', 'Error', 'Info'], text: ['Title', 'Body'] },
  'Status View': { Type: ['Loading', 'Empty', 'Error', 'Offline'], text: ['Title', 'Subtitle'] },
  'Empty Day': { text: ['Caption'] },
  Banner: { Type: ['Allergen', 'Info'], text: ['Body'] },
  // components-dataviz.ts
  'Progress Ring': { Size: ['Calorie 160', 'Small 100'], text: [] },
  'Calorie Summary': { text: ['Remaining', 'Goal', 'Consumed', 'Burned'] },
  'Macro Bar': { Macro: ['Protein', 'Carbs', 'Fat', 'Fiber'], text: ['Label', 'Value', 'Caption'] },
  'Macro Composition Ring': { text: [] },
  'Hydration Gauge': { text: ['Total', 'Goal'] },
  'Bar Chart': { text: ['Title'] },
  'Line Chart': { text: ['Title'] },
  'Stat Tile': { text: ['Label', 'Value'] },
  Legend: { text: ['Label'] },
  'Exercise Progress Row': { text: ['Label', 'Value'] },
} as const;

export type ComponentName = keyof typeof COMPONENT_CATALOG;

const registry = new Map<string, ComponentNode | ComponentSetNode>();

export function register(name: ComponentName, node: ComponentNode | ComponentSetNode, description = ''): void {
  node.name = name;
  if (description) node.description = description;
  registry.set(name, node);
}

export function hasComponent(name: ComponentName): boolean {
  return registry.has(name);
}

/**
 * Creates a component whose content is built by build(). Use for single components and for
 * each variant (name it "Prop=Value, Prop2=Value2" before combining with variantSet()).
 */
export function component(name: string, o: FrameOpts, build: (c: ComponentNode) => void): ComponentNode {
  const c = figma.createComponent();
  style(c, { ...o, name });
  build(c);
  return c;
}

/**
 * Combines variant components into a set on parent, lays the variants out in a grid,
 * exposes text properties (TEXT component properties bound to text nodes whose layer
 * name equals the property name) and registers the set under name.
 */
export function variantSet(
  name: ComponentName,
  variants: ComponentNode[],
  parent: FrameNode,
  opts: { columns?: number; gap?: number; description?: string } = {}
): ComponentSetNode {
  for (const v of variants) parent.appendChild(v);
  const set = figma.combineAsVariants(variants, parent);
  const cols = opts.columns ?? Math.min(variants.length, 4);
  const gap = opts.gap ?? 24;
  set.layoutMode = 'HORIZONTAL';
  set.layoutWrap = 'WRAP';
  set.itemSpacing = gap;
  set.counterAxisSpacing = gap;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = gap;
  set.primaryAxisSizingMode = 'FIXED';
  set.counterAxisSizingMode = 'AUTO';
  const maxW = Math.max(...variants.map((v) => v.width));
  set.resize(cols * maxW + (cols - 1) * gap + gap * 2, set.height);
  set.fills = [];
  set.strokes = [paint('accent-primary', 0.5)];
  set.dashPattern = [6, 4];
  set.strokeWeight = 1;
  set.cornerRadius = 8;
  exposeTextProps(name, set);
  register(name, set, opts.description ?? '');
  return set;
}

/** Registers a single (non-variant) component and exposes its text properties. */
export function single(name: ComponentName, c: ComponentNode, parent: FrameNode, description = ''): ComponentNode {
  parent.appendChild(c);
  exposeTextProps(name, c);
  register(name, c, description);
  return c;
}

function exposeTextProps(name: ComponentName, node: ComponentNode | ComponentSetNode): void {
  const props = COMPONENT_CATALOG[name].text as readonly string[];
  for (const prop of props) {
    const targets = node.findAll((n) => n.type === 'TEXT' && n.name === prop) as TextNode[];
    if (targets.length === 0) continue;
    const key = node.addComponentProperty(prop, 'TEXT', targets[0].characters);
    for (const t of targets) t.componentPropertyReferences = { characters: key };
  }
  // Icon slots: direct icon instances named "Icon" become one swappable property.
  const iconSlots = node.findAll(
    (n) => n.type === 'INSTANCE' && n.name === 'Icon' && !!n.parent && n.parent.type !== 'INSTANCE'
  ) as InstanceNode[];
  if (iconSlots.length > 0) {
    const first = iconSlots[0].mainComponent;
    if (first) {
      const key = node.addComponentProperty('Icon', 'INSTANCE_SWAP', first.id);
      for (const s of iconSlots) s.componentPropertyReferences = { mainComponent: key };
    }
  }
}

/**
 * Instance of a registered component. props mixes variant values and text overrides:
 * instance('Button', { Variant: 'Primary', State: 'Default', Label: 'Save' }).
 */
let stubFactory: ((name: ComponentName) => ComponentNode | ComponentSetNode) | null = null;

/** Test-only: build placeholder components for catalog names a module under test has not built. */
export function setStubFactory(fn: (name: ComponentName) => ComponentNode | ComponentSetNode): void {
  stubFactory = fn;
}

export function instance(name: ComponentName, props: Record<string, string> = {}): InstanceNode {
  let node = registry.get(name);
  if (!node && stubFactory) {
    node = stubFactory(name);
    registry.set(name, node);
  }
  if (!node) throw new Error(`Component not built yet: ${name}`);
  const base = node.type === 'COMPONENT_SET' ? (node.defaultVariant as ComponentNode) : node;
  const inst = base.createInstance();
  setProps(inst, props);
  return inst;
}

/** Sets variant values and text overrides on an instance by their friendly names. */
export function setProps(inst: InstanceNode, props: Record<string, string>): void {
  const defs = inst.componentProperties;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    const key = Object.keys(defs).find((d) => d === k || d.split('#')[0] === k);
    if (key) out[key] = v;
  }
  if (Object.keys(out).length) inst.setProperties(out);
}

// ---------------------------------------------------------------- documentation layout

/** A documentation board: big title, intro text and a content column, 1200px wide. */
export function board(title: string, intro: string, width = 1200): { root: FrameNode; body: FrameNode } {
  const root = frame({ name: title, dir: 'V', gap: 32, pad: 64, fill: 'background', radius: 24, width });
  root.layoutSizingVertical = 'HUG';
  const head = frame({ name: 'Heading', dir: 'V', gap: 12 });
  add(root, head, { h: 'FILL' });
  add(head, text(title, { size: 40, weight: 'Bold', lineHeight: 48 }));
  add(head, text(intro, { role: 'Body/Default', color: 'text-secondary', width: width - 128 }), { h: 'FILL' });
  const body = frame({ name: 'Body', dir: 'V', gap: 48 });
  add(root, body, { h: 'FILL' });
  return { root, body };
}

/** A titled section inside a board body. Returns the content frame (vertical, 24px gap). */
export function section(body: FrameNode, title: string, description = '', dir: 'H' | 'V' = 'V', gap = 24, wrap = false): FrameNode {
  const s = frame({ name: title, dir: 'V', gap: 16 });
  add(body, s, { h: 'FILL' });
  add(s, text(title, { size: 24, weight: 'Bold', lineHeight: 32 }));
  if (description) add(s, text(description, { role: 'Body/Default', color: 'text-secondary' }), { h: 'FILL' });
  const content = frame({ name: `${title} / content`, dir, gap, wrap });
  add(s, content, { h: 'FILL' });
  return content;
}

/** A small caption under a specimen (name + spec), Muted Slate. */
export function caption(label: string, spec = '', width?: number): FrameNode {
  const f = frame({ name: `Caption ${label}`, dir: 'V', gap: 2, width });
  add(f, text(label, { role: 'Body/Field label' }), width ? { h: 'FILL' } : {});
  if (spec) add(f, text(spec, { role: 'Caption/Default', color: 'text-muted', width }), width ? { h: 'FILL' } : {});
  return f;
}

/** Wraps a node with a caption below it. */
export function specimen(node: SceneNode, label: string, spec = '', captionWidth?: number): FrameNode {
  const f = frame({ name: `Specimen ${label}`, dir: 'V', gap: 8 });
  add(f, node);
  add(f, caption(label, spec, captionWidth ?? Math.max(160, 'width' in node ? node.width : 160)));
  return f;
}

/** Creates (or reuses) a page and makes it current. */
export async function usePage(name: string): Promise<PageNode> {
  let p = figma.root.children.find((c) => c.name === name) as PageNode | undefined;
  if (!p) {
    p = figma.createPage();
    p.name = name;
  }
  await figma.setCurrentPageAsync(p);
  return p;
}

/** Places boards on a page left to right with 120px gaps, starting at x. */
export function layoutBoards(page: PageNode, boards: SceneNode[], startX = 0, y = 0, gap = 120): void {
  let x = startX;
  for (const b of boards) {
    if (b.parent !== page) page.appendChild(b);
    b.x = x;
    b.y = y;
    x += b.width + gap;
  }
}

/** Places boards in rows: a new row starts when the next board would pass maxRowWidth. */
export function layoutGrid(page: PageNode, boards: SceneNode[], maxRowWidth = 4000, gap = 120, startY = 0): void {
  let x = 0;
  let y = startY;
  let rowH = 0;
  for (const b of boards) {
    if (b.parent !== page) page.appendChild(b);
    if (x > 0 && x + b.width > maxRowWidth) {
      x = 0;
      y += rowH + gap;
      rowH = 0;
    }
    b.x = x;
    b.y = y;
    x += b.width + gap;
    rowH = Math.max(rowH, b.height);
  }
}

export function notify(msg: string): void {
  try {
    figma.notify(msg, { timeout: 2500 });
  } catch {
    // figma.notify is unavailable when this code runs through the MCP bridge.
  }
}
