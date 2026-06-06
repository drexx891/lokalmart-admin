// src/types/index.ts

export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  companyName: string;
  description?: string | null;
  verified: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  minOrder: number;
  unit: string;
  categoryId?: string | null;
  supplierId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithRelations extends Product {
  category?: Category | null;
  supplier?: Supplier | null;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  shippingMethod?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
}

export interface FlashSale {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  bannerUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  discountPrice: number;
  stock: number;
  sold: number;
}

// Re-export database types for convenience
export type {
  ProductMetricsRow,
  EventRow,
  EventConfig,
  EventProductRow,
  UserBehaviorRow,
  TrackBehaviorPayload,
  HomepageProductsResponse,
  ProductWithMetrics,
  EventWithProducts,
  AIRankingResult,
  AIRecommendationResult,
  AIBannerContent,
} from './database';

