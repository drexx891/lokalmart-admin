import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lokalmart.com'

  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true }
  })
  const categories = await prisma.category.findMany({
    select: { id: true, updatedAt: true }
  })
  const suppliers = await prisma.supplier.findMany({
    select: { id: true, updatedAt: true }
  })

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produk/${product.id}`,
    lastModified: product.updatedAt,
  }))

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.id}`,
    lastModified: category.updatedAt,
  }))

  const supplierUrls = suppliers.map((supplier) => ({
    url: `${baseUrl}/supplier/${supplier.id}`,
    lastModified: supplier.updatedAt,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...productUrls,
    ...categoryUrls,
    ...supplierUrls,
  ]
}
