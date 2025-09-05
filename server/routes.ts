import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramBot } from "./services/telegramBot";
import { walletService } from "./services/walletService";
import { investmentService, INVESTMENT_PRODUCTS } from "./services/investmentService";
import { insertCalculationSchema, insertInvestmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot stats endpoint
  app.get("/api/bot/stats", async (req, res) => {
    try {
      const stats = await storage.getBotStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bot stats" });
    }
  });

  // Update bot stats (admin endpoint)
  app.post("/api/bot/stats", async (req, res) => {
    try {
      const stats = await storage.updateBotStats(req.body);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bot stats" });
    }
  });

  // User endpoints
  app.get("/api/users/:telegramId", async (req, res) => {
    try {
      const user = await storage.getUserByTelegramId(req.params.telegramId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Wallet connection endpoints
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { userId, walletType, address, chainId } = req.body;
      
      if (!await walletService.validateWalletAddress(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const connection = await walletService.connectWallet(userId, walletType, address, chainId);
      
      // Update user with wallet address
      await storage.updateUser(userId, { walletAddress: address });
      
      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  });

  app.post("/api/wallet/disconnect", async (req, res) => {
    try {
      const { userId } = req.body;
      const success = await walletService.disconnectWallet(userId);
      
      if (success) {
        // Remove wallet address from user
        await storage.updateUser(userId, { walletAddress: undefined });
      }
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect wallet" });
    }
  });

  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const connection = await walletService.getWalletConnection(req.params.userId);
      res.json(connection || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet connection" });
    }
  });

  // Investment calculator endpoint
  app.post("/api/calculate", async (req, res) => {
    try {
      const result = insertCalculationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid calculation data", details: result.error });
      }

      const { amount, period, productType } = result.data;
      
      // Calculate returns based on product type and period
      const apyRates = {
        'BitNest Savings': 0.065, // 6.5% average
        'BitNest Loop': 0.10,     // 10% average
        'BitNest Lease': 0.125    // 12.5% average
      };
      
      const apy = apyRates[productType as keyof typeof apyRates] || 0.065;
      const dailyRate = apy / 365;
      const estimatedReturn = parseFloat(amount) * dailyRate * period;
      
      const calculationData = {
        ...result.data,
        estimatedReturn: estimatedReturn.toFixed(2)
      };
      
      const calculation = await storage.createCalculation(calculationData);
      
      res.json({
        calculation,
        totalValue: (parseFloat(amount) + estimatedReturn).toFixed(2),
        apy: (apy * 100).toFixed(1)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate returns" });
    }
  });

  // Get user calculations
  app.get("/api/calculations/:userId", async (req, res) => {
    try {
      const calculations = await storage.getUserCalculations(req.params.userId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  // Bot message endpoint for web interface
  app.post("/api/bot/message", async (req, res) => {
    try {
      const { chatId, message, options } = req.body;
      const result = await telegramBot.sendMessage(chatId, message, options);
      res.json({ success: true, messageId: result.message_id });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Payment processing endpoint
  app.post("/api/payment/process", async (req, res) => {
    try {
      const { amount, token } = req.body;
      
      if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: "Invalid payment amount" });
      }

      const success = await walletService.processPayment({
        recipientAddress: walletService.getPaymentWallet(),
        amount,
        token
      });

      if (success) {
        res.json({ 
          success: true, 
          message: "Payment processed successfully",
          recipient: "Payment wallet (hidden for security)"
        });
      } else {
        res.status(500).json({ error: "Payment processing failed" });
      }
    } catch (error) {
      res.status(500).json({ error: "Payment processing error" });
    }
  });

  // Get liquidity data endpoint
  app.get("/api/liquidity", async (req, res) => {
    try {
      const balance = await walletService.getLiquidityBalance();
      const txCount = await walletService.getBSCTransactionCount(walletService.getLiquidityWallet());
      res.json({ 
        balance,
        wallet: walletService.getLiquidityWallet(),
        network: "BSC",
        transactionCount: txCount,
        bscscanUrl: `https://bscscan.com/address/${walletService.getLiquidityWallet()}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch liquidity data" });
    }
  });

  // Investment endpoints
  app.get("/api/investments/products", (req, res) => {
    res.json(INVESTMENT_PRODUCTS);
  });

  app.post("/api/investments/create", async (req, res) => {
    try {
      const { userId, productType, amount, walletAddress } = req.body;
      
      if (!userId || !productType || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create investment
      const investmentData = await investmentService.createInvestment(
        userId,
        productType,
        parseFloat(amount),
        walletAddress
      );
      
      const investment = await storage.createInvestment(investmentData);
      
      // Process payment automatically
      const txHash = await investmentService.processPayment(
        investment,
        walletAddress || '0x742d35Cc6BF4532A8B1B2f9e4a1234567890A4B8'
      );
      
      // Update with transaction hash
      const updatedInvestment = await storage.updateInvestment(investment.id, {
        transactionHash: txHash
      });
      
      res.json({
        investment: updatedInvestment,
        transactionHash: txHash,
        message: "Investment created and payment processed automatically"
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/investments/user/:userId", async (req, res) => {
    try {
      const investments = await storage.getUserInvestments(req.params.userId);
      
      const enrichedInvestments = investments.map(inv => ({
        ...inv,
        daysRemaining: investmentService.getDaysRemaining(inv),
        status: investmentService.getInvestmentStatus(inv),
        totalExpectedReturn: investmentService.calculateTotalReturns(inv)
      }));
      
      res.json(enrichedInvestments);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch user investments" });
    }
  });

  app.get("/api/investments/:id", async (req, res) => {
    try {
      const investment = await storage.getInvestment(req.params.id);
      if (!investment) {
        return res.status(404).json({ error: "Investment not found" });
      }
      
      const enrichedInvestment = {
        ...investment,
        daysRemaining: investmentService.getDaysRemaining(investment),
        status: investmentService.getInvestmentStatus(investment),
        totalExpectedReturn: investmentService.calculateTotalReturns(investment)
      };
      
      res.json(enrichedInvestment);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch investment" });
    }
  });

  // Auto-sign wallet transactions
  app.post("/api/wallet/auto-sign", async (req, res) => {
    try {
      const { userId, transactionData, walletAddress } = req.body;
      
      // Validate wallet address
      if (!await walletService.validateWalletAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      // In a real implementation, this would interact with the user's connected wallet
      // to automatically sign transactions for BitNest investments
      const mockSignature = `0x${Math.random().toString(16).substring(2, 130)}`;
      
      res.json({
        success: true,
        signature: mockSignature,
        message: "Transaction automatically signed for BitNest investment",
        paymentWallet: walletService.getPaymentWallet()
      });
      
    } catch (error: any) {
      res.status(500).json({ error: "Auto-signing failed" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      bot: "active",
      walletconnect: "enabled",
      investments: "active",
      autoSigning: "enabled"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
