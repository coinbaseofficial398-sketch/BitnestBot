import { Card, CardContent } from "@/components/ui/card";
import { Terminal, ChevronRight } from "lucide-react";

export default function BotCommands() {
  const commands = [
    {
      command: "/start",
      description: "Initialize bot and show welcome message"
    },
    {
      command: "/help",
      description: "Display all available commands and usage"
    },
    {
      command: "/products",
      description: "Show BitNest Loop, Savings, Lease products"
    },
    {
      command: "/wallet",
      description: "Connect crypto wallet (MetaMask, WalletConnect)"
    },
    {
      command: "/stats",
      description: "View real-time platform statistics"
    },
    {
      command: "/calculate",
      description: "Investment calculator for potential returns"
    }
  ];

  return (
    <Card className="bg-card border-border" data-testid="card-bot-commands">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Terminal className="mr-3 text-primary" />
          Bot Commands
        </h2>
        
        <div className="space-y-4">
          {commands.map((cmd, index) => (
            <div 
              key={cmd.command}
              className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors cursor-pointer"
              data-testid={`command-${cmd.command.replace('/', '')}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-primary">{cmd.command}</div>
                  <div className="text-sm text-muted-foreground">{cmd.description}</div>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
