import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is BitNest Finance?",
      answer: "BitNest is a decentralized finance (DeFi) platform based on blockchain technology, providing zero-risk secure fund circulation, lending, and savings services to global users and institutions."
    },
    {
      question: "How do I start using BitNest products?",
      answer: "Connect your crypto wallet through our Telegram bot, choose your preferred product (Loop, Savings, or Lease), and start with any amount you're comfortable investing."
    },
    {
      question: "Are BitNest investments really zero-risk?",
      answer: "BitNest utilizes smart contracts and decentralized technology to minimize traditional financial risks, though all investments carry some level of market risk."
    },
    {
      question: "Which wallets are supported?",
      answer: "We support MetaMask, WalletConnect, and most major cryptocurrency wallets. Our BitNest Wallet is also in development."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <Card className="mt-8 bg-card border-border" data-testid="card-faq-section">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <HelpCircle className="mr-3 text-primary" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg">
              <button 
                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => toggleFAQ(index)}
                data-testid={`button-faq-${index}`}
              >
                <span className="font-medium">{faq.question}</span>
                {openFAQ === index ? (
                  <ChevronUp className="text-muted-foreground" />
                ) : (
                  <ChevronDown className="text-muted-foreground" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground" data-testid={`answer-faq-${index}`}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
