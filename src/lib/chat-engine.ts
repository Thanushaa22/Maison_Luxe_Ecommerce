import { mockProducts, mockOrders, MockProduct } from './mock-data';

/* ═══════════════════════════════════════════════════════════════
   MAISON LUXE — AI Shopping Assistant Engine
   RAG Pipeline + Intent Detection + Product Knowledge
   ═══════════════════════════════════════════════════════════════ */

// ─── Intent Types ───
export type Intent =
  | 'greeting'
  | 'recommend'
  | 'budget'
  | 'occasion'
  | 'notes'
  | 'compare'
  | 'order_track'
  | 'order_status'
  | 'faq_shipping'
  | 'faq_returns'
  | 'faq_payment'
  | 'faq_gift'
  | 'faq_coupons'
  | 'stock_check'
  | 'size_help'
  | 'gift_find'
  | 'season'
  | 'longevity'
  | 'gender'
  | 'similarity'
  | 'general';

// ─── Detect User Intent ───
export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|yo)\b/.test(q)) return 'greeting';

  // Comparison
  if (q.includes('compare') || q.includes('vs') || q.includes('versus') || q.includes('difference between')) return 'compare';

  // Order queries
  if (q.includes('order') && (q.includes('track') || q.includes('where') || q.includes('status') || q.includes('delivery'))) return 'order_track';
  if (q.includes('order') && (q.includes('cancel') || q.includes('refund'))) return 'order_status';

  // FAQ
  if (q.includes('shipping') || q.includes('deliver') || q.includes('ship')) return 'faq_shipping';
  if (q.includes('return') || q.includes('exchange') || q.includes('refund policy')) return 'faq_returns';
  if (q.includes('payment') || q.includes('pay') || q.includes('cod') || q.includes('upi') || q.includes('card')) return 'faq_payment';
  if (q.includes('gift') && (q.includes('wrap') || q.includes('pack'))) return 'faq_gift';
  if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('promo')) return 'faq_coupons';

  // Stock
  if (q.includes('stock') || q.includes('available') || q.includes('out of stock')) return 'stock_check';

  // Size help
  if (q.includes('size') || q.includes('ml') || q.includes('bottle size') || q.includes('which size')) return 'size_help';

  // Gift finding
  if (q.includes('gift') && (q.includes('find') || q.includes('suggest') || q.includes('need') || q.includes('for my'))) return 'gift_find';

  // Budget
  if (q.includes('under') || q.includes('budget') || q.includes('below') || q.includes('less than') || /₹\s*\d/.test(q) || /\d{4,5}/.test(q)) return 'budget';

  // Occasion
  if (q.includes('wedding') || q.includes('date') || q.includes('office') || q.includes('party') || q.includes('night') || q.includes('casual') || q.includes('formal') || q.includes('work')) return 'occasion';

  // Notes
  if (q.includes('vanilla') || q.includes('rose') || q.includes('oud') || q.includes('amber') || q.includes('citrus') || q.includes('musk') || q.includes('sandalwood') || q.includes('jasmine') || q.includes('bergamot') || q.includes('leather') || q.includes('tobacco') || q.includes('incense')) return 'notes';

  // Season
  if (q.includes('summer') || q.includes('winter') || q.includes('spring') || q.includes('monsoon') || q.includes('cold') || q.includes('hot') || q.includes('warm weather')) return 'season';

  // Longevity
  if (q.includes('long last') || q.includes('longevity') || q.includes('hours') || q.includes('all day') || q.includes('stay')) return 'longevity';

  // Gender
  if (q.includes('men') || q.includes('women') || q.includes('unisex') || q.includes('him') || q.includes('her') || q.includes('boyfriend') || q.includes('girlfriend') || q.includes('husband') || q.includes('wife')) return 'gender';

  // Similar
  if (q.includes('similar') || q.includes('like') || q.includes('same') || q.includes('alternative')) return 'similarity';

  // Recommendation (catch-all for perfume queries)
  if (q.includes('recommend') || q.includes('suggest') || q.includes('perfume') || q.includes('fragrance') || q.includes('scent') || q.includes('cologne')) return 'recommend';

  return 'general';
}

// ─── Extract Budget ───
function extractBudget(query: string): number | null {
  const q = query.toLowerCase();
  // "under 5000", "below 5000", "budget 5000"
  const match = q.match(/(?:under|below|budget|less than|max|upto)\s*(?:₹?\s*)?(\d{3,6})/);
  if (match) return parseInt(match[1]);
  // Just a number: "5000 perfume"
  const numMatch = q.match(/(\d{4,6})/);
  if (numMatch) return parseInt(numMatch[1]);
  return null;
}

// ─── Extract Notes ───
function extractNotes(query: string): string[] {
  const noteKeywords = [
    'vanilla', 'rose', 'oud', 'amber', 'citrus', 'musk', 'sandalwood',
    'jasmine', 'bergamot', 'leather', 'tobacco', 'incense', 'saffron',
    'lavender', 'cedar', 'vetiver', 'patchouli', 'iris', 'orchid',
    'lotus', 'mimosa', 'neroli', 'fig', 'honey', 'chocolate', 'coffee',
    'pepper', 'cardamom', 'cinnamon', 'clove', 'nutmeg', 'mint',
  ];
  return noteKeywords.filter(n => query.toLowerCase().includes(n));
}

// ─── Extract Occasion ───
function extractOccasion(query: string): string | null {
  const q = query.toLowerCase();
  const occasions: Record<string, string[]> = {
    wedding: ['wedding', 'bride', 'groom', 'ceremony'],
    date: ['date', 'romantic', 'valentine'],
    office: ['office', 'work', 'formal', 'professional', 'business'],
    party: ['party', 'club', 'night out', 'celebration'],
    casual: ['casual', 'everyday', 'daily', 'weekend'],
    evening: ['evening', 'night', 'dinner'],
  };
  for (const [key, words] of Object.entries(occasions)) {
    if (words.some(w => q.includes(w))) return key;
  }
  return null;
}

// ─── Extract Season ───
function extractSeason(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes('summer') || q.includes('hot') || q.includes('warm weather')) return 'summer';
  if (q.includes('winter') || q.includes('cold')) return 'winter';
  if (q.includes('spring')) return 'spring';
  if (q.includes('monsoon') || q.includes('rain')) return 'monsoon';
  return null;
}

// ─── Extract Gender ───
function extractGender(query: string): 'men' | 'women' | 'unisex' | null {
  const q = query.toLowerCase();
  if (q.includes('women') || q.includes('her') || q.includes('girlfriend') || q.includes('wife') || q.includes('girl')) return 'women';
  if (q.includes('men') || q.includes('him') || q.includes('boyfriend') || q.includes('husband') || q.includes('boy')) return 'men';
  if (q.includes('unisex') || q.includes('anyone') || q.includes('everyone')) return 'unisex';
  return null;
}

// ─── Extract Product Name ───
function extractProductName(query: string): MockProduct | null {
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = normalize(query);
  for (const p of mockProducts) {
    if (q.includes(normalize(p.name))) return p;
  }
  return null;
}

// ─── Semantic Search (TF-IDF) ───
import { semanticSearch } from './semantic-search';

// ─── Smart Product Filter ───
function filterProducts(query: string): MockProduct[] {
  const budget = extractBudget(query);
  const notes = extractNotes(query);
  const occasion = extractOccasion(query);
  const season = extractSeason(query);
  const gender = extractGender(query);
  const q = query.toLowerCase();

  let results = [...mockProducts];

  // Budget filter
  if (budget) {
    results = results.filter(p => p.price <= budget);
  }

  // Occasion filter
  if (occasion) {
    results = results.filter(p => {
      const desc = p.description.toLowerCase();
      return desc.includes(occasion);
    });
  }

  // Season filter
  if (season) {
    results = results.filter(p => {
      const desc = p.description.toLowerCase();
      const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base].join(' ').toLowerCase();
      return desc.includes(season) || allNotes.includes(season);
    });
  }

  // Notes filter
  if (notes.length > 0) {
    results = results.filter(p => {
      const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base].join(' ').toLowerCase();
      return notes.some(n => allNotes.includes(n));
    });
  }

  // If filters returned nothing, fall back to semantic search
  if (results.length === 0) {
    const semantic = semanticSearch(query, 5);
    results = semantic.map(r => r.product);
  }

  return results.slice(0, 3);
}

// ─── FAQ Data ───
const faqData: Record<string, string> = {
  faq_shipping: `We offer free shipping on all orders above ₹10,000. Standard delivery takes 3-5 business days across India. Express delivery (1-2 days) is available in major cities for ₹500 extra. All orders are carefully packaged in our signature luxury gift box.`,

  faq_returns: `We accept returns within 7 days of delivery for unopened products in original packaging. Opened products can be exchanged within 48 hours if you experience any skin sensitivity. Refunds are processed within 5-7 business days to your original payment method.`,

  faq_payment: `We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and Cash on Delivery (COD). EMI options are available for orders above ₹5,000 through our banking partners. All transactions are secured with 256-bit SSL encryption.`,

  faq_gift: `Yes! We offer complimentary luxury gift wrapping with a handwritten note card on all orders. Premium gift boxes with ribbon and dried flowers are available for ₹300 extra. Gift cards are also available in denominations from ₹1,000 to ₹25,000.`,

  faq_coupons: `Subscribe to our newsletter for 10% off your first order. We also run seasonal sales during Diwali, Valentine's Day, and festive periods. Loyalty members earn points on every purchase that can be redeemed for exclusive discounts.`,
};

// ─── Product Knowledge Builder ───
function buildProductContext(products: MockProduct[]): string {
  return products.map(p => {
    const topNotes = p.notes.top.join(', ');
    const heartNotes = p.notes.middle.join(', ');
    const baseNotes = p.notes.base.join(', ');
    const sizes = p.sizes.join(', ');
    return [
      `Name: ${p.name}`,
      `Brand: ${p.brand}`,
      `Category: ${p.category}`,
      `Price: ₹${p.price.toLocaleString('en-IN')}`,
      `Sizes: ${sizes}`,
      `Top Notes: ${topNotes}`,
      `Heart Notes: ${heartNotes}`,
      `Base Notes: ${baseNotes}`,
      `Rating: ${p.rating}/5 (${p.reviewCount} reviews)`,
      `Stock: ${p.stock}`,
      `Description: ${p.description}`,
    ].join(' | ');
  }).join('\n\n');
}

// ─── Response Generator ───
export interface ChatResponse {
  message: string;
  products?: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    matchScore: number;
    topNotes: string;
    rating: number;
    stock: number;
    sizes: string[];
    reason: string;
  }>;
  comparison?: {
    product1: { name: string; price: number; notes: string; rating: number; stock: number; sizes: string[] };
    product2: { name: string; price: number; notes: string; rating: number; stock: number; sizes: string[] };
  };
  suggestions?: string[];
}

function formatProducts(products: MockProduct[], scores?: number[]): ChatResponse['products'] {
  return products.map((p, i) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    image: p.images[0] || '',
    matchScore: scores?.[i] ? Math.round(scores[i] * 100) : 90 - i * 10,
    topNotes: [...p.notes.top.slice(0, 2), ...p.notes.middle.slice(0, 1)].join(', '),
    rating: p.rating,
    stock: p.stock,
    sizes: p.sizes,
    reason: p.stock > 0
      ? `In stock — ${p.notes.top[0]} and ${p.notes.middle[0]} notes`
      : `Currently out of stock — notify me`,
  }));
}

const greetingSuggestions = [
  'Recommend a perfume for a wedding',
  'I need something under ₹15,000',
  'Fresh fragrance for summer',
  'Gift for my girlfriend',
  'Compare Noir Cristal vs Lumiere Solaire',
  'What is your return policy?',
];

export function generateResponse(query: string, _history: string[] = []): ChatResponse {
  const intent = detectIntent(query);
  const suggestions: string[] = [];

  switch (intent) {
    case 'greeting': {
      return {
        message: 'Welcome to MAISON LUXE. I am your personal fragrance consultant. I can help you discover the perfect perfume, compare products, check orders, or answer any questions about our collection. What brings you here today?',
        suggestions: greetingSuggestions,
      };
    }

    case 'recommend': {
      const products = filterProducts(query);
      if (products.length === 0) {
        return {
          message: 'I could not find an exact match for that description. Could you tell me more about the mood (romantic, fresh, bold), an occasion, or specific notes you enjoy? I will find something perfect for you.',
          suggestions: ['Romantic floral', 'Fresh for office', 'Bold for evening', 'Something sweet'],
        };
      }
      const ctx = buildProductContext(products);
      return {
        message: `Based on your preferences, I have curated these exceptional fragrances. Each one has been selected for its unique character and quality.`,
        products: formatProducts(products),
        suggestions: ['Tell me more about the first one', 'Show me something different', 'What are the top notes?', 'Any other options?'],
      };
    }

    case 'budget': {
      const budget = extractBudget(query);
      const products = mockProducts.filter(p => budget ? p.price <= budget : true).slice(0, 3);
      if (products.length === 0) {
        return {
          message: `I could not find fragrances under ₹${budget?.toLocaleString('en-IN')}. Our collection starts at ₹8,500. Would you like to explore our range or increase your budget slightly?`,
          suggestions: ['Show all fragrances', 'Under ₹15,000', 'Under ₹20,000'],
        };
      }
      const budgetText = budget ? `under ₹${budget.toLocaleString('en-IN')}` : 'in your range';
      return {
        message: `Here are our finest fragrances ${budgetText}. Each offers exceptional quality and lasting performance.`,
        products: formatProducts(products),
        suggestions: [`Tell me more about ${products[0].name}`, 'Compare two of these', 'Show cheaper options'],
      };
    }

    case 'occasion': {
      const occasion = extractOccasion(query);
      const products = filterProducts(query);
      return {
        message: occasion
          ? `For ${occasion} occasions, these fragrances are perfectly suited. They have been selected for their character and projection.`
          : `Here are fragrances that work beautifully for special moments.`,
        products: formatProducts(products),
        suggestions: ['What makes these special?', 'Show me more options', 'Compare top two', 'Any budget options?'],
      };
    }

    case 'notes': {
      const notes = extractNotes(query);
      const products = filterProducts(query);
      return {
        message: notes.length > 0
          ? `For lovers of ${notes.join(' and ')}, these fragrances showcase those notes beautifully.`
          : `Here are some exceptional fragrances with beautiful note compositions.`,
        products: formatProducts(products),
        suggestions: ['Explain the notes', 'Show similar fragrances', 'Compare these', 'What season are these for?'],
      };
    }

    case 'compare': {
      // Normalize: remove accents for comparison matching
      const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const qNorm = normalize(query);
      const found = mockProducts.filter(p => qNorm.includes(normalize(p.name)));

      if (found.length >= 2) {
        const [p1, p2] = found;
        return {
          message: `Here is a detailed comparison of ${p1.name} vs ${p2.name}:`,
          comparison: {
            product1: { name: p1.name, price: p1.price, notes: [...p1.notes.top, ...p1.notes.middle, ...p1.notes.base].join(', '), rating: p1.rating, stock: p1.stock, sizes: p1.sizes },
            product2: { name: p2.name, price: p2.price, notes: [...p2.notes.top, ...p2.notes.middle, ...p2.notes.base].join(', '), rating: p2.rating, stock: p2.stock, sizes: p2.sizes },
          },
          products: formatProducts([p1, p2]),
          suggestions: [`Which one lasts longer?`, `Which is better for ${extractOccasion(query) || 'daily wear'}?`, `Show me alternatives`],
        };
      }

      if (found.length === 1) {
        const similar = mockProducts.filter(p => p.id !== found[0].id && p.category === found[0].category).slice(0, 1);
        if (similar.length > 0) {
          return {
            message: `I found ${found[0].name}. Would you like to compare it with ${similar[0].name}?`,
            comparison: {
              product1: { name: found[0].name, price: found[0].price, notes: [...found[0].notes.top, ...found[0].notes.middle, ...found[0].notes.base].join(', '), rating: found[0].rating, stock: found[0].stock, sizes: found[0].sizes },
              product2: { name: similar[0].name, price: similar[0].price, notes: [...similar[0].notes.top, ...similar[0].notes.middle, ...similar[0].notes.base].join(', '), rating: similar[0].rating, stock: similar[0].stock, sizes: similar[0].sizes },
            },
            products: formatProducts([found[0], similar[0]]),
            suggestions: ['Which is better value?', 'Show me a third option', 'Tell me about longevity'],
          };
        }
      }

      return {
        message: 'Which two fragrances would you like me to compare? You can mention them by name, like "Compare Noir Cristal and Lumiere Solaire".',
        suggestions: ['Noir Cristal vs Lumiere Solaire', 'Noir Profond vs Eclat d\'Or', 'Jour Eclat vs Azure Coast'],
      };
    }

    case 'order_track':
    case 'order_status': {
      return {
        message: 'To track your order, please visit your orders page where you can see real-time status updates. You can also provide your order ID and I will look it up for you. Our delivery partners typically update tracking every 6 hours.',
        suggestions: ['Go to my orders', 'What are your delivery times?', 'Can I cancel my order?'],
      };
    }

    case 'faq_shipping':
    case 'faq_returns':
    case 'faq_payment':
    case 'faq_gift':
    case 'faq_coupons': {
      return {
        message: faqData[intent],
        suggestions: ['Tell me about shipping', 'Return policy', 'Payment options', 'Gift wrapping', 'Coupons and offers'],
      };
    }

    case 'stock_check': {
      const nameProduct = extractProductName(query);
      if (nameProduct) {
        return {
          message: nameProduct.stock > 0
            ? `${nameProduct.name} is currently in stock with ${nameProduct.stock} units available. It comes in ${nameProduct.sizes.join(', ')} sizes. Would you like to add it to your bag?`
            : `${nameProduct.name} is currently out of stock. Would you like me to notify you when it becomes available?`,
          products: formatProducts([nameProduct]),
          suggestions: ['Add to bag', 'Notify me when available', 'Show similar fragrances'],
        };
      }
      return {
        message: 'Which product would you like to check stock for? You can mention the product name.',
        suggestions: ['Noir Cristal', 'Lumiere Solaire', 'Eclat d\'Or'],
      };
    }

    case 'size_help': {
      return {
        message: 'Our fragrances come in 30ml, 50ml, and 100ml sizes. Here is a quick guide:\n\n30ml — Perfect for trying a new scent or travel. Lasts 2-3 months with daily use.\n50ml — Our most popular size. Great value and lasts 4-6 months.\n100ml — Best value per ml. Ideal for your signature scent.\n\nPrice per ml decreases with larger sizes, so 100ml offers the best value.',
        suggestions: ['Show me 50ml options', 'Which size is best for gifting?', 'Compare prices per ml'],
      };
    }

    case 'gift_find': {
      const gender = extractGender(query);
      const budget = extractBudget(query);
      let products = mockProducts;
      if (budget) products = products.filter(p => p.price <= budget);
      products = products.slice(0, 3);

      return {
        message: gender
          ? `Here are my top gift recommendations. Each comes with complimentary luxury gift wrapping and a handwritten note card.`
          : `Here are my top gift recommendations for someone special. Each comes with complimentary luxury gift wrapping.`,
        products: formatProducts(products),
        suggestions: ['Add gift wrapping', 'Show me something cheaper', 'What sizes are available?', 'Compare these gifts'],
      };
    }

    case 'season': {
      const season = extractSeason(query);
      const products = filterProducts(query);
      return {
        message: season
          ? `For ${season} weather, these fragrances perform beautifully. Their compositions are designed to complement the season's character.`
          : `Here are fragrances suited for the current season.`,
        products: formatProducts(products),
        suggestions: ['Show me summer fragrances', 'Winter recommendations', 'What works year-round?', 'Compare seasonal picks'],
      };
    }

    case 'longevity': {
      return {
        message: 'All our fragrances are formulated for exceptional longevity. Here is what to expect:\n\nEau de Parfum concentration — 8-12 hours on skin\nBase notes of oud, amber, and musk —最长 lasting\nTop notes fade within 30 minutes, heart notes last 3-4 hours, base notes persist 8+ hours.\n\nFor maximum longevity, apply to pulse points and moisturize skin first.',
        suggestions: ['Show longest lasting fragrances', 'Best for all-day wear', 'Compare longevity of two fragrances'],
      };
    }

    case 'gender': {
      const gender = extractGender(query);
      const products = gender === 'women'
        ? mockProducts.filter(p => p.description.toLowerCase().includes('feminine') || p.notes.top.some(n => ['rose', 'jasmine', 'orchid', 'iris', 'lily'].includes(n.toLowerCase())))
        : gender === 'men'
        ? mockProducts.filter(p => p.description.toLowerCase().includes('masculine') || p.notes.top.some(n => ['leather', 'oud', 'tobacco', 'vetiver'].includes(n.toLowerCase())))
        : mockProducts.slice(0, 3);

      return {
        message: gender
          ? `Here are fragrances curated for ${gender === 'women' ? 'her' : gender === 'men' ? 'him' : 'everyone'}.`
          : `Here are some of our finest fragrances.`,
        products: formatProducts(products.slice(0, 3)),
        suggestions: ['Show me more options', 'Compare two of these', 'Any unisex options?'],
      };
    }

    case 'similarity': {
      const nameProduct = extractProductName(query);
      if (nameProduct) {
        const similar = mockProducts.filter(p => p.id !== nameProduct.id).slice(0, 3);
        return {
          message: `If you enjoy ${nameProduct.name}, you might also love these. They share similar characteristics and note profiles.`,
          products: formatProducts(similar),
          suggestions: [`Tell me about ${similar[0]?.name}`, 'Compare with the first one', 'Show different options'],
        };
      }
      return {
        message: 'Which fragrance would you like me to find similar options for?',
        suggestions: ['Noir Cristal', 'Lumiere Solaire', 'Nocturne Jardin'],
      };
    }

    case 'general':
    default: {
      // Try semantic search as last resort
      const results = semanticSearch(query, 3);
      if (results.length > 0 && results[0].score > 0.1) {
        return {
          message: `Based on your query, here are fragrances that might interest you.`,
          products: formatProducts(results.map(r => r.product), results.map(r => r.score)),
          suggestions: ['Tell me more about the first one', 'Show me something different', 'Compare two of these'],
        };
      }
      return {
        message: 'I am here to help you find the perfect fragrance. You can ask me to recommend perfumes based on mood, occasion, budget, or notes. I can also compare products, check stock, track orders, or answer any questions about our collection.',
        suggestions: greetingSuggestions,
      };
    }
  }
}
