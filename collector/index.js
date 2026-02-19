require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

class TokenCollector {
  constructor() {
    this.gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
    this.token = process.env.OPENCLAW_TOKEN;
    this.dataDir = path.join(__dirname, 'data');
    this.logFile = path.join(this.dataDir, 'collection.log');
    
    // Rate limiting: max 30k tokens per minute (500 tokens per second)
    this.tokenBudget = 30000; // tokens per minute
    this.budgetWindow = 60000; // 1 minute in ms
    this.currentBudget = this.tokenBudget;
    this.lastReset = Date.now();
    this.requestDelay = 5000; // 5 seconds between calls
    
    this.data = {
      sessions: [],
      tools: {},
      agents: {},
      channels: {},
      context: [],
      tokenUsage: {
        daily: {},
        hourly: {},
        total: { tokensIn: 0, tokensOut: 0, context: 0 }
      }
    };
    
    this.isCollecting = false;
    this.initializeDirectories();
  }

  async initializeDirectories() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.log('🌸 Token Collector initialized');
    } catch (error) {
      console.error('❌ Failed to initialize directories:', error.message);
    }
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    console.log(message);
    
    try {
      await fs.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  // Rate limiting functionality
  async checkRateLimit(expectedTokens = 100) {
    const now = Date.now();
    
    // Reset budget if window has passed
    if (now - this.lastReset >= this.budgetWindow) {
      this.currentBudget = this.tokenBudget;
      this.lastReset = now;
    }
    
    // Check if we have enough budget
    if (this.currentBudget < expectedTokens) {
      const waitTime = this.budgetWindow - (now - this.lastReset);
      await this.log(`⏳ Rate limit reached, waiting ${Math.ceil(waitTime/1000)}s`, 'warn');
      await this.sleep(waitTime);
      this.currentBudget = this.tokenBudget;
      this.lastReset = Date.now();
    }
    
    this.currentBudget -= expectedTokens;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeGatewayRequest(endpoint, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.checkRateLimit();
        
        const config = {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };
        
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await axios.get(`${this.gatewayUrl}${endpoint}`, config);
        
        // Check if response is JSON
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Endpoint returned ${contentType}, expected JSON`);
        }
        
        return response.data;
        
      } catch (error) {
        if (attempt === retries) {
          throw new Error(`Gateway request failed after ${retries} attempts: ${error.message}`);
        }
        
        const backoff = Math.pow(2, attempt) * 1000;
        await this.log(`🔄 Attempt ${attempt} failed, retrying in ${backoff/1000}s: ${error.message}`, 'warn');
        await this.sleep(backoff);
      }
    }
  }

  async collectSessionStatus() {
    try {
      await this.log('🔍 Collecting session status data...');
      
      let sessionData = null;
      
      // Try to parse log files or find other data sources first
      sessionData = await this.collectFromLogs();
      
      if (!sessionData) {
        // Try WebSocket or HTTP endpoints if available
        sessionData = await this.collectFromAPI();
      }
      
      if (!sessionData) {
        await this.log('⚠️  No real data sources accessible - skipping collection', 'warn');
      }
      
      return sessionData;
      
    } catch (error) {
      await this.log(`❌ Collection error: ${error.message}`, 'error');
      return null;
    }
  }

  async collectFromLogs() {
    try {
      // Try to read OpenClaw logs for token usage information
      const possibleLogPaths = [
        '/home/ubuntu/.openclaw/logs',
        '/var/log/openclaw',
        '/tmp/openclaw.log'
      ];
      
      for (const logPath of possibleLogPaths) {
        try {
          const exists = await fs.access(logPath).then(() => true).catch(() => false);
          if (exists) {
            await this.log(`📂 Found logs at: ${logPath}`);
            // TODO: Parse logs for token usage information
            // This would require understanding OpenClaw's log format
          }
        } catch (error) {
          // Continue to next path
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async collectFromAPI() {
    try {
      // Use the gateway API to fetch real session data
      await this.log('📡 Fetching real session data from OpenClaw gateway...');
      
      try {
        // Try to connect to the gateway using environment variables
        const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
        const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN || '';
        
        // For now, we'll collect from actual session transcripts
        // since the gateway REST API is primarily for UI
        const sessionData = await this.collectFromTranscripts();
        if (sessionData) {
          return sessionData;
        }
      } catch (error) {
        await this.log(`⚠️  Gateway API request failed: ${error.message}`, 'warn');
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async collectFromTranscripts() {
    try {
      // Read real session transcripts from OpenClaw's session directory
      const sessionsDir = '/home/ubuntu/.openclaw/agents/main/sessions';
      
      // Check if directory exists
      try {
        await fs.access(sessionsDir);
      } catch {
        return null;
      }
      
      const sessionFiles = await fs.readdir(sessionsDir);
      const transcriptFiles = sessionFiles.filter(f => f.endsWith('.jsonl'));
      
      if (transcriptFiles.length === 0) {
        return null;
      }
      
      // Read the most recently modified transcript
      let latestFile = null;
      let latestTime = 0;
      
      for (const file of transcriptFiles) {
        try {
          const filePath = path.join(sessionsDir, file);
          const stats = await fs.stat(filePath);
          if (stats.mtimeMs > latestTime) {
            latestTime = stats.mtimeMs;
            latestFile = filePath;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!latestFile) {
        return null;
      }
      
      await this.log(`📂 Reading session data from: ${path.basename(latestFile)}`);
      
      // Parse the JSONL file (one JSON object per line)
      const content = await fs.readFile(latestFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      // Get the last complete message (most recent) that has usage data
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const logEntry = JSON.parse(lines[i]);
          
          // Handle different entry types - look for actual message entries with usage
          let message = null;
          let usage = null;
          let timestamp = null;
          
          if (logEntry.message && logEntry.message.usage && typeof logEntry.message.usage.totalTokens === 'number') {
            // Format: {"type": "message", "message": {...}, "usage": {...}}
            message = logEntry.message;
            usage = logEntry.message.usage;
            timestamp = logEntry.timestamp;
          } else if (logEntry.usage && typeof logEntry.usage.totalTokens === 'number') {
            // Alternate format
            usage = logEntry.usage;
            message = logEntry.message || {};
            timestamp = logEntry.timestamp;
          }
          
          if (usage && timestamp) {
            // Parse agent name from model or message metadata
            let agentName = logEntry.model || message.model || 'claude-haiku-4-5';
            
            return {
              tokensIn: usage.input || 0,
              tokensOut: usage.output || 0,
              context: (usage.cacheRead || 0) + (usage.cacheWrite || 0),
              session: {
                id: path.basename(latestFile, '.jsonl'),
                agent: agentName,
                channel: 'main',
                started: new Date(new Date(timestamp).getTime() - (usage.totalTokens * 5)).toISOString(), // Estimate start time
                simulated: false
              },
              timestamp: timestamp
            };
          }
        } catch (error) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      await this.log(`❌ Transcript collection error: ${error.message}`, 'warn');
      return null;
    }
  }

  async collectMetrics() {
    try {
      const sessionData = await this.collectSessionStatus();
      if (!sessionData) return null;
      
      const timestamp = new Date().toISOString();
      const dateKey = timestamp.split('T')[0];
      const hourKey = timestamp.split('T')[0] + 'T' + timestamp.split('T')[1].split(':')[0] + ':00';
      
      // Update session data
      this.data.sessions.push({
        timestamp,
        ...sessionData
      });
      
      // Update token usage tracking
      if (!this.data.tokenUsage.daily[dateKey]) {
        this.data.tokenUsage.daily[dateKey] = { tokensIn: 0, tokensOut: 0, context: 0 };
      }
      
      if (!this.data.tokenUsage.hourly[hourKey]) {
        this.data.tokenUsage.hourly[hourKey] = { tokensIn: 0, tokensOut: 0, context: 0 };
      }
      
      // Accumulate token usage
      const tokensIn = sessionData.tokensIn || 0;
      const tokensOut = sessionData.tokensOut || 0;
      const context = sessionData.context || 0;
      
      this.data.tokenUsage.daily[dateKey].tokensIn += tokensIn;
      this.data.tokenUsage.daily[dateKey].tokensOut += tokensOut;
      this.data.tokenUsage.daily[dateKey].context += context;
      
      this.data.tokenUsage.hourly[hourKey].tokensIn += tokensIn;
      this.data.tokenUsage.hourly[hourKey].tokensOut += tokensOut;
      this.data.tokenUsage.hourly[hourKey].context += context;
      
      this.data.tokenUsage.total.tokensIn += tokensIn;
      this.data.tokenUsage.total.tokensOut += tokensOut;
      this.data.tokenUsage.total.context += context;
      
      // Track tools, agents, channels if available
      if (sessionData.session) {
        const { agent, channel } = sessionData.session;
        
        if (agent) {
          this.data.agents[agent] = (this.data.agents[agent] || 0) + 1;
        }
        
        if (channel) {
          this.data.channels[channel] = (this.data.channels[channel] || 0) + 1;
        }
      }
      
      // Log the collection
      await this.log(`📈 Collected: ${tokensIn} in, ${tokensOut} out, ${context} context`);
      
      // Save data periodically
      await this.saveData();
      
      return sessionData;
      
    } catch (error) {
      await this.log(`❌ Metrics collection error: ${error.message}`, 'error');
      return null;
    }
  }

  async saveData() {
    try {
      const dataFile = path.join(this.dataDir, `token-data-${new Date().toISOString().split('T')[0]}.json`);
      await fs.writeFile(dataFile, JSON.stringify(this.data, null, 2));
      
      // Also save a latest.json for easy access
      const latestFile = path.join(this.dataDir, 'latest.json');
      await fs.writeFile(latestFile, JSON.stringify(this.data, null, 2));
      
    } catch (error) {
      await this.log(`❌ Data save error: ${error.message}`, 'error');
    }
  }

  async loadExistingData() {
    try {
      const latestFile = path.join(this.dataDir, 'latest.json');
      const data = await fs.readFile(latestFile, 'utf8');
      this.data = { ...this.data, ...JSON.parse(data) };
      await this.log('📂 Loaded existing data');
    } catch (error) {
      await this.log('📂 No existing data found, starting fresh');
    }
  }

  async startCollection() {
    if (this.isCollecting) {
      await this.log('⚠️  Collection already running', 'warn');
      return;
    }
    
    this.isCollecting = true;
    await this.log('🌸 Token Collector started');
    await this.loadExistingData();
    
    // Initial collection
    await this.collectMetrics();
    
    // Set up continuous collection with 5-second delays
    const collectInterval = setInterval(async () => {
      if (!this.isCollecting) {
        clearInterval(collectInterval);
        return;
      }
      
      await this.collectMetrics();
      await this.sleep(this.requestDelay);
      
    }, this.requestDelay);
    
    // Set up daily data archival (runs at midnight)
    cron.schedule('0 0 * * *', async () => {
      await this.log('🗄️  Running daily data archival');
      await this.archiveDailyData();
    });
    
    // Set up hourly summary reports
    cron.schedule('0 * * * *', async () => {
      await this.generateHourlySummary();
    });
    
    // Graceful shutdown handling
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  async archiveDailyData() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateKey = yesterday.toISOString().split('T')[0];
      
      const archiveFile = path.join(this.dataDir, 'archives', `${dateKey}.json`);
      await fs.mkdir(path.dirname(archiveFile), { recursive: true });
      
      const archiveData = {
        date: dateKey,
        tokenUsage: this.data.tokenUsage.daily[dateKey] || { tokensIn: 0, tokensOut: 0, context: 0 },
        agents: { ...this.data.agents },
        channels: { ...this.data.channels },
        tools: { ...this.data.tools }
      };
      
      await fs.writeFile(archiveFile, JSON.stringify(archiveData, null, 2));
      await this.log(`🗄️  Archived data for ${dateKey}`);
      
    } catch (error) {
      await this.log(`❌ Archive error: ${error.message}`, 'error');
    }
  }

  async generateHourlySummary() {
    try {
      const now = new Date();
      const hourKey = now.toISOString().split('T')[0] + 'T' + now.toISOString().split('T')[1].split(':')[0];
      const usage = this.data.tokenUsage.hourly[hourKey] || { tokensIn: 0, tokensOut: 0, context: 0 };
      
      await this.log(`📊 Hourly Summary (${hourKey}): ${usage.tokensIn} in, ${usage.tokensOut} out, ${usage.context} context`);
      
    } catch (error) {
      await this.log(`❌ Summary error: ${error.message}`, 'error');
    }
  }

  async shutdown() {
    await this.log('🛑 Shutting down token collector...');
    this.isCollecting = false;
    await this.saveData();
    await this.log('✅ Collector shutdown complete');
    process.exit(0);
  }

  // Public methods for external access
  getLatestData() {
    return { ...this.data };
  }

  getCurrentUsage() {
    return { ...this.data.tokenUsage.total };
  }

  async getHistoricalData(days = 7) {
    try {
      const files = await fs.readdir(path.join(this.dataDir, 'archives'));
      const recentFiles = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .slice(-days);
      
      const historicalData = [];
      for (const file of recentFiles) {
        const data = await fs.readFile(path.join(this.dataDir, 'archives', file), 'utf8');
        historicalData.push(JSON.parse(data));
      }
      
      return historicalData;
    } catch (error) {
      await this.log(`❌ Historical data error: ${error.message}`, 'error');
      return [];
    }
  }
}

if (require.main === module) {
  const collector = new TokenCollector();
  collector.startCollection().catch(error => {
    console.error('❌ Failed to start collector:', error);
    process.exit(1);
  });
}

module.exports = TokenCollector;