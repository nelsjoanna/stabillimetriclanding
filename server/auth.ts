import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Extend Express Request to include Passport methods
declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      login(user: User, callback: (err?: Error) => void): void;
      logout(callback: (err?: Error) => void): void;
    }
  }
}

const PgSession = connectPgSimple(session);

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher rounds = more secure but slower
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

// Session configuration
export function setupSession(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error(
      "SESSION_SECRET must be set in environment variables for secure sessions"
    );
  }

  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: "user_sessions", // Will be created automatically
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict", // CSRF protection
      },
      name: "sid", // Don't use default 'connect.sid' to avoid fingerprinting
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

import type { Request, Response, NextFunction } from "express";

// Extend Express Request to include Passport methods
declare global {
  namespace Express {
    interface User extends User {}
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      login(user: User, callback: (err?: Error) => void): void;
      logout(callback: (err?: Error) => void): void;
    }
  }
}

// Middleware to check if user is authenticated
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

// Middleware to check if user is not authenticated (for login/register pages)
export function requireGuest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(403).json({ error: "Already authenticated" });
  }
  return next();
}
