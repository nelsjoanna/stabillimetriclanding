import type { Express, Request, Response } from "express";
import passport from "passport";
import { z } from "zod";
import { insertUserSchema, type User } from "@shared/schema";
import { storage } from "./storage";
import { hashPassword } from "./auth";
import { requireGuest, requireAuth } from "./auth";
import { authLimiter } from "./security";

const registerSchema = insertUserSchema.extend({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100),
});

export function registerAuthRoutes(app: Express) {
  // Register new user
  app.post(
    "/api/auth/register",
    requireGuest,
    authLimiter,
    async (req: Request, res: Response) => {
      try {
        const parsed = registerSchema.parse(req.body);

        // Check if user already exists
        const existing = await storage.getUserByUsername(parsed.username);
        if (existing) {
          return res.status(409).json({
            error: "Username already taken",
          });
        }

        // Hash password before storing
        const hashedPassword = await hashPassword(parsed.password);

        // Create user with hashed password
        const user = await storage.createUser({
          username: parsed.username,
          password: hashedPassword,
        });

        // Auto-login after registration
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to create session" });
          }
          return res.status(201).json({
            id: user.id,
            username: user.username,
          });
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            error: "Invalid registration data",
            details: error.errors,
          });
        }
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Failed to register user" });
      }
    }
  );

  // Login
  app.post(
    "/api/auth/login",
    requireGuest,
    authLimiter,
    (req: Request, res: Response, next) => {
      passport.authenticate("local", (err: Error | null, user: User | false, info: any) => {
        if (err) {
          return res.status(500).json({ error: "Authentication error" });
        }
        if (!user) {
          return res.status(401).json({
            error: info?.message || "Invalid credentials",
          });
        }
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to create session" });
          }
          return res.json({
            id: user.id,
            username: user.username,
          });
        });
      })(req, res, next);
    }
  );

  // Logout
  app.post("/api/auth/logout", requireAuth, (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to destroy session" });
        }
        res.clearCookie("sid");
        return res.json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    if (req.user) {
      return res.json({
        id: req.user.id,
        username: req.user.username,
      });
    }
    return res.status(401).json({ error: "Not authenticated" });
  });
}
