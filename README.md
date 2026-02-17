# 🌸 OpenClaw Token Collector

A robust Node.js service that collects and analyzes OpenClaw token usage data with intelligent API integration, rate limiting, and comprehensive reporting.

## ✨ Features

- **Smart Data Collection**: Automatically detects and adapts to available data sources
- **Rate Limiting**: Built-in protection with max 30k tokens/minute and 5-second delays
- **Error Handling**: Comprehensive retry logic and graceful fallback mechanisms
- **Data Storage**: Structured JSON storage with daily archives
- **Real-time Simulation**: Generates realistic data patterns when APIs are unavailable
- **Automated Reporting**: Daily and weekly audit reports in JSON and Markdown formats
- **Scheduled Tasks**: Automated archival and reporting using cron jobs

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Configuration
Copy the example environment file and configure:
```bash
cp .env.example .env
# Edit .env with your settings
```

### Running the Collector
```bash
# Start continuous collection
npm start

# Or run directly
node index.js

# Generate daily audit report
npm run audit
```

## 📊 Data Collection Strategy

The collector uses a multi-layered approach to gather token usage data:

1. **Log File Analysis**: Scans OpenClaw logs for usage patterns
2. **API Integration**: Attempts connection to various OpenClaw endpoints:
   - `/api/session/status`
   - `/api/stats` 
   - `/session_status`
   - `/api/usage`
3. **Intelligent Simulation**: Generates realistic usage patterns based on time and usage patterns

## 🔧 Configuration Options

### Environment Variables
```bash
# OpenClaw Gateway Configuration
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_TOKEN=your_openclaw_token

# GitHub Integration (for automated reporting)
GITHUB_TOKEN=your_github_pat_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=openclaw-token-audit
```

## 📈 Rate Limiting

The collector implements sophisticated rate limiting to prevent overwhelming the OpenClaw gateway:

- **Token Budget**: Maximum 30,000 tokens per minute
- **Request Delays**: 5-second intervals between API calls
- **Exponential Backoff**: Progressive retry delays on failures
- **Smart Queuing**: Automatic budget reset every minute

## 📁 Data Structure

### Storage Organization
```
collector/
├── data/
│   ├── latest.json              # Current data snapshot
│   ├── token-data-YYYY-MM-DD.json  # Daily data files
│   ├── archives/                # Historical archives
│   └── collection.log           # Activity log
└── reports/
    ├── audit-YYYY-MM-DD.json    # Daily reports (JSON)
    ├── audit-YYYY-MM-DD.md      # Daily reports (Markdown)
    └── weekly-YYYY-MM-DD.json   # Weekly analysis
```

### Data Format
```javascript
{
  "sessions": [/* Session records */],
  "tokenUsage": {
    "total": { "tokensIn": 0, "tokensOut": 0, "context": 0 },
    "daily": { "2026-02-16": { /* daily usage */ } },
    "hourly": { "2026-02-16T14": { /* hourly usage */ } }
  },
  "agents": { "claude-sonnet": 45, "gpt-4": 23 },
  "channels": { "webchat": 32, "api": 18 },
  "tools": { "browser": 12, "exec": 8 }
}
```

## 🛠️ API Methods

### Core Methods
```javascript
const collector = new TokenCollector();

// Start continuous collection
await collector.startCollection();

// Get current data snapshot
const data = collector.getLatestData();

// Get current token usage totals
const usage = collector.getCurrentUsage();

// Get historical data (last N days)
const history = await collector.getHistoricalData(7);

// Generate daily report
const audit = new DailyAudit();
const report = await audit.generateDailyReport();
```

## 📋 Testing

### Run Tests
```bash
# Quick functionality test
node quick-test.js

# Full integration test
node test-collector.js
```

### Test Coverage
- ✅ Data collection and simulation
- ✅ Rate limiting functionality  
- ✅ Error handling and retries
- ✅ Data storage and retrieval
- ✅ Report generation
- ✅ API endpoint detection

## 🔄 Automation Features

### Scheduled Tasks
- **Continuous Collection**: Every 5 seconds during active periods
- **Daily Archives**: Automated at midnight (cron: `0 0 * * *`)
- **Hourly Summaries**: Status reports every hour (cron: `0 * * * *`)
- **Weekly Analysis**: Comprehensive reports on Sundays

### Error Recovery
- Automatic retry with exponential backoff
- Graceful fallback to simulation data
- Persistent storage across restarts
- Comprehensive logging for debugging

## 🌟 Advanced Features

### Intelligent Simulation
When real data is unavailable, the collector generates realistic patterns:
- **Time-based Variations**: Higher usage during business hours
- **Random Agent Selection**: Rotates between available AI models  
- **Channel Distribution**: Simulates usage across different interfaces
- **Realistic Token Ranges**: Based on typical usage patterns

### Performance Optimization
- **Memory Efficient**: Streaming data processing for large datasets
- **Async Operations**: Non-blocking I/O for all file operations
- **Background Processing**: Separated collection from reporting tasks
- **Graceful Shutdown**: Clean process termination with data preservation

## 🔍 Monitoring and Logging

### Log Levels
- **INFO**: Normal operations and status updates
- **WARN**: Non-critical issues and fallback activations  
- **ERROR**: Critical errors requiring attention

### Key Metrics Tracked
- Token usage (in/out/context) per session, hour, and day
- Agent utilization across different AI models
- Channel distribution (webchat, API, CLI, etc.)
- Tool usage frequency and patterns
- Error rates and API availability

## 🤝 Integration

### Dashboard Integration
The collector provides data for the anime-style dashboard:
```javascript
// Get data for dashboard
const dashboardData = {
  current: collector.getCurrentUsage(),
  recent: collector.getLatestData().sessions.slice(-24),
  trends: await collector.getHistoricalData(7)
};
```

### GitHub Automation
Automated repository updates with daily audit results (configured via environment variables).

---

*Built with 🌸 for the OpenClaw Token Audit System*