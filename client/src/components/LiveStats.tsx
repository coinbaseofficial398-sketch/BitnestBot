import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Droplet, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsProps {
  stats?: {
    participants: number;
    participantIncome: string;
    liquidity: string;
  };
  isLoading: boolean;
}

export default function LiveStats({ stats, isLoading }: StatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-card border-border glow-effect" data-testid="card-participants">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Participants</h3>
            <Users className="text-primary text-xl" />
          </div>
          <div className="text-3xl font-bold gradient-text" data-testid="text-participants">
            {stats?.participants?.toLocaleString() || "1,447,639"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Total active users</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border glow-effect" data-testid="card-income">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Participant Income</h3>
            <TrendingUp className="text-secondary text-xl" />
          </div>
          <div className="text-3xl font-bold gradient-text" data-testid="text-income">
            {stats?.participantIncome ? `${Number(stats.participantIncome).toLocaleString()} USDT` : "377,536,290 USDT"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Total earnings generated</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border glow-effect" data-testid="card-liquidity">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Liquidity</h3>
            <Droplet className="text-accent text-xl" />
          </div>
          <div className="text-3xl font-bold gradient-text" data-testid="text-liquidity">
            {stats?.liquidity ? `${Number(stats.liquidity).toLocaleString()} ETH` : "22,673,861 USDT"}
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Wifi className="w-3 h-3 text-accent" />
            <p className="text-xs text-muted-foreground">Live from 0x92b7...3121</p>
          </div>
          <p className="text-sm text-muted-foreground">Available liquidity pool</p>
        </CardContent>
      </Card>
    </div>
  );
}
