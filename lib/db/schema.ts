import { pgTable, text, timestamp, uuid, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(), // Link to Supabase Auth
  username: text("username").notNull(),
  role: text("role", { enum: ["frontend", "backend", "fullstack", "devops"] }).default("frontend"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty", { enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] }).notNull(),
  xpReward: integer("xp_reward").notNull(),
  starterCode: text("starter_code").notNull(),
  solutionCode: text("solution_code"),
  validationRules: jsonb("validation_rules").notNull(), // Custom rules for the validator
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["backlog", "in-progress", "review", "done"] }).default("backlog"),
  priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).default("medium"),
  labels: text("labels").array(),
  estimate: text("estimate"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id),
  scenarioId: uuid("scenario_id").references(() => scenarios.id),
  status: text("status", { enum: ["not-started", "in-progress", "completed"] }).default("not-started"),
  completedCheckpoints: text("completed_checkpoints").array(),
  currentCode: text("current_code"),
  lastAttemptAt: timestamp("last_attempt_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id),
  senderName: text("sender_name").notNull(), // NPC Name (e.g., "Sarah Chen")
  senderRole: text("sender_role").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
