# VOXEL Store - Supabase + Vercel Deployment

## Quick Steps

### 1. Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection strings:
   - **DATABASE_URL**: Connection pooling (port 6543)
   - **DIRECT_URL**: Direct connection (port 5432)

### 2. GitHub
1. Extract zip file
2. Push to GitHub using GitHub Desktop

### 3. Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add environment variables:
   - `DATABASE_URL` - Supabase pooling URL
   - `DIRECT_URL` - Supabase direct URL
   - `NEXTAUTH_SECRET` - Run: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel URL

### 4. Initialize Database
```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Demo Logins
- Admin: admin@voxel.store / admin123
- Customer: user@voxel.store / user123
