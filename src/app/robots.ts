import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Target all search engines (Google, Bing, etc.)
      allow: '/',     // Allow them to crawl the entire website
      disallow: ['/api/', '/admin/'], // Hide backend/admin routes from Google
    },
    // Point Google directly to your dynamically generated sitemap
    sitemap: 'https://www.thecolourworld.in/sitemap.xml',
  }
}