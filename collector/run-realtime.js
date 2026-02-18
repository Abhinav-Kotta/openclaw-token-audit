#!/usr/bin/env node
require('dotenv').config();
const TokenCollector = require('./index.js');

const collector = new TokenCollector();

async function runCollection() {
  try {
    await collector.loadExistingData();
    await collector.collectMetrics();
    console.log(`[${new Date().toISOString()}] ✅ Real data collection complete`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Collection error:`, error.message);
  }
}

// Run immediately
runCollection();

// Then run every 5 minutes
setInterval(runCollection, 5 * 60 * 1000);

console.log('🔄 Real-time data collector started (every 5 minutes)');
