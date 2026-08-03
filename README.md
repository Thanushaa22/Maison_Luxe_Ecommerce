<div align="center">

# MAISON LUXE

### *The Art of Luxury Fragrance*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://maison-luxe-ecommerce.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D-blue?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**🔗 Live: [maison-luxe-ecommerce.vercel.app](https://maison-luxe-ecommerce.vercel.app)**

---

A premium 3D perfume e-commerce experience built with Next.js, React Three Fiber, and Framer Motion.
Features an AI-powered shopping assistant with semantic search, product comparison, and luxury consultant personality.

</div>

---

## ✨ Features

### 🤖 AI Shopping Assistant
- **RAG Pipeline** — Intent detection → database search → context building → response generation
- **18+ Intent Types** — recommend, compare, order tracking, FAQs, gift finding, size help
- **Semantic Search** — TF-IDF vectorization with synonym expansion and cosine similarity
- **Product Comparison** — side-by-side tables with price, notes, ratings, stock
- **Smart Filters** — extracts budget, occasion, season, gender, and notes from natural language
- **FAQ Support** — shipping, returns, payments, gift wrapping, coupons
- **Conversation Memory** — maintains context across messages
- **Quick Suggestions** — clickable chips on every response
- **3 Modes** — Chat, Quiz, Compare tabs in one unified panel

### 🛍️ E-Commerce
- **12 luxury fragrances** with detailed product pages
- **Dynamic pricing** — prices update based on selected size (30ml / 50ml / 100ml)
- **Cart persistence** — survives page refresh via localStorage
- **Checkout flow** — multi-step form with Card & Cash on Delivery
- **Order history** — track past orders with status badges
- **Wishlist** — save favorites across sessions
- **User reviews** — star ratings, verified badges, helpful votes
- **Back-in-stock alerts** — email signup for sold-out items

### 🎨 Visual Experience
- **3D product scenes** — interactive rotating bottles with React Three Fiber
- **Cinematic videos** — hero background, showroom ambiance, brand story
- **Diamond cursor** — custom sharp cursor with crosshair hover and gold glow
- **Framer Motion animations** — scroll reveals, page transitions, micro-interactions
- **Dark luxury aesthetic** — gold accents, glass morphism, ambient lighting
- **Image lightbox** — zoom into product photos
- **Toast notifications** — elegant feedback for cart/wishlist actions
- **Recently viewed** — localStorage-based browsing history
- **Share button** — native share API with clipboard fallback

### 📱 Responsive
- Mobile-first design with hamburger menu
- Optimized touch targets and layouts
- Performance-tuned with lazy loading and code splitting

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **3D Graphics** | Three.js + React Three Fiber + Drei |
| **Post-Processing** | @react-three/postprocessing (Bloom, Vignette) |
| **Animations** | Framer Motion |
| **State** | Zustand (with localStorage persistence) |
| **AI Engine** | TF-IDF Semantic Search (no API key needed) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🤖 AI Assistant Architecture

```
User Query
    ↓
Intent Detection (18+ intents)
    ↓
Smart Extraction (budget, notes, occasion, season, gender)
    ↓
Database Search (semantic + filter)
    ↓
Context Building (product knowledge)
    ↓
Response Generation (personalized, elegant)
    ↓
Frontend Display (products, comparison, suggestions)
```

### Supported Queries

| Query Type | Example | Response |
|-----------|---------|----------|
| **Recommend** | "Recommend a perfume for a wedding" | Filtered products with match scores |
| **Budget** | "Under ₹10,000" | Products sorted by price |
| **Notes** | "I love vanilla and rose" | Products with matching notes |
| **Occasion** | "Something for the office" | Occasion-appropriate fragrances |
| **Compare** | "Compare Noir Cristal vs Lumiere Solaire" | Side-by-side comparison table |
| **Gift** | "Gift for my girlfriend" | Curated gift recommendations |
| **Season** | "Fresh fragrance for summer" | Season-appropriate picks |
| **Order** | "Where is my order?" | Order tracking guidance |
| **FAQ** | "What is your return policy?" | Policy information |
| **Stock** | "Is Noir Cristal in stock?" | Stock availability |
| **Size** | "Which size should I get?" | Size guide |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Thanushaa22/Maison_Luxe_Ecommerce.git

# Navigate to project
cd Maison_Luxe_Ecommerce

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Landing page with video hero
│   ├── collection/              # Product catalog with filters
│   ├── product/[id]/            # Product detail with 3D scene
│   ├── showroom/                # 3D CSS perspective gallery
│   ├── checkout/                # Multi-step checkout
│   ├── orders/                  # Order history
│   ├── wishlist/                # Saved items
│   ├── contact/                 # Contact page
│   └── api/                     # API routes
│       └── ai/
│           ├── fragrance-assistant/  # AI chatbot endpoint
│           └── smart-search/         # Semantic search endpoint
├── components/
│   ├── 3d/                      # React Three Fiber scenes
│   │   ├── ProductScene         # Product detail 3D viewer
│   │   ├── Scene                # Hero 3D scene
│   │   └── PerfumeBottle        # 3D bottle model
│   └── ui/                      # Reusable UI components
│       ├── AIFragranceAssistant # Chatbot with 3 tabs
│       ├── Navbar               # Navigation with search
│       ├── Footer               # Site footer
│       ├── ProductCard          # Product grid card
│       ├── CartDrawer           # Slide-out cart
│       ├── SmartSearch          # ⌘K semantic search
│       ├── CustomCursor         # Diamond cursor
│       ├── Toast                # Notification system
│       ├── ScrollToTop          # Scroll button
│       ├── FragranceFinder      # Quiz recommendation
│       └── ...                  # 25+ more components
├── lib/
│   ├── chat-engine.ts           # AI assistant engine
│   ├── semantic-search.ts       # TF-IDF search
│   └── mock-data.ts             # Product database
├── store/                       # Zustand state management
└── types/                       # TypeScript interfaces
```

---

## 🎯 Key Highlights

### AI Shopping Assistant
The chatbot acts as a professional luxury perfume consultant:
- **18+ intents** — understands budget, occasion, notes, season, gender, comparison, orders, FAQs
- **Semantic search** — TF-IDF vectorization with synonym expansion
- **Product knowledge** — knows every fragrance's notes, ratings, stock, sizes, pricing
- **Personalized responses** — adapts tone based on match confidence
- **Comparison engine** — side-by-side tables for any two products
- **No API key needed** — runs entirely server-side

### 3D Product Visualization
Each product features an interactive 3D scene with:
- Hexagonal glass bottle with realistic refraction
- Gold accent lines and orbital rings
- Floating gold particles with additive blending
- Reflective floor using `MeshReflectorMaterial`
- Dynamic lighting (7-point setup)
- Post-processing bloom and vignette effects

### Smart Checkout
- Email & phone validation
- Address form with Indian pincode support
- Card payment with number formatting
- Cash on Delivery option
- Free shipping above ₹10,000

---

## 📊 Performance

- **Static generation** for all marketing pages
- **Dynamic rendering** for product pages and API routes
- **Code splitting** — 3D scenes load on demand
- **Image optimization** — Next.js Image with priority loading
- **Video optimization** — `preload="metadata"` for background videos
- **Bundle optimization** — Tree-shaking for Framer Motion, Lucide icons
- **localStorage** — cart, wishlist, recently viewed persist across sessions

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live Site** | [maison-luxe-ecommerce.vercel.app](https://maison-luxe-ecommerce.vercel.app) |
| **Repository** | [github.com/Thanushaa22/Maison_Luxe_Ecommerce](https://github.com/Thanushaa22/Maison_Luxe_Ecommerce) |
| **LinkedIn** | [linkedin.com/in/thanusha2233](https://linkedin.com/in/thanusha2233) |
| **Email** | [thanusham2233@gmail.com](mailto:thanusham2233@gmail.com) |

---

<div align="center">

**Built with ♦ by [Thanusha M](https://linkedin.com/in/thanusha2233)**

*"Every fragrance tells a story. Every detail matters."*

</div>
