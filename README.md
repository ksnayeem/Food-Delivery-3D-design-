# Nayeem Spices // 3D Animated Food Delivery Platform

> **Artisanal Gastronomy infused with Chef Nayeem's Signature Spices & Autonomous Drone Delivery.**

A production-grade, interactive 3D web application built with **React 19**, **TypeScript**, **Three.js**, **React Three Fiber**, **Tailwind CSS v4**, and **Framer Motion**.

---

## ✨ Features

* 🍔 **Interactive 3D Food Models**:
  * Real-time 3D rendered **Wagyu Supreme Burger**, **Truffle Pizza**, **Kyoto Ramen**, and **Dragon Sushi**.
  * **Exploded View Mode**: Separate each culinary layer vertically in 3D space to inspect ingredients.
  * 360° mouse-responsive orbit tracking and rising aroma particles.
* 🛸 **3D Autonomous Drone Radar Simulation**:
  * Animated quad-rotor delivery drone with high-speed spinning propellers and an insulated thermal food pod latched underneath.
  * Infinite scrolling 3D city road grid with live flight altitude, speed, and real-time pod temperature sensor telemetry.
* 🛠️ **3D Burger Customizer Lab**:
  * Real-time patty thickness, artisan cheese melts, and gourmet extras with dynamic calorie and price updates.
* 🛍️ **Interactive Slide-Out Cart & Checkout**:
  * Item modifiers, delivery mode toggle (*Autonomous Drone Pod* vs. *Hyper Courier*), promo code validation (`NAYEEM` for $5 off), and order confirmation toast.
* 📍 **Modern Responsive UI**:
  * Glassmorphic navigation bar with custom **Taste** logo emblem.
  * Live search filtering, category tabs, and customer critic reviews.
* 👤 **User Profile Section (Side to the Bar)**:
  * Slide-out user profile drawer with saved delivery addresses, Balcony Autonomous Drone Landing Pad toggle, order history, and instant demo role switcher (`CUSTOMER`, `ADMIN`, `CHEF`, `DISPATCHER`).
* 🛡️ **Separate Cybernetic Admin Dashboard**:
  * Dedicated administrative command console for live order pipeline state transitions, menu inventory toggles, and drone fleet radar telemetry.

---

## 🛠️ Technology Stack

* **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
* **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [Redis](https://redis.io/), [Apache Kafka](https://kafka.apache.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
* **Animation & Motion**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ksnayeem/Food-Delivery-3D-design-.git
   cd Food-Delivery-3D-design-
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start the local development servers**:
   * **Backend API Gateway** (Port 5000):
     ```bash
     cd backend
     npm run dev
     ```
   * **Frontend Application** (Port 5173):
     ```bash
     npm run dev
     ```
   Open [http://localhost:5173/Food-Delivery-3D-design-/](http://localhost:5173/Food-Delivery-3D-design-/) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```
Food-Delivery-3D-design-/
├── backend/
│   ├── src/
│   │   ├── config/             # Database, Redis & Kafka connection pools
│   │   ├── controllers/        # REST route handler logic (Auth, Menu, Orders)
│   │   ├── domain/             # Strict Zod schemas, state machines & types
│   │   ├── middleware/         # Auth, validation, rate limiting & error handlers
│   │   ├── routes/             # Express API endpoint definitions
│   │   ├── services/           # Business domain logic & event publishers
│   │   └── server.ts           # API Gateway entrypoint & lifecycle hooks
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # Backend TypeScript configuration
├── src/
│   ├── api/
│   │   └── client.ts           # Centralized typed HTTP API client
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── FoodModel3D.tsx     # 3D procedural Burger, Pizza, Ramen & Sushi
│   │   │   └── DeliveryDrone3D.tsx # 3D Quad-Rotor Drone & Scrolling City Grid
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx  # Cybernetic Admin Operations Command Center
│   │   ├── layout/
│   │   │   ├── FoodNavbar.tsx      # Header with Profile pill & Admin trigger
│   │   │   └── FoodFooter.tsx      # Fleet status, menu links & telemetry
│   │   ├── sections/
│   │   │   ├── FoodHero.tsx        # Full-screen 3D hero with dish switcher
│   │   │   ├── MenuSection.tsx     # Searchable 3D food menu catalog
│   │   │   ├── CustomizerSection.tsx# Interactive 3D burger customizer lab
│   │   │   ├── LiveTrackingSection.tsx# Live drone radar & thermal metrics
│   │   │   ├── WhyChooseUs.tsx     # Thermal Pod & Michelin chef standards
│   │   │   └── FoodReviews.tsx     # Customer and critic reviews
│   │   └── ui/
│   │       ├── TasteLogo.tsx       # Bespoke culinary flame & fork emblem
│   │       ├── CartDrawer.tsx      # Slide-out bag & drone checkout flow
│   │       ├── FoodModal3D.tsx     # 3D inspection studio with layer explosion
│   │       └── UserProfileDrawer.tsx# Slide-out user account, addresses & roles
│   ├── context/
│   │   └── AuthContext.tsx         # User authentication & role simulation state
│   ├── data/
│   │   └── foodData.ts             # Artisan dishes, ingredients & calories
│   ├── types/
│   │   └── index.ts                # TypeScript domain models & OrderStatus
│   ├── App.tsx                     # Master assembled web application
│   └── index.css                   # Tailwind CSS v4 & theme tokens
├── docker-compose.yml              # PostgreSQL, Redis & Kafka multi-container spec
├── package.json                    # Frontend dependencies
├── vite.config.ts                  # Vite 8 build & bundler configuration
└── README.md                       # Documentation
```

---

## 📜 License

Created with passion by **Nayeem Spices with Taste Inc.** All rights reserved.
