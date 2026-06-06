import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });
import { prisma } from '../src/lib/prisma';
import { getCategoryImageUrl, getCategoryIconUrl } from '../src/lib/categoryImages';

async function main() {
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const slug = cat.slug && cat.slug.trim().length > 0 ? cat.slug : cat.name.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.update({
      where: { id: cat.id },
      data: {
        imageUrl: getCategoryImageUrl(slug),
        icon: getCategoryIconUrl(slug),
      },
    });
    console.log(`✅ Updated category: ${cat.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
