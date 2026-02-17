#!/usr/bin/env node

/**
 * Active Token Collector Runner
 * 
 * Fetches real token usage data from OpenClaw gateway
 * and updates latest.json with actual metrics
 * 
 * Usage:
 *   node run-collector.js         # Run once
 *   npm run collect               # Run once (via package.json)
 *   node run-collector.js --watch # Run every 5 minutes
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const TokenCollector = require('./index.js');

class ActiveCollector {
  constructor() {
    this.lastRun = null;
    this.dataFile = path.join(__dirname, 'data/latest.json');
  }

  async validateConfiguration() {
    console.log('\n🔍 Validating Configuration...');
    
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
    const token = process.env.OPENCLAW_TOKEN;
    
    if (!gatewayUrl) {
      console.error('❌ OPENCLAW_GATEWAY_URL not set in .env');
      process.exit(1);
    }
    
    if (!token || token === '__OPENCLAW_TOKEN__') {
      console.warn('⚠️  OPENCLAW_TOKEN not configured in .env');
      console.warn('   Using default OpenClaw token from gateway auth.');
    }
    
    console.log(`✅ Gateway URL: ${gatewayUrl}`);
    console.log(`✅ Token configured: ${token ? 'yes' : 'default'}`);
  }

  async runCollection() {
    const startTime = Date.now();
    console.log(`\n⏱️  Starting collection at ${new Date().toISOString()}`);
    
    try {
      const collector = new TokenCollector();
      
      // Load existing data
      await collector.loadExistingData();
      console.log('📚 Loaded existing data');
      
      // Collect metrics (connects to gateway and fetches real data)
      console.log('🔄 Fetching metrics from gateway...');
      const result = await collector.collectMetrics();
      
      if (!result) {
        console.warn('⚠️  No new metrics collected this cycle');
      } else {
        console.log('✅ Collected new metrics');
      }
      
      // Log results
      const data = collector.data;
      const totalTokens = 
        data.tokenUsage.total.tokensIn + 
        data.tokenUsage.total.tokensOut + 
        data.tokenUsage.total.context;
      
      console.log('\n📈 Collection Summary:');
      console.log(`   Sessions: ${data.sessions.length}`);
      console.log(`   Tokens In: ${data.tokenUsage.total.tokensIn.toLocaleString()}`);
      console.log(`   Tokens Out: ${data.tokenUsage.total.tokensOut.toLocaleString()}`);
      console.log(`   Context: ${data.tokenUsage.total.context.toLocaleString()}`);
      console.log(`   Total: ${totalTokens.toLocaleString()}`);
      console.log(`   Agents: ${Object.keys(data.agents).length} ${JSON.stringify(data.agents)}`);
      console.log(`   Channels: ${Object.keys(data.channels).length} ${JSON.stringify(data.channels)}`);
      console.log(`   Tools: ${Object.keys(data.tools).length} ${JSON.stringify(data.tools)}`);
      
      // Show daily stats
      const today = new Date().toISOString().split('T')[0];
      const todayUsage = data.tokenUsage.daily[today] || { tokensIn: 0, tokensOut: 0, context: 0 };
      console.log(`\n📅 Today's Usage (${today}):`);
      console.log(`   In: ${todayUsage.tokensIn.toLocaleString()}`);
      console.log(`   Out: ${todayUsage.tokensOut.toLocaleString()}`);
      console.log(`   Context: ${todayUsage.context.toLocaleString()}`);
      
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`\n✅ Collection complete in ${elapsed}s`);
      
      this.lastRun = new Date();
      return true;
      
    } catch (error) {
      console.error(`\n❌ Collection failed: ${error.message}`);
      return false;
    }
  }

  async watchMode() {
    console.log('\n👀 Watch mode enabled (runs every 5 minutes)');
    console.log('   Press Ctrl+C to stop\n');
    
    // Run immediately
    await this.runCollection();
    
    // Then every 5 minutes
    const interval = setInterval(async () => {
      console.log('\n' + '='.repeat(60));
      await this.runCollection();
    }, 5 * 60 * 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Stopping collector...');
      clearInterval(interval);
      process.exit(0);
    });
  }

  async run(args = []) {
    await this.validateConfiguration();
    
    if (args.includes('--watch')) {
      await this.watchMode();
    } else {
      // Default: run once
      await this.runCollection();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const collector = new ActiveCollector();
  collector.run(process.argv.slice(2)).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = ActiveCollector;
