// Script: Seed ProductMetrics untuk semua produk yang sudah ada
import { prisma } from '../src/lib/prisma';

async function seedMetrics() {
  console.log('🌱 Seeding ProductMetrics untuk produk yang sudah ada...\n');

  try {
    // Ambil semua produk yang belum punya metrics
    const products = await prisma.product.findMany({
      where: {
        metrics: null
      },
      select: { id: true, name: true, price: true }
    });

    console.log(`📦 Ditemukan ${products.length} produk tanpa metrics\n`);

    for (const product of products) {
      const views = Math.floor(Math.random() * 500) + 10;
      const clicks = Math.floor(Math.random() * views * 0.3) + 5;
      const purchases = Math.floor(Math.random() * clicks * 0.4);
      const conversionRate = clicks > 0 ? Number((purchases / clicks).toFixed(4)) : 0;
      const avgRating = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
      const totalRevenue = purchases * product.price;

      await prisma.productMetrics.create({
        data: {
          productId: product.id,
          views,
          clicks,
          purchases,
          conversionRate,
          avgRating,
          totalRevenue,
        }
      });

      console.log(`  ✅ ${product.name.substring(0, 50)} — views:${views} clicks:${clicks} purchases:${purchases} rating:${avgRating}`);
    }

    // Juga seed sample Event
    const existingEvents = await prisma.event.count();
    if (existingEvents === 0) {
      console.log('\n🎪 Membuat sample events...\n');

      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Flash Sale event
      const flashSaleEvent = await prisma.event.create({
        data: {
          name: 'Flash Sale Pertengahan Bulan',
          type: 'flash_sale',
          startTime: now,
          endTime: tomorrow,
          isActive: true,
          configJson: {
            bannerUrl: null,
            colorTheme: '#E24B4A',
            colorFrom: '#E24B4A',
            colorTo: '#FF6B6B',
            maxDiscount: 70,
            description: 'Diskon gila-gilaan! Cuma hari ini!'
          },
        }
      });

      // Campaign event
      const campaignEvent = await prisma.event.create({
        data: {
          name: 'Promo Supplier Baru',
          type: 'campaign',
          startTime: now,
          endTime: nextWeek,
          isActive: true,
          configJson: {
            bannerUrl: null,
            colorTheme: '#1A3C6E',
            colorFrom: '#1A3C6E',
            colorTo: '#2A5FA0',
            description: 'Selamat datang supplier baru! Diskon spesial untuk stok perdana.'
          },
        }
      });

      // Add some products to events
      const sampleProducts = await prisma.product.findMany({ take: 10 });
      
      for (let i = 0; i < Math.min(5, sampleProducts.length); i++) {
        await prisma.eventProduct.create({
          data: {
            eventId: flashSaleEvent.id,
            productId: sampleProducts[i].id,
            discountPercent: Math.floor(Math.random() * 40) + 20, // 20-60%
            featuredPosition: i + 1
          }
        });
      }

      for (let i = 5; i < Math.min(10, sampleProducts.length); i++) {
        await prisma.eventProduct.create({
          data: {
            eventId: campaignEvent.id,
            productId: sampleProducts[i].id,
            discountPercent: Math.floor(Math.random() * 20) + 10, // 10-30%
            featuredPosition: i - 4
          }
        });
      }

      console.log(`  ✅ Event: ${flashSaleEvent.name} — ${Math.min(5, sampleProducts.length)} produk`);
      console.log(`  ✅ Event: ${campaignEvent.name} — ${Math.min(5, sampleProducts.length)} produk`);
    }

    // Summary
    const totalMetrics = await prisma.productMetrics.count();
    const totalEvents = await prisma.event.count();
    const totalEP = await prisma.eventProduct.count();

    console.log('\n========================================');
    console.log('📊 SUMMARY SEEDING:');
    console.log(`   ProductMetrics: ${totalMetrics} records`);
    console.log(`   Events: ${totalEvents} records`);
    console.log(`   EventProducts: ${totalEP} records`);
    console.log('========================================');
    console.log('\n🎉 Seeding selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMetrics();
