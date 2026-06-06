import { prisma } from '../src/lib/prisma';

// Helper function to map category names to loremflickr keywords
function getKeywordForCategory(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('elektronik') || name.includes('komputer') || name.includes('handphone')) return 'electronics,gadget';
    if (name.includes('pakaian') || name.includes('fashion') || name.includes('baju')) return 'clothing,fashion';
    if (name.includes('sepatu')) return 'shoes,sneakers';
    if (name.includes('tas')) return 'bag,backpack';
    if (name.includes('kesehatan') || name.includes('perawatan') || name.includes('kecantikan')) return 'health,skincare';
    if (name.includes('makanan') || name.includes('minuman')) return 'food,beverage';
    if (name.includes('rumah')) return 'furniture,home';
    if (name.includes('otomotif')) return 'car,automotive';
    if (name.includes('anak') || name.includes('bayi')) return 'toys,baby';
    if (name.includes('jam')) return 'watch,clock';
    if (name.includes('hobi')) return 'hobby,collection';
    return 'product,item';
}

// Helper to generate a random product name based on keyword
function generateProductName(keyword: string, index: number): string {
    const prefixes = ['Premium', 'Pro', 'Classic', 'Modern', 'Ultra', 'Smart', 'Luxury', 'Minimalist', 'Vintage', 'Eco-friendly'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const mainWord = keyword.split(',')[0].charAt(0).toUpperCase() + keyword.split(',')[0].slice(1);
    return `${prefix} ${mainWord} Edition V${(index % 9) + 1}`;
}

async function main() {
    console.log("Preparing to seed 48 unique products...");

    // Ensure a supplier exists
    let supplier = await prisma.supplier.findFirst();
    if (!supplier) {
        const user = await prisma.user.create({
            data: {
                name: 'Global Supplier',
                email: 'supplier@example.com',
                password: 'hashedpassword',
                role: 'supplier',
            }
        });
        supplier = await prisma.supplier.create({
            data: {
                companyName: 'PT Global Makmur',
                description: 'Supplier terpercaya',
                userId: user.id
            }
        });
    }

    // Get categories to assign randomly
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        console.error("No categories found! Please seed categories first.");
        return;
    }

    // Delete existing products and related data
    console.log("Deleting old data...");
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.flashSaleItem.deleteMany({});
    await prisma.flashSale.deleteMany({});
    await prisma.product.deleteMany({});

    console.log("Creating 48 new distinct products...");
    for (let i = 1; i <= 48; i++) {
        // Distribute evenly among categories
        const category = categories[i % categories.length];
        const keyword = getKeywordForCategory(category.name);
        const name = generateProductName(keyword, i) + ` - Item #${i}`;
        const price = Math.floor(Math.random() * 50) * 10000 + 50000; // 50k to 550k
        
        await prisma.product.create({
            data: {
                name,
                description: `Ini adalah deskripsi lengkap untuk produk ${name}. Didesain khusus untuk memenuhi kebutuhan Anda. Produk ini masuk dalam kategori ${category.name}.`,
                price,
                stock: Math.floor(Math.random() * 100) + 10,
                minOrder: 1,
                unit: 'Pcs',
                // Use loremflickr for guaranteed diverse images based on category keyword
                imageUrl: `https://loremflickr.com/500/500/${keyword}?random=${i}`,
                categoryId: category.id,
                supplierId: supplier.id
            }
        });
    }

    console.log("✅ Successfully seeded 48 diverse products!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
