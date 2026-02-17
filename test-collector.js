const TokenCollector = require('./index.js');

async function testCollector() {
  console.log('🧪 Testing Token Collector...');
  
  const collector = new TokenCollector();
  
  try {
    // Test single collection
    const result = await collector.collectSessionStatus();
    console.log('✅ Collection test result:', result);
    
    // Test rate limiting
    console.log('🔄 Testing rate limiting...');
    await collector.checkRateLimit(100);
    console.log('✅ Rate limiting works');
    
    // Test data storage
    collector.data.tokenUsage.total = { tokensIn: 1000, tokensOut: 2000, context: 500 };
    await collector.saveData();
    console.log('✅ Data storage works');
    
    // Test data access methods
    const latestData = collector.getLatestData();
    const currentUsage = collector.getCurrentUsage();
    
    console.log('📊 Latest data structure:', Object.keys(latestData));
    console.log('📈 Current usage:', currentUsage);
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testCollector();
}