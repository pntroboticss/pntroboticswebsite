import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pntacademy.com';

  // Major routes defining the core of PNT Academy
  const routes = [
    '',
    '/championship',
    '/championship/individual',
    '/contact',
    '/courses/offline-bootcamps',
    '/courses/online',
    '/curriculum/cbse-icse-ib',
    '/curriculum/nep-aligned',
    '/kit',
    '/payments',
    '/programs/army-navy-internship',
    '/programs/colleges',
    '/programs/courses-for-kids',
    '/programs/schools',
    '/programs/summer-camp',
    '/schools/composite-skill-lab',
    '/schools/robotics-lab',
    '/workshop',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
