// Pure helpers for scripts/maestro-affected.mjs: map changed files to Maestro
// flow tags through .maestro/areas.json, and read each flow's tags.
const fs = require('node:fs');
const path = require('node:path');

// Glob to RegExp: `**` spans folders, `*` stays within one, `?` is one char.
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i += 1;
        if (glob[i + 1] === '/') i += 1;
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

function matchesAny(file, globs) {
  return globs.some((g) => globToRegExp(g).test(file));
}

// Returns { runAll, tags, reasons } for a list of repo-root-relative paths.
function selectTags(changedFiles, areas) {
  const reasons = {};
  const runAllFiles = changedFiles.filter((f) =>
    matchesAny(f, areas.runAll || [])
  );
  const tags = new Set(areas.always || []);
  for (const [tag, globs] of Object.entries(areas.areas || {})) {
    const hits = changedFiles.filter((f) => matchesAny(f, globs));
    if (hits.length > 0) {
      tags.add(tag);
      reasons[tag] = hits;
    }
  }
  return {
    runAll: runAllFiles.length > 0,
    runAllFiles,
    tags: [...tags].sort(),
    reasons,
  };
}

// Reads the `tags:` list from a flow file's header (before the first `---`).
function parseFlowTags(text) {
  const header = text.split(/^---\s*$/m)[0];
  const lines = header.split(/\r?\n/);
  const tags = [];
  let inTags = false;
  for (const line of lines) {
    if (/^tags:\s*$/.test(line)) {
      inTags = true;
      continue;
    }
    if (inTags) {
      const m = /^\s+-\s+['"]?([^'"#\s]+)['"]?/.exec(line);
      if (m) {
        tags.push(m[1]);
        continue;
      }
      if (/^\S/.test(line)) inTags = false;
    }
  }
  return tags;
}

// Lists the .yaml flows under a folder with their tags.
function listFlows(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.ya?ml$/.test(entry.name)) {
        out.push({ file: p, tags: parseFlowTags(fs.readFileSync(p, 'utf8')) });
      }
    }
  };
  walk(dir);
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

function flowsForTags(flows, selection) {
  if (selection.runAll) return flows;
  return flows.filter((f) => f.tags.some((t) => selection.tags.includes(t)));
}

module.exports = {
  globToRegExp,
  selectTags,
  parseFlowTags,
  listFlows,
  flowsForTags,
};
