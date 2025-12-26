# User Authentication Guide

This guide explains how to use the secure authentication system for www.stabilimetricpro.com.

## Authentication Endpoints

### 1. Register New User
**POST** `/api/auth/register`

Creates a new user account with a hashed password.

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Requirements:**
- Username: 3-50 characters, alphanumeric + underscore only
- Password: Minimum 8 characters, maximum 100 characters

**Response (201):**
```json
{
  "id": "user-uuid",
  "username": "johndoe"
}
```

**Errors:**
- `400` - Invalid input data
- `409` - Username already taken
- `429` - Too many requests (rate limited to 5 per 15 minutes)

### 2. Login
**POST** `/api/auth/login`

Authenticates a user and creates a session.

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "id": "user-uuid",
  "username": "johndoe"
}
```

**Errors:**
- `401` - Invalid credentials
- `429` - Too many requests (rate limited to 5 per 15 minutes)

### 3. Logout
**POST** `/api/auth/logout`

Destroys the current session and logs out the user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Requires:** Authentication

### 4. Get Current User
**GET** `/api/auth/me`

Returns the currently authenticated user.

**Response (200):**
```json
{
  "id": "user-uuid",
  "username": "johndoe"
}
```

**Errors:**
- `401` - Not authenticated

**Requires:** Authentication

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 12 rounds
- Passwords are never stored in plain text
- Passwords are never returned in API responses

### Session Security
- Sessions stored in PostgreSQL database (not memory)
- Secure cookies with:
  - `httpOnly: true` - Prevents XSS attacks
  - `secure: true` - HTTPS only in production
  - `sameSite: strict` - CSRF protection
  - 30-day expiration

### Rate Limiting
- Registration: 5 attempts per 15 minutes per IP
- Login: 5 attempts per 15 minutes per IP
- Prevents brute force attacks

## Frontend Integration

### Example: Register User

```typescript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookies
  body: JSON.stringify({
    username: "johndoe",
    password: "securepassword123",
  }),
});

if (response.ok) {
  const user = await response.json();
  console.log("Registered:", user);
}
```

### Example: Login

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookies
  body: JSON.stringify({
    username: "johndoe",
    password: "securepassword123",
  }),
});

if (response.ok) {
  const user = await response.json();
  console.log("Logged in:", user);
}
```

### Example: Check Authentication Status

```typescript
const response = await fetch("/api/auth/me", {
  credentials: "include", // Important for cookies
});

if (response.ok) {
  const user = await response.json();
  console.log("Authenticated as:", user);
} else {
  console.log("Not authenticated");
}
```

### Example: Logout

```typescript
const response = await fetch("/api/auth/logout", {
  method: "POST",
  credentials: "include", // Important for cookies
});

if (response.ok) {
  console.log("Logged out");
}
```

## React Query Integration

You can use React Query for authentication state management:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Login mutation
const loginMutation = useMutation({
  mutationFn: async (data: { username: string; password: string }) => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  },
});

// Get current user
const { data: user } = useQuery({
  queryKey: ["auth", "me"],
  queryFn: async () => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
  retry: false,
});

// Logout mutation
const logoutMutation = useMutation({
  mutationFn: async () => {
    await apiRequest("POST", "/api/auth/logout");
  },
  onSuccess: () => {
    queryClient.setQueryData(["auth", "me"], null);
  },
});
```

## Environment Setup

### Required Environment Variables

```bash
# Database connection (required for authentication)
DATABASE_URL=postgresql://...

# Session secret (required for secure sessions)
SESSION_SECRET=your-secret-key-min-32-characters

# Node environment
NODE_ENV=production
```

### Generate SESSION_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## Database Setup

The authentication system requires the following database tables:

1. **users** - User accounts (created automatically via schema)
2. **user_sessions** - Session storage (created automatically by connect-pg-simple)

Run database migrations:
```bash
npm run db:push
```

## Testing Authentication

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt

# Get current user
curl http://localhost:5000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## Security Best Practices

1. **Never store passwords in plain text** ✅ (Already implemented)
2. **Use HTTPS in production** ✅ (Railway provides this)
3. **Validate all inputs** ✅ (Zod validation implemented)
4. **Rate limit authentication endpoints** ✅ (Implemented)
5. **Use secure session cookies** ✅ (Implemented)
6. **Hash passwords with bcrypt** ✅ (12 rounds implemented)
7. **Store sessions in database** ✅ (PostgreSQL store implemented)

## Troubleshooting

### "Authentication required" error
- Ensure you're sending cookies with requests (`credentials: "include"`)
- Check that session cookie is being set
- Verify SESSION_SECRET is configured

### "Too many requests" error
- You've hit the rate limit (5 attempts per 15 minutes)
- Wait 15 minutes or use a different IP address

### Session not persisting
- Check that cookies are enabled in browser
- Verify `sameSite` and `secure` cookie settings match your setup
- Ensure DATABASE_URL is set for session storage

## Next Steps

1. Set `SESSION_SECRET` in Railway environment variables
2. Deploy your application
3. Test authentication endpoints
4. Integrate authentication into your frontend
5. Add protected routes that require authentication
