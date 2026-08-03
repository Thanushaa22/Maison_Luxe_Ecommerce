import { mockProducts, MockProduct } from './mock-data';

/* ─── Simple TF-IDF-like Semantic Search ─── */

// Tokenize text into words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

// Build a product corpus string for each product
function productToText(p: MockProduct): string {
  return [
    p.name,
    p.brand,
    p.description,
    p.category,
    p.notes.top.join(' '),
    p.notes.middle.join(' '),
    p.notes.base.join(' '),
  ].join(' ');
}

// Build vocabulary from all products
function buildVocabulary(products: MockProduct[]): Map<string, number> {
  const df = new Map<string, number>(); // document frequency
  const n = products.length;

  for (const p of products) {
    const words = new Set(tokenize(productToText(p)));
    for (const w of words) {
      df.set(w, (df.get(w) || 0) + 1);
    }
  }

  // IDF: log(N / df) — rare words get higher weight
  const idf = new Map<string, number>();
  for (const [word, freq] of df) {
    idf.set(word, Math.log((n + 1) / (freq + 1)) + 1);
  }
  return idf;
}

// Convert text to TF-IDF vector (sparse)
function textToVector(text: string, idf: Map<string, number>): Map<string, number> {
  const words = tokenize(text);
  const tf = new Map<string, number>();
  for (const w of words) {
    tf.set(w, (tf.get(w) || 0) + 1);
  }
  // Normalize TF by max frequency
  const maxTf = Math.max(...tf.values(), 1);
  const vec = new Map<string, number>();
  for (const [word, freq] of tf) {
    const tfNorm = freq / maxTf;
    const idfVal = idf.get(word) || 0;
    vec.set(word, tfNorm * idfVal);
  }
  return vec;
}

// Cosine similarity between two sparse vectors
function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, normA = 0, normB = 0;
  for (const [word, val] of a) {
    normA += val * val;
    const bVal = b.get(word);
    if (bVal !== undefined) dot += val * bVal;
  }
  for (const [, val] of b) {
    normB += val * val;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Expand query with synonyms for better matching
const synonymMap: Record<string, string[]> = {
  romantic: ['floral', 'rose', 'sensual', 'warm', 'date', 'evening'],
  fresh: ['citrus', 'aquatic', 'light', 'clean', 'summer', 'morning'],
  bold: ['oriental', 'oud', 'leather', 'dark', 'intense', 'night'],
  elegant: ['woody', 'amber', 'musk', 'sandalwood', 'sophisticated'],
  sweet: ['vanilla', 'honey', 'caramel', 'gourmand'],
  woody: ['cedar', 'sandalwood', 'vetiver', 'oakmoss'],
  floral: ['rose', 'jasmine', 'orchid', 'lily', 'iris'],
  citrus: ['bergamot', 'lemon', 'orange', 'grapefruit', 'mandarin'],
  summer: ['fresh', 'aquatic', 'light', 'citrus'],
  winter: ['warm', 'oriental', 'spicy', 'amber'],
  wedding: ['floral', 'elegant', 'romantic', 'classic'],
  office: ['fresh', 'light', 'citrus', 'clean'],
  date: ['romantic', 'sensual', 'warm', 'floral'],
  beach: ['aquatic', 'fresh', 'citrus', 'light'],
  luxury: ['amber', 'oud', 'gold', 'premium', 'exclusive'],
  classic: ['woody', 'amber', 'musk', 'timeless'],
};

function expandQuery(query: string): string {
  const words = tokenize(query);
  const expanded = [...words];
  for (const w of words) {
    if (synonymMap[w]) expanded.push(...synonymMap[w]);
  }
  return expanded.join(' ');
}

// ─── Pre-compute vectors once ───
let idf: Map<string, number> | null = null;
let productVectors: Map<string, Map<string, number>> | null = null;

function ensureInitialized() {
  if (idf) return;
  idf = buildVocabulary(mockProducts);
  productVectors = new Map();
  for (const p of mockProducts) {
    const text = productToText(p);
    productVectors.set(p.id, textToVector(text, idf));
  }
}

// ─── Main search function ───
export interface SearchResult {
  product: MockProduct;
  score: number;
}

export function semanticSearch(query: string, limit: number = 5): SearchResult[] {
  ensureInitialized();

  const expandedQuery = expandQuery(query);
  const queryVec = textToVector(expandedQuery, idf!);

  const results: SearchResult[] = [];
  for (const p of mockProducts) {
    const pVec = productVectors!.get(p.id);
    if (!pVec) continue;
    const score = cosineSimilarity(queryVec, pVec);
    results.push({ product: p, score });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter(r => r.score > 0.05);
}
