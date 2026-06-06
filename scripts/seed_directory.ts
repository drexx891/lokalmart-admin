import { prisma } from '../src/lib/prisma';

// Struktur kategori dari screenshot referensi
const directoryStructure = [
    {
        main: "ELEKTRONIK",
        keyword: "electronics,gadget",
        subs: [
            "Konsol Game", "Aksesoris Konsol", "Alat Casting", "Foot Bath & Spa",
            "Mesin Jahit", "Setrika Uap", "Purifier", "Penyedot Debu", "Telepon",
            "Mesin Cuci", "Water Heater", "Pendingin Ruangan", "Pengering Sepatu",
            "TV Aksesoris", "Perangkat Dapur", "Lampu", "Kamera Keamanan",
            "Video Game", "Baterai", "Remot Kontrol", "Walkie Talkie", "Media Player"
        ]
    },
    {
        main: "MAKANAN & MINUMAN",
        keyword: "food,beverage",
        subs: [
            "Makanan Ringan", "Bahan Pokok", "Menu Sarapan", "Minuman",
            "Susu Olahan", "Makanan Beku", "Roti Kue", "Set Hadiah Hampers",
            "Makanan Kaleng", "Makanan Instan"
        ]
    },
    {
        main: "KOMPUTER & AKSESORIS",
        keyword: "computer,laptop",
        subs: [
            "Desktop", "Monitor", "Komponen Laptop", "Penyimpanan Data",
            "Komponen Network", "Software", "Peralatan Kantor", "Printer Scanner",
            "Aksesoris Desktop", "Keyboard Mouse", "Laptop", "Gaming",
            "Audio Computer", "Proyektor"
        ]
    },
    {
        main: "PERAWATAN & KECANTIKAN",
        keyword: "skincare,cosmetics",
        subs: [
            "Perawatan Tubuh", "Perawatan Tangan", "Perawatan Kaki", "Perawatan Kuku",
            "Perawatan Rambut", "Perawatan Pria", "Parfum Wewangian", "Kosmetik Wajah",
            "Kosmetik Mata", "Kosmetik Bibir", "Pembersih Make Up", "Aksesoris Make Up",
            "Alat Perawatan Wajah", "Alat Pelangsing Tubuh", "Alat Penghilang Bulu",
            "Alat Rambut", "Treatment Mata", "Paket Set Kecantikan"
        ]
    },
    {
        main: "HANDPHONE & AKSESORIS",
        keyword: "smartphone,accessories",
        subs: [
            "Kartu Perdana", "Tablet", "Handphone", "Perangkat Wearable",
            "Perangkat VR", "Aksesoris Selfie", "Kartu Memori", "Kabel Charger",
            "Powerbank Baterai", "Casing Skin", "Audio Handphone"
        ]
    },
    {
        main: "PAKAIAN PRIA",
        keyword: "menswear,clothing",
        subs: [
            "Denim Pria", "Hoodie Sweatshirt", "Sweater Cardigan", "Jaket Mantel",
            "Jas Formal", "Celana Panjang Pria", "Celana Pendek Pria", "Atasan Pria",
            "Batik Pria", "Pakaian Dalam Pria", "Pakaian Tidur Pria"
        ]
    },
    {
        main: "PAKAIAN WANITA",
        keyword: "womenswear,fashion",
        subs: [
            "Pakaian Tradisional", "Kostum", "Kain Wanita", "Batik Wanita",
            "Denim Wanita", "Atasan Wanita", "Celana Legging"
        ]
    },
    {
        main: "FASHION MUSLIM",
        keyword: "hijab,muslim",
        subs: [
            "Hijab", "Aksesoris Muslim", "Atasan Muslim Wanita", "Bawahan Muslim Wanita",
            "Dress Muslim", "Mukena", "Sajadah", "Koko Pria"
        ]
    }
];

function generateProductName(subName: string, i: number): string {
    const prefixes = ['Premium', 'Original', 'Classic', 'Modern', 'Super', 'Best Seller'];
    const prefix = prefixes[i % prefixes.length];
    return `${prefix} ${subName} Model ${i+1}`;
}

async function main() {
    console.log("Preparing to seed massive directory products...");

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

    // Match main categories to database categories
    const dbCategories = await prisma.category.findMany();
    if (dbCategories.length === 0) {
        console.error("No categories found in DB!");
        return;
    }

    // Helper to find category ID
    const getCategoryId = (mainName: string) => {
        const match = dbCategories.find(c => c.name.toUpperCase().includes(mainName.split(' ')[0]));
        return match ? match.id : dbCategories[0].id; // Fallback to first
    };

    console.log("Deleting old products to ensure clean slate...");
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.flashSaleItem.deleteMany({});
    await prisma.flashSale.deleteMany({});
    await prisma.product.deleteMany({});

    console.log("Generating products for each sub-category...");
    let productCount = 0;
    
    for (const group of directoryStructure) {
        const catId = getCategoryId(group.main);
        
        for (const sub of group.subs) {
            // Kita buat 2 produk unik untuk masing-masing subkategori agar pencarian tidak kosong
            for (let i = 0; i < 2; i++) {
                const name = generateProductName(sub, i);
                const price = Math.floor(Math.random() * 50) * 10000 + 25000;
                
                await prisma.product.create({
                    data: {
                        name,
                        description: `Produk khusus untuk kebutuhan ${sub}. Berkualitas tinggi dan bergaransi resmi. Kategori utama: ${group.main}.`,
                        price,
                        stock: Math.floor(Math.random() * 50) + 5,
                        minOrder: 1,
                        unit: 'Pcs',
                        imageUrl: `https://loremflickr.com/500/500/${group.keyword}?random=${productCount}`,
                        categoryId: catId,
                        supplierId: supplier.id
                    }
                });
                productCount++;
            }
        }
    }

    console.log(`✅ Successfully seeded ${productCount} diverse products mapped to sub-categories!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
