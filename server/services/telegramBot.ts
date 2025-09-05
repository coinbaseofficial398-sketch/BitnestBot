import TelegramBot from 'node-telegram-bot-api';
import { storage } from '../storage';

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
          this.sendProductDetail(chatId, 'loop');
          break;
        case 'savings':
          this.sendProductDetail(chatId, 'savings');
          break;
        case 'lease':
          this.sendProductDetail(chatId, 'lease');
          break;
        case 'wallet_connect':
          this.sendProductDetail(chatId, 'wallet');
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
        [{ text: '📱 BitNest Wallet', callback_data: 'wallet_connect' }],
        [{ text: '🌐 Visit Website', url: 'https://www.bitnest.finance' }]
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
        [{ text: '💰 View Products', callback_data: 'products' }]
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
• MetaMask (Browser extension)
• WalletConnect (Mobile & Desktop)
• BitNest Wallet (Coming soon)

*Benefits:*
• Secure transactions
• Access to all DeFi products
• Real-time portfolio tracking
• Zero-risk investment options`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🦊 Connect MetaMask', url: 'https://metamask.io/' }],
        [{ text: '📱 WalletConnect', url: 'https://walletconnect.com/' }],
        [{ text: '📱 BitNest Wallet (Soon)', callback_data: 'wallet_connect' }]
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
        [{ text: '💰 View Products', callback_data: 'products' }]
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
        [{ text: '💬 Ask Community', callback_data: 'community' }]
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
        [{ text: '📄 WhitePaper', url: 'https://www.bitnest.finance' }]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  private sendProductDetail(chatId: number, product: string) {
    const products = {
      loop: {
        title: '🔄 BitNest Loop',
        description: 'Automated yield farming and liquidity provision system with 8-12% APY',
        features: '• Automated portfolio rebalancing\n• Multi-protocol yield optimization\n• Smart contract security\n• Compound interest rewards'
      },
      savings: {
        title: '💳 BitNest Savings',
        description: 'Zero-risk savings with guaranteed returns of 5-8% APY',
        features: '• Principal protection guarantee\n• Daily interest accrual\n• Flexible withdrawal options\n• Stablecoin focused'
      },
      lease: {
        title: '🏠 BitNest Lease',
        description: 'Decentralized asset leasing and rental services with 10-15% APY',
        features: '• Real estate tokenization\n• Fractional ownership\n• Rental income distribution\n• Asset-backed security'
      },
      wallet: {
        title: '📱 BitNest Wallet',
        description: 'Secure multi-chain cryptocurrency wallet (Coming Soon)',
        features: '• Multi-chain support\n• DeFi integration\n• Enhanced security features\n• Cross-chain transactions'
      }
    };

    const info = products[product as keyof typeof products];
    
    const message = `*${info.title}*

${info.description}

*Key Features:*
${info.features}

*Security:* All products are built on audited smart contracts with multi-signature protection.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🌐 Learn More', url: 'https://www.bitnest.finance' }],
        [{ text: '🔙 Back to Products', callback_data: 'products' }]
      ]
    };

    this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  public async sendMessage(chatId: number, message: string, options?: any) {
    return this.bot.sendMessage(chatId, message, options);
  }

  public getBot() {
    return this.bot;
  }
}

export const telegramBot = new BitNestTelegramBot();
