// Run: node --test tests/
// Node 24 strips the TypeScript types, so this needs no test runner.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categoriesOf, filterProjects, paginate, PER_PAGE } from '../lib/workFilter.ts';

const P = (title: string, tags: string[]) => ({ slug: title.toLowerCase(), title, tags });
const ALL = [
  P('LAB', ['CRM', 'Dashboard']),
  P('IOGA', ['Software Development', 'Mobile App']),
  P('FINPIVOT', ['Logo & Branding', 'Dashboard']),
  P('ECOEATS', ['Logo & Branding', 'Mobile App']),
  P('IZI-IT', ['Application', 'Development']),
  P('CMP', ['Dashboard', 'WordPress']),
  P('Offy Puzzles 2024', ['Branding', 'Illustrator']),
  P('Passerelles Numériques', ['Web Design', 'WordPress']),
];

test('a page holds six cards', () => {
  assert.equal(PER_PAGE, 6);
});

test('categories are the unique tags, sorted', () => {
  const c = categoriesOf(ALL);
  assert.deepEqual(c.slice(0, 3), ['Application', 'Branding', 'CRM']);
  assert.equal(new Set(c).size, c.length);
  assert.ok(c.includes('Mobile App'));
});

test('a category keeps only the cards with that tag', () => {
  assert.deepEqual(filterProjects(ALL, { category: 'Mobile App', q: '' }).map((p) => p.title), ['IOGA', 'ECOEATS']);
});

test('search matches the title without accents or case', () => {
  assert.deepEqual(filterProjects(ALL, { category: '', q: 'numeriques' }).map((p) => p.title), ['Passerelles Numériques']);
  assert.deepEqual(filterProjects(ALL, { category: '', q: '  ioga ' }).map((p) => p.title), ['IOGA']);
});

test('search matches a tag too', () => {
  assert.deepEqual(filterProjects(ALL, { category: '', q: 'wordpress' }).map((p) => p.title), ['CMP', 'Passerelles Numériques']);
});

test('category and search combine', () => {
  assert.deepEqual(filterProjects(ALL, { category: 'Dashboard', q: 'fin' }).map((p) => p.title), ['FINPIVOT']);
});

test('an unknown category gives no cards', () => {
  assert.equal(filterProjects(ALL, { category: 'Nope', q: '' }).length, 0);
});

test('paginate cuts pages of six and clamps the page', () => {
  const twelve = [...ALL, ...ALL.slice(0, 4)];
  assert.deepEqual(paginate(twelve, 1), { items: twelve.slice(0, 6), page: 1, pages: 2 });
  assert.deepEqual(paginate(twelve, 2), { items: twelve.slice(6, 12), page: 2, pages: 2 });
  assert.equal(paginate(twelve, 9).page, 2);
  assert.equal(paginate(twelve, 0).page, 1);
  assert.equal(paginate(twelve, Number.NaN).page, 1);
});

test('an empty list is one empty page', () => {
  assert.deepEqual(paginate([], 3), { items: [], page: 1, pages: 1 });
});

test('a partly filled last page', () => {
  const r = paginate(ALL, 2);
  assert.equal(r.items.length, 2);
  assert.equal(r.pages, 2);
});
