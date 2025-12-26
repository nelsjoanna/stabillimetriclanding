# Railway Deployment Guide

This guide will help you deploy your Beauty Builder application to Railway with PostgreSQL database.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. Your code pushed to GitHub (already done: `nelsjoanna/stabillimetriclanding`)

## Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `nelsjoanna/stabillimetriclanding`
5. Select the branch: `waitlist-api-submit-d4f94` (or merge to main first)

### 2. Add PostgreSQL Database

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically:
   - Provision a PostgreSQL database
   - Create a `DATABASE_URL` environment variable
   - Make it available to your application

### 3. Configure Your Application

Railway will automatically:
- Detect Node.js from your `railway.json` or `package.json`
- Run `npm run build` (from `railway.json`)
- Run `npm start` to start the server
- Set `PORT` environment variable automatically
- Provide `DATABASE_URL` from the PostgreSQL service

### 4. Seed the Database

After your first deployment, you need to seed the ingredients data:

**Option A: Using Railway CLI (Recommended)**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Run the seed command:
   ```bash
   railway run npm run db:push
   railway run npm run db:seed
   ```

**Option B: Using Railway Dashboard**

1. Go to your service in Railway dashboard
2. Click on the service → "Variables" tab
3. Verify `DATABASE_URL` is set
4. Go to "Deployments" → Click on the latest deployment
5. Open the "Shell" tab
6. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```

### 5. Verify Deployment

1. Railway will provide a public URL (e.g., `your-app.railway.app`)
2. Visit the URL to see your application
3. The API endpoint `/api/waitlist` should work
4. Check Railway logs to ensure everything is running

## Environment Variables

Railway automatically sets:
- `PORT` - Port for your application
- `DATABASE_URL` - PostgreSQL connection string (from database service)
- `NODE_ENV` - Set to "production" in production

## Database Schema

The application uses the following tables:
- `users` - User accounts
- `waitlist_signups` - Waitlist signups
- `ingredients` - Ingredient database (10 hardcoded ingredients)

## Troubleshooting

1. **Build fails:**
   - Check Railway logs for errors
   - Verify `railway.json` is correct
   - Ensure all dependencies are in `package.json`

2. **Database connection fails:**
   - Verify PostgreSQL service is added
   - Check `DATABASE_URL` is set in environment variables
   - Ensure database service is running

3. **Seed fails:**
   - Make sure `db:push` ran successfully first
   - Check database connection string is correct
   - Verify `shared/seed-ingredients.json` exists

## Next Steps

After successful deployment:
1. Set up a custom domain (optional)
2. Configure email notifications for waitlist signups
3. Monitor application logs in Railway dashboard
4. Scale resources as needed
