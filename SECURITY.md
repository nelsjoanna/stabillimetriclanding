# Security Implementation Guide

This document outlines the security measures implemented for www.stabilimetricpro.com.

## Security Features Implemented

### 1. Password Security
- **bcrypt hashing**: All passwords are hashed with bcrypt (12 rounds)
- **Password requirements**: Minimum 8 characters, alphanumeric + underscore for usernames
- **No plain text storage**: Passwords are never stored in plain text

### 2. Session Management
- **PostgreSQL session store**: Sessions stored in database (not memory)
- **Secure cookies**: 
  - `httpOnly: true` - Prevents XSS attacks
  - `secure: true` - HTTPS only in production
  - `sameSite: strict` - CSRF protection
  - 30-day expiration
- **Session secret**: Required environment variable

### 3. Security Headers (Helmet)
- **Content Security Policy**: Restricts resource loading
- **XSS Protection**: Built-in browser XSS filtering
- **Frame Options**: Prevents clickjacking
- **HSTS**: HTTP Strict Transport Security (when HTTPS enabled)

### 4. Rate Limiting
- **API endpoints**: 100 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes per IP
- **Waitlist**: 3 signups per hour per IP
- Prevents brute force and DDoS attacks

### 5. Input Validation
- **Zod schemas**: All inputs validated with Zod
- **SQL injection protection**: Using parameterized queries (Drizzle ORM)
- **Payload size limits**: 10MB max for JSON/URL-encoded data

### 6. Error Handling
- **No information leakage**: Generic error messages in production
- **Detailed logging**: Errors logged server-side only

### 7. Authentication Routes
- `/api/auth/register` - User registration (rate limited)
- `/api/auth/login` - User login (rate limited)
- `/api/auth/logout` - User logout
- `/api/auth/me` - Get current user (requires authentication)

## Required Environment Variables

```bash
# Database connection (required)
DATABASE_URL=postgresql://...

# Session secret (required for authentication)
SESSION_SECRET=your-secret-key-here-min-32-characters

# Node environment
NODE_ENV=production
```

## Setting Up SESSION_SECRET

Generate a secure random secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

Add to Railway environment variables:
1. Go to Railway project → Your service
2. Variables tab
3. Add `SESSION_SECRET` with your generated value

## HTTPS/SSL Configuration

### Railway Automatic HTTPS
Railway automatically provides HTTPS for your domain. Ensure:
1. Custom domain is configured in Railway
2. SSL certificate is provisioned (automatic)
3. `NODE_ENV=production` is set

### Domain Configuration
1. Add custom domain in Railway dashboard
2. Update DNS records as instructed
3. Railway handles SSL certificate automatically

## Security Checklist

- [x] Password hashing (bcrypt)
- [x] Secure session management
- [x] Security headers (Helmet)
- [x] Rate limiting
- [x] Input validation
- [x] Secure error handling
- [x] HTTPS enforcement (via Railway)
- [x] SQL injection protection
- [x] XSS protection
- [x] CSRF protection (via sameSite cookies)

## Additional Recommendations

### 1. Regular Security Updates
- Keep dependencies updated: `npm audit` and `npm update`
- Monitor security advisories

### 2. Monitoring
- Set up error tracking (e.g., Sentry)
- Monitor failed login attempts
- Track rate limit violations

### 3. Database Security
- Use connection pooling (already implemented)
- Regular backups
- Limit database user permissions

### 4. API Security
- Consider API keys for programmatic access
- Implement request signing for sensitive operations
- Add request logging for audit trails

### 5. Content Security
- Validate file uploads (if added)
- Sanitize user-generated content
- Implement file type restrictions

## Testing Security

### Test Rate Limiting
```bash
# Should fail after 5 attempts
for i in {1..6}; do
  curl -X POST https://www.stabilimetricpro.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
done
```

### Test Authentication
```bash
# Register
curl -X POST https://www.stabilimetricpro.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"securepass123"}' \
  -c cookies.txt

# Login
curl -X POST https://www.stabilimetricpro.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"securepass123"}' \
  -c cookies.txt

# Access protected route
curl https://www.stabilimetricpro.com/api/auth/me \
  -b cookies.txt
```

## Incident Response

If a security issue is discovered:
1. Immediately rotate `SESSION_SECRET`
2. Review access logs
3. Check for unauthorized access
4. Update affected passwords
5. Patch vulnerability
6. Notify affected users if necessary

## Contact

For security concerns, please contact the development team immediately.
