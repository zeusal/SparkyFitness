// Preview entry point: builds the parts of the design system that are finished
// (cover, foundations, controls, surfaces and rows). Use `npm run build:preview`.
// The full build (src/main.ts) adds navigation, feedback, data visualization,
// patterns and screens once those modules are in place.

import * as core from './core';
import { buildFoundations } from './foundations';
import { buildControls } from './components-controls';
import { buildSurfaces } from './components-surfaces';
import { COLOR_TOKENS } from './data/tokens';

function buildCover(): FrameNode {
  const { root, body } = core.board(
    'SparkyFitness Mobile — Design System (preview)',
    'Generated from SparkyFitnessMobile/DESIGN.md and global.css. Colors are variables with Light, Dark and AMOLED modes; type and shadows are shared styles; every component is built from them. This preview contains the foundations and the first component families; navigation, feedback, data visualization, patterns and screens come with the full build.',
    1600
  );
  const rows = core.frame({ name: 'Contents', dir: 'H', gap: 24, wrap: true });
  core.add(body, rows, { h: 'FILL' });
  const pages: [string, string][] = [
    ['Foundations', `${COLOR_TOKENS.length} color variables × 3 themes, type roles, spacing, radius, elevation and ${core.ICON_NAMES.length} icons.`],
    ['Components', 'Buttons, inputs, selection controls, chips and badges, cards, and rows and lists, with their states.'],
  ];
  for (const [title, desc] of pages) {
    const card = core.frame({ name: title, dir: 'V', gap: 8, pad: 24, fill: 'surface', radius: 16, width: 360 });
    core.effect(card, 'Elevation/Card (shadow-sm)');
    core.add(rows, card);
    core.add(card, core.text(title, { role: 'Title/Screen bar' }));
    core.add(card, core.text(desc, { role: 'Body/Default', color: 'text-secondary', width: 312 }), { h: 'FILL' });
  }
  return root;
}

async function run(): Promise<void> {
  core.notify('Building the SparkyFitness design system (preview)…');
  await core.loadFonts();
  const theme = core.createColorVariables();
  core.createDimensionVariables();
  core.createTextStyles();
  core.createEffectStyles();

  // Under dynamic-page only the current page is loaded; load the first one before reading it.
  const first = figma.root.children[0];
  await first.loadAsync();
  if (first.children.length === 0) first.name = 'Cover';
  const cover = await core.usePage('Cover');
  core.layoutBoards(cover, [buildCover()]);

  const foundations = await core.usePage('Foundations');
  core.layoutGrid(foundations, buildFoundations(), 5200);

  const components = await core.usePage('Components');
  const boards = [...buildControls(), ...buildSurfaces()];
  core.layoutGrid(components, boards, 5200);

  const linked = await core.linkStyles();
  await figma.setCurrentPageAsync(cover);
  figma.viewport.scrollAndZoomIntoView(cover.children);
  const modes = theme.hasModes ? 'Light/Dark/AMOLED' : 'Light only (this plan allows one mode)';
  figma.closePlugin(`SparkyFitness design system preview ready · ${boards.length} component boards · themes: ${modes} · ${linked} style links`);
}

run().catch((e: unknown) => {
  const msg = e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e);
  figma.closePlugin(`Build failed: ${msg}`);
});
