
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Percent, TrendingUp, RefreshCcw } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [positions, setPositions] = useState([
    { id: 1, symbol: "RELIANCE", quantity: 10, entryPrice: 2500, currentPrice: 2550, pnl: 500, stopLossType: "percentage", stopLossValue: 2, status: "active" },
    { id: 2, symbol: "INFY", quantity: 15, entryPrice: 1600, currentPrice: 1580, pnl: -300, stopLossType: "fixed", stopLossValue: 30, status: "active" },
  ]);
  
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  
  const handleLogin = () => {
    // In a real app, this would authenticate with Zerodha
    if (apiKey && apiSecret) {
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setApiKey("");
    setApiSecret("");
  };

  const updateStopLoss = (id, type, value) => {
    setPositions(positions.map(pos => 
      pos.id === id ? { ...pos, stopLossType: type, stopLossValue: value } : pos
    ));
  };

  const startTrailing = (id) => {
    // In a real app, this would start the trailing stop loss for the position
    console.log(`Starting trailing stop loss for position ${id}`);
  };

  const stopTrailing = (id) => {
    // In a real app, this would stop the trailing stop loss for the position
    console.log(`Stopping trailing stop loss for position ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              ZeroTrail
            </h1>
            <p className="text-gray-400">Automated Trailing Stop Loss for Zerodha</p>
          </div>
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="mt-4 md:mt-0 border-red-500 text-red-500 hover:bg-red-950"
            >
              Disconnect from Zerodha
            </Button>
          ) : null}
        </header>
        
        <main>
          <Tabs defaultValue={isLoggedIn ? "dashboard" : "connect"} className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="dashboard" disabled={!isLoggedIn}>Dashboard</TabsTrigger>
              <TabsTrigger value="settings" disabled={!isLoggedIn}>Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Connect to Zerodha</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your Zerodha API credentials to start using automated trailing stop loss
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      placeholder="Enter your Zerodha API Key" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input 
                      id="api-secret" 
                      type="password" 
                      placeholder="Enter your Zerodha API Secret" 
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleLogin}
                    disabled={!apiKey || !apiSecret}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Connect to Zerodha
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>How it works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-950 text-blue-400 p-2 rounded-full">1</div>
                    <div>
                      <h3 className="font-medium">Connect your Zerodha account</h3>
                      <p className="text-gray-400">Securely link your trading account using API credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-950 text-blue-400 p-2 rounded-full">2</div>
                    <div>
                      <h3 className="font-medium">Configure trailing stop loss</h3>
                      <p className="text-gray-400">Set percentage or fixed amount trail for each position</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-950 text-blue-400 p-2 rounded-full">3</div>
                    <div>
                      <h3 className="font-medium">Let automation protect your profits</h3>
                      <p className="text-gray-400">The app will automatically adjust stop loss as price moves in your favor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Positions</span>
                        <span>{positions.filter(p => p.status === "active").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trailing Enabled</span>
                        <span>{positions.filter(p => p.status === "active").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total P&L</span>
                        <span className={positions.reduce((acc, pos) => acc + pos.pnl, 0) >= 0 ? "text-green-400" : "text-red-400"}>
                          ₹{positions.reduce((acc, pos) => acc + pos.pnl, 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle>Market Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold">Market Open</div>
                        <div className="text-gray-400">9:15 AM - 3:30 PM</div>
                      </div>
                      <Badge className="bg-green-600">Live</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle>Automation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold">Trailing Active</div>
                        <div className="text-gray-400">Last check: 1m ago</div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Refresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Active Positions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure and monitor trailing stop loss for your open positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positions.map(position => (
                      <div key={position.id} className="p-4 border border-gray-800 rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold">{position.symbol}</h3>
                              <Badge className={position.pnl >= 0 ? "bg-green-600" : "bg-red-600"}>
                                {position.pnl >= 0 ? "+" : ""}{position.pnl}
                              </Badge>
                            </div>
                            <div className="text-gray-400">
                              {position.quantity} shares @ ₹{position.entryPrice}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="text-right">
                              <div className="text-xl font-medium">₹{position.currentPrice}</div>
                              <div className={position.currentPrice > position.entryPrice ? "text-green-400" : "text-red-400"}>
                                {((position.currentPrice - position.entryPrice) / position.entryPrice * 100).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`sl-type-${position.id}`}>Stop Loss Type</Label>
                            <Select 
                              value={position.stopLossType} 
                              onValueChange={(value) => updateStopLoss(position.id, value, position.stopLossValue)}
                            >
                              <SelectTrigger id={`sl-type-${position.id}`} className="bg-gray-800 border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed">Fixed Value</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`sl-value-${position.id}`}>
                              {position.stopLossType === "percentage" ? "Percentage (%)" : "Fixed Value (₹)"}
                            </Label>
                            <div className="relative">
                              <Input
                                id={`sl-value-${position.id}`}
                                type="number"
                                value={position.stopLossValue}
                                onChange={(e) => updateStopLoss(position.id, position.stopLossType, Number(e.target.value))}
                                className="bg-gray-800 border-gray-700"
                              />
                              {position.stopLossType === "percentage" ? (
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                              ) : null}
                            </div>
                          </div>
                          
                          <div className="flex items-end">
                            <Button 
                              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                              onClick={() => startTrailing(position.id)}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Start Trailing
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Alert className="bg-blue-950 border-blue-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This is a simulation. In a real implementation, you would need to install a Python application that uses the Zerodha API to execute the trailing stop-loss strategy.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure global settings for the trailing stop loss application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Run in background</Label>
                      <p className="text-gray-400 text-sm">Keep the application running even when closed</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send email notifications</Label>
                      <p className="text-gray-400 text-sm">Receive email alerts when stop loss is executed</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Default stop loss type</Label>
                      <p className="text-gray-400 text-sm">Set the default type for new positions</p>
                    </div>
                    <Select defaultValue="percentage">
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Update frequency (seconds)</Label>
                      <p className="text-gray-400 text-sm">How often to check for price updates</p>
                    </div>
                    <Input 
                      type="number" 
                      defaultValue="5" 
                      className="w-32 bg-gray-800 border-gray-700" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Python Application Code</CardTitle>
                  <CardDescription className="text-gray-400">
                    Copy this Python code to implement the backend for the trailing stop loss functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black p-4 rounded-md overflow-auto text-sm text-gray-300 whitespace-pre-wrap">
{`#!/usr/bin/env python3
# ZeroTrail - Automated Trailing Stop Loss for Zerodha
# Save this as zerotrail.py

import time
import logging
from kiteconnect import KiteConnect
from typing import Dict, List, Optional, Union, Literal
import os
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("zerotrail.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ZeroTrail")

class TrailingStopLoss:
    def __init__(self, 
                 symbol: str, 
                 quantity: int,
                 entry_price: float,
                 stop_loss_type: Literal['percentage', 'fixed'],
                 stop_loss_value: float):
        self.symbol = symbol
        self.quantity = quantity
        self.entry_price = entry_price
        self.stop_loss_type = stop_loss_type
        self.stop_loss_value = stop_loss_value
        self.highest_price = entry_price
        self.stop_loss_price = self._calculate_initial_stop_loss()
        
    def _calculate_initial_stop_loss(self) -> float:
        if self.stop_loss_type == 'percentage':
            return self.entry_price * (1 - self.stop_loss_value / 100)
        else:  # fixed value
            return self.entry_price - self.stop_loss_value
    
    def update(self, current_price: float) -> Optional[float]:
        """
        Update tracking with current price.
        Returns the stop loss price if it's triggered, None otherwise.
        """
        if current_price <= self.stop_loss_price:
            # Stop loss triggered
            return self.stop_loss_price
        
        if current_price > self.highest_price:
            # New highest price reached, update trailing stop loss
            self.highest_price = current_price
            if self.stop_loss_type == 'percentage':
                self.stop_loss_price = current_price * (1 - self.stop_loss_value / 100)
            else:  # fixed value
                self.stop_loss_price = current_price - self.stop_loss_value
        
        return None

class ZerodhaTrader:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.kite = KiteConnect(api_key=api_key)
        self.access_token = None
        self.positions: Dict[str, TrailingStopLoss] = {}
        self.config_file = "zerotrail_config.json"
        self.load_config()
    
    def authenticate(self):
        """Generate request token URL and authenticate"""
        if self.access_token:
            self.kite.set_access_token(self.access_token)
            return
            
        print(f"Please visit this URL to authorize the application: {self.kite.login_url()}")
        request_token = input("Enter the request token: ")
        data = self.kite.generate_session(request_token, api_secret=self.api_secret)
        self.access_token = data["access_token"]
        self.kite.set_access_token(self.access_token)
        logger.info("Authentication successful")
        
        # Save the access token to config
        self.save_config()
    
    def load_config(self):
        """Load configuration from file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                    self.access_token = config.get('access_token')
                    
                    # Load saved trailing stop loss configurations
                    positions_config = config.get('positions', {})
                    for symbol, pos_data in positions_config.items():
                        self.positions[symbol] = TrailingStopLoss(
                            symbol=symbol,
                            quantity=pos_data['quantity'],
                            entry_price=pos_data['entry_price'],
                            stop_loss_type=pos_data['stop_loss_type'],
                            stop_loss_value=pos_data['stop_loss_value']
                        )
                logger.info(f"Loaded configuration with {len(self.positions)} positions")
        except Exception as e:
            logger.error(f"Error loading config: {e}")
    
    def save_config(self):
        """Save configuration to file"""
        try:
            positions_config = {}
            for symbol, tsl in self.positions.items():
                positions_config[symbol] = {
                    'quantity': tsl.quantity,
                    'entry_price': tsl.entry_price,
                    'stop_loss_type': tsl.stop_loss_type,
                    'stop_loss_value': tsl.stop_loss_value
                }
            
            config = {
                'access_token': self.access_token,
                'positions': positions_config
            }
            
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=2)
            logger.info("Configuration saved")
        except Exception as e:
            logger.error(f"Error saving config: {e}")
    
    def add_trailing_stop_loss(self, 
                              symbol: str, 
                              quantity: int,
                              entry_price: Optional[float] = None,
                              stop_loss_type: Literal['percentage', 'fixed'] = 'percentage',
                              stop_loss_value: float = 2.0):
        """
        Add a new position to track with trailing stop loss
        """
        # Get current price if entry price not provided
        if entry_price is None:
            try:
                quote = self.kite.quote(f"NSE:{symbol}")
                entry_price = quote[f"NSE:{symbol}"]["last_price"]
            except Exception as e:
                logger.error(f"Error getting current price for {symbol}: {e}")
                return False
        
        self.positions[symbol] = TrailingStopLoss(
            symbol=symbol,
            quantity=quantity,
            entry_price=entry_price,
            stop_loss_type=stop_loss_type,
            stop_loss_value=stop_loss_value
        )
        logger.info(f"Added trailing stop loss for {symbol} at {entry_price} with {stop_loss_type}={stop_loss_value}")
        self.save_config()
        return True
    
    def remove_trailing_stop_loss(self, symbol: str):
        """Remove a position from tracking"""
        if symbol in self.positions:
            del self.positions[symbol]
            logger.info(f"Removed trailing stop loss for {symbol}")
            self.save_config()
            return True
        return False
    
    def get_current_price(self, symbol: str) -> Optional[float]:
        """Get current price for a symbol"""
        try:
            quote = self.kite.quote(f"NSE:{symbol}")
            return quote[f"NSE:{symbol}"]["last_price"]
        except Exception as e:
            logger.error(f"Error getting current price for {symbol}: {e}")
            return None
    
    def place_sell_order(self, symbol: str, quantity: int, price: float) -> bool:
        """Place a sell order for a position"""
        try:
            order_id = self.kite.place_order(
                variety=self.kite.VARIETY_REGULAR,
                exchange=self.kite.EXCHANGE_NSE,
                tradingsymbol=symbol,
                transaction_type=self.kite.TRANSACTION_TYPE_SELL,
                quantity=quantity,
                product=self.kite.PRODUCT_CNC,  # For delivery positions, use PRODUCT_MIS for intraday
                order_type=self.kite.ORDER_TYPE_MARKET,  # Using market order for immediate execution
                price=price  # This will be ignored for market orders
            )
            logger.info(f"Placed sell order for {symbol}, quantity={quantity}, order_id={order_id}")
            return True
        except Exception as e:
            logger.error(f"Error placing sell order for {symbol}: {e}")
            return False
    
    def run_trailing_stop_loss(self, update_interval: int = 5):
        """Main loop to check and update trailing stop loss for all positions"""
        logger.info(f"Starting trailing stop loss with {len(self.positions)} positions")
        
        try:
            while True:
                for symbol, tsl in list(self.positions.items()):
                    current_price = self.get_current_price(symbol)
                    if current_price is None:
                        continue
                    
                    trigger_price = tsl.update(current_price)
                    if trigger_price:
                        logger.info(f"Stop loss triggered for {symbol} at {trigger_price}")
                        success = self.place_sell_order(symbol, tsl.quantity, current_price)
                        if success:
                            self.remove_trailing_stop_loss(symbol)
                    else:
                        logger.debug(f"{symbol}: Current={current_price}, Highest={tsl.highest_price}, SL={tsl.stop_loss_price}")
                
                time.sleep(update_interval)
        except KeyboardInterrupt:
            logger.info("Stopping trailing stop loss")
        except Exception as e:
            logger.error(f"Error in trailing stop loss: {e}")

def main():
    print("ZeroTrail - Automated Trailing Stop Loss for Zerodha")
    print("---------------------------------------------------")
    
    api_key = input("Enter your Zerodha API key: ")
    api_secret = input("Enter your Zerodha API secret: ")
    
    trader = ZerodhaTrader(api_key, api_secret)
    trader.authenticate()
    
    while True:
        print("\nMenu:")
        print("1. Add trailing stop loss for a position")
        print("2. Remove trailing stop loss")
        print("3. List all positions with trailing stop loss")
        print("4. Start trailing stop loss execution")
        print("5. Exit")
        
        choice = input("Enter your choice (1-5): ")
        
        if choice == '1':
            symbol = input("Enter symbol (e.g., RELIANCE): ")
            quantity = int(input("Enter quantity: "))
            stop_loss_type = input("Enter stop loss type (percentage/fixed): ").lower()
            stop_loss_value = float(input("Enter stop loss value: "))
            
            # Optional - can be left blank to use current market price
            entry_price_str = input("Enter entry price (leave blank for current price): ")
            entry_price = float(entry_price_str) if entry_price_str else None
            
            trader.add_trailing_stop_loss(
                symbol=symbol,
                quantity=quantity,
                entry_price=entry_price,
                stop_loss_type=stop_loss_type,
                stop_loss_value=stop_loss_value
            )
            
        elif choice == '2':
            symbol = input("Enter symbol to remove trailing stop loss: ")
            trader.remove_trailing_stop_loss(symbol)
            
        elif choice == '3':
            print("\nCurrent positions with trailing stop loss:")
            for symbol, tsl in trader.positions.items():
                current_price = trader.get_current_price(symbol) or 0
                profit_loss = (current_price - tsl.entry_price) * tsl.quantity
                
                print(f"Symbol: {symbol}")
                print(f"  Quantity: {tsl.quantity}")
                print(f"  Entry Price: {tsl.entry_price}")
                print(f"  Current Price: {current_price}")
                print(f"  Stop Loss Price: {tsl.stop_loss_price}")
                print(f"  Stop Loss Type: {tsl.stop_loss_type}")
                print(f"  Stop Loss Value: {tsl.stop_loss_value}")
                print(f"  P&L: {profit_loss:.2f}")
                print("------------------------------")
            
        elif choice == '4':
            update_interval = int(input("Enter update interval in seconds (default: 5): ") or "5")
            trader.run_trailing_stop_loss(update_interval)
            
        elif choice == '5':
            print("Exiting ZeroTrail. Goodbye!")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
`}</pre>
                </CardContent>
                <CardFooter>
                  <p className="text-gray-400 text-sm">
                    This code requires the kiteconnect Python library. Install it using <code>pip install kiteconnect</code>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>ZeroTrail - Automated Trailing Stop Loss for Zerodha</p>
          <p className="mt-1">Created for educational purposes only. Not affiliated with Zerodha.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
