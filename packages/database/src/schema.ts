import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 42 }).notNull().unique(),
  tier: text("tier", { enum: ["freemium", "premium"] }).default("freemium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  contractAddress: varchar("contract_address", { length: 42 }),
  repoUrl: text("repo_url"),
  locCount: integer("loc_count").notNull(),
  safetyScore: integer("safety_score"),
  reportUrl: text("report_url"),
  status: text("status", { enum: ["pending", "completed", "failed"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
