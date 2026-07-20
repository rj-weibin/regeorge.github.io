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

function duplicateValues(items, label, getValue) {
  const seen = new Map();
  for (const item of items ?? []) {
    const value = getValue(item);
    if (!value) continue;
    if (seen.has(value)) errors.push(`${label}: duplicate ${value}`);
    seen.set(value, true);
  }
}

const graph = readJson('data/knowledge-graph.json');
const books = readJson('data/books/books.json');
const cards = readJson('data/concepts/collisions.json');
const mobileCards = readJson('data/concepts/mobile-cards.json');
const projects = readJson('data/projects/projects.json');
duplicateIds(graph?.nodes, 'concept');
duplicateIds(books, 'book', item => item.bookId ?? item.id ?? item.title);
duplicateValues(books, 'book', item => item.title?.trim());
books?.forEach(book => {
  const collisionCount = book.detail?.collisions?.length ?? 0;
  if ((book.notes ?? 0) !== collisionCount) errors.push(`book ${book.bookId}: notes must equal detail.collisions length`);
});
duplicateIds(projects, 'project');
duplicateIds(cards, 'collision');
cards?.forEach((card, index) => {
  if (!card.tag && !card.id) errors.push(`collision card ${index + 1}: missing tag/id`);
  if (card.type !== 'collision') errors.push(`collision card ${index + 1}: type must be collision`);
  if (!['draft', 'proposed', 'reviewed', 'archived'].includes(card.status)) errors.push(`collision card ${index + 1}: invalid status`);
  if (!card.updatedAt) errors.push(`collision card ${index + 1}: missing updatedAt`);
});
duplicateIds(mobileCards?.cards, 'mobile card');

const graphNodeIds = new Set(graph?.nodes?.map(node => node.id) ?? []);
const graphTopicIds = new Set(graph?.topics?.map(topic => topic.id) ?? []);
const graphCategoryIds = new Set(graph?.categories?.map(category => category.id) ?? []);
for (const node of graph?.nodes ?? []) {
  if (node.source && !fs.existsSync(path.join(root, node.source))) errors.push(`concept ${node.id}: missing source ${node.source}`);
  for (const relation of node.relations ?? []) {
    if (!['node', 'topic', 'category'].includes(relation.targetType)) {
      errors.push(`concept ${node.id}: invalid relation targetType for ${relation.target}`);
      continue;
    }
    const targetSet = relation.targetType === 'node' ? graphNodeIds : relation.targetType === 'topic' ? graphTopicIds : graphCategoryIds;
    if (!targetSet.has(relation.target)) errors.push(`concept ${node.id}: missing ${relation.targetType} ${relation.target}`);
  }
}

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
  if (text.includes('.deploy_git') || text.includes('projects/philosophy-flywheel/data/knowledge-graph') || text.includes('hexo_posts') || text.includes('gardenForLilis') || text.includes('stickergotaro')) {
    errors.push(`legacy data reference: pages/${relative}`);
  }
  for (const pattern of [/172\.17\.\d+\.\d+/, /Basic dGhpcmQ6MTIz/, /Credentials:\s*third:123/, /12345aA!/]) {
    if (pattern.test(text)) errors.push(`sensitive value in generated page: pages/${relative}`);
  }
}

if (errors.length) {
  console.error(errors.map(error => `✗ ${error}`).join('\n'));
  process.exit(1);
}
console.log('Data and page output validation passed.');
