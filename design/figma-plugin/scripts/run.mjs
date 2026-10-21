// Runs the builder (or one module) against the strict Figma mock.
//   node scripts/run.mjs all                 -> bundles src/main.ts and runs the full build
//   node scripts/run.mjs components-controls -> runs foundations prerequisites + that module,
//                                               stubbing any catalog component it does not build
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { install, stats } from './mock-figma.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
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

let entry = path.join(ROOT, 'src/main.ts');
if (target !== 'all') {
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
