export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  walletType: 'metamask' | 'walletconnect' | 'bitnest';
}

export class WalletService {
  private connections: Map<string, WalletConnection> = new Map();

  async connectWallet(userId: string, walletType: string, address: string, chainId: number = 1): Promise<WalletConnection> {
    const connection: WalletConnection = {
      address,
      chainId,
      isConnected: true,
      walletType: walletType as WalletConnection['walletType']
    };

    this.connections.set(userId, connection);
    return connection;
  }

  async disconnectWallet(userId: string): Promise<boolean> {
    return this.connections.delete(userId);
  }

  async getWalletConnection(userId: string): Promise<WalletConnection | undefined> {
    return this.connections.get(userId);
  }

  async validateWalletAddress(address: string): Promise<boolean> {
    // Basic Ethereum address validation
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  }

  async getWalletBalance(address: string): Promise<string> {
    // In a real implementation, this would query blockchain
    // For now, return a mock balance
    return "0.00";
  }
}

export const walletService = new WalletService();
