import { type User, type InsertUser, type BotStats, type InsertBotStats, type Calculation, type InsertCalculation, type Investment, type InsertInvestment, type DailyReturn, type InsertDailyReturn } from "@shared/schema";
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
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getUserInvestments(userId: string): Promise<Investment[]>;
  getInvestment(id: string): Promise<Investment | undefined>;
  updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | undefined>;
  
  // Daily returns operations
  createDailyReturn(dailyReturn: InsertDailyReturn): Promise<DailyReturn>;
  getInvestmentReturns(investmentId: string): Promise<DailyReturn[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private botStats: BotStats;
  private calculations: Map<string, Calculation>;
  private investments: Map<string, Investment>;
  private dailyReturns: Map<string, DailyReturn>;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.investments = new Map();
    this.dailyReturns = new Map();
    
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

  // Investment operations
  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = randomUUID();
    const investment: Investment = {
      ...insertInvestment,
      id,
      startDate: insertInvestment.startDate || new Date(),
      lastProcessedDate: new Date(),
      totalReturns: "0",
      createdAt: new Date(),
    };
    this.investments.set(id, investment);
    return investment;
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (inv) => inv.userId === userId
    );
  }

  async getInvestment(id: string): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;
    
    const updatedInvestment = { ...investment, ...updates };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Daily returns operations
  async createDailyReturn(insertDailyReturn: InsertDailyReturn): Promise<DailyReturn> {
    const id = randomUUID();
    const dailyReturn: DailyReturn = {
      ...insertDailyReturn,
      id,
      createdAt: new Date(),
    };
    this.dailyReturns.set(id, dailyReturn);
    return dailyReturn;
  }

  async getInvestmentReturns(investmentId: string): Promise<DailyReturn[]> {
    return Array.from(this.dailyReturns.values()).filter(
      (ret) => ret.investmentId === investmentId
    );
  }
}

export const storage = new MemStorage();
