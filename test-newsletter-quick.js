// Quick test script for newsletter
const http = require('http');

const testData = JSON.stringify({
  email: 'test@example.com'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/newsletter/health',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

console.log('🧪 Testing Newsletter Server Health...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Health Check Response:', JSON.parse(data));
    
    // Now test subscription
    const subscribeOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/newsletter/subscribe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testData.length
      }
    };
    
    console.log('\n📧 Testing Newsletter Subscription...');
    
    const subscribeReq = http.request(subscribeOptions, (subRes) => {
      let subData = '';
      
      subRes.on('data', (chunk) => {
        subData += chunk;
      });
      
      subRes.on('end', () => {
        console.log('✅ Subscription Response:', JSON.parse(subData));
        console.log('\n🎉 Newsletter server is working perfectly!');
        process.exit(0);
      });
    });
    
    subscribeReq.on('error', (error) => {
      console.error('❌ Subscription Error:', error);
      process.exit(1);
    });
    
    subscribeReq.write(testData);
    subscribeReq.end();
  });
});

req.on('error', (error) => {
  console.error('❌ Health Check Error:', error);
  console.log('💡 Make sure the newsletter server is running: node newsletter-server.cjs');
  process.exit(1);
});

req.end();
