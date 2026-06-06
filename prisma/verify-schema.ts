// Script verifikasi tabel baru
import { prisma } from '../src/lib/prisma';

async function verify() {
  console.log('🔍 Verifikasi tabel baru di database...\n');

  try {
    // 1. ProductMetrics
    const metricsCount = await prisma.productMetrics.count();
    console.log(`✅ ProductMetrics — ${metricsCount} records`);

    // 2. Event
    const eventCount = await prisma.event.count();
    console.log(`✅ Event — ${eventCount} records`);

    // 3. EventProduct
    const epCount = await prisma.eventProduct.count();
    console.log(`✅ EventProduct — ${epCount} records`);

    // 4. UserBehavior
    const behaviorCount = await prisma.userBehavior.count();
    console.log(`✅ UserBehavior — ${behaviorCount} records`);

    // 5. Verify new Product fields
    const productWithStatus = await prisma.product.findFirst({
      select: { id: true, name: true, status: true }
    });
    console.log(`✅ Product.status field — sample: ${JSON.stringify(productWithStatus)}`);

    // 6. Verify new Supplier fields
    const supplierWithRating = await prisma.supplier.findFirst({
      select: { id: true, companyName: true, rating: true, totalSales: true }
    });
    console.log(`✅ Supplier.rating/totalSales fields — sample: ${JSON.stringify(supplierWithRating)}`);

    // 7. Count existing products (for seeding metrics)
    const productCount = await prisma.product.count();
    console.log(`\n📦 Total Products: ${productCount}`);
    console.log(`📊 Products with Metrics: ${metricsCount}`);
    
    if (productCount > 0 && metricsCount === 0) {
      console.log('\n⚠️  Produk ada tapi belum ada metrics. Jalankan SQL seed di Supabase Dashboard.');
    }

    console.log('\n🎉 FASE 1 Database Schema — SELESAI!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
