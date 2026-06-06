// src/lib/ai-engine.ts
// Service utama untuk integrasi Claude AI
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================
// 1. getPersonalizedProducts — Rekomendasi produk per user
// ============================================================
export async function getPersonalizedProducts(
  userId: string,
  behaviorHistory: { productId: string; actionType: string; timestamp: Date }[],
  availableProducts: { id: string; name: string; price: number; categoryId: string | null; description: string }[]
): Promise<{ productIds: string[]; reasoning: string }> {
  try {
    // Jika tidak ada behavior history, return empty
    if (behaviorHistory.length === 0) {
      return { productIds: [], reasoning: 'Belum ada riwayat aktivitas user.' };
    }

    // Batasi data yang dikirim ke Claude (cost efficiency)
    const recentBehavior = behaviorHistory.slice(0, 50);
    const productSample = availableProducts.slice(0, 100);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Kamu adalah AI recommendation engine untuk marketplace e-commerce Indonesia bernama "Belio".

Berdasarkan riwayat aktivitas user berikut, urutkan produk yang paling relevan untuk ditampilkan di homepage mereka.

## Riwayat Aktivitas User (${userId}):
${JSON.stringify(recentBehavior.map(b => ({
  product: b.productId,
  action: b.actionType,
  time: b.timestamp
})), null, 2)}

## Produk yang Tersedia:
${JSON.stringify(productSample.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  category: p.categoryId
})), null, 2)}

## Instruksi:
1. Analisis pola perilaku user (apa yang sering dilihat, diklik, dibeli)
2. Urutkan product IDs berdasarkan relevansi tertinggi
3. Return HANYA JSON valid, tanpa markdown atau penjelasan

## Format Output (JSON):
{
  "productIds": ["id1", "id2", "id3", ...],
  "reasoning": "Penjelasan singkat mengapa urutan ini dipilih"
}`
        }
      ],
    });

    // Parse response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Extract JSON dari response (handle jika ada markdown wrapper)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        productIds: parsed.productIds || [],
        reasoning: parsed.reasoning || 'AI recommendation',
      };
    }

    return { productIds: [], reasoning: 'Gagal parse AI response' };
  } catch (error) {
    console.error('[AI Engine] getPersonalizedProducts error:', error);
    return { productIds: [], reasoning: 'AI service sedang tidak tersedia' };
  }
}

// ============================================================
// 2. rankProductsForHomepage — Ranking produk dengan scoring
// ============================================================
export async function rankProductsForHomepage(
  products: { id: string; name: string; price: number; categoryId: string | null }[],
  metrics: { productId: string; views: number; clicks: number; purchases: number; avgRating: number; conversionRate: number }[]
): Promise<{ rankings: { productId: string; score: number; reason: string }[] }> {
  try {
    if (products.length === 0) {
      return { rankings: [] };
    }

    // Gabungkan produk dengan metrics-nya
    const productsWithMetrics = products.map(p => {
      const m = metrics.find(m => m.productId === p.id);
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        views: m?.views || 0,
        clicks: m?.clicks || 0,
        purchases: m?.purchases || 0,
        rating: m?.avgRating || 0,
        conversion: m?.conversionRate || 0,
      };
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      // Extended thinking untuk keputusan ranking yang lebih akurat
      thinking: {
        type: 'enabled',
        budget_tokens: 5000,
      },
      messages: [
        {
          role: 'user',
          content: `Kamu adalah AI ranking engine untuk marketplace e-commerce "Belio". 
Berikan skor ranking (0-100) untuk setiap produk berdasarkan performanya.

## Data Produk + Metrics:
${JSON.stringify(productsWithMetrics.slice(0, 50), null, 2)}

## Kriteria Ranking:
- Views (popularitas) → bobot 15%
- Clicks (ketertarikan) → bobot 20%
- Purchases (konversi) → bobot 30%
- Rating (kualitas) → bobot 25%
- Conversion Rate (efisiensi) → bobot 10%

## Instruksi:
Hitung skor 0-100 untuk setiap produk. Return HANYA JSON valid.

## Format Output (JSON):
{
  "rankings": [
    {"productId": "xxx", "score": 85, "reason": "High purchases + good rating"},
    ...
  ]
}`
        }
      ],
    });

    // Extract text content (skip thinking blocks)
    const textBlock = response.content.find(b => b.type === 'text');
    const text = textBlock?.type === 'text' ? textBlock.text : '';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { rankings: parsed.rankings || [] };
    }

    return { rankings: [] };
  } catch (error) {
    console.error('[AI Engine] rankProductsForHomepage error:', error);
    // Fallback: ranking sederhana berdasarkan formula manual
    const fallbackRankings = products.map(p => {
      const m = metrics.find(m => m.productId === p.id);
      const score = m
        ? Math.min(100, Math.round(
            (m.views * 0.15 / 5) +
            (m.clicks * 0.20) +
            (m.purchases * 0.30 * 2) +
            (m.avgRating * 0.25 * 20) +
            (m.conversionRate * 0.10 * 100)
          ))
        : 0;
      return { productId: p.id, score, reason: 'Fallback scoring (AI unavailable)' };
    });

    return { rankings: fallbackRankings.sort((a, b) => b.score - a.score) };
  }
}

// ============================================================
// 3. generateEventBanner — Copywriting AI untuk banner event
// ============================================================
export async function generateEventBanner(
  eventConfig: {
    name: string;
    type: string;
    startTime: Date;
    endTime: Date;
    maxDiscount?: number;
    description?: string;
    productCount?: number;
  }
): Promise<{ title: string; subtitle: string; cta: string }> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Kamu adalah copywriter profesional untuk marketplace e-commerce Indonesia "Belio".
Buat copywriting banner yang menarik untuk event berikut:

## Detail Event:
- Nama: ${eventConfig.name}
- Tipe: ${eventConfig.type}
- Mulai: ${eventConfig.startTime}
- Selesai: ${eventConfig.endTime}
- Diskon Maks: ${eventConfig.maxDiscount || 'bervariasi'}%
- Deskripsi: ${eventConfig.description || '-'}
- Jumlah Produk: ${eventConfig.productCount || 'banyak'}

## Instruksi:
- Bahasa Indonesia yang catchy, singkat, dan persuasif
- Title max 6 kata
- Subtitle max 15 kata
- CTA max 4 kata
- Gunakan emoji jika sesuai
- Return HANYA JSON valid

## Format Output:
{
  "title": "...",
  "subtitle": "...",
  "cta": "..."
}`
        }
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || eventConfig.name,
        subtitle: parsed.subtitle || `Diskon hingga ${eventConfig.maxDiscount}%!`,
        cta: parsed.cta || 'Belanja Sekarang',
      };
    }

    // Fallback jika parsing gagal
    return {
      title: eventConfig.name,
      subtitle: `Diskon hingga ${eventConfig.maxDiscount || 50}%! Jangan sampai kehabisan.`,
      cta: 'Belanja Sekarang',
    };
  } catch (error) {
    console.error('[AI Engine] generateEventBanner error:', error);
    return {
      title: eventConfig.name,
      subtitle: `Promo spesial sedang berlangsung!`,
      cta: 'Lihat Promo',
    };
  }
}
