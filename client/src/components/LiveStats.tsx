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

  return null; // Stats display removed as requested
}
