# Verify Waitlist Database Setup

## Quick Verification Steps

### 1. Check Health Endpoint

After deployment, visit:
```
https://www.stabilimetricpro.com/api/health
```

**Expected response (with database):**
```json
{
  "status": "healthy",
  "storage": "database",
  "database": "connected",
  "timestamp": "2024-12-26T..."
}
```

**If you see:**
```json
{
  "status": "healthy",
  "storage": "memory",
  "database": "not_configured"
}
```

Then `DATABASE_URL` is not set. Check Railway configuration.

### 2. Check Application Logs

In Railway dashboard → Your service → Logs, look for:

**✅ Good signs:**
```
✅ DATABASE_URL detected - using database storage
✅ Waitlist signups will be saved to Railway PostgreSQL
✅ Using database storage for waitlist signups
```

**❌ Warning signs:**
```
⚠️  DATABASE_URL not set - using in-memory storage
⚠️  Waitlist signups will NOT persist (data lost on restart)
```

### 3. Test Waitlist Signup

1. Submit the waitlist form on your website
2. Check Railway logs for:
   ```
   ✅ Waitlist signup saved to database: user@example.com
   ✅ Waitlist signup created: user@example.com (John Doe)
   ```

### 4. Verify Data in Database

**Via Railway CLI:**
```bash
railway run psql $DATABASE_URL -c "SELECT email, name, phone_number, company_name, created_at FROM waitlist_signups ORDER BY created_at DESC LIMIT 5;"
```

**Via Railway Dashboard:**
1. Go to PostgreSQL service
2. Click "Query" tab
3. Run: `SELECT * FROM waitlist_signups ORDER BY created_at DESC;`

## Current Status

✅ **Schema updated** - Includes `name` and `phone_number` fields
✅ **Component updated** - Form collects name and phone number
✅ **Storage configured** - Uses database when `DATABASE_URL` is set
✅ **Logging added** - Shows when data is saved to database
✅ **Health check** - `/api/health` endpoint to verify connectivity

## Next Step: Push Schema

Run this to add the new columns to your database:

```bash
railway run npm run db:push
```

This will add:
- `name` column (required)
- `phone_number` column (optional)

After this, all waitlist signups will be saved to Railway's PostgreSQL database! 🎉
