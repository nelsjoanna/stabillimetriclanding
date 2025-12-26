# Waitlist Database Setup

This guide ensures waitlist signup data is properly saved to Railway's PostgreSQL database.

## Current Implementation

The waitlist signup system automatically uses Railway's database when `DATABASE_URL` is set (which Railway does automatically).

### How It Works

1. **Storage Detection**: The app checks for `DATABASE_URL` environment variable
2. **Database Storage**: If `DATABASE_URL` is set, uses `DatabaseStorage` class
3. **Fallback**: If database is unavailable, falls back to in-memory storage (with warning)

### Database Schema

The `waitlist_signups` table includes:
- `id` - Unique identifier (UUID)
- `email` - Email address (required, unique)
- `name` - Full name (required)
- `phone_number` - Phone number (optional)
- `company_name` - Company name (required)
- `role` - User role (optional)
- `company_size` - Company size (optional)
- `is_pilot_partner` - Pilot partner flag (boolean)
- `created_at` - Timestamp

## Verifying Database Storage

### 1. Check Storage Type on Startup

When your app starts, look for this log message:
```
✅ Using database storage for waitlist signups
```

If you see:
```
⚠️  DATABASE_URL not set - using in-memory storage (data will not persist)
```

Then the database is not configured. Check Railway environment variables.

### 2. Verify Database Schema

Push the updated schema to Railway:

```bash
railway run npm run db:push
```

This will add the `name` and `phone_number` columns if they don't exist.

### 3. Test Waitlist Signup

Submit a form and check the logs:

```
✅ Waitlist signup saved to database: user@example.com
✅ Waitlist signup created: user@example.com (John Doe)
```

### 4. Query Database Directly

You can verify data is saved by querying the database:

```bash
railway run psql $DATABASE_URL -c "SELECT email, name, phone_number, company_name, created_at FROM waitlist_signups ORDER BY created_at DESC LIMIT 10;"
```

Or via Railway dashboard:
1. Go to PostgreSQL service
2. Click "Query" tab
3. Run: `SELECT * FROM waitlist_signups ORDER BY created_at DESC;`

## Troubleshooting

### Data Not Saving

1. **Check DATABASE_URL is set:**
   - Railway automatically sets this for PostgreSQL services
   - Verify in Railway dashboard: Service → Variables → `DATABASE_URL`

2. **Check database connection:**
   - Look for connection errors in Railway logs
   - Verify PostgreSQL service is running

3. **Check schema is up to date:**
   ```bash
   railway run npm run db:push
   ```

4. **Check application logs:**
   - Look for "✅ Using database storage" message
   - Look for "✅ Waitlist signup saved to database" messages
   - Check for any error messages

### Common Issues

**Issue**: "DATABASE_URL not set" warning
- **Solution**: Ensure PostgreSQL service is added and linked to your app service in Railway

**Issue**: "Failed to create waitlist signup" error
- **Solution**: Check database schema is up to date with `railway run npm run db:push`
- **Solution**: Verify all required fields (email, name, companyName) are being sent

**Issue**: Data appears in memory but not in database
- **Solution**: Check that `DATABASE_URL` is actually set in Railway
- **Solution**: Verify the storage instance is `DatabaseStorage`, not `MemStorage`

## Railway Configuration

### Automatic Setup

Railway automatically:
1. Sets `DATABASE_URL` when PostgreSQL service is added
2. Links the database to your application service
3. Provides connection pooling

### Manual Verification

1. Go to Railway project dashboard
2. Check your application service
3. Go to "Variables" tab
4. Verify `DATABASE_URL` is listed (it's automatically set)

## Data Persistence

✅ **With Database**: Data persists across deployments and restarts
❌ **Without Database**: Data is lost when the application restarts (in-memory only)

## Next Steps

1. **Deploy your application** - Railway will automatically use the database
2. **Push schema updates** - Run `railway run npm run db:push` after schema changes
3. **Monitor logs** - Check Railway logs to verify data is being saved
4. **Query database** - Use Railway's database query tool to view saved signups

Your waitlist signups are now being saved to Railway's PostgreSQL database! 🎉
