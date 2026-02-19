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

      // Filter out simulated sessions - only show real data
      data.sessions = data.sessions.filter(session => !session.session?.simulated);
      
      // Recalculate statistics based on real sessions only
      let totalTokensIn = 0;
      let totalTokensOut = 0;
      let totalContext = 0;
      
      const newDaily: Record<string, { tokensIn: number; tokensOut: number; context: number }> = {};
      const newHourly: Record<string, { tokensIn: number; tokensOut: number; context: number }> = {};
      
      data.sessions.forEach(session => {
        totalTokensIn += session.tokensIn || 0;
        totalTokensOut += session.tokensOut || 0;
        totalContext += session.context || 0;
        
        // Aggregate by date
        const dateKey = session.timestamp.split('T')[0];
        if (!newDaily[dateKey]) {
          newDaily[dateKey] = { tokensIn: 0, tokensOut: 0, context: 0 };
        }
        newDaily[dateKey].tokensIn += session.tokensIn || 0;
        newDaily[dateKey].tokensOut += session.tokensOut || 0;
        newDaily[dateKey].context += session.context || 0;
        
        // Aggregate by hour
        const hourKey = session.timestamp.substring(0, 13);
        if (!newHourly[hourKey]) {
          newHourly[hourKey] = { tokensIn: 0, tokensOut: 0, context: 0 };
        }
        newHourly[hourKey].tokensIn += session.tokensIn || 0;
        newHourly[hourKey].tokensOut += session.tokensOut || 0;
        newHourly[hourKey].context += session.context || 0;
      });
      
      // Update token usage with real data only
      data.tokenUsage = {
        daily: newDaily,
        hourly: newHourly,
        total: {
          tokensIn: totalTokensIn,
          tokensOut: totalTokensOut,
          context: totalContext
        }
      };
    } catch (error) {
      console.error('Failed to load real data:', error);
      throw new Error('No real data available. Please ensure the collector is running and has collected data.');
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