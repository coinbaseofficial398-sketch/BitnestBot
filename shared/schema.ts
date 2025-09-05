import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  walletAddress: text("wallet_address"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participants: integer("participants").notNull().default(0),
  participantIncome: decimal("participant_income", { precision: 18, scale: 2 }).notNull().default("0"),
  liquidity: decimal("liquidity", { precision: 18, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  period: integer("period").notNull(),
  productType: text("product_type").notNull(),
  estimatedReturn: decimal("estimated_return", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBotStatsSchema = createInsertSchema(botStats).omit({
  id: true,
  updatedAt: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBotStats = z.infer<typeof insertBotStatsSchema>;
export type BotStats = typeof botStats.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
