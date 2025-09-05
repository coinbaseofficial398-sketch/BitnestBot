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

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productType: text("product_type").notNull(), // 'BitNest Loop' or 'BitNest Savings'
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // days
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(), // annual percentage yield
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  dailyReturn: decimal("daily_return", { precision: 18, scale: 8 }).notNull(),
  totalReturns: decimal("total_returns", { precision: 18, scale: 2 }).default("0"),
  lastProcessedDate: timestamp("last_processed_date").defaultNow(),
  transactionHash: text("transaction_hash"),
  paymentWallet: text("payment_wallet").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyReturns = pgTable("daily_returns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investmentId: varchar("investment_id").references(() => investments.id).notNull(),
  date: timestamp("date").notNull(),
  returnAmount: decimal("return_amount", { precision: 18, scale: 8 }).notNull(),
  processed: boolean("processed").default(false),
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

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
  lastProcessedDate: true,
  totalReturns: true,
});

export const insertDailyReturnSchema = createInsertSchema(dailyReturns).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBotStats = z.infer<typeof insertBotStatsSchema>;
export type BotStats = typeof botStats.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertDailyReturn = z.infer<typeof insertDailyReturnSchema>;
export type DailyReturn = typeof dailyReturns.$inferSelect;
