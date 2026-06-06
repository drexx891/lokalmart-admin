import { prisma } from '../src/lib/prisma';

async function main() {
    console.log("Deleting old categories...");
    await prisma.category.deleteMany({});

    const categories = [
        { name: "Elektronik", imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop" },
        { name: "Komputer & Aksesoris", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" },
        { name: "Handphone & Aksesoris", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" },
        { name: "Pakaian Pria", imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop" },
        { name: "Sepatu Pria", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop" },
        { name: "Tas Pria", imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=200&fit=crop" },
        { name: "Aksesoris Fashion", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
        { name: "Jam Tangan", imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop" },
        { name: "Kesehatan", imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop" },
        { name: "Hobi & Koleksi", imageUrl: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=200&h=200&fit=crop" },
        { name: "Makanan & Minuman", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop" },
        { name: "Perawatan & Kecantikan", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop" },
        { name: "Perlengkapan Rumah", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop" },
        { name: "Pakaian Wanita", imageUrl: "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=200&h=200&fit=crop" },
        { name: "Fashion Muslim", imageUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=200&h=200&fit=crop" },
        { name: "Fashion Bayi & Anak", imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop" },
        { name: "Ibu & Bayi", imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=200&h=200&fit=crop" },
        { name: "Sepatu Wanita", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop" },
        { name: "Tas Wanita", imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=200&h=200&fit=crop" },
        { name: "Otomotif", imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop" }
    ];

    console.log("Seeding new categories...");
    for (const c of categories) {
        await prisma.category.create({
            data: {
                name: c.name,
                imageUrl: c.imageUrl
            }
        });
        console.log(`Created: ${c.name}`);
    }
    console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
