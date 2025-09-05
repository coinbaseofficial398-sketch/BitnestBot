import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, PiggyBank, Home, Wallet, Layers } from "lucide-react";

export default function ProductsSection() {
  const products = [
    {
      icon: RotateCcw,
      title: "BitNest Loop",
      description: "Automated yield farming and liquidity provision system",
      color: "text-primary"
    },
    {
      icon: PiggyBank,
      title: "BitNest Savings",
      description: "Zero-risk savings with guaranteed returns",
      color: "text-secondary"
    },
    {
      icon: Home,
      title: "BitNest Lease",
      description: "Decentralized asset leasing and rental services",
      color: "text-accent"
    },
    {
      icon: Wallet,
      title: "BitNest Wallet",
      description: "Secure multi-chain cryptocurrency wallet",
      color: "text-primary"
    }
  ];

  return (
    <Card className="mt-8 bg-card border-border" data-testid="card-products-section">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Layers className="mr-3 text-primary" />
          BitNest Products & Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <div 
                key={product.title}
                className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors cursor-pointer"
                data-testid={`product-${product.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className={`w-12 h-12 bg-${product.color.split('-')[1]}/20 rounded-lg flex items-center justify-center mb-3`}>
                  <IconComponent className={`${product.color} text-xl`} />
                </div>
                <h3 className="font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
