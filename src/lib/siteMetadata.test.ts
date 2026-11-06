import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolveSite } from './siteIdentity';
import { rewriteSiteMetadata } from './siteMetadata';

const template = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
for (const host of ['me', 'hub']) {
  test(`${host} receives its identity in HTML before JavaScript runs`, () => {
    const site = resolveSite(new URL(`https://${host}.nielstudios.com/`));
    const output = rewriteSiteMetadata(template, site);
    assert.ok(output.includes(`<title>${site.title.replaceAll('&', '&amp;')}</title>`));
    assert.ok(output.includes(`property="og:url" content="${site.url}"`));
    assert.ok(output.includes(`rel="canonical" href="${site.url}"`));
    assert.ok(output.includes(site.description));
    assert.ok(output.includes(`property="og:image" content="${site.url}og-image.png"`));
    assert.ok(output.includes(`name="theme-color" content="${site.kind === 'portfolio' ? '#eee7db' : '#f4f0e6'}"`));
    assert.ok(!output.includes('Curated Web Project Showcase'));
    assert.equal(output.split('<body>')[1], template.split('<body>')[1]);
    const data = JSON.parse(output.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(data.url, site.url);
    assert.equal(data.name, site.name);
  });
}
