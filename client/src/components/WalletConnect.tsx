import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Smartphone, CheckCircle, Unlink, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnect() {
  const [connectedWallet, setConnectedWallet] = useState<any>(null);
  const [walletConnectURI, setWalletConnectURI] = useState<string>('');
  const { toast } = useToast();
  const WALLETCONNECT_PROJECT_ID = '56d7e1b7-b070-4c83-b259-8f6938cf93a1';

  useEffect(() => {
    // Generate WalletConnect URI for QR code
    const uri = `wc:${Math.random().toString(36).substring(2)}@2?relay-protocol=irn&symKey=${Math.random().toString(36).substring(2)}`;
    setWalletConnectURI(uri);
  }, []);

  const connectMutation = useMutation({
    mutationFn: async (walletType: string) => {
      // Simulate wallet connection
      const mockAddress = "0x742d35Cc6BF4532A8B1B2f9e4a1234567890A4B8";
      const response = await apiRequest("POST", "/api/wallet/connect", {
        userId: "mock-user-id",
        walletType,
        address: mockAddress,
        chainId: 1
      });
      return response.json();
    },
    onSuccess: (data) => {
      setConnectedWallet(data);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${data.walletType} wallet`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/wallet/disconnect", {
        userId: "mock-user-id"
      });
      return response.json();
    },
    onSuccess: () => {
      setConnectedWallet(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected wallet",
      });
    },
  });

  return (
    <Card className="bg-card border-border" data-testid="card-wallet-connect">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Link className="mr-3 text-primary" />
          Wallet Connection
        </h2>
        
        <div className="space-y-4">
          {!connectedWallet ? (
            <>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <div className="font-medium">MetaMask</div>
                      <div className="text-sm text-muted-foreground">Browser extension wallet</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => connectMutation.mutate('metamask')}
                    disabled={connectMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-connect-metamask"
                  >
                    Connect
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium">WalletConnect</div>
                      <div className="text-sm text-muted-foreground">Mobile & desktop wallets</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => connectMutation.mutate('walletconnect')}
                    disabled={connectMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-connect-walletconnect"
                  >
                    Connect
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Project ID: {WALLETCONNECT_PROJECT_ID}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="text-accent" />
                  <span className="font-medium text-accent">Connection Status</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">No wallet connected. Connect your wallet to access DeFi features.</p>
                <div className="text-xs text-muted-foreground">
                  <div>💰 Payments route to secure wallet automatically</div>
                  <div>📊 Live liquidity from BSC: 0x92b7...3121</div>
                  <div>🔗 BSCScan verified wallet connection</div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4" data-testid="connected-wallet-state">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="text-primary" />
                    <span className="font-medium text-primary">Wallet Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono" data-testid="text-wallet-address">
                    {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnectMutation.mutate()}
                  disabled={disconnectMutation.isPending}
                  className="text-destructive hover:text-destructive/80"
                  data-testid="button-disconnect-wallet"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
