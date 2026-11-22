#!/usr/bin/env node
// Runs only the Maestro flows a change can affect.
//
//   pnpm run maestro:affected -- --app-id org.SparkyApps.SparkyFitnessMobile1.dev --device <serial>
//
// It lists the files changed against a base ref (default upstream/main, else
// origin/main) plus uncommitted and untracked files, maps them to flow tags
// with .maestro/areas.json, and runs `maestro test` on flows/ with those tags.
// The `smoke` flows always run; a change to a shared file (App.tsx,
// navigation, shared/, ...) runs every flow.
//
// Options:
//   --base <ref>       compare against this ref
//   --app-id <id>      app under test (or APP_ID env)
//   --device <serial>  device to use (or MAESTRO_DEVICE env)
//   --all              run every flow, whatever changed
//   --with-data        also run the matching flows-data/ flows; needs
//                      SPARKY_E2E_SERVER_URL and SPARKY_E2E_API_KEY in the
//                      environment (a test account; see .maestro/README.md)
//   --dry-run          print what would run and stop
//   -- <args>          anything after -- goes to `maestro test` as is
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  selectTags,
  listFlows,
  flowsForTags,
} = require('./maestro-affected/affected.cjs');

const mobileDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const maestroDir = path.join(mobileDir, '.maestro');
const outputDir = path.join(mobileDir, '.maestro-results');

function parseArgs(argv) {
  const opts = { extra: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--') {
      opts.extra = argv.slice(i + 1);
      break;
    }
    if (a === '--all' || a === '--with-data' || a === '--dry-run') {
      opts[a.slice(2)] = true;
    } else if (a === '--base' || a === '--app-id' || a === '--device') {
      opts[a.slice(2)] = argv[i + 1];
      i += 1;
    } else {
      throw new Error(`Unknown option ${a} (see the header of this script)`);
    }
  }
  return opts;
}

function git(args) {
  return execFileSync('git', args, { cwd: mobileDir, encoding: 'utf8' }).trim();
}

function refExists(ref) {
  try {
    git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function changedFiles(base) {
  const lines = [
    git(['diff', '--name-only', `${base}...HEAD`]),
    git(['diff', '--name-only', 'HEAD']),
    git(['ls-files', '--others', '--exclude-standard', '--full-name']),
  ]
    .join('\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return [...new Set(lines)].sort();
}

function runMaestro(label, args) {
  const shown = args.map((a) => (a.startsWith('API_KEY=') ? 'API_KEY=***' : a));
  console.log(`\n${label}: maestro ${shown.join(' ')}`);
  const res = spawnSync('maestro', args, {
    cwd: mobileDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (res.error) throw res.error;
  return res.status ?? 1;
}

const opts = parseArgs(process.argv.slice(2));
const areas = JSON.parse(
  readFileSync(path.join(maestroDir, 'areas.json'), 'utf8')
);

const base =
  opts.base ?? ['upstream/main', 'origin/main'].find((r) => refExists(r));
if (!base || !refExists(base)) {
  throw new Error('No base ref found: pass --base <ref> (e.g. upstream/main)');
}

const files = changedFiles(base);
const selection = opts.all
  ? { runAll: true, runAllFiles: ['--all'], tags: [], reasons: {} }
  : selectTags(files, areas);

console.log(`Base: ${base}. Changed files: ${files.length}.`);
if (selection.runAll) {
  console.log(
    `Running every flow because of: ${selection.runAllFiles.slice(0, 5).join(', ')}`
  );
} else {
  console.log(`Tags: ${selection.tags.join(', ')}`);
  for (const [tag, hits] of Object.entries(selection.reasons)) {
    console.log(
      `  ${tag}: ${hits.slice(0, 3).join(', ')}${hits.length > 3 ? ', ...' : ''}`
    );
  }
}

const safeFlows = flowsForTags(
  listFlows(path.join(maestroDir, 'flows')),
  selection
);
const dataFlows = opts['with-data']
  ? flowsForTags(listFlows(path.join(maestroDir, 'flows-data')), selection)
  : [];
console.log(
  `Flows: ${safeFlows.length} in flows/${opts['with-data'] ? `, ${dataFlows.length} in flows-data/` : ''}`
);
for (const f of [...safeFlows, ...dataFlows]) {
  console.log(`  ${path.relative(mobileDir, f.file)}`);
}
if (opts['dry-run']) process.exit(0);

const appId = opts['app-id'] ?? process.env.APP_ID;
if (!appId) throw new Error('Pass --app-id <package> or set APP_ID');
const device = opts.device ?? process.env.MAESTRO_DEVICE;

const common = [
  ...(device ? ['--device', device] : []),
  '-e',
  `APP_ID=${appId}`,
  ...(selection.runAll ? [] : ['--include-tags', selection.tags.join(',')]),
  '--test-output-dir',
  outputDir,
  '--debug-output',
  outputDir,
  ...opts.extra,
];

let status = 0;
if (safeFlows.length > 0) {
  status = runMaestro('flows/', ['--no-ansi', 'test', maestroDir, ...common]);
}
if (dataFlows.length > 0) {
  const serverUrl = process.env.SPARKY_E2E_SERVER_URL;
  const apiKey = process.env.SPARKY_E2E_API_KEY;
  if (!serverUrl || !apiKey) {
    throw new Error(
      '--with-data needs SPARKY_E2E_SERVER_URL and SPARKY_E2E_API_KEY'
    );
  }
  const dataStatus = runMaestro('flows-data/', [
    '--no-ansi',
    'test',
    maestroDir,
    '--config',
    path.join(maestroDir, 'config-data.yaml'),
    ...common,
    '-e',
    `SERVER_URL=${serverUrl}`,
    '-e',
    `API_KEY=${apiKey}`,
  ]);
  status = status || dataStatus;
}
process.exit(status);
