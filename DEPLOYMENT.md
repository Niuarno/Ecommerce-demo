# VOXEL E-Commerce Store - Supabase + Vercel Deployment

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

---

## Prerequisites

1. **Supabase Account** - [Sign up free](https://supabase.com)
2. **Vercel Account** - [Sign up free](https://vercel.com)
3. **GitHub Account** - For code hosting

---

## Step 1: Set Up Supabase

### 1.1 Create a New Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** voxel-store (or your choice)
   - **Database Password:** Save this securely!
   - **Region:** Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

### 1.2 Get Database Connection Strings

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy both URLs:

**For DATABASE_URL (Connection Pooling):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**For DIRECT_URL (Direct Connection):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

> ⚠️ **Important:** Replace `[PASSWORD]` with your database password!

---

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to project
cd voxel-store-supabase

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. Add environment variables
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# 6. Redeploy to apply env vars
vercel --prod
```

### Option B: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables (see below)
5. Click **Deploy**

---

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | Pooler connection string | Supabase → Settings → Database |
| `DIRECT_URL` | Direct connection string | Supabase → Settings → Database |
| `NEXTAUTH_SECRET` | Random 32-byte string | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | e.g., `https://your-store.vercel.app` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard |
| `PAYPAL_CLIENT_ID` | PayPal client ID | PayPal Developer |
| `PAYPAL_CLIENT_SECRET` | PayPal secret | PayPal Developer |

---

## Step 4: Initialize Database

### After first deployment:

```bash
# Pull env vars to local
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed the database with demo data
npx prisma db seed
```

### Or use Supabase SQL Editor:

1. Go to Supabase → SQL Editor
2. Run migrations manually if needed

---

## Step 5: Configure Supabase Auth (Optional)

If you want Google OAuth:

1. Go to Supabase → Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials
4. Or use NextAuth.js Google provider (already configured)

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

- **Admin:** admin@voxel.store / admin123
- **Customer:** user@voxel.store / user123

---

## Troubleshooting

### Database Connection Issues

```
Error: P1001: Can't reach database server
```
- Check DATABASE_URL and DIRECT_URL are correct
- Verify password is URL-encoded if it contains special chars
- Ensure Supabase project is not paused

### Prisma Migration Issues

```bash
# Reset database (caution: deletes all data)
npx prisma migrate reset

# Or push schema directly
npx prisma db push --force-reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## Features

✅ Full e-commerce storefront
✅ Modern, Gen-Z inspired UI
✅ Shopping cart & wishlist
✅ Customer dashboard
✅ Order management & tracking
✅ Stripe & PayPal payments
✅ Admin dashboard
✅ Dark mode support
✅ Fully responsive
✅ SEO optimized

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework |
| TypeScript | Language |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Components |
| Prisma | ORM |
| Supabase | Database |
| NextAuth.js | Authentication |
| Zustand | State Management |
| Stripe | Payments |
| PayPal | Payments |

---

## License

MIT - Use freely for personal or commercial projects.
