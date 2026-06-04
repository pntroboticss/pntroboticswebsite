import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pntrobotics.vercel.app'; // Replace with actual domain later

  // Core routes for PNT Robotics
  const routes = [
    '',
    '/careers',
    '/careers/internship',
    '/careers/status',
    '/contact',
    '/products',
    '/services',
    '/about'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
