import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveSite } from './siteIdentity';

test('the two production hosts have distinct identities and cannot be overridden by query parameters', () => {
  assert.equal(resolveSite(new URL('https://me.nielstudios.com/')).kind, 'portfolio');
  assert.equal(resolveSite(new URL('https://hub.nielstudios.com/?site=portfolio')).kind, 'hub');
  assert.equal(resolveSite(new URL('https://me.nielstudios.com/?site=hub')).kind, 'portfolio');
});

test('local and Pages previews can demonstrate either site without changing production routing', () => {
  assert.equal(resolveSite(new URL('http://localhost:3000/')).kind, 'hub');
  assert.equal(resolveSite(new URL('http://localhost:3000/?site=portfolio')).kind, 'portfolio');
  assert.equal(resolveSite(new URL('https://preview.project-hub-ezx.pages.dev/?site=portfolio')).kind, 'portfolio');
  assert.equal(resolveSite(new URL('https://example.com/?site=portfolio')).kind, 'hub');
});

test('each identity has its own canonical URL and share metadata', () => {
  const hub = resolveSite(new URL('https://hub.nielstudios.com/'));
  const portfolio = resolveSite(new URL('https://me.nielstudios.com/'));
  assert.equal(hub.url, 'https://hub.nielstudios.com/');
  assert.equal(portfolio.url, 'https://me.nielstudios.com/');
  assert.match(hub.title, /Project Hub/);
  assert.match(portfolio.title, /Between Words/);
  assert.notEqual(hub.description, portfolio.description);
});
