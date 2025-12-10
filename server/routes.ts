import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSignupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/waitlist", async (req, res) => {
    try {
      const parsed = insertWaitlistSignupSchema.parse(req.body);
      
      const existing = await storage.getWaitlistSignupByEmail(parsed.email);
      if (existing) {
        return res.status(409).json({ 
          error: "This email is already on the waitlist" 
        });
      }
      
      const signup = await storage.createWaitlistSignup(parsed);
      return res.status(201).json(signup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      console.error("Waitlist signup error:", error);
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
