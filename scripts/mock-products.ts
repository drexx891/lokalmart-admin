import { prisma } from '../src/lib/prisma';

async function main() {
  const supplier = await prisma.supplier.findFirst();
  const category = await prisma.category.findFirst();

  if (!supplier || !category) {
    console.error("Supplier or Category not found!");
    process.exit(1);
  }

  const mockProducts = [];
  for (let i = 1; i <= 50; i++) {
    mockProducts.push({
      name: `Produk Grosir Kualitas Premium ${i}`,
      description: `Deskripsi lengkap untuk produk grosir kualitas premium edisi ke-${i}. Barang dijamin bagus dan siap kirim.`,
      price: Math.floor(Math.random() * 100000) + 15000,
      stock: Math.floor(Math.random() * 1000) + 50,
      minOrder: Math.floor(Math.random() * 50) + 5,
      unit: i % 2 === 0 ? 'Pieces' : 'Sets',
      imageUrl: `https://loremflickr.com/500/500/product?random=${i}`,
      categoryId: category.id,
      supplierId: supplier.id,
    });
  }

  console.log("Menambahkan 50 produk dummy...");
  await prisma.product.createMany({
    data: mockProducts
  });

  console.log("Berhasil menambahkan 50 produk mock!");
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
