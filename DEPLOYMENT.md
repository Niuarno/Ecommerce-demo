# VOXEL E-Commerce Store - Vercel Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/voxel-store)

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Database** - Choose one:
   - [Vercel Postgres](https://vercel.com/storage/postgres) (Recommended)
   - [Neon](https://neon.tech)
   - [PlanetScale](https://planetscale.com)
   - [Supabase](https://supabase.com)

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voxel-store.git
git push -u origin main
```

### 2. Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project settings (auto-detected)

### 3. Set Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Postgres connection string |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., https://your-store.vercel.app) |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal secret |

### 4. Database Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## Features

- 🛍️ Full-featured e-commerce storefront
- 🎨 Modern, Gen-Z inspired UI
- 🛒 Shopping cart & wishlist
- 👤 Customer dashboard
- 📦 Order management & tracking
- 💳 Stripe & PayPal payments
- 📊 Admin dashboard
- 🌙 Dark mode support
- 📱 Fully responsive

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Prisma ORM
- **Auth:** NextAuth.js v4
- **State:** Zustand + TanStack Query
- **Payments:** Stripe + PayPal

## Demo Credentials

- **Admin:** admin@voxel.store / admin123
- **Customer:** user@voxel.store / user123

## License

MIT License - Feel free to use for personal or commercial projects.
