import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSignupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for model signups
  app.post("/api/signups", async (req, res) => {
    try {
      const signupData = insertSignupSchema.parse(req.body);
      const signup = await storage.createSignup(signupData);
      res.json({ success: true, signup });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid form data", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Failed to submit signup" 
        });
      }
    }
  });

  // API route to get all signups (for admin purposes)
  app.get("/api/signups", async (req, res) => {
    try {
      const signups = await storage.getSignups();
      res.json({ success: true, signups });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch signups" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
