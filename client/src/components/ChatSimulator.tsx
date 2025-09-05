import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send } from "lucide-react";
import { useState } from "react";

export default function ChatSimulator() {
  const [inputValue, setInputValue] = useState("");

  const messages = [
    {
      type: "bot",
      content: "🏠 Welcome to BitNest Finance!",
      subContent: "Explore our DeFi ecosystem with zero-risk financial services.",
      buttons: ["📊 View Stats", "💰 Products", "🔗 Connect Wallet"]
    },
    {
      type: "user",
      content: "/products"
    },
    {
      type: "bot",
      content: "🔄 BitNest Products:",
      buttons: ["🔄 BitNest Loop", "💳 BitNest Savings", "🏠 BitNest Lease", "📱 BitNest Wallet"]
    }
  ];

  return (
    <Card className="bg-card border-border" data-testid="card-chat-simulator">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Bot className="mr-3 text-primary" />
          Chat Preview
        </h2>
        
        <div className="bg-muted rounded-lg p-4 h-80 overflow-y-auto space-y-3" data-testid="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-primary-foreground text-sm" />
                </div>
              )}
              
              <div className={`rounded-lg p-3 max-w-xs ${
                message.type === 'bot' 
                  ? 'bg-background' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                <p className="text-sm font-medium">{message.content}</p>
                {message.subContent && (
                  <p className="text-sm mt-1 opacity-90">{message.subContent}</p>
                )}
                {message.buttons && (
                  <div className="mt-2 space-y-1">
                    {message.buttons.map((button, btnIndex) => (
                      <Button
                        key={btnIndex}
                        variant="secondary"
                        size="sm"
                        className="block w-full text-left text-xs"
                        data-testid={`button-${button.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                      >
                        {button}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-secondary-foreground text-sm" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-primary-foreground text-sm" />
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground typing-indicator">BitNest Bot is typing</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Input
            type="text"
            placeholder="Type a command..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-input border-border"
            data-testid="input-chat-message"
          />
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
