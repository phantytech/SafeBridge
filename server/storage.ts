import { db } from "./db";
import { profiles, activities, emergencyAlerts } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { InsertProfile, InsertActivity, Profile, Activity, EmergencyAlert, InsertEmergencyAlert } from "@shared/schema";

export interface IStorage {
  createProfile(profile: InsertProfile & { id?: string }): Promise<Profile>;
  getProfileById(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  createActivity(activity: InsertActivity & { role: "user" | "parent" | "police" }): Promise<Activity>;
  getActivitiesByUserId(userId: string): Promise<Activity[]>;
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getEmergencyAlerts(limit?: number): Promise<EmergencyAlert[]>;
  resolveEmergencyAlert(id: string): Promise<EmergencyAlert | undefined>;
}

class DbStorage implements IStorage {
  async createProfile(profile: InsertProfile & { id?: string }): Promise<Profile> {
    const result = await db.insert(profiles).values(profile as any).returning();
    return result[0];
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email));
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() } as any)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }

  async createActivity(activity: InsertActivity & { role: "user" | "parent" | "police" }): Promise<Activity> {
    const result = await db.insert(activities).values(activity as any).returning();
    return result[0];
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    const result = await db.select().from(activities).where(eq(activities.userId, userId));
    return result;
  }

  async createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const result = await db.insert(emergencyAlerts).values(alert as any).returning();
    return result[0];
  }

  async getEmergencyAlerts(limit: number = 50): Promise<EmergencyAlert[]> {
    const result = await db
      .select()
      .from(emergencyAlerts)
      .orderBy(desc(emergencyAlerts.createdAt))
      .limit(limit);
    return result;
  }

  async resolveEmergencyAlert(id: string): Promise<EmergencyAlert | undefined> {
    const result = await db
      .update(emergencyAlerts)
      .set({ status: "resolved", resolvedAt: new Date() })
      .where(eq(emergencyAlerts.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
