# Velora - Premium E-Commerce Platform

A production-grade e-commerce platform built with Laravel (backend) and React + Tailwind CSS (frontend).

## 🚀 Tech Stack

### Backend
- **Framework**: Laravel 12 (PHP)
- **Authentication**: Laravel Sanctum (SPA)
- **Database**: MySQL
- **API**: RESTful JSON API (versioned)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 4.x with custom design tokens
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 📁 Project Structure

```
Ecommerce/
├── ecommerce-backend/    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   ├── Services/              # Business logic
│   │   └── Repositories/          # Data access
│   ├── config/
│   ├── database/
│   └── routes/
│       └── api.php               # API routes (v1)
│
└── ecommerce-frontend/   # React SPA
    ├── src/
    │   ├── components/
    │   │   ├── common/           # Button, Input, Card, Modal
    │   │   ├── layout/           # Header, Footer
    │   │   └── features/         # ProductCard, CartItem, etc.
    │   ├── pages/               # Route pages
    │   ├── hooks/               # Custom hooks
    │   ├── context/             # React Context
    │   ├── services/            # API client
    │   ├── utils/               # Helper functions
    │   └── constants/           # Config & constants
    └── index.html
```

## 🎨 Design Philosophy

This project follows a "Human Touch" design philosophy:
- **Warm color palette**: Terracotta primary, sage secondary, golden accents
- **Organic spacing**: Variable, not rigid 8px grid
- **Mixed typography**: Playfair Display (serif) + Inter (sans-serif)
- **Micro-interactions**: Lift effects, subtle rotations, spring animations

## 🛠 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0

### Backend Setup
```bash
cd ecommerce-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd ecommerce-frontend
npm install
npm run dev
```


## 📄 License

This project is proprietary software. All rights reserved.
