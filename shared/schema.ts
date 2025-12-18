import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().$type<"user" | "parent" | "police">(),
  phoneNumber: text("phone_number"),
  location: text("location"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  contactDetails: text("contact_details"),
  parentInfo: jsonb("parent_info").$type<{ name?: string; email?: string; phone?: string } | null>(),
  emergencyContact: text("emergency_contact"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const emergencyAlerts = pgTable("emergency_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => profiles.id),
  userName: text("user_name").notNull(),
  userPhone: text("user_phone"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: numeric("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  status: text("status").notNull().$type<"active" | "resolved">().default("active"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => profiles.id),
  role: text("role").notNull().$type<"user" | "parent" | "police">(),
  activityType: text("activity_type").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const meetings = pgTable("meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  meetCode: varchar("meet_code").notNull().unique(),
  createdByUserId: varchar("created_by_user_id").notNull().references(() => profiles.id),
  createdByName: text("created_by_name").notNull(),
  status: text("status").notNull().$type<"active" | "ended">().default("active"),
  participants: jsonb("participants").$type<Array<{ userId: string; name: string; joinedAt: string }>>().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  endedAt: timestamp("ended_at"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const settingsSchema = z.object({
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  contactDetails: z.string().optional(),
  parentInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
  emergencyContact: z.string().optional(),
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  endedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type Settings = z.infer<typeof settingsSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
