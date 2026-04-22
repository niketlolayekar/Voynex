# 🌍 VOYNEX – Complete Travel Companion

A **production-ready full-stack SaaS travel platform** built with modern technologies and AI-powered features.

![VOYNEX](https://img.shields.io/badge/VOYNEX-Travel%20Platform-blue?style=for-the-badge)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based auth with HttpOnly cookies
- Role-based access: **User**, **Travel Agency**, **Admin**
- Protected routes with RBAC middleware

### 🌍 Trip Discovery
- Browse trips with filters (destination, price, duration, activity type)
- Detailed trip pages with itinerary, reviews, included/excluded items
- Real-time search and filtering

### 🤖 AI-Powered Features
- **AI Trip Planner** — Personalized itineraries based on budget, duration, interests, and group composition
- **AI Packing Assistant** — Smart packing checklists based on destination and activities
- **GPT Chatbot** — Travel Q&A assistant with contextual responses

### 👨‍👩‍👧‍👦 Group Planning
- Personalized itineraries for mixed groups (children, adults, seniors)
- Age-appropriate activity suggestions
- Accessibility-aware recommendations

### 🛒 E-Commerce Shop
- Travel gear marketplace (jackets, accessories, gear, electronics)
- Add to cart, quantity management, checkout flow

### 🚗 Travel Rentals
- Rent bikes, scooties, cars, and GoPro cameras
- Location-based availability
- Feature specifications and pricing

### 📅 Booking System
- Multi-step booking flow: Select → Summary → Payment → Confirmation
- Group composition selector (adults/children/seniors)
- Razorpay payment integration

### ⭐ Reviews & Ratings
- 1-5 star ratings with written reviews
- Average rating per trip
- User avatars and timestamps

### 🏢 Travel Agency Portal
- Add/edit/delete trips
- View and manage bookings
- Revenue analytics and trends

### 🛡️ Admin Dashboard
- User management (CRUD)
- Trip moderation
- Booking oversight
- Review management
- Revenue analytics

### 🌗 Dark Mode
- Toggle light/dark theme
- System preference detection
- Smooth CSS transitions
- LocalStorage persistence

### 📩 Newsletter
- Email subscription in footer
- Success feedback

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript |
| Styling | Tailwind CSS v4 |
| State | React Context API |
| Animations | Framer Motion |
| Backend | Express.js (NestJS-style modular) |
| Auth | JWT with HttpOnly cookies |
| Database | In-memory (MongoDB-ready schemas) |

---

## 📁 Project Structure

```
Voynex/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── layout.tsx            # Root layout
│       │   ├── globals.css           # Design system
│       │   ├── login/page.tsx        # Login
│       │   ├── signup/page.tsx       # Signup
│       │   ├── trips/page.tsx        # Trip listing
│       │   ├── trips/[id]/page.tsx   # Trip detail
│       │   ├── booking/page.tsx      # Booking flow
│       │   ├── dashboard/page.tsx    # User dashboard
│       │   ├── shop/page.tsx         # E-commerce
│       │   ├── cart/page.tsx         # Shopping cart
│       │   ├── rentals/page.tsx      # Travel rentals
│       │   ├── ai-planner/page.tsx   # AI trip planner
│       │   ├── packing-assistant/    # Packing checklist
│       │   ├── agency/page.tsx       # Agency portal
│       │   └── admin/page.tsx        # Admin dashboard
│       ├── components/
│       │   ├── Header.tsx            # Navigation
│       │   ├── Footer.tsx            # Footer + newsletter
│       │   ├── GPTChatbot.tsx        # AI chatbot
│       │   ├── ProtectedRoute.tsx    # Auth guard
│       │   └── ClientProviders.tsx   # Context wrapper
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   ├── ThemeContext.tsx
│       │   └── CartContext.tsx
│       ├── types/index.ts
│       └── lib/mockData.ts
├── backend/
│   └── src/main.js                   # API server
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
npm install
node src/main.js
# → http://localhost:5000
```

### Demo Login
Use any email/password combination:
- **User**: `user@test.com` / any password
- **Agency**: `agency@test.com` / any password  
- **Admin**: `admin@test.com` / any password

---

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#3B82F6` | Primary actions, links |
| Teal | `#14B8A6` | Secondary, success |
| Orange | `#F97316` | Alerts, badges |

---

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/trips` | No | List trips |
| GET | `/api/trips/:id` | No | Trip details |
| POST | `/api/trips` | Agency/Admin | Create trip |
| PUT | `/api/trips/:id` | Agency/Admin | Update trip |
| DELETE | `/api/trips/:id` | Agency/Admin | Delete trip |
| GET | `/api/bookings` | Yes | User bookings |
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/reviews/:tripId` | No | Trip reviews |
| POST | `/api/reviews` | Yes | Add review |
| GET | `/api/admin/stats` | Admin | Dashboard stats |

---

## 📜 License

MIT © 2026 VOYNEX
