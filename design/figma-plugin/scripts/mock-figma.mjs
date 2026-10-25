// A strict in-memory stand-in for the Figma Plugin API, for running the builder under Node.
// It enforces the runtime rules that most often break plugins in real Figma:
//  - layoutSizingHorizontal/Vertical: FILL only on children of auto-layout frames (not absolute),
//    HUG only on auto-layout frames or TEXT children of auto-layout frames
//  - text: font must be loaded before characters / fontName are written
//  - resize: width and height must be >= 0.01
//  - combineAsVariants: COMPONENT nodes only, consistent "Prop=Value" names, unique combinations
//  - setProperties: keys must exist; variant values must match an existing variant
//  - addComponentProperty only on COMPONENT / COMPONENT_SET (never on a variant inside a set)
//  - componentPropertyReferences keys must exist on the owning component (set)
//  - paint colors in 0..1, no "a" key on paint colors; fills/strokes must be arrays
//  - setCurrentPageAsync must be used (currentPage setter throws)
// It does not render anything; widths of auto-layout frames are not computed.

let nextId = 1;
const loadedFonts = new Set();
const fontKey = (f) => `${f.family}::${f.style}`;
export const stats = { nodes: {}, errors: [] };

function assertPaints(arr, what) {
  if (!Array.isArray(arr)) throw new Error(`${what} must be an array`);
  for (const p of arr) {
    if (p.type === 'SOLID') {
      if ('a' in p.color) throw new Error(`${what}: SOLID paint color must not have "a" (use opacity)`);
      for (const k of ['r', 'g', 'b']) if (p.color[k] < 0 || p.color[k] > 1 || Number.isNaN(p.color[k])) throw new Error(`${what}: color ${k}=${p.color[k]} out of 0..1`);
    }
  }
}

function parseVariantName(name) {
  const out = {};
  for (const part of name.split(',')) {
    const [k, v] = part.split('=').map((s) => s && s.trim());
    if (!k || v === undefined) throw new Error(`Variant name "${name}" must be "Prop=Value, Prop2=Value2"`);
    out[k] = v;
  }
  return out;
}

class BaseNode {
  constructor(type) {
    this.id = `${nextId++}:0`;
    this.type = type;
    this.name = type;
    this.children = [];
    this.parent = null;
    this.removed = false;
    this.x = 0;
    this.y = 0;
    this._w = 100;
    this._h = 100;
    this._fills = [];
    this._strokes = [];
    this.effects = [];
    this.opacity = 1;
    this.visible = true;
    this.layoutMode = 'NONE';
    this.layoutPositioning = 'AUTO';
    this.description = '';
    this.componentPropertyReferences = null;
    this._boundVars = {};
    stats.nodes[type] = (stats.nodes[type] || 0) + 1;
  }
  get width() { return this._w; }
  get height() { return this._h; }
  get fills() { return this._fills; }
  set fills(v) { assertPaints(v, `${this.type}.fills`); this._fills = v; }
  get strokes() { return this._strokes; }
  set strokes(v) { assertPaints(v, `${this.type}.strokes`); this._strokes = v; }
  resize(w, h) {
    if (!(w >= 0.01) || !(h >= 0.01)) throw new Error(`resize(${w}, ${h}) on ${this.type} "${this.name}": size must be >= 0.01`);
    this._w = w; this._h = h;
  }
  resizeWithoutConstraints(w, h) { this.resize(w, h); }
  rescale(s) { this._w *= s; this._h *= s; for (const c of this.children || []) c.rescale(s); }
  appendChild(c) {
    if (!this.children) throw new Error(`${this.type} cannot have children`);
    if (c.parent) c.parent.children = c.parent.children.filter((n) => n !== c);
    c.parent = this;
    this.children.push(c);
    // Figma resets FILL on a child moved into a non-auto-layout parent
    return c;
  }
  insertChild(i, c) { this.appendChild(c); this.children.splice(this.children.indexOf(c), 1); this.children.splice(i, 0, c); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((n) => n !== this); this.parent = null; this.removed = true; }
  findAll(fn) { const out = []; const walk = (n) => { for (const c of n.children || []) { if (!fn || fn(c)) out.push(c); walk(c); } }; walk(this); return out; }
  findOne(fn) { return this.findAll(fn)[0] || null; }
  findChildren(fn) { return (this.children || []).filter((c) => !fn || fn(c)); }
  findChild(fn) { return this.findChildren(fn)[0] || null; }
  findAllWithCriteria({ types }) { return this.findAll((n) => !types || types.includes(n.type)); }
  // Deep copy with no side effects on the original's parent (used by clone() and instances).
  _copy(newParent) {
    const c = Object.create(Object.getPrototypeOf(this));
    Object.assign(c, this);
    c.id = `${nextId++}:0`;
    c.parent = newParent;
    c._overrides = this._overrides ? { ...this._overrides } : undefined;
    // Leaf nodes (text, vectors, shapes) have no children property at all, as in Figma.
    if (this.children) c.children = this.children.map((k) => k._copy(c));
    else delete c.children;
    stats.nodes[this.type] = (stats.nodes[this.type] || 0) + 1;
    nodes.set(c.id, c);
    return c;
  }
  // Figma: the duplicate is placed next to the original, in the same parent.
  clone() {
    const c = this._copy(null);
    if (this.parent) this.parent.appendChild(c);
    return c;
  }
  setBoundVariable(field, v) { this._boundVars[field] = v ? v.id : null; }
  setExplicitVariableModeForCollection(coll, modeId) {
    const c = typeof coll === 'string' ? collections.get(coll) : coll;
    if (!c || !c.modes.find((m) => m.modeId === modeId)) throw new Error('setExplicitVariableModeForCollection: unknown collection/mode');
    this._explicitMode = modeId;
  }
  async loadAsync() { if (this.type !== 'PAGE') throw new Error('loadAsync on non-page'); }
  async setEffectStyleIdAsync(id) { if (!effectStyles.has(id)) throw new Error('unknown effect style ' + id); this._effectStyleId = id; }
  set constraints(v) { this._constraints = v; }
  get constraints() { return this._constraints || { horizontal: 'MIN', vertical: 'MIN' }; }
}

const SIZING = ['FIXED', 'HUG', 'FILL'];
function defineSizing(proto, prop) {
  Object.defineProperty(proto, prop, {
    get() { return this['_' + prop] || 'FIXED'; },
    set(v) {
      if (!SIZING.includes(v)) throw new Error(`${prop}: expected FIXED|HUG|FILL, got ${v}`);
      const parentAuto = this.parent && this.parent.layoutMode && this.parent.layoutMode !== 'NONE';
      if (v === 'FILL' && (!parentAuto || this.layoutPositioning === 'ABSOLUTE'))
        throw new Error(`in set_${prop}: FILL can only be set on children of auto-layout frames ("${this.name}" ${this.type}, parent ${this.parent ? this.parent.type + ' "' + this.parent.name + '" layoutMode=' + this.parent.layoutMode : 'none'})`);
      if (v === 'HUG' && !(this.layoutMode && this.layoutMode !== 'NONE') && !(this.type === 'TEXT' && parentAuto))
        throw new Error(`in set_${prop}: HUG only on auto-layout frames or TEXT children of auto-layout ("${this.name}" ${this.type})`);
      this['_' + prop] = v;
    },
  });
}
defineSizing(BaseNode.prototype, 'layoutSizingHorizontal');
defineSizing(BaseNode.prototype, 'layoutSizingVertical');

Object.defineProperty(BaseNode.prototype, 'componentPropertyReferences', {
  get() { return this._cpr || null; },
  set(refs) {
    if (refs === null) { this._cpr = null; return; }
    let owner = this.parent;
    while (owner && owner.type !== 'COMPONENT' && owner.type !== 'COMPONENT_SET' && owner.type !== 'PAGE') owner = owner.parent;
    if (!owner || owner.type === 'PAGE') throw new Error(`componentPropertyReferences on "${this.name}" outside a component`);
    owner = ownerOf(owner);
    for (const [field, key] of Object.entries(refs)) {
      if (!owner._props[key]) throw new Error(`componentPropertyReferences: ${key} is not defined on ${owner.name}`);
      if (field === 'characters' && this.type !== 'TEXT') throw new Error('characters reference on non-TEXT node');
      if (field === 'mainComponent' && this.type !== 'INSTANCE') throw new Error('mainComponent reference on non-INSTANCE node');
      // Every layer bound to one INSTANCE_SWAP property shows its value, so all must share the
      // property's default component (Figma would otherwise swap them and drop their look).
      if (field === 'mainComponent' && this._main.id !== owner._props[key].defaultValue)
        throw new Error(`INSTANCE_SWAP ${key} on ${owner.name}: slot "${this.name}" is ${this._main.parent && this._main.parent.name}/${this._main.name}, not the property's default`);
    }
    this._cpr = refs;
  },
});

class FrameLike extends BaseNode {
  constructor(type) {
    super(type);
    this.itemSpacing = 0; this.counterAxisSpacing = 0;
    this.paddingTop = this.paddingBottom = this.paddingLeft = this.paddingRight = 0;
    this.primaryAxisAlignItems = 'MIN'; this.counterAxisAlignItems = 'MIN';
    this.primaryAxisSizingMode = 'AUTO'; this.counterAxisSizingMode = 'AUTO';
    this.layoutWrap = 'NO_WRAP'; this.clipsContent = true; this.cornerRadius = 0;
    this.strokeWeight = 1; this.strokeAlign = 'INSIDE'; this.dashPattern = [];
  }
  set primaryAxisAlignItems(v) { if (!['MIN', 'CENTER', 'MAX', 'SPACE_BETWEEN'].includes(v)) throw new Error('primaryAxisAlignItems ' + v); this._paa = v; }
  get primaryAxisAlignItems() { return this._paa; }
  set counterAxisAlignItems(v) { if (!['MIN', 'CENTER', 'MAX', 'BASELINE'].includes(v)) throw new Error('counterAxisAlignItems ' + v); this._caa = v; }
  get counterAxisAlignItems() { return this._caa; }
  set primaryAxisSizingMode(v) { if (!['FIXED', 'AUTO'].includes(v)) throw new Error('primaryAxisSizingMode ' + v); this._pasm = v; }
  get primaryAxisSizingMode() { return this._pasm; }
  set counterAxisSizingMode(v) { if (!['FIXED', 'AUTO'].includes(v)) throw new Error('counterAxisSizingMode ' + v); this._casm = v; }
  get counterAxisSizingMode() { return this._casm; }
  set layoutWrap(v) { if (v === 'WRAP' && this.layoutMode !== 'HORIZONTAL') throw new Error('layoutWrap WRAP requires HORIZONTAL layout'); this._wrap = v; }
  get layoutWrap() { return this._wrap; }
}

class TextNode extends BaseNode {
  constructor() {
    super('TEXT');
    delete this.children;
    this._fontName = null;
    this._chars = '';
    this.fontSize = 12; this.textAutoResize = 'WIDTH_AND_HEIGHT'; this.textAlignHorizontal = 'LEFT';
    this.textTruncation = 'DISABLED'; this.maxLines = null; this.textCase = 'ORIGINAL';
  }
  get fontName() { return this._fontName || { family: 'Inter', style: 'Regular' }; }
  set fontName(f) { if (!loadedFonts.has(fontKey(f))) throw new Error(`Cannot use unloaded font "${f.family} ${f.style}"`); this._fontName = f; }
  get characters() { return this._chars; }
  set characters(s) {
    const f = this.fontName;
    if (!loadedFonts.has(fontKey(f))) throw new Error(`Cannot write to node with unloaded font "${f.family} ${f.style}"`);
    if (typeof s !== 'string') throw new Error('characters must be a string');
    this._chars = s;
    this._w = Math.max(1, s.length * (this.fontSize || 12) * 0.55);
    this._h = (this.fontSize || 12) * 1.3;
  }
  set lineHeight(v) { if (typeof v !== 'object' || !v.unit) throw new Error('lineHeight must be {unit, value}'); this._lh = v; }
  get lineHeight() { return this._lh || { unit: 'AUTO' }; }
  set letterSpacing(v) { if (typeof v !== 'object' || !v.unit) throw new Error('letterSpacing must be {unit, value}'); this._ls = v; }
  get letterSpacing() { return this._ls; }
  async setTextStyleIdAsync(id) { if (!textStyles.has(id)) throw new Error('unknown text style ' + id); this._textStyleId = id; }
  set maxLines(v) { if (v !== null && this.textTruncation !== 'ENDING') throw new Error('maxLines requires textTruncation ENDING'); this._ml = v; }
  get maxLines() { return this._ml; }
}

function ownerOf(node) {
  // The node that owns component properties for a component/variant
  if (node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET') return node.parent;
  return node;
}

class ComponentNode extends FrameLike {
  constructor() { super('COMPONENT'); this._props = {}; this._propCounter = 0; }
  addComponentProperty(name, type, defaultValue) {
    if (this.parent && this.parent.type === 'COMPONENT_SET') throw new Error('addComponentProperty on a variant: add it to the COMPONENT_SET instead');
    return addProp(this, name, type, defaultValue);
  }
  get componentPropertyDefinitions() {
    if (this.parent && this.parent.type === 'COMPONENT_SET') throw new Error('componentPropertyDefinitions read on a variant component');
    return this._props;
  }
  createInstance() {
    const inst = new InstanceNode(this);
    return inst;
  }
}

function addProp(owner, name, type, defaultValue) {
  if (!['TEXT', 'BOOLEAN', 'INSTANCE_SWAP', 'VARIANT'].includes(type)) throw new Error('bad property type ' + type);
  if (type === 'INSTANCE_SWAP' && !nodes.has(defaultValue)) throw new Error('INSTANCE_SWAP default must be a component id');
  const key = `${name}#${++owner._propCounter}:0`;
  owner._props[key] = { type, defaultValue };
  return key;
}

class ComponentSetNode extends FrameLike {
  constructor() { super('COMPONENT_SET'); this._props = {}; this._propCounter = 0; }
  get defaultVariant() { return this.children[0]; }
  addComponentProperty(name, type, d) { return addProp(this, name, type, d); }
  get componentPropertyDefinitions() { return this._props; }
}

class InstanceNode extends FrameLike {
  constructor(main) {
    super('INSTANCE');
    this._main = main;
    this._overrides = {};
    this._w = main.width; this._h = main.height;
    // The instance root shows the main component's paints until overridden.
    this._fills = main._fills; this._strokes = main._strokes;
    this.children = (main.children || []).map((c) => c._copy(this));
  }
  get componentProperties() {
    const owner = ownerOf(this._main);
    const out = {};
    if (owner.type === 'COMPONENT_SET') {
      for (const [k, v] of Object.entries(parseVariantName(this._main.name))) out[k] = { type: 'VARIANT', value: v };
    }
    for (const [k, def] of Object.entries(owner._props)) out[k] = { type: def.type, value: this._overrides[k] ?? def.defaultValue };
    return out;
  }
  setProperties(props) {
    const owner = ownerOf(this._main);
    const current = this.componentProperties;
    const variantChange = {};
    for (const [k, v] of Object.entries(props)) {
      if (!(k in current)) throw new Error(`setProperties: "${k}" is not a property of ${owner.name} (has ${Object.keys(current).join(', ')})`);
      if (current[k].type === 'VARIANT') variantChange[k] = v;
      else if (current[k].type === 'TEXT' && typeof v !== 'string') throw new Error('TEXT property value must be a string');
      else this._overrides[k] = v;
    }
    if (Object.keys(variantChange).length) {
      const want = { ...parseVariantName(this._main.name), ...variantChange };
      const match = owner.children.find((c) => { const p = parseVariantName(c.name); return Object.keys(want).every((k) => p[k] === want[k]); });
      if (!match) throw new Error(`setProperties: no variant of ${owner.name} matches ${JSON.stringify(want)}`);
      this._main = match;
    }
  }
  detachInstance() { const f = new FrameLike('FRAME'); return f; }
  swapComponent(c) { if (!c || c.type !== 'COMPONENT') throw new Error('swapComponent: COMPONENT required'); this._main = c; }
  // documentAccess "dynamic-page": the sync getter throws, as in Figma.
  get mainComponent() { throw new Error('in get_mainComponent: Cannot call with documentAccess: dynamic-page. Use node.getMainComponentAsync instead.'); }
  async getMainComponentAsync() { return this._main; }
}

const nodes = new Map();
const collections = new Map();
const variables = new Map();
const textStyles = new Map();
const effectStyles = new Map();

function track(n) { nodes.set(n.id, n); return n; }

function makePage(name) {
  const p = new BaseNode('PAGE');
  p.name = name;
  return track(p);
}

function svgToFrame(svg) {
  const f = track(new FrameLike('FRAME'));
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  f._w = vb ? +vb[1] : 24; f._h = vb ? +vb[2] : 24;
  const shapes = svg.match(/<(path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*>/g) || [];
  if (!shapes.length) throw new Error('createNodeFromSvg: no shapes');
  for (const s of shapes) {
    const v = track(new BaseNode('VECTOR'));
    delete v.children;
    v.vectorNetwork = {};
    const stroke = /stroke="(?!none)/.test(s);
    const fillNone = /fill="none"/.test(s);
    v._strokes = stroke ? [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }] : [];
    v._fills = fillNone ? [] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    v._w = f._w; v._h = f._h;
    f.appendChild(v);
  }
  return f;
}

export function install() {
  const root = { type: 'DOCUMENT', children: [makePage('Page 1')], name: 'Doc' };
  root.children[0].parent = root;
  let current = root.children[0];
  let doneResolve;
  globalThis.__mockDone = new Promise((r) => (doneResolve = r));
  const figma = {
    mixed: Symbol('mixed'),
    root,
    get currentPage() { return current; },
    set currentPage(_) { throw new Error('Setting figma.currentPage is not supported'); },
    async setCurrentPageAsync(p) { if (!root.children.includes(p)) throw new Error('page not in document'); current = p; },
    createPage() { const p = makePage('Page'); p.parent = root; root.children.push(p); return p; },
    async loadFontAsync(f) { if (f.family !== 'Inter' || !['Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'].includes(f.style)) throw new Error(`Font not found: ${f.family} ${f.style}`); loadedFonts.add(fontKey(f)); },
    createFrame() { const f = track(new FrameLike('FRAME')); current.appendChild(f); return f; },
    createAutoLayout(dir = 'HORIZONTAL') { const f = figma.createFrame(); f.layoutMode = dir; return f; },
    createComponent() { const c = track(new ComponentNode()); current.appendChild(c); return c; },
    createText() { const t = track(new TextNode()); current.appendChild(t); return t; },
    createRectangle() { const r = track(new BaseNode('RECTANGLE')); delete r.children; r.cornerRadius = 0; current.appendChild(r); return r; },
    createEllipse() { const e = track(new BaseNode('ELLIPSE')); delete e.children; e.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0 }; current.appendChild(e); return e; },
    createLine() { const l = track(new BaseNode('LINE')); delete l.children; current.appendChild(l); return l; },
    createVector() { const v = track(new BaseNode('VECTOR')); delete v.children; current.appendChild(v); return v; },
    createSection() { const s = track(new BaseNode('SECTION')); current.appendChild(s); return s; },
    createNodeFromSvg(svg) { const f = svgToFrame(svg); current.appendChild(f); return f; },
    flatten(ns, parent) { const v = track(new BaseNode('VECTOR')); delete v.children; (parent || current).appendChild(v); for (const n of ns) n.remove(); return v; },
    group(ns, parent) { const g = track(new BaseNode('GROUP')); parent.appendChild(g); for (const n of ns) g.appendChild(n); return g; },
    combineAsVariants(ns, parent) {
      if (!ns.length) throw new Error('combineAsVariants: empty');
      const seen = new Set();
      let keys = null;
      for (const n of ns) {
        if (n.type !== 'COMPONENT') throw new Error(`combineAsVariants: ${n.type} "${n.name}" is not a COMPONENT`);
        const p = parseVariantName(n.name);
        const k = Object.keys(p).sort().join('|');
        if (keys === null) keys = k; else if (keys !== k) throw new Error(`combineAsVariants: inconsistent property names: "${n.name}"`);
        const combo = JSON.stringify(Object.keys(p).sort().map((x) => [x, p[x]]));
        if (seen.has(combo)) throw new Error(`combineAsVariants: duplicate variant "${n.name}"`);
        seen.add(combo);
        if (Object.keys(n._props).length) throw new Error(`combineAsVariants: "${n.name}" already has component properties; add them to the set after combining`);
      }
      const set = track(new ComponentSetNode());
      parent.appendChild(set);
      for (const n of ns) set.appendChild(n);
      return set;
    },
    createTextStyle() { const s = { id: `S:t${nextId++}`, name: '', type: 'TEXT', description: '' }; textStyles.set(s.id, s); return new Proxy(s, { set(o, k, v) { if (k === 'fontName' && !loadedFonts.has(fontKey(v))) throw new Error('text style font not loaded'); if ((k === 'lineHeight' || k === 'letterSpacing') && (typeof v !== 'object' || !v.unit)) throw new Error(k + ' must be {unit, value}'); o[k] = v; return true; } }); },
    createEffectStyle() { const s = { id: `S:e${nextId++}`, name: '', type: 'EFFECT', effects: [], description: '' }; effectStyles.set(s.id, s); return s; },
    getLocalTextStylesAsync: async () => [...textStyles.values()],
    getLocalEffectStylesAsync: async () => [...effectStyles.values()],
    async getNodeByIdAsync(id) { return nodes.get(id) || null; },
    notify() {},
    closePlugin(msg) { doneResolve(msg); },
    viewport: { scrollAndZoomIntoView() {} },
    variables: {
      createVariableCollection(name) {
        const c = { id: `VC:${nextId++}`, name, modes: [{ modeId: `${nextId++}:0`, name: 'Mode 1' }], variableIds: [] };
        c.renameMode = (id, n) => { const m = c.modes.find((x) => x.modeId === id); if (!m) throw new Error('renameMode: unknown mode'); m.name = n; };
        // FIGMA_MAX_MODES=1 (or run.mjs --max-modes=1) simulates a plan with one mode per collection.
        c.addMode = (n) => { const max = Number(process.env.FIGMA_MAX_MODES || 4); if (c.modes.length >= max) throw new Error(`in addMode: Limited to ${max} modes only`); const m = { modeId: `${nextId++}:0`, name: n }; c.modes.push(m); return m.modeId; };
        collections.set(c.id, c);
        return c;
      },
      createVariable(name, coll, type) {
        const c = typeof coll === 'string' ? collections.get(coll) : coll;
        if (!c || !collections.has(c.id)) throw new Error('createVariable: collection object or id required');
        if (!['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'].includes(type)) throw new Error('bad var type');
        for (const id of c.variableIds) if (variables.get(id).name === name) throw new Error(`duplicate variable name ${name}`);
        const v = { id: `VariableID:${nextId++}`, name, resolvedType: type, valuesByMode: {}, description: '', codeSyntax: {} };
        let scopes = ['ALL_SCOPES'];
        Object.defineProperty(v, 'scopes', { get: () => scopes, set: (s) => { if (!Array.isArray(s)) throw new Error('scopes array'); scopes = s; } });
        v.setValueForMode = (modeId, val) => {
          if (!c.modes.find((m) => m.modeId === modeId)) throw new Error('setValueForMode: unknown mode');
          if (type === 'COLOR') for (const k of ['r', 'g', 'b', 'a']) if (k in val && (val[k] < 0 || val[k] > 1)) throw new Error('color out of range');
          v.valuesByMode[modeId] = val;
        };
        v.setVariableCodeSyntax = (platform, s) => { if (!['WEB', 'ANDROID', 'iOS'].includes(platform)) throw new Error('platform'); v.codeSyntax[platform] = s; };
        c.variableIds.push(v.id);
        variables.set(v.id, v);
        return v;
      },
      setBoundVariableForPaint(paint, field, v) {
        if (field !== 'color' || !v || !variables.has(v.id)) throw new Error('setBoundVariableForPaint: bad args');
        return { ...paint, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: v.id } } };
      },
      async getLocalVariablesAsync() { return [...variables.values()]; },
      async getLocalVariableCollectionsAsync() { return [...collections.values()]; },
      async getVariableByIdAsync(id) { return variables.get(id) || null; },
    },
  };
  globalThis.figma = figma;
  globalThis.__mockState = { nodes, collections, variables, textStyles, effectStyles, stats };
  return figma;
}
