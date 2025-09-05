import { useQuery } from "@tanstack/react-query";
import LiveStats from "@/components/LiveStats";
import BotCommands from "@/components/BotCommands";
import ChatSimulator from "@/components/ChatSimulator";
import ProductsSection from "@/components/ProductsSection";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import WalletConnect from "@/components/WalletConnect";
import FAQSection from "@/components/FAQSection";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Box, Forward } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/bot/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Box className="text-primary-foreground text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">BitNest Finance</h1>
                <p className="text-sm text-muted-foreground">Telegram Bot Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium pulse-animation">
                <div className="inline-block w-2 h-2 bg-accent rounded-full mr-2"></div>
                Bot Active
              </span>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                WalletConnect Enabled
              </span>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.open('https://t.me/BitNestFinanceBot', '_blank')}
                data-testid="button-open-telegram"
              >
                <Forward className="mr-2 h-4 w-4" />
                Open in Telegram
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Live Stats */}
        <LiveStats stats={stats} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Bot Commands */}
          <BotCommands />
          
          {/* Chat Simulator */}
          <ChatSimulator />
        </div>

        {/* Products Section */}
        <ProductsSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Investment Calculator */}
          <InvestmentCalculator />
          
          {/* Wallet Connect */}
          <WalletConnect />
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Social Links */}
        <SocialLinks />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4 space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Bot Token: </span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">8467...SyX0E</span>
                <span className="text-xs text-destructive ml-2">(Secured via Replit Secrets)</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">WalletConnect ID: </span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">56d7...93a1</span>
              </div>
              <div className="text-xs text-muted-foreground">
                📊 Live liquidity from secure wallet | 💰 Payments auto-routed to verified address
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2022 BitNest Limited. All rights reserved</p>
            <p className="text-xs text-muted-foreground mt-2">Telegram Bot Dashboard for DeFi Services</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
