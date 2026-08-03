import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@luxeperfume.com" },
    update: {},
    create: {
      email: "admin@luxeperfume.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+91 98765 43210",
    },
  });
  console.log("Admin user created:", admin.email);

  const products = [
    {
      name: "Noir Cristal",
      slug: "noir-cristal",
      description:
        "A mesmerizing dark crystal fragrance that captures the mystique of a moonlit Parisian garden. Deep purple roses intertwine with smoky incense and rare oud, creating an intoxicating veil of dark elegance. Each note unfolds like a secret whispered between shadows.",
      brand: "Noir Cristal",
      price: 14500,
      comparePrice: 17000,
      images: [
        "/images/products/noir-cristal.jpg",
        "/images/products/noir-cristal-2.jpg",
      ],
      sizes: ["30ml", "50ml", "100ml"],
      notes: {
        top: ["Black Violet", "Dark Berry", "Pink Pepper"],
        middle: ["Black Rose", "Incense", "Oud Wood"],
        base: ["Dark Amber", "Smoky Cedar", "Cashmere Musk"],
      },
      category: "oriental",
      rating: 4.9,
      reviewCount: 312,
      stock: 42,
      isActive: true,
      featured: true,
    },
    {
      name: "Jour Éclat",
      slug: "jour-eclat",
      description:
        "Bottled Mediterranean sunlight in its purest form. This radiant citrus-floral opens with sparkling bergamot and warm saffron, blooming into a heart of golden amber and wild herbs. A fragrance that illuminates every moment with warmth and vitality.",
      brand: "Solstice Botanica",
      price: 11800,
      comparePrice: 13500,
      images: [
        "/images/products/jour-eclat.jpg",
        "/images/products/jour-eclat-2.jpg",
      ],
      sizes: ["30ml", "50ml", "100ml"],
      notes: {
        top: ["Bergamot", "Saffron", "Lavender"],
        middle: ["Amber", "Rose Absolute", "Herbes de Provence"],
        base: ["Sandalwood", "Honey", "Warm Musk"],
      },
      category: "citrus",
      rating: 4.7,
      reviewCount: 278,
      stock: 56,
      isActive: true,
      featured: true,
    },
    {
      name: "Nocturne Jardin",
      slug: "nocturne-jardin",
      description:
        "An enchanting journey through a secret night garden under silver moonlight. Midnight blooms of rare orchid and dark iris dance with ancient stone and moss, creating a fragrance of profound beauty and quiet mystery.",
      brand: "Aurora Botanica",
      price: 16200,
      comparePrice: null,
      images: [
        "/images/products/nocturne-jardin.jpg",
        "/images/products/nocturne-jardin-2.jpg",
      ],
      sizes: ["50ml", "100ml"],
      notes: {
        top: ["Blue Lotus", "Juniper", "Silver Birch"],
        middle: ["Dark Iris", "Night Orchid", "Violet Leaf"],
        base: ["Ancient Oakmoss", "Grey Amber", "Velvet Musk"],
      },
      category: "woody",
      rating: 4.8,
      reviewCount: 189,
      stock: 31,
      isActive: true,
      featured: true,
    },
    {
      name: "Lumière Solaire",
      slug: "lumiere-solaire",
      description:
        "A golden symphony of Mediterranean warmth and celestial radiance. Iridescent crystals of light capture the essence of midsummer — warm olive groves, golden mimosa, and creamy white roses bathed in amber sunlight.",
      brand: "Lumière d'Or",
      price: 13500,
      comparePrice: 15800,
      images: [
        "/images/products/lumiere-solaire.jpg",
        "/images/products/lumiere-solaire-2.jpg",
      ],
      sizes: ["30ml", "50ml", "100ml"],
      notes: {
        top: ["Mandarin", "Pink Grapefruit", "Honeyed Fig"],
        middle: ["Golden Mimosa", "White Rose", "Neroli"],
        base: ["Creamy Sandalwood", "Liquid Amber", "Blonde Woods"],
      },
      category: "floral",
      rating: 4.9,
      reviewCount: 423,
      stock: 48,
      isActive: true,
      featured: true,
    },
    {
      name: "Noir Profond",
      slug: "noir-profond",
      description:
        "The ultimate expression of dark sophistication. A scent of profound depth — matte black leather, aged cognac, and rare tobacconist leaves create an olfactory masterpiece of understated power and timeless refinement.",
      brand: "Noir Absolu",
      price: 18500,
      comparePrice: null,
      images: [
        "/images/products/noir-profond.jpg",
        "/images/products/noir-profond-2.jpg",
      ],
      sizes: ["50ml", "100ml"],
      notes: {
        top: ["Cognac", "Black Cardamom", "Bitter Orange"],
        middle: ["Aged Leather", "Tobacco Leaf", "Dark Chocolate"],
        base: ["Smoky Vetiver", "Oud", "Labdanum"],
      },
      category: "oriental",
      rating: 4.9,
      reviewCount: 156,
      stock: 22,
      isActive: true,
      featured: true,
    },
    {
      name: "Éclat d'Or",
      slug: "eclat-dor",
      description:
        "Liquid gold distilled into a bottle of crystalline beauty. This opulent oriental fragrance wraps you in warm vanilla, rich amber, and delicate gold-threaded silk. A scent of pure indulgence and golden luxury.",
      brand: "Maison Luxe",
      price: 15800,
      comparePrice: 18200,
      images: [
        "/images/products/eclat-dor.jpg",
        "/images/products/eclat-dor-2.jpg",
      ],
      sizes: ["30ml", "50ml", "100ml"],
      notes: {
        top: ["Cardamom", "Cinnamon Bark", "Pink Pepper"],
        middle: ["Vanilla Absolute", "Golden Amber", "Orris Butter"],
        base: ["Benzoin", "Tonka Bean", "Mysore Sandalwood"],
      },
      category: "oriental",
      rating: 4.8,
      reviewCount: 345,
      stock: 39,
      isActive: true,
      featured: true,
    },
    {
      name: "Soleil d'Argent",
      slug: "soleil-dargent",
      description:
        "Fresh as a cool ocean breeze at sunrise. This aquatic masterpiece combines sea minerals with delicate florals for a scent that is both invigorating and serene — like silver light dancing on crystalline waves.",
      brand: "Soleil d'Argent",
      price: 8500,
      comparePrice: 9900,
      images: [
        "/images/products/soleil-dargent.jpg",
        "/images/products/soleil-dargent-2.jpg",
      ],
      sizes: ["30ml", "50ml", "100ml"],
      notes: {
        top: ["Sea Salt", "Cucumber", "Green Apple"],
        middle: ["Marine Accord", "Water Lily", "Blue Lotus"],
        base: ["Driftwood", "Ambergris", "White Musk"],
      },
      category: "aquatic",
      rating: 4.6,
      reviewCount: 267,
      stock: 63,
      isActive: true,
      featured: false,
    },
    {
      name: "Nuit Parisienne",
      slug: "nuit-parisienne",
      description:
        "The essence of a glamorous Parisian evening. Sparkling champagne effervescence meets powdery iris and rare violet, creating an unforgettable nocturnal fragrance that embodies the romance and sophistication of the City of Light.",
      brand: "Nuit Parisienne",
      price: 13800,
      comparePrice: null,
      images: [
        "/images/products/nuit-parisienne.jpg",
        "/images/products/nuit-parisienne-2.jpg",
      ],
      sizes: ["50ml", "100ml"],
      notes: {
        top: ["Champagne Accord", "Grapefruit", "Pink Pepper"],
        middle: ["Iris Pallida", "Violet Leaf", "Jasmine Sambac"],
        base: ["Powdery Musk", "Atlas Cedar", "Ambrette"],
      },
      category: "floral",
      rating: 4.7,
      reviewCount: 143,
      stock: 44,
      isActive: true,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`Product created: ${product.name}`);
  }

  const coupons = [
    {
      code: "WELCOME10",
      discountPercent: 10,
      validUntil: new Date("2026-12-31"),
      isActive: true,
      maxUses: 1000,
      usedCount: 0,
    },
    {
      code: "LUXE20",
      discountPercent: 20,
      validUntil: new Date("2026-12-31"),
      isActive: true,
      maxUses: 500,
      usedCount: 127,
    },
    {
      code: "FESTIVE15",
      discountPercent: 15,
      validUntil: new Date("2026-12-31"),
      isActive: true,
      maxUses: 200,
      usedCount: 45,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
    console.log(`Coupon created: ${coupon.code}`);
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
