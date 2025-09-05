import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, CreditCard } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState("1000");
  const [period, setPeriod] = useState("30");
  const [productType, setProductType] = useState("BitNest Savings");
  const [result, setResult] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  const { toast } = useToast();

  const calculateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Calculation Complete",
        description: `Estimated return: $${data.calculation.estimatedReturn}`,
      });
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/payment/process", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Payment Successful",
        description: "Your investment has been processed securely.",
      });
      setShowPayment(false);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Payment processing failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInvest = () => {
    if (result) {
      setShowPayment(true);
    }
  };

  const processPayment = () => {
    paymentMutation.mutate({
      amount,
      token: "USDT"
    });
  };

  const handleCalculate = () => {
    calculateMutation.mutate({
      amount,
      period: parseInt(period),
      productType,
    });
  };

  return (
    <Card className="bg-card border-border" data-testid="card-investment-calculator">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Calculator className="mr-3 text-primary" />
          Investment Calculator
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount" className="block text-sm font-medium mb-2">Investment Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-input border-border"
              data-testid="input-amount"
            />
          </div>
          
          <div>
            <Label htmlFor="period" className="block text-sm font-medium mb-2">Investment Period (Days)</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full bg-input border-border" data-testid="select-period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="product" className="block text-sm font-medium mb-2">Product Type</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger className="w-full bg-input border-border" data-testid="select-product">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BitNest Savings">BitNest Savings (5-8% APY)</SelectItem>
                <SelectItem value="BitNest Loop">BitNest Loop (8-12% APY)</SelectItem>
                <SelectItem value="BitNest Lease">BitNest Lease (10-15% APY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleCalculate}
            disabled={calculateMutation.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            data-testid="button-calculate"
          >
            {calculateMutation.isPending ? "Calculating..." : "Calculate Potential Returns"}
          </Button>
          
          {result && (
            <div className="bg-muted rounded-lg p-4 mt-4" data-testid="calculation-result">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Return:</span>
                <span className="text-lg font-bold text-secondary" data-testid="text-estimated-return">
                  ${result.calculation.estimatedReturn}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Total Value:</span>
                <span className="text-lg font-bold gradient-text" data-testid="text-total-value">
                  ${result.totalValue}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">APY:</span>
                <span className="text-sm font-medium text-accent" data-testid="text-apy">
                  {result.apy}%
                </span>
              </div>
              {!showPayment ? (
                <Button 
                  onClick={handleInvest}
                  className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="button-invest-now"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Invest Now
                </Button>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                  <div className="text-center">
                    <CreditCard className="mx-auto text-primary mb-2" size={24} />
                    <p className="text-sm font-medium mb-2">Secure Payment Processing</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Payment will be processed securely to our verified wallet
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPayment(false)}
                        className="flex-1"
                        data-testid="button-cancel-payment"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={processPayment}
                        disabled={paymentMutation.isPending}
                        className="flex-1 bg-primary text-primary-foreground"
                        data-testid="button-confirm-payment"
                      >
                        {paymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
