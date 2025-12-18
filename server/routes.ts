import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "./supabase";

// Demo accounts for testing
const DEMO_ACCOUNTS: Record<string, { password: string; role: string; id: string }> = {
  "demo.user@example.com": { password: "demo.user@example.com", role: "user", id: "user-demo-1" },
  "demo.parent@example.com": { password: "demo.parent@example.com", role: "parent", id: "parent-demo-1" },
  "demo.police@example.com": { password: "demo.police@example.com", role: "police", id: "police-demo-1" },
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post("/api/auth/profile", async (req, res) => {
    try {
      const body = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : error });
    }
  });

  app.get("/api/auth/profile/:id", async (req, res) => {
    try {
      const profile = await storage.getProfileById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/auth/profile-by-email", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: "Email query parameter required" });
      }
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  // Login endpoint - supports both demo and Supabase auth
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Check demo accounts first
      const demoAccount = DEMO_ACCOUNTS[email];
      if (demoAccount && demoAccount.password === password) {
        // Ensure profile exists for demo account
        let profile = await storage.getProfileById(demoAccount.id);
        if (!profile) {
          profile = await storage.createProfile({
            id: demoAccount.id,
            email,
            name: email.split('@')[0],
            role: demoAccount.role
          });
        }
        
        // Log activity
        await storage.createActivity({
          userId: demoAccount.id,
          role: demoAccount.role as "user" | "parent" | "police",
          activityType: 'login',
          description: `User logged in as ${demoAccount.role}`
        });
        
        return res.json({ success: true, profile });
      }

      // Try Supabase auth
      if (!supabase) {
        return res.status(400).json({ error: "Supabase not configured" });
      }
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!data.user) throw new Error("Login failed");

      // Get or create profile
      let profile = await storage.getProfileByEmail(email);
      if (!profile) {
        profile = await storage.createProfile({
          email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          role: role || data.user.user_metadata?.role || 'user'
        });
      }

      // Log activity
      await storage.createActivity({
        userId: data.user.id,
        role: profile.role,
        activityType: 'login',
        description: `User logged in as ${profile.role}`
      });

      res.json({ success: true, profile });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Login failed" });
    }
  });

  // Signup endpoint
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: "Missing required fields: email, password, name, role" });
      }

      // Create Supabase auth user
      if (!supabase) {
        return res.status(400).json({ error: "Supabase not configured" });
      }
      
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });

      if (authError) throw authError;
      if (!user) throw new Error("Failed to create user");

      // Create profile in database
      const profile = await storage.createProfile({
        email,
        name,
        role
      });

      // Log signup activity
      await storage.createActivity({
        userId: user.id,
        role,
        activityType: 'signup',
        description: `New ${role} account created`
      });

      res.json({ success: true, profile });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Signup failed" });
    }
  });

  // Activity routes
  app.post("/api/activity", async (req, res) => {
    try {
      const body = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity({
        ...body,
        role: body.role as "user" | "parent" | "police"
      });
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: error instanceof z.ZodError ? error.errors : error });
    }
  });

  app.get("/api/activity/user/:userId", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByUserId(req.params.userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  return httpServer;
}
