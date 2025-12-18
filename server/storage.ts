import { db } from "./db";
import { profiles, activities, emergencyAlerts, meetings } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { InsertProfile, InsertActivity, Profile, Activity, EmergencyAlert, InsertEmergencyAlert, Meeting, InsertMeeting } from "@shared/schema";

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
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  getMeetingByCode(meetCode: string): Promise<Meeting | undefined>;
  addMeetingParticipant(meetId: string, userId: string, userName: string): Promise<Meeting | undefined>;
  endMeeting(meetId: string): Promise<Meeting | undefined>;
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

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const result = await db.insert(meetings).values(meeting as any).returning();
    return result[0];
  }

  async getMeetingByCode(meetCode: string): Promise<Meeting | undefined> {
    const result = await db.select().from(meetings).where(eq(meetings.meetCode, meetCode));
    return result[0];
  }

  async addMeetingParticipant(meetId: string, userId: string, userName: string): Promise<Meeting | undefined> {
    const meeting = await db.select().from(meetings).where(eq(meetings.id, meetId));
    if (!meeting[0]) return undefined;

    const currentParticipants = meeting[0].participants || [];
    const newParticipant = { userId, name: userName, joinedAt: new Date().toISOString() };
    
    const result = await db
      .update(meetings)
      .set({ participants: [...currentParticipants, newParticipant] as any })
      .where(eq(meetings.id, meetId))
      .returning();
    return result[0];
  }

  async endMeeting(meetId: string): Promise<Meeting | undefined> {
    const result = await db
      .update(meetings)
      .set({ status: "ended", endedAt: new Date() })
      .where(eq(meetings.id, meetId))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
