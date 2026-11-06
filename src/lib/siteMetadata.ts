import type { resolveSite } from './siteIdentity';

/** Rewrite only the metadata of our static HTML template, leaving the app and its assets intact. */
export function rewriteSiteMetadata(html: string, site: ReturnType<typeof resolveSite>) {
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const values: Record<string, string> = {
    title: site.title, description: site.description, author: 'Niel Studios',
    keywords: site.kind === 'hub' ? 'Niel Studios, projects, websites, applications, tools' : 'Niel Studios, portfolio, design, development, literature',
    'theme-color': site.themeColor, 'apple-mobile-web-app-title': site.name,
    'og:image': site.image, 'og:image:secure_url': site.image, 'twitter:image': site.image,
    'og:title': site.title, 'og:description': site.description, 'og:site_name': site.name,
    'og:image:alt': site.title, 'twitter:title': site.title,
    'twitter:description': site.description, 'twitter:image:alt': site.title,
  };
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(site.title)}</title>`)
    .replace(/<meta\s[^>]*>/gi, tag => {
      const key = tag.match(/(?:name|property)="([^"]+)"/i)?.[1];
      return key && key in values ? tag.replace(/content="[^"]*"/i, `content="${escape(values[key])}"`) : tag;
    })
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': site.kind === 'portfolio' ? 'ProfilePage' : 'CollectionPage',
      name: site.name, headline: site.title, description: site.description, url: site.url,
    })}</script>`)
    .replace('</head>', `  <link rel="canonical" href="${site.url}" />\n    <meta property="og:url" content="${site.url}" />\n  </head>`);
}
