# Netlify Deployment Guide

This guide will help you deploy your Beauty Builder application to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://netlify.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for first-time setup)

1. **Connect your repository:**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select your repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - These are already configured in `netlify.toml`, so Netlify should detect them automatically

3. **Install dependencies:**
   - Run `npm install` to install all dependencies including `@netlify/functions`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and deploy:**
   ```bash
   npm install
   npm run build
   netlify deploy --prod
   ```

## Important Notes

### Database/Storage

⚠️ **Current Limitation:** The app currently uses in-memory storage, which means data will be lost when serverless functions restart. For production, you should:

1. **Set up a database:**
   - Use PostgreSQL (via Supabase, Neon, or Railway)
   - Or use Netlify's built-in database options
   - Update `server/storage.ts` to use a persistent database instead of `MemStorage`

2. **Environment Variables:**
   - If using a database, add `DATABASE_URL` in Netlify:
     - Go to Site settings → Environment variables
     - Add your database connection string

### API Routes

- API routes are handled by Netlify Functions in `netlify/functions/`
- The `/api/waitlist` endpoint is available at `/.netlify/functions/waitlist`
- Redirects in `netlify.toml` make `/api/waitlist` work as expected

### Build Process

- The build command runs `npm run build` which builds both client and server
- Only the client build (`dist/public`) is deployed to Netlify
- Netlify Functions are automatically built from `netlify/functions/`

## Troubleshooting

1. **Build fails:**
   - Make sure all dependencies are in `package.json`
   - Check that Node.js version matches (set to 20 in `netlify.toml`)

2. **Functions not working:**
   - Verify `@netlify/functions` is installed
   - Check function logs in Netlify dashboard

3. **API routes return 404:**
   - Verify redirects in `netlify.toml`
   - Check that functions are in `netlify/functions/` directory

## Next Steps

1. Set up a production database
2. Configure environment variables
3. Set up custom domain (optional)
4. Enable form notifications (if using Netlify Forms)
