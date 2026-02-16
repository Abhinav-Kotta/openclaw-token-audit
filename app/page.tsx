'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  Cpu, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import TokenChart from '@/components/TokenChart';
import SessionsTable from '@/components/SessionsTable';
import Header from '@/components/Header';

interface TokenData {
  sessions: any[];
  tools: Record<string, number>;
  agents: Record<string, number>;
  channels: Record<string, number>;
  context: any[];
  tokenUsage: {
    daily: Record<string, { tokensIn: number; tokensOut: number; context: number }>;
    hourly: Record<string, { tokensIn: number; tokensOut: number; context: number }>;
    total: { tokensIn: number; tokensOut: number; context: number };
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/token-data');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const tokenData = await response.json();
      setData(tokenData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center"
        >
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-text-secondary">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const { tokenUsage, sessions, agents, channels, tools } = data;
  const { total } = tokenUsage;
  
  // Calculate additional stats
  const totalSessions = sessions.length;
  const activeAgents = Object.keys(agents).length;
  const activeChannels = Object.keys(channels).length;
  const totalTools = Object.keys(tools).length;

  // Prepare chart data
  const chartData = Object.entries(tokenUsage.daily).map(([date, usage]) => ({
    date,
    tokensIn: usage.tokensIn,
    tokensOut: usage.tokensOut,
    total: usage.tokensIn + usage.tokensOut,
  })).slice(-7); // Last 7 days

  return (
    <div className="min-h-screen">
      <Header onRefresh={fetchData} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-anime-gradient bg-clip-text text-transparent">
            Token Audit Dashboard
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Monitor your OpenClaw token usage with real-time analytics and insights
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Tokens In"
            value={total.tokensIn.toLocaleString()}
            icon={TrendingUp}
            trend={{ value: 12, direction: 'up' }}
            color="primary"
          />
          
          <StatsCard
            title="Total Tokens Out"
            value={total.tokensOut.toLocaleString()}
            icon={Zap}
            trend={{ value: 8, direction: 'up' }}
            color="secondary"
          />
          
          <StatsCard
            title="Context Tokens"
            value={total.context.toLocaleString()}
            icon={Eye}
            trend={{ value: 5, direction: 'up' }}
            color="accent"
          />
          
          <StatsCard
            title="Active Sessions"
            value={totalSessions.toString()}
            icon={Activity}
            trend={{ value: 3, direction: 'up' }}
            color="primary"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Active Agents"
            value={activeAgents.toString()}
            icon={Cpu}
            color="secondary"
            size="small"
          />
          
          <StatsCard
            title="Active Channels"
            value={activeChannels.toString()}
            icon={MessageSquare}
            color="accent"
            size="small"
          />
          
          <StatsCard
            title="Tools Available"
            value={totalTools.toString()}
            icon={BarChart3}
            color="primary"
            size="small"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TokenChart data={chartData} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background-secondary/50 backdrop-blur-sm border border-primary-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6 text-center">Agent Distribution</h3>
            <div className="space-y-4">
              {Object.entries(agents).map(([agent, count]) => (
                <div key={agent} className="flex items-center justify-between">
                  <span className="text-text-secondary capitalize">{agent}</span>
                  <div className="flex items-center space-x-3">
                    <div className="bg-background-tertiary rounded-full h-2 w-32 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(agents))) * 100}%` }}
                      />
                    </div>
                    <span className="text-text-primary font-mono w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SessionsTable sessions={sessions} />
        </motion.div>
      </main>
    </div>
  );
}