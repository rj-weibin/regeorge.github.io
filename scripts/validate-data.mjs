import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function readJson(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing: ${relative}`);
    return null;
  }
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { errors.push(`invalid JSON: ${relative} (${error.message})`); return null; }
}

function duplicateIds(items, label, getId = item => item.id) {
  const seen = new Map();
  for (const item of items ?? []) {
    const id = getId(item);
    if (!id) { errors.push(`${label}: missing id`); continue; }
    if (seen.has(id)) errors.push(`${label}: duplicate id ${id}`);
    seen.set(id, true);
  }
}

const graph = readJson('data/knowledge-graph.json');
const books = readJson('data/books/books.json');
const cards = readJson('data/concepts/collisions.json');
const mobileCards = readJson('data/concepts/mobile-cards.json');
const projects = readJson('data/projects/projects.json');
duplicateIds(graph?.nodes, 'concept');
duplicateIds(books, 'book', item => item.bookId ?? item.id ?? item.title);
duplicateIds(projects, 'project');
cards?.forEach((card, index) => {
  if (!card.tag && !card.id) errors.push(`collision card ${index + 1}: missing tag/id`);
});
duplicateIds(mobileCards?.cards, 'mobile card');

const pending = path.join(root, 'inbox', 'pending');
if (fs.existsSync(pending) && fs.readdirSync(pending).length > 0) {
  console.warn('warning: inbox/pending contains unprocessed intake files');
}

for (const relative of ['pages/index.html', 'pages/data/knowledge-graph.json', 'pages/data/books-data.js', 'pages/data/philosophy-cards.json', 'pages/data/cards.json', 'pages/data/projects.json']) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`missing build output: ${relative}`);
}

const pageFiles = fs.existsSync(path.join(root, 'pages'))
  ? fs.readdirSync(path.join(root, 'pages'), { recursive: true }).filter(name => /\.(html|js|json)$/.test(name))
  : [];
for (const relative of pageFiles) {
  const text = fs.readFileSync(path.join(root, 'pages', relative), 'utf8');
  if (text.includes('.deploy_git') || text.includes('projects/philosophy-flywheel/data/knowledge-graph')) {
    errors.push(`legacy data reference: pages/${relative}`);
  }
}

if (errors.length) {
  console.error(errors.map(error => `✗ ${error}`).join('\n'));
  process.exit(1);
}
console.log('Data and page output validation passed.');
