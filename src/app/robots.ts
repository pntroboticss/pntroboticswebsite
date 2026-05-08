import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*'],
    },
    sitemap: 'https://pntrobotics.vercel.app/sitemap.xml',
  };
}
