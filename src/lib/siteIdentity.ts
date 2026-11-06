export type SiteKind = 'hub' | 'portfolio';

const identities = {
  hub: {
    kind: 'hub' as const,
    url: 'https://hub.nielstudios.com/',
    title: 'Project Hub — Niel Studios',
    name: 'Project Hub',
    description: 'Browse the Niel Studios project directory: websites, applications, and useful tools. Search by name, category, or tag and explore each live project.',
  },
  portfolio: {
    kind: 'portfolio' as const,
    url: 'https://me.nielstudios.com/',
    title: 'Niel Studios — Between Words & Worlds',
    name: 'Niel Studios',
    description: 'The personal portfolio of Niel Studios. Thoughtful design, development, selected work, and a wider perspective through literature and poetry.',
  },
};

export function resolveSite(url: URL) {
  const hostname = url.hostname.toLowerCase();
  const preview = ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
    || hostname === 'project-hub-ezx.pages.dev' || hostname.endsWith('.project-hub-ezx.pages.dev');
  return identities[hostname === 'me.nielstudios.com' || (preview && url.searchParams.get('site') === 'portfolio') ? 'portfolio' : 'hub'];
}
