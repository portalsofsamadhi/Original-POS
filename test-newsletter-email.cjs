// Test script for newsletter email functionality
const fetch = require('node-fetch');

const testNewsletterEmail = async () => {
  console.log('🧪 Testing Newsletter Email System...\n');

  // Test with a real email address (replace with your test email)
  const testEmail = 'portalsofsamadhi@gmail.com'; // Using the same email for testing
  
  try {
    console.log(`📧 Testing newsletter subscription for: ${testEmail}`);
    
    const response = await fetch('http://localhost:3001/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      }),
    });

    const data = await response.json();
    console.log('✅ Newsletter API Response:', data);
    
    if (data.success) {
      console.log('✅ Newsletter subscription successful!');
      console.log('📬 Welcome email should have been sent to:', testEmail);
      console.log('📝 Check your inbox and spam folder');
    } else {
      console.log('❌ Newsletter subscription failed:', data.error);
      
      // If already subscribed, that's ok for testing
      if (data.error === 'Email already subscribed') {
        console.log('ℹ️ Email already subscribed - this is expected for testing');
      }
    }
  } catch (error) {
    console.log('❌ Newsletter API Error:', error.message);
    console.log('💡 Make sure the newsletter server is running on port 3001');
    console.log('💡 Run: npx ts-node newsletter-server.ts');
  }

  console.log('\n📋 Test Complete!');
  console.log('🔧 To start the server: npx ts-node newsletter-server.ts');
};

// Check if server is running first
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/newsletter/health');
    const data = await response.json();
    console.log('✅ Newsletter server is running:', data);
    console.log('');
    
    // Server is running, proceed with test
    await testNewsletterEmail();
  } catch (error) {
    console.log('❌ Newsletter server is not running');
    console.log('💡 Please start the server first: npx ts-node newsletter-server.ts');
    console.log('💡 Then run this test again: node test-newsletter-email.js');
  }
};

// Run the test
checkServer();
