import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSignupSchema } from "@shared/schema";
import { z } from "zod";
import { waitlistLimiter } from "./security";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check endpoint to verify database connectivity
  app.get("/api/health", async (_req, res) => {
    try {
      const isDatabase = process.env.DATABASE_URL ? true : false;
      const storageType = process.env.DATABASE_URL ? "database" : "memory";
      
      // Try to query database if available
      if (isDatabase) {
        try {
          await storage.getAllWaitlistSignups();
          return res.json({
            status: "healthy",
            storage: storageType,
            database: "connected",
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          return res.status(503).json({
            status: "degraded",
            storage: storageType,
            database: "connection_error",
            error: process.env.NODE_ENV === "production" ? "Database error" : String(error),
            timestamp: new Date().toISOString(),
          });
        }
      }
      
      return res.json({
        status: "healthy",
        storage: storageType,
        database: "not_configured",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  app.post("/api/waitlist", waitlistLimiter, async (req, res) => {
    try {
      const parsed = insertWaitlistSignupSchema.parse(req.body);
      
      const existing = await storage.getWaitlistSignupByEmail(parsed.email);
      if (existing) {
        return res.status(409).json({ 
          error: "This email is already on the waitlist" 
        });
      }
      
      const signup = await storage.createWaitlistSignup(parsed);
      console.log(`✅ Waitlist signup created: ${signup.email} (${signup.name})`);
      return res.status(201).json(signup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      console.error("❌ Waitlist signup error:", error);
      return res.status(500).json({ error: "Failed to process signup" });
    }
  });

  app.get("/api/waitlist", async (_req, res) => {
    try {
      const signups = await storage.getAllWaitlistSignups();
      return res.json(signups);
    } catch (error) {
      console.error("Fetch waitlist error:", error);
      return res.status(500).json({ error: "Failed to fetch signups" });
    }
  });

  return httpServer;
}
