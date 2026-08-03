export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  video?: string;
  category: string;
  sizes: string[];
  notes: FragranceNotes;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
  avatar?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: Record<string, unknown>;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  size: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: Date;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  products?: Product[];
  product?: Product;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Order[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface FragranceRecommendation {
  product: Product;
  score: number;
  reason: string;
}
