import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to sanitize and normalize URLs
function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return url;
  }
}

// Helper to extract domain name cleanly
function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

// Lazy Gemini API initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// API endpoint to analyze link and auto-generate thumbnail, favicon, metadata & AI tags
app.post('/api/analyze-link', async (req, res) => {
  try {
    const { url: rawUrl } = req.body;
    if (!rawUrl || typeof rawUrl !== 'string') {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const targetUrl = normalizeUrl(rawUrl);
    const domain = getDomain(targetUrl);

    // Default screenshot providers
    const wordpressScreenshot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1280&h=800`;
    const microlinkScreenshot = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url`;
    const thumIoScreenshot = `https://image.thum.io/get/width/1200/crop/800/${targetUrl}`;
    const defaultFavicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

    let pageTitle = domain.charAt(0).toUpperCase() + domain.slice(1);
    let pageDescription = `Project live at ${domain}`;
    let ogImage = '';
    let fetchedFavicon = defaultFavicon;

    // Fetch HTML metadata with timeout
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const htmlRes = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      clearTimeout(timeout);

      if (htmlRes.ok) {
        const html = await htmlRes.text();

        // Extract <title>
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          pageTitle = titleMatch[1].trim();
        }

        // Extract og:title if available
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          pageTitle = ogTitleMatch[1].trim();
        }

        // Extract meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        if (descMatch && descMatch[1]) {
          pageDescription = descMatch[1].trim();
        }

        // Extract og:image
        const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (ogImgMatch && ogImgMatch[1]) {
          let rawImg = ogImgMatch[1].trim();
          if (rawImg.startsWith('//')) {
            ogImage = `https:${rawImg}`;
          } else if (rawImg.startsWith('/')) {
            const origin = new URL(targetUrl).origin;
            ogImage = `${origin}${rawImg}`;
          } else if (/^https?:\/\//i.test(rawImg)) {
            ogImage = rawImg;
          }
        }
      }
    } catch (fetchErr) {
      console.log(`Direct HTML fetch for ${targetUrl} timed out or failed, using fallback providers.`);
    }

    // Default categorization based on domain/title/description heuristics
    let suggestedCategory = 'Web App';
    const lowerUrl = targetUrl.toLowerCase();
    const lowerTitle = pageTitle.toLowerCase();
    const lowerDesc = pageDescription.toLowerCase();

    if (lowerUrl.includes('github.com') || lowerUrl.includes('gitlab.com') || lowerTitle.includes('repository') || lowerTitle.includes('open source')) {
      suggestedCategory = 'Open Source';
    } else if (lowerUrl.includes('figma.com') || lowerUrl.includes('dribbble.com') || lowerUrl.includes('behance.net') || lowerTitle.includes('design')) {
      suggestedCategory = 'Design';
    } else if (lowerTitle.includes('portfolio') || lowerDesc.includes('portfolio')) {
      suggestedCategory = 'Portfolio';
    } else if (lowerTitle.includes('tool') || lowerTitle.includes('generator') || lowerTitle.includes('converter') || lowerDesc.includes('utility')) {
      suggestedCategory = 'Tool';
    } else if (lowerUrl.includes('app') || lowerTitle.includes('mobile')) {
      suggestedCategory = 'Mobile';
    }

    let suggestedTags = [domain.replace(/\..*$/, ''), suggestedCategory.toLowerCase()];

    // Optional Gemini AI enhancement
    try {
      const ai = getGeminiClient();
      if (ai) {
        const prompt = `Given a website project:
Title: "${pageTitle}"
URL: "${targetUrl}"
Description: "${pageDescription}"

Extract/suggest:
1. Clean short project title (max 5 words)
2. Concise one-line description (max 15 words)
3. Category (Must be one of: "Web App", "Portfolio", "Tool", "Design", "Mobile", "Open Source", "Other")
4. Array of 2-4 tech or project tags.

Respond ONLY with JSON format:
{"title": "...", "description": "...", "category": "...", "tags": ["tag1", "tag2"]}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedAi = JSON.parse(jsonMatch[0]);
          if (parsedAi.title) pageTitle = parsedAi.title;
          if (parsedAi.description) pageDescription = parsedAi.description;
          if (parsedAi.category) suggestedCategory = parsedAi.category;
          if (Array.isArray(parsedAi.tags) && parsedAi.tags.length > 0) suggestedTags = parsedAi.tags;
        }
      }
    } catch (aiErr) {
      console.log('Gemini AI enrichment skipped or encountered issue:', aiErr);
    }

    // Default primary thumbnail strategy: WordPress mshots or OG image if available
    const primaryThumbnail = wordpressScreenshot;

    res.json({
      url: targetUrl,
      title: pageTitle,
      description: pageDescription,
      thumbnailUrl: primaryThumbnail,
      ogImage: ogImage || null,
      favicon: fetchedFavicon,
      screenshots: {
        wordpress: wordpressScreenshot,
        microlink: microlinkScreenshot,
        thumIo: thumIoScreenshot,
      },
      suggestedCategory,
      suggestedTags,
    });
  } catch (err: any) {
    console.error('Analyze link error:', err);
    res.status(500).json({ error: 'Failed to analyze website link' });
  }
});

// Serve static public assets explicitly with correct headers
app.use(express.static(path.join(process.cwd(), 'public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// API endpoint to return active Open Graph Meta Tag details
app.get('/api/og-metadata', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  res.json({
    siteName: 'Project Hub',
    title: 'Project Hub — Curated Web Project Showcase & Directory',
    description: 'Discover, bookmark, and showcase curated web creations, applications, and tools with automatic live screenshots, category filters, and instant launch redirects.',
    type: 'website',
    url: baseUrl,
    ogImage: `${baseUrl}/og-image.png`,
    twitterCard: 'summary_large_image',
    themeColor: '#f5f5f7',
    platformsSupported: ['LinkedIn', 'Twitter / X', 'Discord', 'WhatsApp', 'Facebook', 'Slack', 'iMessage'],
    status: 'active'
  });
});

async function startServer() {
  const fs = await import('fs');

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Custom middleware to inject absolute OG image URLs for social crawlers in development
    app.use(async (req, res, next) => {
      const userAgent = (req.headers['user-agent'] || '').toLowerCase();
      const isCrawler = /linkedinbot|whatsapp|twitterbot|facebookexternalhit|discordbot|telegrambot|slackbot|applebot/i.test(userAgent);

      if (isCrawler && req.accepts('html') && !req.path.includes('.') && !req.path.startsWith('/api')) {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        const rawIndexPath = path.join(process.cwd(), 'index.html');
        if (fs.existsSync(rawIndexPath)) {
          let html = fs.readFileSync(rawIndexPath, 'utf-8');
          html = await vite.transformIndexHtml(req.originalUrl, html);
          html = html
            .replace(/content="\/og-image\.png"/g, `content="${baseUrl}/og-image.png"`)
            .replace(/content="\/og-image\.svg"/g, `content="${baseUrl}/og-image.png"`)
            .replace(/<head>/i, `<head>\n    <meta property="og:url" content="${baseUrl}${req.originalUrl}" />`);

          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.send(html);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;

      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = html
          .replace(/content="\/og-image\.png"/g, `content="${baseUrl}/og-image.png"`)
          .replace(/content="\/og-image\.svg"/g, `content="${baseUrl}/og-image.png"`)
          .replace(/<head>/i, `<head>\n    <meta property="og:url" content="${baseUrl}${req.originalUrl}" />`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } else {
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
