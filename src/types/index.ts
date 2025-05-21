
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradeConfig {
  id: string;
  user_id: string;
  name: string;
  trailing_stop_type: 'percentage' | 'difference';
  trailing_value: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TradeHistory {
  id: string;
  user_id: string;
  config_id: string | null;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  status: 'open' | 'closed' | 'cancelled';
  trade_type: 'buy' | 'sell';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}
