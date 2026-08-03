export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  video?: string;
  sizes: string[];
  notes: { top: string[]; middle: string[]; base: string[] };
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "1", name: "Noir Cristal", slug: "noir-cristal", brand: "Noir Cristal",
    description: "A mesmerizing dark crystal fragrance that captures the mystique of a moonlit Parisian garden. Deep purple roses intertwine with smoky incense and rare oud.",
    price: 14500, comparePrice: 17000,
    images: ["/images/products/noir-cristal.png", "/images/products/noir-cristal-2.png"],
    video: "/images/products/hero-perfume.mp4",
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Black Violet", "Dark Berry", "Pink Pepper"], middle: ["Black Rose", "Incense", "Oud Wood"], base: ["Dark Amber", "Smoky Cedar", "Cashmere Musk"] },
    category: "oriental", rating: 4.9, reviewCount: 312, stock: 42, isActive: true, featured: true,
    createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "2", name: "Jour Éclat", slug: "jour-eclat", brand: "Solstice Botanica",
    description: "Bottled Mediterranean sunlight. Radiant citrus-floral opens with sparkling bergamot and warm saffron, blooming into golden amber and wild herbs.",
    price: 11800, comparePrice: 13500,
    images: ["/images/products/jour-eclat.png", "/images/products/jour-eclat-2.png"],
    video: "/images/products/collection-showcase.mp4",
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Bergamot", "Saffron", "Lavender"], middle: ["Amber", "Rose Absolute", "Herbes de Provence"], base: ["Sandalwood", "Honey", "Warm Musk"] },
    category: "citrus", rating: 4.7, reviewCount: 278, stock: 56, isActive: true, featured: true,
    createdAt: "2026-02-10T00:00:00Z", updatedAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "3", name: "Nocturne Jardin", slug: "nocturne-jardin", brand: "Aurora Botanica",
    description: "An enchanting journey through a secret night garden under silver moonlight. Midnight blooms of rare orchid and dark iris dance with ancient stone and moss.",
    price: 16200, comparePrice: null,
    images: ["/images/products/nocturne-jardin.png", "/images/products/nocturne-jardin-2.png"],
    video: "/images/products/product-detail.mp4",
    sizes: ["50ml", "100ml"],
    notes: { top: ["Blue Lotus", "Juniper", "Silver Birch"], middle: ["Dark Iris", "Night Orchid", "Violet Leaf"], base: ["Ancient Oakmoss", "Grey Amber", "Velvet Musk"] },
    category: "woody", rating: 4.8, reviewCount: 189, stock: 31, isActive: true, featured: true,
    createdAt: "2026-03-05T00:00:00Z", updatedAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "4", name: "Lumière Solaire", slug: "lumiere-solaire", brand: "Lumière d'Or",
    description: "A golden symphony of Mediterranean warmth. Iridescent crystals capture midsummer — warm olive groves, golden mimosa, and creamy white roses.",
    price: 13500, comparePrice: 15800,
    images: ["/images/products/lumiere-solaire.png", "/images/products/lumiere-solaire-2.png"],
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Mandarin", "Pink Grapefruit", "Honeyed Fig"], middle: ["Golden Mimosa", "White Rose", "Neroli"], base: ["Creamy Sandalwood", "Liquid Amber", "Blonde Woods"] },
    category: "floral", rating: 4.9, reviewCount: 423, stock: 48, isActive: true, featured: true,
    createdAt: "2026-01-20T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "5", name: "Noir Profond", slug: "noir-profond", brand: "Noir Absolu",
    description: "The ultimate expression of dark sophistication. Matte black leather, aged cognac, and rare tobacconist leaves create an olfactory masterpiece.",
    price: 18500, comparePrice: null,
    images: ["/images/products/noir-profond.png", "/images/products/velvet-orchid.png"],
    sizes: ["50ml", "100ml"],
    notes: { top: ["Cognac", "Black Cardamom", "Bitter Orange"], middle: ["Aged Leather", "Tobacco Leaf", "Dark Chocolate"], base: ["Smoky Vetiver", "Oud", "Labdanum"] },
    category: "oriental", rating: 4.9, reviewCount: 156, stock: 22, isActive: true, featured: true,
    createdAt: "2026-02-28T00:00:00Z", updatedAt: "2026-02-28T00:00:00Z",
  },
  {
    id: "6", name: "Éclat d'Or", slug: "eclat-dor", brand: "Maison Luxe",
    description: "Liquid gold distilled into crystal. Warm vanilla, rich amber, and gold-threaded silk create pure indulgence and golden luxury.",
    price: 15800, comparePrice: 18200,
    images: ["/images/products/eclat-dor.png", "/images/products/citrus-nomade.png"],
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Cardamom", "Cinnamon Bark", "Pink Pepper"], middle: ["Vanilla Absolute", "Golden Amber", "Orris Butter"], base: ["Benzoin", "Tonka Bean", "Mysore Sandalwood"] },
    category: "oriental", rating: 4.8, reviewCount: 345, stock: 39, isActive: true, featured: true,
    createdAt: "2026-03-12T00:00:00Z", updatedAt: "2026-03-12T00:00:00Z",
  },
  {
    id: "7", name: "Soleil d'Argent", slug: "soleil-dargent", brand: "Soleil d'Argent",
    description: "Fresh as a cool ocean breeze at sunrise. Sea minerals with delicate florals — invigorating and serene like silver light on waves.",
    price: 8500, comparePrice: 9900,
    images: ["/images/products/soleil-dargent.png", "/images/products/soleil-dargent-2.png"],
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Sea Salt", "Cucumber", "Green Apple"], middle: ["Marine Accord", "Water Lily", "Blue Lotus"], base: ["Driftwood", "Ambergris", "White Musk"] },
    category: "aquatic", rating: 4.6, reviewCount: 267, stock: 63, isActive: true, featured: false,
    createdAt: "2026-01-25T00:00:00Z", updatedAt: "2026-01-25T00:00:00Z",
  },
  {
    id: "8", name: "Nuit Parisienne", slug: "nuit-parisienne", brand: "Nuit Parisienne",
    description: "The essence of a glamorous Parisian evening. Sparkling champagne meets powdery iris and rare violet for an unforgettable nocturnal fragrance.",
    price: 13800, comparePrice: null,
    images: ["/images/products/nuit-parisienne.png", "/images/products/nuit-parisienne-2.png"],
    sizes: ["50ml", "100ml"],
    notes: { top: ["Champagne Accord", "Grapefruit", "Pink Pepper"], middle: ["Iris Pallida", "Violet Leaf", "Jasmine Sambac"], base: ["Powdery Musk", "Atlas Cedar", "Ambrette"] },
    category: "floral", rating: 4.7, reviewCount: 143, stock: 44, isActive: true, featured: false,
    createdAt: "2026-02-14T00:00:00Z", updatedAt: "2026-02-14T00:00:00Z",
  },
  {
    id: "9", name: "Velvet Dusk", slug: "velvet-dusk", brand: "Maison Luxe",
    description: "As the sun sets, velvet dusk unfolds. A warm embrace of saffron, cardamom, and smoky vetiver that lingers like the last rays of golden hour.",
    price: 12800, comparePrice: 14500,
    images: ["/images/products/velvet-orchid.png", "/images/products/velvet-orchid-2.png"],
    video: "/images/products/hero-perfume.mp4",
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Saffron", "Cardamom", "Bergamot"], middle: ["Smoky Vetiver", "Amber", "Orris"], base: ["Sandalwood", "Musk", "Cedarwood"] },
    category: "oriental", rating: 4.8, reviewCount: 198, stock: 35, isActive: true, featured: true,
    createdAt: "2026-03-20T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "10", name: "Citrus Royale", slug: "citrus-royale", brand: "Solstice Botanica",
    description: "A regal burst of citrus nobility. Blood orange, neroli, and white cedar create a fragrance that commands attention with effortless elegance.",
    price: 9800, comparePrice: 11200,
    images: ["/images/products/citrus-nomade.png", "/images/products/citrus-nomade-2.png"],
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Blood Orange", "Neroli", "Lemon Zest"], middle: ["White Cedar", "Jasmine", "Geranium"], base: ["Vetiver", "Amber", "White Musk"] },
    category: "citrus", rating: 4.6, reviewCount: 234, stock: 52, isActive: true, featured: true,
    createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "11", name: "Midnight Oud", slug: "midnight-oud", brand: "Noir Absolu",
    description: "The darkness incarnate. Rare Laotian oud, black amber, and midnight jasmine create an intoxicating aura of mystery and power.",
    price: 22500, comparePrice: null,
    images: ["/images/products/noir-cristal-2.png", "/images/products/noir-profond.png"],
    video: "/images/products/collection-showcase.mp4",
    sizes: ["50ml", "100ml"],
    notes: { top: ["Black Pepper", "Cinnamon", "Saffron"], middle: ["Laotian Oud", "Midnight Jasmine", "Rose Absolute"], base: ["Black Amber", "Labdanum", "Agarwood"] },
    category: "oriental", rating: 4.9, reviewCount: 87, stock: 15, isActive: true, featured: true,
    createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "12", name: "Azure Coast", slug: "azure-coast", brand: "Aurora Botanica",
    description: "The Mediterranean in a bottle. Sea salt, driftwood, and sun-warmed fig leaf evoke endless summer days along the Italian riviera.",
    price: 10500, comparePrice: 12000,
    images: ["/images/products/soleil-dargent.png", "/images/products/soleil-dargent-2.png"],
    sizes: ["30ml", "50ml", "100ml"],
    notes: { top: ["Sea Salt", "Fig Leaf", "Lemon"], middle: ["Driftwood", "Marine Accord", "Water Lily"], base: ["Ambergris", "Cedarwood", "White Musk"] },
    category: "aquatic", rating: 4.7, reviewCount: 312, stock: 48, isActive: true, featured: false,
    createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-04-15T00:00:00Z",
  },
];

export const mockReviews = [
  { id: "1", userId: "2", productId: "1", rating: 5, comment: "Absolutely stunning fragrance. The dark rose and oud combination is magnificent. Lasts all day and the sillage is incredible.", createdAt: "2026-03-15T00:00:00Z", user: { name: "Arjun Mehta", email: "arjun@example.com" }, helpful: 24, verified: true },
  { id: "2", userId: "3", productId: "1", rating: 5, comment: "Gets compliments every time I wear it. Worth every penny. The smoky cedar dry down is heavenly.", createdAt: "2026-03-20T00:00:00Z", user: { name: "Priya Sharma", email: "priya@example.com" }, helpful: 18, verified: true },
  { id: "3", userId: "2", productId: "1", rating: 4, comment: "Beautiful dark floral. I only wish the bottle was bigger for the price.", createdAt: "2026-04-02T00:00:00Z", user: { name: "Vikram Singh", email: "vikram@example.com" }, helpful: 12, verified: true },
  { id: "4", userId: "2", productId: "4", rating: 5, comment: "Pure sunshine in a bottle. My signature summer scent. The mimosa note is dreamy.", createdAt: "2026-04-01T00:00:00Z", user: { name: "Ananya Reddy", email: "ananya@example.com" }, helpful: 31, verified: true },
  { id: "5", userId: "3", productId: "4", rating: 4, comment: "Light, elegant, and perfect for daytime. Gets noticed.", createdAt: "2026-04-08T00:00:00Z", user: { name: "Rohit Kumar", email: "rohit@example.com" }, helpful: 9, verified: true },
  { id: "6", userId: "3", productId: "5", rating: 5, comment: "Incredibly sophisticated. The leather note is sublime. This is a grown-up fragrance.", createdAt: "2026-04-05T00:00:00Z", user: { name: "Neha Patel", email: "neha@example.com" }, helpful: 27, verified: true },
  { id: "7", userId: "2", productId: "5", rating: 5, comment: "The tobacco and cognac combination is intoxicating. My new signature.", createdAt: "2026-04-12T00:00:00Z", user: { name: "Sameer Joshi", email: "sameer@example.com" }, helpful: 15, verified: true },
  { id: "8", userId: "2", productId: "6", rating: 4, comment: "Beautiful warm vanilla with amber. Long lasting and elegant. Perfect for date nights.", createdAt: "2026-04-10T00:00:00Z", user: { name: "Kavita Desai", email: "kavita@example.com" }, helpful: 20, verified: true },
  { id: "9", userId: "3", productId: "2", rating: 5, comment: "Fresh and uplifting. The bergamot opening is incredible. Perfect for morning wear.", createdAt: "2026-04-15T00:00:00Z", user: { name: "Aditya Nair", email: "aditya@example.com" }, helpful: 14, verified: true },
  { id: "10", userId: "2", productId: "3", rating: 5, comment: "Like walking through a moonlit garden. The iris and orchid notes are magical.", createdAt: "2026-04-18T00:00:00Z", user: { name: "Meera Gupta", email: "meera@example.com" }, helpful: 22, verified: true },
];

export const mockUser = {
  id: "1", email: "admin@luxeperfume.com", name: "Admin User", role: "ADMIN" as const,
  phone: "+91 98765 43210", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
};

export const mockDashboardStats = {
  totalRevenue: 2847500,
  totalOrders: 156,
  totalUsers: 89,
  totalProducts: 8,
  recentOrders: [
    { id: "ORD-001", userId: "2", total: 28000, status: "DELIVERED", createdAt: "2026-07-28T00:00:00Z" },
    { id: "ORD-002", userId: "3", total: 16200, status: "SHIPPED", createdAt: "2026-07-29T00:00:00Z" },
    { id: "ORD-003", userId: "2", total: 13500, status: "PROCESSING", createdAt: "2026-07-30T00:00:00Z" },
    { id: "ORD-004", userId: "3", total: 44500, status: "DELIVERED", createdAt: "2026-07-31T00:00:00Z" },
    { id: "ORD-005", userId: "2", total: 8500, status: "PENDING", createdAt: "2026-08-01T00:00:00Z" },
  ],
  monthlyRevenue: [
    { month: "Feb", revenue: 345000 }, { month: "Mar", revenue: 423000 },
    { month: "Apr", revenue: 512000 }, { month: "May", revenue: 389000 },
    { month: "Jun", revenue: 623000 }, { month: "Jul", revenue: 555500 },
  ],
};

export function getMockProducts(params: { search?: string; category?: string; featured?: boolean; sort?: string; limit?: number; page?: number; priceMin?: number; priceMax?: number } = {}) {
  let filtered = [...mockProducts];
  if (params.search) { const q = params.search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)); }
  if (params.category) {
    const cats = params.category.toLowerCase().split(',').map(c => c.trim());
    filtered = filtered.filter(p => cats.some(c => p.category.toLowerCase().includes(c)));
  }
  if (params.featured) filtered = filtered.filter(p => p.featured);
  if (params.priceMin && params.priceMin > 0) filtered = filtered.filter(p => p.price >= params.priceMin!);
  if (params.priceMax && params.priceMax < 999999) filtered = filtered.filter(p => p.price <= params.priceMax!);
  if (params.sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (params.sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (params.sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = filtered.length; const page = params.page || 1; const limit = params.limit || 12;
  const start = (page - 1) * limit;
  return { items: filtered.slice(start, start + limit), total, page, pageSize: limit, totalPages: Math.ceil(total / limit) };
}

export function getMockProductById(id: string) { return mockProducts.find(p => p.id === id) || null; }
export function getMockReviews(productId?: string) { return productId ? mockReviews.filter(r => r.productId === productId) : mockReviews; }

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "admin-1", name: "Admin User", email: "admin@luxeperfume.com",
    password: "$2a$12$ONlwjZxZEKB3yCbviB79wO3JOFcwqR/EQJNBJFSJYWKgLTRksG93i",
    role: "ADMIN", phone: null, avatar: null, createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "customer-1", name: "Test Customer", email: "customer@test.com",
    password: "$2a$12$BimiEC3mIJfuqg67M1YXmuycMKR/FBBkFzHD0ZXME9ydLUbKj5.0S",
    role: "CUSTOMER", phone: null, avatar: null, createdAt: "2026-02-01T00:00:00Z",
  },
];

const inMemoryUsers: MockUser[] = [...mockUsers];

export function findMockUserByEmail(email: string): MockUser | undefined {
  return inMemoryUsers.find(u => u.email === email);
}

export function createMockUser(user: MockUser): MockUser {
  inMemoryUsers.push(user);
  return user;
}
