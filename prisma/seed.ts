import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    // Bersihkan data lama
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 12);

    // Buat User Pembeli
    const buyer = await prisma.user.create({
        data: {
            name: 'Global Sourcing Corp',
            email: 'buyer@globalsourcing.com',
            password: hashedPassword,
            role: 'user',
        }
    });

    // Buat User Supplier 1
    const supplierUser1 = await prisma.user.create({
        data: {
            name: 'Supplier Admin 1',
            email: 'admin@textilefactory.cn',
            password: hashedPassword, 
            role: 'supplier',
        }
    });

    const supplier1 = await prisma.supplier.create({
        data: {
            companyName: 'Shenzhen Apparel Manufacturing Co., Ltd.',
            description: 'Leading manufacturer of high quality apparel and garments.',
            verified: true,
            userId: supplierUser1.id
        }
    });

    const supplierUser2 = await prisma.user.create({
        data: {
            name: 'Supplier Admin 2',
            email: 'admin@elec-tech.cn',
            password: hashedPassword, 
            role: 'supplier',
        }
    });

    const supplier2 = await prisma.supplier.create({
        data: {
            companyName: 'Guangdong Tech Electronics Ltd.',
            description: 'OEM/ODM provider for consumer electronics and gadgets.',
            verified: true,
            userId: supplierUser2.id
        }
    });

    // Buat Kategori (Berdasarkan Made-in-China)
    const catApparel = await prisma.category.create({
        data: {
            name: 'Apparel & Accessories',
            description: 'Clothing, Garments, Hats, Gloves.',
        }
    });

    const catElectronics = await prisma.category.create({
        data: {
            name: 'Consumer Electronics',
            description: 'Smartphones, Audio, Wearables.',
        }
    });

    const catLightIndustry = await prisma.category.create({
        data: {
            name: 'Light Industry & Daily Use',
            description: 'Daily household items, packaging.',
        }
    });

    // Masukkan data produk grosir / B2B
    await prisma.product.create({
        data: {
            name: 'Wholesale Plain Blank T-Shirt 100% Cotton 180gsm',
            description: 'Custom logo blank t-shirt for printing. High quality combed cotton.',
            price: 25000, // Harga grosir per piece (dalam rupiah)
            stock: 100000,
            minOrder: 500,
            unit: 'Pieces',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
            categoryId: catApparel.id,
            supplierId: supplier1.id
        },
    });

    await prisma.product.create({
        data: {
            name: 'OEM Wireless Earbuds TWS Bluetooth 5.3 Noise Cancelling',
            description: 'Factory direct sale true wireless stereo earphones with ANC.',
            price: 150000,
            stock: 50000,
            minOrder: 1000,
            unit: 'Sets',
            imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
            categoryId: catElectronics.id,
            supplierId: supplier2.id
        },
    });

    await prisma.product.create({
        data: {
            name: 'Eco-Friendly Biodegradable Sugarcane Bagasse Food Container',
            description: 'Takeaway food packaging box. Microwave safe and compostable.',
            price: 800,
            stock: 500000,
            minOrder: 50000,
            unit: 'Pieces',
            imageUrl: 'https://images.unsplash.com/photo-1622384728514-c28892f2ab22?w=500&q=80',
            categoryId: catLightIndustry.id,
            supplierId: supplier1.id
        },
    });

    console.log('✅ Seeding berhasil! Data B2B (Supplier, MOQ, Kategori) telah ditambahkan.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
