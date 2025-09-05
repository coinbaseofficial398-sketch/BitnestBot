import TelegramBot from 'node-telegram-bot-api';
import { storage } from '../storage';
import { investmentService, INVESTMENT_PRODUCTS } from './investmentService';
import { walletService } from './walletService';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8467427685:AAFTAfE2DQBaxZSciIaTGkxokwWNr7SyX0E';

export class BitNestTelegramBot {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
    this.setupCommands();
    this.setupCallbacks();
  }

  private setupCommands() {
    // Set bot commands
    this.bot.setMyCommands([
      { command: 'start', description: 'Initialize bot and show welcome message' },
      { command: 'help', description: 'Display all available commands and usage' },
      { command: 'products', description: 'Show BitNest Loop, Savings, Lease products' },
      { command: 'wallet', description: 'Connect crypto wallet (MetaMask, WalletConnect)' },
      { command: 'stats', description: 'View real-time platform statistics' },
      { command: 'calculate', description: 'Investment calculator for potential returns' },
      { command: 'faq', description: 'Frequently asked questions' },
      { command: 'community', description: 'Join our community channels' }
    ]);

    // Start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const user = msg.from;

      if (user) {
        // Create or update user in storage
        let existingUser = await storage.getUserByTelegramId(user.id.toString());
        if (!existingUser) {
          await storage.createUser({
            telegramId: user.id.toString(),
            username: user.username || undefined,
            firstName: user.first_name || undefined,
            lastName: user.last_name || undefined,
          });
        }
      }

      const welcomeMessage = `🏠 *Welcome to BitNest Finance!*

Explore our DeFi ecosystem with zero-risk financial services.

BitNest is a decentralized finance (DeFi) platform providing secure, transparent, and inclusive financial services through blockchain technology.

*Quick Actions:*`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '📊 View Stats', callback_data: 'stats' },
            { text: '💰 Products', callback_data: 'products' }
          ],
          [
            { text: '🔗 Connect Wallet', callback_data: 'wallet' },
            { text: '🧮 Calculator', callback_data: 'calculate' }
          ],
          [
            { text: '❓ FAQ', callback_data: 'faq' },
            { text: '👥 Community', callback_data: 'community' }
          ]
        ]
      };

      this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `*BitNest Finance Bot Commands:*

/start - Initialize bot and show welcome message
/help - Display this help message
/products - Show BitNest products (Loop, Savings, Lease)
/wallet - Connect your crypto wallet
/stats - View real-time platform statistics
/calculate - Investment returns calculator
/faq - Frequently asked questions
/community - Join our community channels

*Navigation:*
Use the inline buttons for quick access to features, or type commands directly.

*Support:*
Join our Telegram groups for community support and updates.`;

      this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    });

    // Products command
    this.bot.onText(/\/products/, (msg) => {
      this.sendProductsInfo(msg.chat.id);
    });

    // Stats command
    this.bot.onText(/\/stats/, async (msg) => {
      await this.sendStatsInfo(msg.chat.id);
    });

    // Wallet command
    this.bot.onText(/\/wallet/, (msg) => {
      this.sendWalletInfo(msg.chat.id);
    });

    // Calculate command
    this.bot.onText(/\/calculate/, (msg) => {
      this.sendCalculatorInfo(msg.chat.id);
    });

    // FAQ command
    this.bot.onText(/\/faq/, (msg) => {
      this.sendFAQInfo(msg.chat.id);
    });

    // Community command
    this.bot.onText(/\/community/, (msg) => {
      this.sendCommunityInfo(msg.chat.id);
    });
  }

  private setupCallbacks() {
    this.bot.on('callback_query', async (callbackQuery) => {
      const msg = callbackQuery.message;
      const data = callbackQuery.data;
      const chatId = msg?.chat.id;

      if (!chatId) return;

      // Answer callback query to remove loading state
      this.bot.answerCallbackQuery(callbackQuery.id);

      switch (data) {
        case 'stats':
          await this.sendStatsInfo(chatId);
          break;
        case 'products':
          this.sendProductsInfo(chatId);
          break;
        case 'wallet':
          this.sendWalletInfo(chatId);
          break;
        case 'calculate':
          this.sendCalculatorInfo(chatId);
          break;
        case 'faq':
          this.sendFAQInfo(chatId);
          break;
        case 'community':
          this.sendCommunityInfo(chatId);
          break;
        case 'loop':
          this.sendInvestmentOptions(chatId, 'BitNest Loop');
          break;
        case 'savings':
          this.sendInvestmentOptions(chatId, 'BitNest Savings');
          break;
        case 'invest_loop':
          this.handleInvestmentFlow(chatId, 'BitNest Loop', callbackQuery.from?.id.toString());
          break;
        case 'invest_savings':
          this.handleInvestmentFlow(chatId, 'BitNest Savings', callbackQuery.from?.id.toString());
          break;
        case 'my_investments':
          this.showUserInvestments(chatId, callbackQuery.from?.id.toString());
          break;
        case 'lease':
          this.sendProductDetail(chatId, 'lease');
          break;
        case 'wallet_connect':
          this.sendProductDetail(chatId, 'wallet');
          break;
        case 'wallet_connect_qr':
          this.sendWalletConnectQR(chatId);
          break;
        case 'home':
          this.sendHomeMessage(chatId);
          break;
      }
    });
  }

  private sendProductsInfo(chatId: number) {
    const message = `*🔄 BitNest Products & Services:*

Our decentralized finance ecosystem offers multiple zero-risk investment opportunities:`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🔄 BitNest Loop', callback_data: 'loop' }],
        [{ text: '💳 BitNest Savings', callback_data: 'savings' }],
        [{ text: '🏠 BitNest Lease', callback_data: 'lease' }],
        [{ text: '📱 BitNest Wallet', callback_data: 'wallet' }],
        [{ text: '🌐 Visit Website', url: 'https://www.bitnest.finance' }],
        [
          { text: '🏠 Home', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private async sendStatsInfo(chatId: number) {
    const stats = await storage.getBotStats();
    
    const message = `*📊 BitNest Finance Live Statistics:*

👥 *Participants:* ${Number(stats.participants).toLocaleString()}
💰 *Participant Income:* ${Number(stats.participantIncome).toLocaleString()} USDT
🌊 *Liquidity:* ${Number(stats.liquidity).toLocaleString()} USDT

*Last Updated:* ${stats.updatedAt.toLocaleString()}

These numbers represent real-time data from our decentralized ecosystem.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🔄 Refresh Stats', callback_data: 'stats' }],
        [{ text: '💰 View Products', callback_data: 'products' }],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendWalletInfo(chatId: number) {
    const message = `*🔗 Wallet Connection:*

Connect your cryptocurrency wallet to access BitNest DeFi features:

*Supported Wallets:*
• MetaMask (Browser extension & Mobile)
• Trust Wallet (Mobile)
• Coinbase Wallet (Mobile)
• Rainbow Wallet (Mobile)
• WalletConnect (Universal)

*Benefits:*
• Secure transactions
• Access to all DeFi products
• Real-time portfolio tracking
• Zero-risk investment options`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🦊 MetaMask Mobile', url: 'https://metamask.app.link/dapp/bitnest.finance' },
          { text: '🛡️ Trust Wallet', url: 'https://link.trustwallet.com/open_url?coin_id=60&url=https://bitnest.finance' }
        ],
        [
          { text: '🌈 Rainbow', url: 'https://rnbwapp.com/link?url=https://bitnest.finance' },
          { text: '💙 Coinbase Wallet', url: 'https://go.cb-w.com/dapp?cb_url=https://bitnest.finance' }
        ],
        [{ text: '📱 WalletConnect', callback_data: 'wallet_connect_qr' }],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'products' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendCalculatorInfo(chatId: number) {
    const message = `*🧮 Investment Calculator:*

Calculate potential returns from BitNest products:

*Available Products & APY:*
• BitNest Savings: 5-8% APY
• BitNest Loop: 8-12% APY  
• BitNest Lease: 10-15% APY

*Example Calculation:*
Investment: 1,000 USDT
Period: 30 days
Product: BitNest Savings (6% APY)
Estimated Return: ~15 USDT

*Note:* Returns are estimates based on current market conditions and historical performance.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🌐 Use Web Calculator', url: 'https://www.bitnest.finance' }],
        [{ text: '💰 View Products', callback_data: 'products' }],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendFAQInfo(chatId: number) {
    const message = `*❓ Frequently Asked Questions:*

*Q: What is BitNest Finance?*
A: BitNest is a decentralized finance (DeFi) platform providing zero-risk secure fund circulation, lending, and savings services.

*Q: How do I start using BitNest products?*
A: Connect your crypto wallet, choose your preferred product (Loop, Savings, or Lease), and start with any amount.

*Q: Are BitNest investments really zero-risk?*
A: BitNest utilizes smart contracts and decentralized technology to minimize traditional financial risks.

*Q: Which wallets are supported?*
A: We support MetaMask, WalletConnect, and most major cryptocurrency wallets.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '📖 Full Documentation', url: 'https://www.bitnest.finance' }],
        [{ text: '💬 Ask Community', callback_data: 'community' }],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendCommunityInfo(chatId: number) {
    const message = `*👥 Join BitNest Community:*

Connect with our global community of DeFi enthusiasts:

*Official Channels:*
• Telegram Groups - Community discussions
• Telegram News - Latest updates & announcements
• Official Website - Complete information
• WhitePaper - Technical documentation

*Stay Updated:*
Get the latest news about new products, features, and community events.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '💬 Telegram Groups', url: 'https://t.me/bitnestfinance' }],
        [{ text: '📰 Telegram News', url: 'https://t.me/bitnestnews' }],
        [{ text: '🌐 Official Website', url: 'https://www.bitnest.finance' }],
        [{ text: '📄 WhitePaper', url: 'https://www.bitnest.finance' }],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendInvestmentOptions(chatId: number, productType: string) {
    const product = INVESTMENT_PRODUCTS[productType];
    if (!product) return;

    const message = `*${product.name}*

${product.description}

*Investment Details:*
• Duration: ${product.duration} days
• APY: ${product.apy}%
• Min Amount: $${product.minAmount}
• Max Amount: $${product.maxAmount.toLocaleString()}

*Key Features:*
${product.features.map(f => `• ${f}`).join('\n')}

*Security:* Payments automatically routed to secure wallet with smart contract protection.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '💰 Invest Now', callback_data: `invest_${productType === 'BitNest Loop' ? 'loop' : 'savings'}` }],
        [{ text: '📊 My Investments', callback_data: 'my_investments' }],
        [{ text: '🔙 Back to Products', callback_data: 'products' }],
        [
          { text: '🏠 Home', callback_data: 'home' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private async handleInvestmentFlow(chatId: number, productType: string, userId?: string) {
    if (!userId) return;

    const product = INVESTMENT_PRODUCTS[productType];
    const message = `*Start ${product.name} Investment*

Please enter your investment amount (${product.minAmount}-${product.maxAmount.toLocaleString()} USD):

*Example:* 1000

Reply with just the number.`;

    // Store user state for investment flow
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    
    // Set up listener for investment amount
    this.bot.once('message', async (msg) => {
      if (msg.chat.id === chatId && msg.from?.id.toString() === userId) {
        await this.processInvestmentAmount(chatId, productType, msg.text || '', userId);
      }
    });
  }

  private async processInvestmentAmount(chatId: number, productType: string, amountText: string, userId: string) {
    const amount = parseFloat(amountText);
    const product = INVESTMENT_PRODUCTS[productType];

    if (isNaN(amount) || amount < product.minAmount || amount > product.maxAmount) {
      this.bot.sendMessage(chatId, `❌ Invalid amount. Please enter a value between $${product.minAmount} and $${product.maxAmount.toLocaleString()}.`);
      return;
    }

    try {
      // Create investment
      const investmentData = await investmentService.createInvestment(userId, productType, amount);
      const investment = await storage.createInvestment(investmentData);

      // Generate mock wallet address for user (in real app, this would come from wallet connection)
      const mockUserWallet = '0x742d35Cc6BF4532A8B1B2f9e4a1234567890A4B8';
      
      // Process payment automatically
      const txHash = await investmentService.processPayment(investment, mockUserWallet);
      
      // Update investment with transaction hash
      await storage.updateInvestment(investment.id, { transactionHash: txHash });

      const dailyReturn = parseFloat(investment.dailyReturn);
      const totalReturn = dailyReturn * investment.duration;

      const successMessage = `✅ *Investment Created Successfully!*

*Investment Details:*
• Product: ${investment.productType}
• Amount: $${Number(investment.amount).toLocaleString()}
• Duration: ${investment.duration} days
• APY: ${investment.apy}%
• Daily Return: $${dailyReturn.toFixed(4)}
• Total Expected Return: $${totalReturn.toFixed(2)}
• End Date: ${new Date(investment.endDate).toLocaleDateString()}

*Transaction:* ${txHash.substring(0, 10)}...${txHash.substring(-8)}

💳 Payment automatically processed to secure wallet.`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '📊 View My Investments', callback_data: 'my_investments' }],
          [{ text: '💰 Invest More', callback_data: 'products' }]
        ]
      };

      this.bot.sendMessage(chatId, successMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

    } catch (error: any) {
      this.bot.sendMessage(chatId, `❌ Investment failed: ${error.message}`);
    }
  }

  private async showUserInvestments(chatId: number, userId?: string) {
    if (!userId) return;

    try {
      const investments = await storage.getUserInvestments(userId);
      
      if (investments.length === 0) {
        const message = `📊 *Your Investments*

You don't have any active investments yet.

Start investing in BitNest products to see your portfolio here!`;
        
        const keyboard = {
          inline_keyboard: [
            [{ text: '💰 Start Investing', callback_data: 'products' }]
          ]
        };
        
        this.bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
        return;
      }

      let message = `📊 *Your Active Investments*\n\n`;
      let totalInvested = 0;
      let totalReturns = 0;

      investments.forEach((inv, index) => {
        const daysRemaining = investmentService.getDaysRemaining(inv);
        const dailyReturn = parseFloat(inv.dailyReturn);
        const expectedTotal = dailyReturn * inv.duration;
        totalInvested += parseFloat(inv.amount);
        totalReturns += expectedTotal;

        message += `*${index + 1}. ${inv.productType}*\n`;
        message += `💰 Amount: $${Number(inv.amount).toLocaleString()}\n`;
        message += `📅 Days Remaining: ${daysRemaining}\n`;
        message += `📈 Daily Return: $${dailyReturn.toFixed(4)}\n`;
        message += `🎯 Expected Total: $${expectedTotal.toFixed(2)}\n`;
        message += `📊 Status: ${investmentService.getInvestmentStatus(inv)}\n\n`;
      });

      message += `*Portfolio Summary:*\n`;
      message += `💵 Total Invested: $${totalInvested.toLocaleString()}\n`;
      message += `💎 Expected Returns: $${totalReturns.toFixed(2)}`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '💰 Invest More', callback_data: 'products' }],
          [{ text: '🔄 Refresh', callback_data: 'my_investments' }],
          [
            { text: '🏠 Home', callback_data: 'home' },
            { text: '🔙 Back', callback_data: 'products' }
          ]
        ]
      };

      this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

    } catch (error: any) {
      this.bot.sendMessage(chatId, `❌ Error loading investments: ${error.message}`);
    }
  }

  public async sendMessage(chatId: number, message: string, options?: any) {
    return this.bot.sendMessage(chatId, message, options);
  }

  private sendHomeMessage(chatId: number) {
    const welcomeMessage = `🏠 *Welcome to BitNest Finance!*

Explore our DeFi ecosystem with zero-risk financial services.

BitNest is a decentralized finance (DeFi) platform providing secure, transparent, and inclusive financial services through blockchain technology.

*Quick Actions:*`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📊 View Stats', callback_data: 'stats' },
          { text: '💰 Products', callback_data: 'products' }
        ],
        [
          { text: '🔗 Connect Wallet', callback_data: 'wallet' },
          { text: '🧮 Calculator', callback_data: 'calculate' }
        ],
        [
          { text: '❓ FAQ', callback_data: 'faq' },
          { text: '👥 Community', callback_data: 'community' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendWalletConnectQR(chatId: number) {
    const qrData = `wc:${Math.random().toString(36).substring(2)}@2?relay-protocol=irn&symKey=${Math.random().toString(36).substring(2)}`;
    
    const message = `*📱 WalletConnect QR Code:*

Scan this QR code with your mobile wallet app:

\`\`\`
${qrData}
\`\`\`

*Or open directly in these apps:*`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🦊 MetaMask', url: `https://metamask.app.link/wc?uri=${encodeURIComponent(qrData)}` },
          { text: '🛡️ Trust', url: `https://link.trustwallet.com/wc?uri=${encodeURIComponent(qrData)}` }
        ],
        [
          { text: '🌈 Rainbow', url: `https://rnbwapp.com/wc?uri=${encodeURIComponent(qrData)}` },
          { text: '💙 Coinbase', url: `https://go.cb-w.com/wc?uri=${encodeURIComponent(qrData)}` }
        ],
        [
          { text: '🏠 Home', callback_data: 'home' },
          { text: '🔙 Back', callback_data: 'wallet' }
        ]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendProductDetail(chatId: number, productType: string) {
    if (productType === 'lease') {
      const message = `*🏠 BitNest Lease*

Innovative asset leasing through blockchain technology.

*Key Features:*
• Decentralized asset management
• Flexible lease terms
• Automated smart contracts
• Zero-risk collateral protection

*Coming Soon:* Full lease marketplace integration`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '📧 Get Notified', url: 'https://www.bitnest.finance/notify' }],
          [
            { text: '🏠 Home', callback_data: 'home' },
            { text: '🔙 Back', callback_data: 'products' }
          ]
        ]
      };

      this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    } else if (productType === 'wallet') {
      this.sendWalletInfo(chatId);
    }
  }

  public getBot() {
    return this.bot;
  }
}

export const telegramBot = new BitNestTelegramBot();
