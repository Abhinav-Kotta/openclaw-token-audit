// Core data types for the Token Audit Dashboard

export interface Session {
  timestamp: string;
  tokensIn: number;
  tokensOut: number;
  context: number;
  session: {
    id: string;
    agent: string;
    channel: string;
    started: string;
    simulated?: boolean;
  };
}

export interface TokenUsage {
  daily: Record<string, {
    tokensIn: number;
    tokensOut: number;
    context: number;
  }>;
  hourly: Record<string, {
    tokensIn: number;
    tokensOut: number;
    context: number;
  }>;
  total: {
    tokensIn: number;
    tokensOut: number;
    context: number;
  };
}

export interface TokenData {
  sessions: Session[];
  tools: Record<string, number>;
  agents: Record<string, number>;
  channels: Record<string, number>;
  context: any[];
  tokenUsage: TokenUsage;
}

export interface ChartDataPoint {
  date: string;
  tokensIn: number;
  tokensOut: number;
  total: number;
}

export interface StatsTrend {
  value: number;
  direction: 'up' | 'down';
}

export interface StatsCardData {
  title: string;
  value: string;
  trend?: StatsTrend;
  color?: 'primary' | 'secondary' | 'accent';
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation variants
export type AnimationVariant = {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
};

// Theme types
export type ColorScheme = 'primary' | 'secondary' | 'accent';
export type ComponentSize = 'small' | 'normal' | 'large';

// Filter and sort options
export interface FilterOptions {
  agent?: string;
  channel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'timestamp' | 'tokensIn' | 'tokensOut' | 'total';
  sortOrder?: 'asc' | 'desc';
}

// Dashboard state
export interface DashboardState {
  data: TokenData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  refreshInterval: number;
}

// Chart configuration
export interface ChartConfig {
  type: 'line' | 'area' | 'bar';
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  colors: {
    tokensIn: string;
    tokensOut: string;
    context: string;
    total: string;
  };
}