import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

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

function getCollectorDataPath(): string {
  // Try different possible paths for the collector data
  const possiblePaths = [
    // Development path (when running from dashboard directory)
    join(process.cwd(), '../collector/data/latest.json'),
    // Production path (when deployed)
    join(process.cwd(), 'collector/data/latest.json'),
    // Alternative path
    join(process.cwd(), '../../collector/data/latest.json'),
    // Absolute path fallback
    '/home/ubuntu/.openclaw/workspace/token-audit/collector/data/latest.json',
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error('Collector data file not found');
}

function getMockData(): TokenData {
  return {
    sessions: [
      {
        timestamp: new Date().toISOString(),
        tokensIn: 1250,
        tokensOut: 2100,
        context: 150,
        session: {
          id: 'demo-session-' + Date.now(),
          agent: 'claude-3-sonnet',
          channel: 'webchat',
          started: new Date(Date.now() - 3600000).toISOString(),
          simulated: true
        }
      },
      {
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        tokensIn: 890,
        tokensOut: 1540,
        context: 120,
        session: {
          id: 'demo-session-' + (Date.now() - 1800000),
          agent: 'gpt-4',
          channel: 'discord',
          started: new Date(Date.now() - 5400000).toISOString(),
          simulated: true
        }
      }
    ],
    tools: {
      'web_search': 15,
      'code_execution': 8,
      'file_operations': 12,
      'image_analysis': 5
    },
    agents: {
      'claude-3-sonnet': 12,
      'gpt-4': 8,
      'gpt-3.5-turbo': 5
    },
    channels: {
      'webchat': 15,
      'discord': 7,
      'slack': 3
    },
    context: [],
    tokenUsage: {
      daily: (() => {
        const daily: Record<string, { tokensIn: number; tokensOut: number; context: number }> = {};
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          daily[dateStr] = {
            tokensIn: Math.floor(Math.random() * 2000) + 1000,
            tokensOut: Math.floor(Math.random() * 3000) + 1500,
            context: Math.floor(Math.random() * 500) + 100
          };
        }
        return daily;
      })(),
      hourly: (() => {
        const hourly: Record<string, { tokensIn: number; tokensOut: number; context: number }> = {};
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now);
          hour.setHours(hour.getHours() - i);
          const hourStr = hour.toISOString().substr(0, 13);
          
          hourly[hourStr] = {
            tokensIn: Math.floor(Math.random() * 500) + 200,
            tokensOut: Math.floor(Math.random() * 800) + 300,
            context: Math.floor(Math.random() * 100) + 20
          };
        }
        return hourly;
      })(),
      total: {
        tokensIn: 45230,
        tokensOut: 78940,
        context: 12150
      }
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    let data: TokenData;

    try {
      const dataPath = getCollectorDataPath();
      const fileContent = readFileSync(dataPath, 'utf-8');
      data = JSON.parse(fileContent);
      
      // Ensure the data has all required properties
      if (!data.tokenUsage || !data.sessions) {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.log('Using mock data due to error:', error);
      data = getMockData();
    }

    const response = NextResponse.json(data);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch token data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}