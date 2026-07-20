import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'agents', 'operating-rules.md');
const text = fs.readFileSync(source, 'utf8');
for (const name of ['AGENTS.md', 'CLAUDE.md', 'CODEBUDDY.md']) {
  fs.writeFileSync(path.join(root, name), text, 'utf8');
}
console.log('Synced agent guides from agents/operating-rules.md');
