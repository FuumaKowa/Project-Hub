import { resolveSite } from '../src/lib/siteIdentity';
import { rewriteSiteMetadata } from '../src/lib/siteMetadata';

export async function onRequest(context) {
  const response = await context.next();
  if (response.status !== 200 || !response.headers.get('content-type')?.includes('text/html')) return response;
  const site = resolveSite(new URL(context.request.url));
  const headers = new Headers(response.headers);
  // The body is personalized by hostname; do not retain validators for the unmodified asset.
  headers.delete('content-length');
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'no-cache');
  return new Response(rewriteSiteMetadata(await response.text(), site), { status: response.status, headers });
}
