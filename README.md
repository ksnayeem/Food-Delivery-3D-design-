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

---

## 🛠️ Technology Stack

* **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
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
   git clone https://github.com/<your-username>/nayeem-spices.git
   cd nayeem-spices
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) or the port indicated in your terminal.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── 3d/
│   │   ├── FoodModel3D.tsx        # 3D procedural Burger, Pizza, Ramen & Sushi
│   │   └── DeliveryDrone3D.tsx    # 3D Quad-Rotor Drone & Scrolling City Grid
│   ├── layout/
│   │   ├── FoodNavbar.tsx         # Floating glass header with location selector
│   │   └── FoodFooter.tsx         # Fleet status, menu links & newsletter
│   ├── sections/
│   │   ├── FoodHero.tsx           # Full-screen 3D hero with dish switcher
│   │   ├── MenuSection.tsx        # Searchable 3D food menu catalog
│   │   ├── CustomizerSection.tsx  # Interactive 3D burger lab
│   │   ├── LiveTrackingSection.tsx# Live drone radar & thermal metrics
│   │   ├── WhyChooseUs.tsx        # Innovations & Michelin standards
│   │   └── FoodReviews.tsx        # Customer and critic reviews
│   └── ui/
│       ├── TasteLogo.tsx          # Bespoke culinary flame & fork emblem
│       ├── Button.tsx             # Futuristic button component
│       ├── CartDrawer.tsx         # Slide-out bag & drone checkout flow
│       └── FoodModal3D.tsx        # 3D inspection studio with layer explosion
├── data/
│   └── foodData.ts                # Artisan dishes, ingredients & calories
├── types/
│   └── index.ts                   # TypeScript interfaces
├── App.tsx                        # Master assembled web application
└── index.css                      # Tailwind CSS v4 & theme tokens
```

---

## 📜 License

Created with passion by **Nayeem Spices with Taste Inc.** All rights reserved.
