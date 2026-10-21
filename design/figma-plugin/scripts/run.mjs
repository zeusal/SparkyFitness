// Runs the builder (or one module) against the strict Figma mock.
//   node scripts/run.mjs all                 -> bundles src/main.ts and runs the full build
//   node scripts/run.mjs components-controls -> runs foundations prerequisites + that module,
//                                               stubbing any catalog component it does not build
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { install, stats } from './mock-figma.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] || 'all';
const cache = path.join(ROOT, '.cache');
fs.mkdirSync(cache, { recursive: true });

const BUILDERS = {
  foundations: 'buildFoundations',
  'components-controls': 'buildControls',
  'components-surfaces': 'buildSurfaces',
  'components-navigation': 'buildNavigation',
  'components-feedback': 'buildFeedback',
  'components-dataviz': 'buildDataviz',
  patterns: 'buildPatterns',
  screens: 'buildScreens',
};

let entry = path.join(ROOT, target === 'preview' ? 'src/main-preview.ts' : 'src/main.ts');
if (target !== 'all' && target !== 'preview') {
  if (!BUILDERS[target]) throw new Error(`unknown module ${target}; one of: all, ${Object.keys(BUILDERS).join(', ')}`);
  entry = path.join(cache, `entry-${target}.ts`);
  const needsIcons = target !== 'foundations';
  fs.writeFileSync(entry, `
import * as core from '../src/core';
import { COMPONENT_CATALOG, type ComponentName } from '../src/core';
import { ${BUILDERS[target]} } from '../src/${target}';


function stub(name: ComponentName): ComponentSetNode | ComponentNode {
  const spec = COMPONENT_CATALOG[name] as Record<string, readonly string[]>;
  const axes = Object.entries(spec).filter(([k]) => k !== 'text');
  const holder = core.frame({ name: 'Stubs' });
  const make = (label: string) => core.component(label, { dir: 'V', gap: 4, pad: 8, fill: 'surface', width: 200 }, (c) => {
    for (const t of spec.text) core.add(c, core.text(t, { name: t }));
  });
  if (!axes.length) return core.single(name, make(name), holder);
  const combos: string[][] = [[]];
  for (const [k, vals] of axes) {
    const next: string[][] = [];
    for (const c of combos) for (const v of vals) next.push([...c, k + '=' + v]);
    combos.splice(0, combos.length, ...next);
  }
  return core.variantSet(name, combos.map((c) => make(c.join(', '))), holder);
}

async function run() {
  await core.loadFonts();
  core.createColorVariables();
  core.createDimensionVariables();
  core.createTextStyles();
  core.createEffectStyles();
  ${needsIcons ? "core.createIconComponents(core.frame({ name: 'Icons (test)', dir: 'H', wrap: true, width: 800 }));" : ''}
  core.setStubFactory(stub);
  const boards = ${BUILDERS[target]}();
  if (!Array.isArray(boards) || boards.length === 0) throw new Error('${BUILDERS[target]} must return a non-empty array of boards');
  core.applyThemeFallback();
  await core.linkStyles();
  figma.closePlugin('ok ' + boards.length + ' boards: ' + boards.map((b) => b.name).join(', '));
}
run().catch((e) => figma.closePlugin('Build failed: ' + (e && e.stack ? e.stack : e)));
`);
}

const out = path.join(cache, `bundle-${target}.js`);
await build({ entryPoints: [entry], bundle: true, outfile: out, format: 'iife', target: 'es2017', logLevel: 'error' });
install();
await import(pathToFileURL(out).href + `?t=${Date.now()}`);
const msg = await Promise.race([globalThis.__mockDone, new Promise((r) => setTimeout(() => r('TIMEOUT: closePlugin never called'), 60000))]);
const s = globalThis.__mockState;
console.log(String(msg).slice(0, 4000));
console.log('nodes:', JSON.stringify(stats.nodes));
console.log('variables:', s.variables.size, 'collections:', s.collections.size, 'textStyles:', s.textStyles.size, 'effectStyles:', s.effectStyles.size);
const linkedText = [...s.nodes.values()].filter((n) => n.type === 'TEXT' && n._textStyleId).length;
console.log('text nodes linked to styles:', linkedText);
if (/^Build failed|TIMEOUT/.test(String(msg))) process.exit(1);

// Theme check: every bound paint under a frame rendered in a theme must resolve to that theme's
// value, whether the theme comes from an explicit variable mode or from the fallback collections.
const tokensOut = path.join(cache, 'tokens.mjs');
await build({ entryPoints: [path.join(ROOT, 'src/data/tokens.ts')], bundle: true, format: 'esm', outfile: tokensOut, logLevel: 'error' });
const { COLOR_TOKENS } = await import(pathToFileURL(tokensOut).href + `?t=${Date.now()}`);
const tokenByKey = new Map(COLOR_TOKENS.map((t) => [t.token.replace(/^--color-/, ''), t]));
const hex = (c) => '#' + ['r', 'g', 'b'].map((k) => Math.round(c[k] * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const collOf = new Map();
for (const c of s.collections.values()) for (const id of c.variableIds) collOf.set(id, c);
function resolve(node, p) {
  const id = p && p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
  if (!id) return null;
  const v = s.variables.get(id);
  const coll = collOf.get(id);
  let mode = coll.modes[0].modeId;
  for (let n = node; n; n = n.parent) {
    if (n._explicitMode && coll.modes.some((m) => m.modeId === n._explicitMode)) { mode = n._explicitMode; break; }
  }
  return { key: v.name.split('/').pop(), hex: hex(v.valuesByMode[mode]) };
}
const THEMED = /^(?:Theme (Light|Dark|AMOLED)|Surfaces (Light|Dark|AMOLED)|(Light|Dark|AMOLED) theme|(Light|Dark|AMOLED) plate)$/;
let checked = 0;
const bad = [];
for (const root of s.nodes.values()) {
  const m = !root.removed && THEMED.exec(root.name);
  if (!m) continue;
  const mode = (m[1] || m[2] || m[3] || m[4]).toLowerCase();
  const walk = (n) => {
    if (n !== root && (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET')) return;
    for (const p of [...(Array.isArray(n.fills) ? n.fills : []), ...(Array.isArray(n.strokes) ? n.strokes : [])]) {
      const r = resolve(n, p);
      if (!r) continue;
      checked++;
      const want = tokenByKey.get(r.key)[mode].hex.toUpperCase();
      if (r.hex !== want && bad.length < 10) bad.push(`${root.name} › ${n.type} "${n.name}": ${r.key} is ${r.hex}, ${mode} is ${want}`);
    }
    for (const c of n.children || []) walk(c);
  };
  walk(root);
}
console.log(`theme check: ${checked} bound paints under themed frames${bad.length ? ', MISMATCHES:\n  ' + bad.join('\n  ') : ', all match'}`);
if (bad.length || checked === 0) process.exit(1);
