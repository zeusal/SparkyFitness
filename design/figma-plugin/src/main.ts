// Entry point: builds the SparkyFitness Mobile design system into the open Figma file.
// Run it once in an empty file (Figma Desktop › Plugins › Development › SparkyFitness Design System).

import * as core from './core';
import { buildFoundations } from './foundations';
import { buildControls } from './components-controls';
import { buildSurfaces } from './components-surfaces';
import { buildNavigation } from './components-navigation';
import { buildFeedback } from './components-feedback';
import { buildDataviz } from './components-dataviz';
import { buildPatterns } from './patterns';
import { buildScreens } from './screens';
import { COLOR_TOKENS } from './data/tokens';
import { ICON_NAMES } from './core';

async function buildCover(): Promise<FrameNode> {
  const { root, body } = core.board(
    'SparkyFitness Mobile — Design System',
    'Generated from SparkyFitnessMobile/DESIGN.md and global.css. Colors are variables with Light, Dark and AMOLED modes; type and shadows are shared styles; every component is built from them. When code and this file disagree, the code wins: regenerate the file instead of editing tokens by hand.',
    1600
  );
  const rows = core.frame({ name: 'Contents', dir: 'H', gap: 24, wrap: true });
  core.add(body, rows, { h: 'FILL' });
  const pages: [string, string][] = [
    ['Foundations', `${COLOR_TOKENS.length} color variables × 3 themes, type roles, spacing, radius, elevation and ${ICON_NAMES.length} icons.`],
    ['Components', 'Controls, surfaces and rows, navigation, sheets, feedback and data visualization, with their states.'],
    ['Patterns & Rules', 'Screen anatomy, screen types, state order and the do’s and don’ts from DESIGN.md.'],
    ['Screens', 'Dashboard, Diary, Library and Settings assembled from the components, in Light, Dark and AMOLED.'],
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
  core.notify('Building the SparkyFitness design system…');
  await core.loadFonts();
  const theme = core.createColorVariables();
  core.createDimensionVariables();
  core.createTextStyles();
  core.createEffectStyles();

  // The file's first page becomes the cover.
  // Under dynamic-page only the current page is loaded; load the first one before reading it.
  const first = figma.root.children[0];
  await first.loadAsync();
  if (first.children.length === 0) first.name = 'Cover';
  const cover = await core.usePage('Cover');
  core.layoutBoards(cover, [await buildCover()]);

  const foundations = await core.usePage('Foundations');
  core.layoutGrid(foundations, buildFoundations(), 5200);
  core.notify('Foundations done. Building components…');

  const components = await core.usePage('Components');
  const boards = [...buildControls(), ...buildSurfaces(), ...buildNavigation(), ...buildFeedback(), ...buildDataviz()];
  core.layoutGrid(components, boards, 5200);
  core.notify('Components done. Building patterns and screens…');

  const patterns = await core.usePage('Patterns & Rules');
  core.layoutGrid(patterns, buildPatterns(), 5200);

  const screens = await core.usePage('Screens');
  core.layoutGrid(screens, buildScreens(), 100000);

  const linked = await core.linkStyles();
  await figma.setCurrentPageAsync(cover);
  figma.viewport.scrollAndZoomIntoView(cover.children);
  const modes = theme.hasModes ? 'Light/Dark/AMOLED' : 'Light only (this plan allows one mode)';
  figma.closePlugin(`SparkyFitness design system ready · ${boards.length} component boards · themes: ${modes} · ${linked} style links`);
}

run().catch((e: unknown) => {
  const msg = e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e);
  figma.closePlugin(`Build failed: ${msg}`);
});
