
import { Coins, ArrowUpRight, TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import TokenPriceChart from "./TokenPriceChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";

interface TokenTransaction {
  id: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  from: string;
  to: string;
  time: Date;
}

interface TokenDetailCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  priceChange: number;
  totalSupply: number;
  marketCap: number;
  volume24h: number;
  allTimeHigh: number;
  chartData: Array<{ name: string; price: number }>;
  transactions: TokenTransaction[];
}

const TokenDetailCard = ({
  id,
  name,
  image,
  price,
  priceChange,
  totalSupply,
  marketCap,
  volume24h,
  allTimeHigh,
  chartData,
  transactions,
}: TokenDetailCardProps) => {
  const isPriceUp = priceChange >= 0;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="glass p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-xl overflow-hidden mb-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-xl font-bold mb-2">{name} Token</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <span>Utility token for chatbot access</span>
          </div>
          
          <div className="glass p-4 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <div className="flex items-center gap-1 text-lg font-medium text-token-purple">
                <Coins size={16} />
                {price.toFixed(2)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <div className={`flex items-center gap-1 ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {isPriceUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-token-purple hover:bg-token-purple/90 mb-2">Buy Tokens</Button>
          <Button variant="outline" className="w-full">Sell Tokens</Button>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="glass p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Price Chart</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7">1D</Button>
                <Button variant="outline" size="sm" className="text-xs h-7 bg-token-purple/20">1W</Button>
                <Button variant="outline" size="sm" className="text-xs h-7">1M</Button>
                <Button variant="outline" size="sm" className="text-xs h-7">1Y</Button>
              </div>
            </div>
            <TokenPriceChart 
              data={chartData} 
              color="#8B5CF6" 
              height={200} 
              showGrid 
              showAxis 
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass p-3 rounded-xl">
              <h3 className="text-xs text-muted-foreground mb-1">Market Cap</h3>
              <div className="font-medium">{marketCap.toLocaleString()}</div>
            </div>
            
            <div className="glass p-3 rounded-xl">
              <h3 className="text-xs text-muted-foreground mb-1">Volume (24h)</h3>
              <div className="font-medium">{volume24h.toLocaleString()}</div>
            </div>
            
            <div className="glass p-3 rounded-xl">
              <h3 className="text-xs text-muted-foreground mb-1">Total Supply</h3>
              <div className="font-medium">{totalSupply.toLocaleString()}</div>
            </div>
            
            <div className="glass p-3 rounded-xl">
              <h3 className="text-xs text-muted-foreground mb-1">All-Time High</h3>
              <div className="font-medium">{allTimeHigh.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <h2 className="text-lg font-medium mb-3">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                      </TableCell>
                      <TableCell>{tx.price.toFixed(2)}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{formatAddress(tx.from)}</TableCell>
                      <TableCell>{formatAddress(tx.to)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{tx.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailCard;
