import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dailyArg = args.find(arg => !arg.startsWith('--'));
const daily = dailyArg ? path.resolve(dailyArg) : null;
const out = relative => path.join(root, relative);

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function writeJson(relative, value) { ensure(path.dirname(out(relative))); fs.writeFileSync(out(relative), JSON.stringify(value, null, 2) + '\n'); }
function copy(source, target) { ensure(path.dirname(target)); fs.cpSync(source, target, { recursive: true, force: true }); }
function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
function same(a, b) { return fs.readFileSync(a).equals(fs.readFileSync(b)); }
function findByName(dir, name) { return listFiles(dir).find(file => path.basename(file) === name); }

const graphContext = {};
const graphSource = fs.readFileSync(out('projects/philosophy-flywheel/data/knowledge-graph.js'), 'utf8');
vm.runInNewContext(`${graphSource}\nthis.__graph = KNOWLEDGE_GRAPH;`, graphContext);
const graph = graphContext.__graph;
if (!graph) throw new Error('knowledge graph could not be loaded');

const booksContext = { window: {} };
vm.runInNewContext(fs.readFileSync(out('projects/reading-shelf/data/books-data.js'), 'utf8'), booksContext);
const books = booksContext.window.READING_SHELF_BOOKS;
const cards = JSON.parse(fs.readFileSync(out('projects/reading-shelf/data/philosophy-cards.json'), 'utf8'));

const memoryRoot = out('data/memory');
if (args.includes('--clean')) fs.rmSync(memoryRoot, { recursive: true, force: true });
ensure(memoryRoot);
const map = { '阅读': 'reading', '工作': 'work', '生活': 'life', '乒乓': 'sports', '存档': 'archive' };
const migration = { schemaVersion: 1, generatedAt: new Date().toISOString(), dailyNotes: daily ? 'https://github.com/rj-weibin/daily-notes' : null, mergedFiles: [], importedFiles: [], conflicts: [] };

if (daily && fs.existsSync(daily)) {
  for (const file of listFiles(daily)) {
    const relative = path.relative(daily, file);
    if (relative.startsWith('.git' + path.sep)) continue;
    const parts = relative.split(path.sep);
    const ignoredRoots = new Set(['.git', '.github', '.obsidian', '.trash']);
    const ignoredFiles = new Set(['.gitignore', 'Thumbs.db', '分类体系说明.md', 'auto-push.sh', 'crontab-setup.txt']);
    if (ignoredRoots.has(parts[0]) || ignoredFiles.has(parts.at(-1)) || parts.at(-1) === '.DS_Store') continue;
    if (parts[0] === '图片') continue;
    const category = map[parts[0]] ?? 'resources';
    const target = path.join(memoryRoot, category, ...parts.slice(map[parts[0]] ? 1 : 0));
    copy(file, target);
    migration.importedFiles.push({ from: relative, to: path.relative(root, target) });
  }
}

const siteSources = out('projects/philosophy-flywheel/sources');
for (const file of listFiles(siteSources)) {
  const name = path.basename(file);
  const targetExisting = findByName(memoryRoot, name);
  if (!targetExisting) {
    const target = path.join(memoryRoot, 'atlas', name);
    copy(file, target);
    migration.importedFiles.push({ from: path.relative(root, file), to: path.relative(root, target) });
  } else if (!same(file, targetExisting)) {
    const original = fs.readFileSync(targetExisting, 'utf8');
    const supplement = fs.readFileSync(file, 'utf8');
    if (!original.includes('## 迁移补充：站点原始记录')) {
      fs.writeFileSync(targetExisting, `${original.trimEnd()}\n\n---\n\n## 迁移补充：站点原始记录\n\n${supplement.trim()}\n`, 'utf8');
    }
    migration.conflicts.push({ site: path.relative(root, file), canonical: path.relative(root, targetExisting) });
  } else {
    migration.mergedFiles.push({ site: path.relative(root, file), canonical: path.relative(root, targetExisting) });
  }
}

if (daily) {
  const taxonomy = path.join(daily, '分类体系说明.md');
  if (fs.existsSync(taxonomy)) copy(taxonomy, out('data/resources/分类体系说明.md'));
  for (const name of ['auto-push.sh', 'crontab-setup.txt']) {
    const file = path.join(daily, name);
    if (fs.existsSync(file)) copy(file, out(`automation/${name}`));
  }
  const images = path.join(daily, '图片');
  if (fs.existsSync(images)) copy(images, out('assets/imported'));
}

const sourceLookup = new Map(listFiles(memoryRoot).map(file => [path.basename(file), path.relative(root, file).split(path.sep).join('/')]));
for (const node of graph.nodes) {
  if (!node.source || sourceLookup.has(path.basename(node.source))) continue;
  const filename = path.basename(node.source);
  const target = path.join(memoryRoot, 'atlas', filename);
  const content = [
    `# 迁移记录：${node.title}`,
    '',
    '> 原始 Markdown 未在两个仓库快照中找到。本文件只保留旧图谱中已经存在的结构化内容，不代表新增原话。',
    '',
    '## 洞见',
    '',
    node.oneLiner ?? '',
    '',
    '## 哲学笔记',
    '',
    node.philosophyNote ?? '',
    '',
    '## 关键要点',
    '',
    ...(node.keyTakeaways ?? []).map(item => `- ${item}`),
    '',
  ].join('\n');
  fs.writeFileSync(target, content, 'utf8');
  sourceLookup.set(filename, path.relative(root, target).split(path.sep).join('/'));
  migration.conflicts.push({ missingOriginal: node.source, canonical: path.relative(root, target) });
}
const normalizedGraph = { ...graph, meta: { ...graph.meta, sourceOfTruth: 'data', generatedFrom: 'data/memory' }, nodes: graph.nodes.map(node => ({
  ...node,
  source: node.source ? (sourceLookup.get(path.basename(node.source)) ?? node.source) : null,
})) };
writeJson('data/knowledge-graph.json', normalizedGraph);
writeJson('data/books/books.json', books);
writeJson('data/concepts/collisions.json', cards);
writeJson('data/books/reading-notes.json', listFiles(path.join(memoryRoot, 'reading')).map(file => ({ id: path.basename(file, path.extname(file)), path: path.relative(root, file).split(path.sep).join('/'), title: path.basename(file, path.extname(file)) })));
writeJson('data/resources/migration-report.json', migration);
if (args.includes('--remove-legacy')) {
  const legacyTargets = [
    '.deploy_git',
    'projects',
    'resume',
    'index.html',
    'templates/site/projects/philosophy-flywheel/sources',
    'templates/site/projects/philosophy-flywheel/data/knowledge-graph.js',
    'templates/site/projects/reading-shelf/data/books-data.js',
    'templates/site/projects/reading-shelf/data/philosophy-cards.json',
  ];
  for (const relative of legacyTargets) fs.rmSync(out(relative), { recursive: true, force: true });
}
console.log(`Migrated ${migration.importedFiles.length} files, merged ${migration.mergedFiles.length}, conflicts ${migration.conflicts.length}.`);
