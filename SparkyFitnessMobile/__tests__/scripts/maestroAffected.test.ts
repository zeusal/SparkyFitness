import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(pathToFileURL(__filename));
const {
  globToRegExp,
  selectTags,
  parseFlowTags,
  listFlows,
  flowsForTags,
} = require('../../scripts/maestro-affected/affected.cjs');

const mobileRoot = path.resolve(__dirname, '../..');
const areas = JSON.parse(
  fs.readFileSync(path.join(mobileRoot, '.maestro/areas.json'), 'utf8')
);

describe('globToRegExp', () => {
  it('keeps * within one folder and lets ** span folders', () => {
    expect(globToRegExp('a/*.tsx').test('a/B.tsx')).toBe(true);
    expect(globToRegExp('a/*.tsx').test('a/b/C.tsx')).toBe(false);
    expect(globToRegExp('a/**').test('a/b/c/D.ts')).toBe(true);
    expect(globToRegExp('a/**/x.ts').test('a/x.ts')).toBe(true);
    expect(globToRegExp('a.b/c?.ts').test('a.b/c1.ts')).toBe(true);
    expect(globToRegExp('a.b/c?.ts').test('axb/c1.ts')).toBe(false);
  });
});

describe('selectTags with the real areas.json', () => {
  it('always includes smoke and adds the area of a changed screen', () => {
    const sel = selectTags(
      ['SparkyFitnessMobile/src/screens/DiaryScreen.tsx'],
      areas
    );
    expect(sel.runAll).toBe(false);
    expect(sel.tags).toEqual(['diary', 'smoke']);
  });

  it('runs everything when a shared file changes', () => {
    const sel = selectTags(['SparkyFitnessMobile/App.tsx'], areas);
    expect(sel.runAll).toBe(true);
  });

  it('runs only smoke for files no area claims', () => {
    const sel = selectTags(['docs/src/index.md'], areas);
    expect(sel).toMatchObject({ runAll: false, tags: ['smoke'] });
  });

  it('maps a server food route to the food flows', () => {
    const sel = selectTags(
      ['SparkyFitnessServer/routes/foodCrudRoutes.ts'],
      areas
    );
    expect(sel.tags).toContain('food');
  });
});

describe('flow tags', () => {
  it('reads the tags list from the flow header only', () => {
    const text = [
      'appId: ${APP_ID}',
      'tags:',
      '  - diary',
      "  - 'smoke'",
      'onFlowComplete:',
      '  - runScript: x.js',
      '---',
      'tags:',
      '  - not-a-tag',
    ].join('\n');
    expect(parseFlowTags(text)).toEqual(['diary', 'smoke']);
  });

  it('gives every kit flow an area tag that areas.json knows', () => {
    const known = new Set([
      ...areas.always,
      ...Object.keys(areas.areas),
      'android',
      'ios',
      'regression',
      'writes-data',
      'clean-install',
    ]);
    const flows = [
      ...listFlows(path.join(mobileRoot, '.maestro/flows')),
      ...listFlows(path.join(mobileRoot, '.maestro/flows-data')),
    ];
    expect(flows.length).toBeGreaterThan(0);
    for (const flow of flows) {
      const areaTags = flow.tags.filter(
        (t: string) => areas.always.includes(t) || t in areas.areas
      );
      expect({ file: flow.file, ok: areaTags.length > 0 }).toEqual({
        file: flow.file,
        ok: true,
      });
      for (const tag of flow.tags) {
        expect({ file: flow.file, tag, known: known.has(tag) }).toEqual({
          file: flow.file,
          tag,
          known: true,
        });
      }
    }
  });

  it('selects flows by tag unless everything runs', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'maestro-flows-'));
    fs.writeFileSync(path.join(dir, 'a.yaml'), 'tags:\n  - diary\n---\n');
    fs.writeFileSync(path.join(dir, 'b.yaml'), 'tags:\n  - food\n---\n');
    const flows = listFlows(dir);
    const picked = flowsForTags(flows, { runAll: false, tags: ['diary'] });
    expect(picked.map((f: { file: string }) => path.basename(f.file))).toEqual([
      'a.yaml',
    ]);
    expect(flowsForTags(flows, { runAll: true, tags: [] })).toHaveLength(2);
  });
});
