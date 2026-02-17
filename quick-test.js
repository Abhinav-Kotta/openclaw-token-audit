const TokenCollector = require('./index.js');

async function quickTest() {
  console.log('🧪 Quick test of Token Collector core functionality...');
  
  const collector = new TokenCollector();
  
  try {
    // Test simulated data generation
    const simData = collector.generateSimulatedData();
    console.log('✅ Simulation data:', simData);
    
    // Test rate limiting functionality
    console.log('🔄 Testing rate limiting...');
    await collector.checkRateLimit(100);
    console.log('✅ Rate limiting works');
    
    // Test data structure
    collector.data.tokenUsage.total = { tokensIn: 1000, tokensOut: 2000, context: 500 };
    await collector.saveData();
    console.log('✅ Data storage works');
    
    // Test metrics collection with simulated data
    const result = await collector.collectMetrics();
    console.log('✅ Metrics collection works');
    
    const latestData = collector.getLatestData();
    const currentUsage = collector.getCurrentUsage();
    
    console.log('📊 Current usage:', currentUsage);
    console.log('📈 Sessions collected:', latestData.sessions.length);
    
    console.log('✅ All core functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

if (require.main === module) {
  quickTest().then(() => process.exit(0));
}