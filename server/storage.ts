import { type User, type InsertUser, type BotStats, type InsertBotStats, type Calculation, type InsertCalculation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Bot stats operations
  getBotStats(): Promise<BotStats>;
  updateBotStats(stats: InsertBotStats): Promise<BotStats>;
  
  // Calculations operations
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getUserCalculations(userId: string): Promise<Calculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private botStats: BotStats;
  private calculations: Map<string, Calculation>;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    
    // Initialize with real data from BitNest Finance
    this.botStats = {
      id: randomUUID(),
      participants: 1447639,
      participantIncome: "377536290.00",
      liquidity: "22673861.00",
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      username: insertUser.username || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      walletAddress: insertUser.walletAddress || null,
      id, 
      createdAt: new Date(),
      isActive: true 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBotStats(): Promise<BotStats> {
    // Update liquidity with live data from the specified wallet
    try {
      const { walletService } = await import('./services/walletService');
      const liveLiquidity = await walletService.getLiquidityBalance();
      this.botStats.liquidity = liveLiquidity;
      this.botStats.updatedAt = new Date();
    } catch (error: any) {
      console.log('Could not fetch live liquidity, using cached value');
    }
    return this.botStats;
  }

  async updateBotStats(stats: InsertBotStats): Promise<BotStats> {
    this.botStats = {
      ...this.botStats,
      ...stats,
      updatedAt: new Date(),
    };
    return this.botStats;
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = {
      ...insertCalculation,
      userId: insertCalculation.userId || null,
      id,
      createdAt: new Date(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getUserCalculations(userId: string): Promise<Calculation[]> {
    return Array.from(this.calculations.values()).filter(
      (calc) => calc.userId === userId
    );
  }
}

export const storage = new MemStorage();
