import { prisma } from '../src/lib/prisma';
import { getCategoryImageUrl, getCategoryIconUrl } from '../src/lib/categoryImages';

async function main() {
  const categoryNames = [
    'Pakaian Pria', 'Pakaian Wanita', 'Sepatu & Sandal', 'Tas & Dompet',
    'Jam Tangan', 'Aksesoris Fashion', 'Ibu & Bayi', 'Kesehatan',
    'Kecantikan', 'Perawatan Tubuh', 'Handphone & Tablet', 'Komputer & Laptop',
    'Kamera', 'Elektronik Rumah', 'Hobi & Koleksi', 'Olahraga & Outdoor',
    'Makanan & Minuman', 'Otomotif', 'Perlengkapan Rumah'
  ];

  console.log("Menambahkan 19 kategori dummy...");

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if category exists
    const existing = await prisma.category.findUnique({ where: { name } });
    if (!existing) {
      await prisma.category.create({
        data: {
          name,
          slug,
          description: `Kategori ${name}`,
          imageUrl: getCategoryImageUrl(slug),
          icon: getCategoryIconUrl(slug),
        }
      });
    }
  }

  console.log("Berhasil menambahkan kategori populer!");
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
