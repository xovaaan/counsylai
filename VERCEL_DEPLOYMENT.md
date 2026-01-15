# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Database Setup (PostgreSQL)

You need a PostgreSQL database. Options:
- **Supabase** (recommended - free tier available)
- **Vercel Postgres**
- **Neon** (serverless PostgreSQL)

**Steps:**
1. Create a PostgreSQL database
2. Get your connection strings:
   - `DATABASE_URL` - Main connection string (with pooling)
   - `DIRECT_URL` - Direct connection string (for migrations)

### 2. Run Database Migrations

Before deploying, ensure your database schema is up to date:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (or use migrations)
npx prisma db push
# OR
npx prisma migrate deploy
```

### 3. Environment Variables Required in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

#### **Required:**
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### **Clerk (Production Keys):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

#### **Google Gemini AI:**
```
GEMINI_API_KEY=your-gemini-api-key
```

#### **Optional (if using Supabase):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Build Configuration

Your `package.json` already has the correct build script:
```json
"build": "prisma generate && next build"
```

Vercel will automatically:
1. Run `prisma generate` to generate Prisma Client
2. Run `next build` to build your Next.js app

### 5. Vercel Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel project settings, add all environment variables listed above
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app

### 6. Post-Deployment: Run Migrations

After first deployment, you may need to run migrations:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Using Vercel's Postgres (if using Vercel Postgres)**
- Migrations run automatically

**Option C: Manual connection**
- Connect to your database directly and run:
```bash
npx prisma migrate deploy
```

## 🔍 Testing After Deployment

1. **Sign Up/Login**: Test Clerk authentication
2. **Onboarding**: Complete the onboarding flow
3. **Dashboard**: Verify you can access the dashboard
4. **Database**: Check that data is being saved (users, etc.)

## ⚠️ Common Issues

### Issue: "Prisma Client not generated"
**Solution**: Ensure `prisma generate` runs during build (already in your build script)

### Issue: "Database connection failed"
**Solution**: 
- Check `DATABASE_URL` and `DIRECT_URL` are correct
- Ensure database allows connections from Vercel IPs
- For Supabase: Check connection pooling settings

### Issue: "Clerk authentication not working"
**Solution**:
- Verify you're using **production** Clerk keys (not test keys)
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_live_`
- Check `CLERK_SECRET_KEY` starts with `sk_live_`

### Issue: "Onboarding completes but can't access dashboard"
**Solution**:
- Check database connection
- Verify `onboardingCompleted` field is being saved
- Check middleware is working correctly

## 📝 Quick Start Commands

```bash
# 1. Set up database (if using Supabase)
# Follow SUPABASE_SETUP.md

# 2. Generate Prisma Client locally
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Deploy to Vercel
# Push to GitHub and import to Vercel
# Add environment variables in Vercel dashboard
# Deploy!
```

## ✅ Verification Checklist

After deployment, verify:
- [ ] Homepage loads
- [ ] Sign up/Sign in works
- [ ] Onboarding form works
- [ ] Can complete onboarding
- [ ] Dashboard is accessible after onboarding
- [ ] Database saves user data
- [ ] No console errors in browser
- [ ] No errors in Vercel logs
