const slugToKeyword: Record<string, string> = {
  'alat-pertukangan': 'tools,hardware',
  'apparel-&-accessories': 'apparel,clothing',
  'bahan-bangunan': 'construction,materials',
  'buku-&-alat-tulis': 'stationery,books',
  'consumer-electronics': 'electronics,gadgets',
  'fashion-muslim': 'hijab,muslim,fashion',
  'fashion-pria': 'menswear,fashion,men',
  'elektronik-rumah': 'home,appliances',
  'perlengkapan-mandi': 'bathroom,accessories',
  'pertanian-&-perkebunan': 'agriculture,farming',
  'kerajinan-&-handmade': 'handmade,crafts',
  'minuman': 'beverage,drink',
  'sembako-&-bahan-pokok': 'groceries,food',
  'kecantikan-&-skincare': 'skincare,cosmetics',
  'kesehatan-&-obat': 'medicine,health',
  'perawatan-tubuh': 'bodycare,lotion',
  'ibu-&-bayi': 'baby,mother',
  'komputer-&-laptop': 'laptop,computer',
  'fashion-wanita': 'womenswear,fashion,women',
  'sepatu-&-tas': 'shoes,bags',
  'handphone-&-tablet': 'smartphone,tablet',
  'rumah-&-dapur': 'home,kitchen',
  'makanan-&-camilan': 'food,snacks',
  'mainan-&-edukasi-anak': 'toys,kids',
  'olahraga-&-fitness': 'sports,fitness',
  'outdoor-&-camping': 'camping,outdoor',
  'otomotif-&-sparepart': 'automotive,car',
  'hewan-&-perlengkapan': 'pets,animals',
  'souvenir-&-oleh-oleh': 'souvenir,gift',
  'light-industry-&-daily-use': 'industry,daily'
};

function getKeyword(slug: string): string {
  // Try to find an exact match
  if (slugToKeyword[slug]) {
    return slugToKeyword[slug];
  }
  
  // Fallback: remove non-alphanumeric and use the slug words
  return slug.replace(/[^a-zA-Z0-9]/g, ',');
}

const localImages: Record<string, string> = {
  'fashion-pria': '/images/categories/cat_fashion_pria_1780527436189.png',
  'fashion-wanita': '/images/categories/cat_fashion_wanita_1780525898202.png',
  'elektronik-rumah': '/images/categories/cat_elektronik_rumah_1780525915324.png',
  'kecantikan-&-skincare': '/images/categories/cat_kecantikan_skincare_1780525941917.png',
  'makanan-&-camilan': '/images/categories/cat_makanan_camilan_1780525928894.png',
  'sepatu-&-tas': '/images/categories/cat_sepatu_tas_1780527447959.png',
  'komputer-&-laptop': '/images/categories/cat_komputer_laptop_1780527459408.png'
};

export function getCategoryImageUrl(slug: string): string {
  if (localImages[slug]) return localImages[slug];
  
  // Generic beautiful e-commerce placeholder for remaining categories
  return `https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop`;
}

export function getCategoryIconUrl(slug: string): string {
  if (localImages[slug]) return localImages[slug];
  
  return `https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=80&h=80&fit=crop`;
}
