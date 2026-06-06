import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profil/', '/keranjang/', '/api/'],
    },
    sitemap: 'https://lokalmart.com/sitemap.xml',
  }
}
