<div align="center">

# MAISON LUXE

### *The Art of Luxury Fragrance*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://maison-luxe-ecommerce.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D-blue?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)

**🔗 Live: [maison-luxe-ecommerce.vercel.app](https://maison-luxe-ecommerce.vercel.app)**

---

A premium 3D perfume e-commerce platform with AI-powered shopping assistant, real-time database, JWT authentication, and admin dashboard.

</div>

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@luxeperfume.com` | `admin123` |
| **Customer** | `customer@test.com` | `customer123` |
| **Register** | Any email | Any password |

**Test Coupons:** `WELCOME10` (10% off), `LUXE20` (20% off), `FLAT500` (₹500 off)

---

## Features

### Authentication & Authorization
- User Registration & Login with JWT
- Password hashing with bcrypt (12 rounds)
- Role-based access control (Admin / Customer)
- Forgot Password with token-based reset
- Auth persistence via localStorage
- Protected API routes with middleware

### E-Commerce
- **12 luxury fragrances** with detailed product pages
- **Dynamic pricing** — prices update based on selected size (30ml / 50ml / 100ml)
- **Server-side cart** — persists across sessions for logged-in users
- **Checkout flow** — multi-step form with Card & Cash on Delivery
- **Coupon system** — percentage discounts, flat discounts, min order amounts, usage limits
- **Order management** — track status, cancel pending orders
- **Tax & shipping** — 18% GST, free shipping above ₹10,000

### AI Shopping Assistant
- **RAG Pipeline** — Intent detection → database search → context building → response generation
- **18+ Intent Types** — recommend, compare, order tracking, FAQs, gift finding, size help
- **Semantic Search** — TF-IDF vectorization with synonym expansion and cosine similarity
- **Product Comparison** — side-by-side tables with price, notes, ratings, stock
- **Smart Filters** — extracts budget, occasion, season, gender, and notes from natural language
- **No API key needed** — runs entirely server-side

### Admin Dashboard
- Total Revenue, Orders, Customers, Products
- Monthly revenue chart (Recharts)
- Best selling products
- Low stock alerts
- User management (view, block/unblock)
- Order management (update status, tracking)
- Coupon management (CRUD)

### 3D & Visual Experience
- **3D product scenes** — interactive rotating bottles with React Three Fiber
- **Cinematic videos** — hero background, showroom ambiance, brand story
- **Diamond cursor** — custom sharp cursor with crosshair hover and gold glow
- **Framer Motion animations** — scroll reveals, page transitions, micro-interactions
- **Dark luxury aesthetic** — gold accents, glass morphism, ambient lighting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | SQLite (via Prisma ORM) |
| **Auth** | JWT + bcryptjs |
| **Styling** | Tailwind CSS 4 |
| **3D Graphics** | Three.js + React Three Fiber + Drei |
| **Post-Processing** | @react-three/postprocessing (Bloom, Vignette) |
| **Animations** | Framer Motion |
| **State** | Zustand (with localStorage persistence) |
| **AI Engine** | TF-IDF Semantic Search (no API key) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Deployment** | Vercel |

---

## API Documentation

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/me` | Update profile | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (filter, sort, paginate) | No |
| GET | `/api/products/[id]` | Get product with reviews | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/[id]` | Update product | Admin |
| DELETE | `/api/products/[id]` | Delete product | Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PUT | `/api/cart` | Update item quantity | Yes |
| DELETE | `/api/cart` | Remove item / clear cart | Yes |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/[id]` | Get order details | Yes |
| PUT | `/api/orders/[id]` | Cancel order | Yes |

### Checkout
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/checkout` | Place order from cart | Yes |

### Wishlist
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get wishlist | Yes |
| POST | `/api/wishlist` | Toggle wishlist item | Yes |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews?productId=X` | Get reviews | No |
| POST | `/api/reviews` | Create review | Yes |

### Coupons
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/coupons` | List active coupons | No |
| POST | `/api/coupons/validate` | Validate coupon code | No |
| POST | `/api/coupons` | Create coupon | Admin |
| PUT | `/api/coupons` | Update coupon | Admin |
| DELETE | `/api/coupons` | Delete coupon | Admin |

### Addresses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/addresses` | Get user addresses | Yes |
| POST | `/api/addresses` | Add address | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/products` | List all products | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| PUT | `/api/admin/users` | Update user role | Admin |
| GET | `/api/admin/orders` | List all orders | Admin |
| PUT | `/api/admin/orders` | Update order status | Admin |
| GET | `/api/admin/coupons` | List all coupons | Admin |

### AI Assistant
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/fragrance-assistant` | Chat with AI assistant | No |

---

## Getting Started

```bash
# Clone
git clone https://github.com/Thanushaa22/Maison_Luxe_Ecommerce.git
cd Maison_Luxe_Ecommerce

# Install
npm install

# Setup database
npx prisma db push
npx tsx prisma/seed.ts

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── collection/              # Product catalog
│   ├── product/[id]/            # Product detail
│   ├── showroom/                # 3D gallery
│   ├── checkout/                # Checkout flow
│   ├── orders/                  # Order history
│   ├── wishlist/                # Saved items
│   ├── cart/                    # Shopping cart
│   ├── auth/                    # Auth page
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── admin/                   # Admin dashboard
│   └── api/
│       ├── auth/                # Login, Register, Me, Forgot/Reset
│       ├── products/            # CRUD
│       ├── cart/                # Cart management
│       ├── wishlist/            # Wishlist toggle
│       ├── orders/              # Order management
│       ├── checkout/            # Order creation
│       ├── reviews/             # Reviews
│       ├── coupons/             # Coupon validation + CRUD
│       ├── addresses/           # Address management
│       ├── admin/               # Admin stats, products, users, orders, coupons
│       └── ai/                  # Fragrance assistant
├── components/
│   ├── 3d/                      # React Three Fiber scenes
│   └── ui/                      # 25+ UI components
├── lib/
│   ├── auth.ts                  # JWT + bcrypt utilities
│   ├── prisma.ts                # Prisma client singleton
│   ├── chat-engine.ts           # AI chat engine
│   ├── semantic-search.ts       # TF-IDF search
│   └── mock-data.ts             # Fallback data
├── store/                       # Zustand state management
└── types/                       # TypeScript interfaces

prisma/
├── schema.prisma                # Database schema
├── seed.ts                      # Database seeder
└── dev.db                       # SQLite database
```

---

## Database Schema

```
User ─────┬── Cart ──── CartItem
          ├── Order ──── OrderItem
          ├── Review
          ├── Wishlist
          └── Address

Product ──┬── OrderItem
          ├── CartItem
          ├── Review
          └── Wishlist

Coupon (standalone)
```

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 7-day expiry
- Role-based API protection (Admin/Customer)
- Input validation on all endpoints
- SQL injection prevention via Prisma ORM
- Secure environment variables

---

## AI Usage Documentation

### Features Implemented
1. **AI Shopping Assistant** — Chat-based product recommendation with 18+ intent types
2. **Semantic Search** — TF-IDF vectorization for natural language product queries

### Tools Used
- **TF-IDF (Term Frequency-Inverse Document Frequency)** — Custom implementation for product matching
- **Synonym Expansion** — Maps natural language terms to product attributes
- **Intent Detection** — Regex-based pattern matching for 18+ user intents
- **RAG Pipeline** — Retrieve relevant products → Build context → Generate response

### Why These Choices
- **No external API dependency** — Works offline, no API costs, instant responses
- **Privacy-first** — Product data never leaves the server
- **Customizable** — Full control over matching logic and response generation
- **Fast** — Sub-100ms response times with local computation

---

## Links

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
