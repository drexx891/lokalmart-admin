// src/types/database.ts
// Type definitions untuk tabel-tabel baru di database

export interface ProductMetricsRow {
  id: string;
  productId: string;
  views: number;
  clicks: number;
  purchases: number;
  conversionRate: number;
  avgRating: number;
  totalRevenue: number;
  lastUpdated: Date;
}

export interface EventRow {
  id: string;
  name: string;
  type: 'flash_sale' | 'campaign' | 'seasonal' | 'clearance';
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  configJson: EventConfig | null;
  aiTitle: string | null;
  aiSubtitle: string | null;
  aiCta: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventConfig {
  bannerUrl?: string;
  colorTheme?: string;
  colorFrom?: string;
  colorTo?: string;
  maxDiscount?: number;
  terms?: string;
  targetCategories?: string[];
  description?: string;
}

export interface EventProductRow {
  id: string;
  eventId: string;
  productId: string;
  discountPercent: number;
  featuredPosition: number;
}

export interface UserBehaviorRow {
  id: string;
  userId: string;
  productId: string | null;
  actionType: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'wishlist' | 'search';
  metadata: Record<string, unknown> | null;
  timestamp: Date;
}

// Payload types untuk API requests
export interface TrackBehaviorPayload {
  productId?: string;
  actionType: UserBehaviorRow['actionType'];
  metadata?: Record<string, unknown>;
}

export interface HomepageProductsResponse {
  products: ProductWithMetrics[];
  events: EventWithProducts[];
  personalizedIds?: string[];
}

export interface ProductWithMetrics {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  status: string;
  categoryId: string | null;
  supplierId: string | null;
  supplier?: { companyName: string } | null;
  category?: { name: string; slug: string } | null;
  metrics?: ProductMetricsRow | null;

  // Fields komputasi untuk ranking
  rankScore?: number;
  rankReason?: string;
}

export interface EventWithProducts extends EventRow {
  products: (EventProductRow & {
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl: string | null;
    };
  })[];
}

// AI Engine types
export interface AIRankingResult {
  productId: string;
  score: number;
  reason: string;
}

export interface AIRecommendationResult {
  productIds: string[];
  reasoning: string;
}

export interface AIBannerContent {
  title: string;
  subtitle: string;
  cta: string;
}
