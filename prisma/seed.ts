import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Admin User ──
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@luxeperfume.com" },
    update: {},
    create: {
      email: "admin@luxeperfume.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });
  console.log("Admin user:", admin.email);

  // ── Test Customer ──
  const customerPassword = await hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      email: "customer@test.com",
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+91 98765 43211",
    },
  });
  console.log("Customer user:", customer.email);

  // ── Products ──
  const products = [
    {
      name: "Noir Cristal", slug: "noir-cristal", brand: "Noir Cristal", sku: "NC-001",
      description: "A mesmerizing dark crystal fragrance that captures the mystique of a moonlit Parisian garden. Deep purple roses intertwine with smoky incense and rare oud.",
      price: 14500, comparePrice: 17000, images: "/images/products/noir-cristal.png,/images/products/noir-cristal-2.png",
      video: "/images/products/hero-perfume.mp4",
      sizes: "30ml,50ml,100ml", category: "oriental", rating: 4.9, reviewCount: 312, stock: 42, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Black Violet", "Dark Berry", "Pink Pepper"], middle: ["Black Rose", "Incense", "Oud Wood"], base: ["Dark Amber", "Smoky Cedar", "Cashmere Musk"] }),
    },
    {
      name: "Jour Éclat", slug: "jour-eclat", brand: "Solstice Botanica", sku: "JE-002",
      description: "Bottled Mediterranean sunlight. Radiant citrus-floral opens with sparkling bergamot and warm saffron, blooming into golden amber and wild herbs.",
      price: 11800, comparePrice: 13500, images: "/images/products/jour-eclat.png,/images/products/jour-eclat-2.png",
      video: "/images/products/collection-showcase.mp4",
      sizes: "30ml,50ml,100ml", category: "citrus", rating: 4.7, reviewCount: 278, stock: 56, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Bergamot", "Saffron", "Lavender"], middle: ["Amber", "Rose Absolute", "Herbes de Provence"], base: ["Sandalwood", "Honey", "Warm Musk"] }),
    },
    {
      name: "Nocturne Jardin", slug: "nocturne-jardin", brand: "Aurora Botanica", sku: "NJ-003",
      description: "An enchanting journey through a secret night garden under silver moonlight. Midnight blooms of rare orchid and dark iris dance with ancient stone and moss.",
      price: 16200, comparePrice: null, images: "/images/products/nocturne-jardin.png,/images/products/nocturne-jardin-2.png",
      video: "/images/products/product-detail.mp4",
      sizes: "50ml,100ml", category: "woody", rating: 4.8, reviewCount: 189, stock: 31, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Blue Lotus", "Juniper", "Silver Birch"], middle: ["Dark Iris", "Night Orchid", "Violet Leaf"], base: ["Ancient Oakmoss", "Grey Amber", "Velvet Musk"] }),
    },
    {
      name: "Lumière Solaire", slug: "lumiere-solaire", brand: "Lumière d'Or", sku: "LS-004",
      description: "A golden symphony of Mediterranean warmth. Iridescent crystals capture midsummer — warm olive groves, golden mimosa, and creamy white roses.",
      price: 13500, comparePrice: 15800, images: "/images/products/lumiere-solaire.png,/images/products/lumiere-solaire-2.png",
      sizes: "30ml,50ml,100ml", category: "floral", rating: 4.9, reviewCount: 423, stock: 48, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Mandarin", "Pink Grapefruit", "Honeyed Fig"], middle: ["Golden Mimosa", "White Rose", "Neroli"], base: ["Creamy Sandalwood", "Liquid Amber", "Blonde Woods"] }),
    },
    {
      name: "Noir Profond", slug: "noir-profond", brand: "Noir Absolu", sku: "NP-005",
      description: "The ultimate expression of dark sophistication. Matte black leather, aged cognac, and rare tobacconist leaves create an olfactory masterpiece.",
      price: 18500, comparePrice: null, images: "/images/products/noir-profond.png,/images/products/velvet-orchid.png",
      sizes: "50ml,100ml", category: "oriental", rating: 4.9, reviewCount: 156, stock: 22, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Cognac", "Black Cardamom", "Bitter Orange"], middle: ["Aged Leather", "Tobacco Leaf", "Dark Chocolate"], base: ["Smoky Vetiver", "Oud", "Labdanum"] }),
    },
    {
      name: "Éclat d'Or", slug: "eclat-dor", brand: "Maison Luxe", sku: "ED-006",
      description: "Liquid gold distilled into crystal. Warm vanilla, rich amber, and gold-threaded silk create pure indulgence and golden luxury.",
      price: 15800, comparePrice: 18200, images: "/images/products/eclat-dor.png,/images/products/citrus-nomade.png",
      sizes: "30ml,50ml,100ml", category: "oriental", rating: 4.8, reviewCount: 345, stock: 39, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Cardamom", "Cinnamon Bark", "Pink Pepper"], middle: ["Vanilla Absolute", "Golden Amber", "Orris Butter"], base: ["Benzoin", "Tonka Bean", "Mysore Sandalwood"] }),
    },
    {
      name: "Soleil d'Argent", slug: "soleil-dargent", brand: "Soleil d'Argent", sku: "SA-007",
      description: "Fresh as a cool ocean breeze at sunrise. Sea minerals with delicate florals — invigorating and serene like silver light on waves.",
      price: 8500, comparePrice: 9900, images: "/images/products/soleil-dargent.png,/images/products/soleil-dargent-2.png",
      sizes: "30ml,50ml,100ml", category: "aquatic", rating: 4.6, reviewCount: 267, stock: 63, isActive: true, featured: false,
      notes: JSON.stringify({ top: ["Sea Salt", "Cucumber", "Green Apple"], middle: ["Marine Accord", "Water Lily", "Blue Lotus"], base: ["Driftwood", "Ambergris", "White Musk"] }),
    },
    {
      name: "Nuit Parisienne", slug: "nuit-parisienne", brand: "Nuit Parisienne", sku: "NP-008",
      description: "The essence of a glamorous Parisian evening. Sparkling champagne meets powdery iris and rare violet for an unforgettable nocturnal fragrance.",
      price: 13800, comparePrice: null, images: "/images/products/nuit-parisienne.png,/images/products/nuit-parisienne-2.png",
      sizes: "50ml,100ml", category: "floral", rating: 4.7, reviewCount: 143, stock: 44, isActive: true, featured: false,
      notes: JSON.stringify({ top: ["Champagne Accord", "Grapefruit", "Pink Pepper"], middle: ["Iris Pallida", "Violet Leaf", "Jasmine Sambac"], base: ["Powdery Musk", "Atlas Cedar", "Ambrette"] }),
    },
    {
      name: "Citrus Royale", slug: "citrus-royale", brand: "Solstice Botanica", sku: "CR-009",
      description: "A regal burst of citrus nobility. Blood orange, neroli, and white cedar create a fragrance that commands attention with effortless elegance.",
      price: 9800, comparePrice: 11200, images: "/images/products/citrus-nomade.png,/images/products/citrus-nomade-2.png",
      sizes: "30ml,50ml,100ml", category: "citrus", rating: 4.6, reviewCount: 234, stock: 52, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Blood Orange", "Neroli", "Lemon Zest"], middle: ["White Cedar", "Orange Blossom", "Ginger"], base: ["Vetiver", "White Amber", "Musk"] }),
    },
    {
      name: "Velvet Dusk", slug: "velvet-dusk", brand: "Maison Luxe", sku: "VD-010",
      description: "As the sun sets, velvet dusk unfolds. A warm embrace of saffron, cardamom, and smoky vetiver that lingers like the last rays of golden hour.",
      price: 12800, comparePrice: 14500, images: "/images/products/velvet-orchid.png,/images/products/velvet-orchid-2.png",
      video: "/images/products/hero-perfume.mp4",
      sizes: "30ml,50ml,100ml", category: "oriental", rating: 4.8, reviewCount: 198, stock: 35, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Saffron", "Cardamom", "Black Pepper"], middle: ["Velvet Rose", "Oud", "Incense"], base: ["Smoky Vetiver", "Amber", "Leather"] }),
    },
    {
      name: "Midnight Oud", slug: "midnight-oud", brand: "Noir Absolu", sku: "MO-011",
      description: "The darkness incarnate. Rare Laotian oud, black amber, and midnight jasmine create an intoxicating aura of mystery and power.",
      price: 22500, comparePrice: null, images: "/images/products/noir-cristal-2.png,/images/products/noir-profond.png",
      sizes: "50ml,100ml", category: "oriental", rating: 4.9, reviewCount: 87, stock: 15, isActive: true, featured: true,
      notes: JSON.stringify({ top: ["Black Pepper", "Saffron", "Oud"], middle: ["Midnight Jasmine", "Black Amber", "Leather"], base: ["Laotian Oud", "Sandalwood", "Musk"] }),
    },
    {
      name: "Azure Coast", slug: "azure-coast", brand: "Aurora Botanica", sku: "AC-012",
      description: "The Mediterranean in a bottle. Sea salt, driftwood, and sun-warmed fig leaf evoke endless summer days along the Italian riviera.",
      price: 10500, comparePrice: 12000, images: "/images/products/soleil-dargent.png,/images/products/soleil-dargent-2.png",
      sizes: "30ml,50ml,100ml", category: "aquatic", rating: 4.7, reviewCount: 312, stock: 48, isActive: true, featured: false,
      notes: JSON.stringify({ top: ["Sea Salt", "Fig Leaf", "Bergamot"], middle: ["Driftwood", "Blue Iris", "Marine Accord"], base: ["White Cedar", "Ambergris", "Clean Musk"] }),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`Product: ${product.name}`);
  }

  // ── Coupons ──
  const coupons = [
    { code: "WELCOME10", description: "10% off first order", discountType: "percent", discountValue: 10, minOrderAmount: 5000, validUntil: new Date("2026-12-31"), maxUses: 1000 },
    { code: "LUXE20", description: "20% off premium fragrances", discountType: "percent", discountValue: 20, minOrderAmount: 10000, validUntil: new Date("2026-12-31"), maxUses: 500, usedCount: 127 },
    { code: "FESTIVE15", description: "15% festive discount", discountType: "percent", discountValue: 15, minOrderAmount: 0, validUntil: new Date("2026-12-31"), maxUses: 200, usedCount: 45 },
    { code: "FLAT500", description: "₹500 off", discountType: "flat", discountValue: 500, minOrderAmount: 3000, validUntil: new Date("2026-12-31"), maxUses: 300 },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
    console.log(`Coupon: ${coupon.code}`);
  }

  // ── Sample Reviews ──
  const sampleReviews = [
    { userId: customer.id, productId: (await prisma.product.findUnique({ where: { slug: "noir-cristal" } }))!.id, rating: 5, comment: "Absolutely stunning fragrance. The oud and rose combination is perfection.", helpful: 12 },
    { userId: customer.id, productId: (await prisma.product.findUnique({ where: { slug: "lumiere-solaire" } }))!.id, rating: 5, comment: "My signature scent now. Gets compliments everywhere I go.", helpful: 8 },
    { userId: customer.id, productId: (await prisma.product.findUnique({ where: { slug: "noir-profond" } }))!.id, rating: 4, comment: "Rich and complex. Perfect for evening events.", helpful: 5 },
  ];

  for (const review of sampleReviews) {
    const existing = await prisma.review.findFirst({ where: { userId: review.userId, productId: review.productId } });
    if (!existing) {
      await prisma.review.create({ data: review });
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
