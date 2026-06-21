// Test production API endpoints
import fetch from 'node-fetch';

const API_BASE = 'https://pos-api.onrender.com';
const LOCAL_API = 'http://localhost:10000';

async function testAPI(baseUrl) {
  console.log(`\n🧪 Testing API at: ${baseUrl}`);
  
  try {
    // Test health endpoint
    console.log('Testing /api/health...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test newsletter subscription
    console.log('\nTesting newsletter subscription...');
    const subscribeResponse = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        phone: '+1234567890'
      })
    });
    const subscribeData = await subscribeResponse.json();
    console.log('📧 Newsletter subscribe:', subscribeData);
    
    // Test booking creation
    console.log('\nTesting booking creation...');
    const bookingResponse = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        service: 'retreat',
        date: '2025-02-01',
        notes: 'Test booking from production test'
      })
    });
    const bookingData = await bookingResponse.json();
    console.log('📅 Booking creation:', bookingData);
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

// Test both production and local if available
async function runTests() {
  console.log('🚀 Starting API endpoint tests...');
  
  // Test production API
  await testAPI(API_BASE);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Production API tests completed!');
  console.log('🌐 If all tests passed, your production deployment should work correctly.');
  console.log('🔗 Frontend: https://www.portalsofsamadhi.com');
  console.log('🔗 API: https://pos-api.onrender.com');
}

runTests().catch(console.error);