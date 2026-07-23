import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = path.join(root, 'pages');
const template = path.join(root, 'templates', 'site');
const data = path.join(root, 'data');

function remove(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copy(source, target) {
  fs.cpSync(source, target, { recursive: true, force: true });
}

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

remove(pages);
fs.mkdirSync(pages, { recursive: true });
copy(template, pages);
copy(path.join(root, 'assets'), path.join(pages, 'assets'));
remove(path.join(pages, 'projects', 'reading-shelf', 'scripts'));
remove(path.join(pages, 'projects', 'philosophy-flywheel', 'REVIEW.md'));
fs.mkdirSync(path.join(pages, 'data'), { recursive: true });

const graph = readJson('data/knowledge-graph.json');
const books = readJson('data/books/books.json');
const cards = readJson('data/concepts/collisions.json');
const mobileCards = readJson('data/concepts/mobile-cards.json');
const projects = readJson('data/projects/projects.json');
const personalEngineeringThesis = readJson('data/projects/personal-engineering-thesis.json');
fs.writeFileSync(path.join(pages, 'data', 'knowledge-graph.json'), JSON.stringify(graph, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'books.json'), JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'philosophy-cards.json'), JSON.stringify(cards, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'cards.json'), JSON.stringify(mobileCards, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'projects.json'), JSON.stringify(projects, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'personal-engineering-thesis.json'), JSON.stringify(personalEngineeringThesis, null, 2) + '\n');
fs.writeFileSync(path.join(pages, 'data', 'books-data.js'), `window.READING_SHELF_BOOKS = ${JSON.stringify(books, null, 2)};\n`);

const registry = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  counts: {
    concepts: graph.nodes?.length ?? 0,
    books: books.length,
    collisionCards: cards.length,
    mobileCards: mobileCards.cards?.length ?? 0,
    projects: projects.length,
  },
};
fs.writeFileSync(path.join(pages, 'data', 'registry.json'), JSON.stringify(registry, null, 2) + '\n');
console.log(`Built pages/ (${registry.counts.concepts} concepts, ${registry.counts.books} books, ${registry.counts.collisionCards} collision cards)`);
