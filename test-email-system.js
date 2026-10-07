// Test script to verify email functionality
// This script tests both booking confirmation and newsletter subscription emails

const testEmailSystem = async () => {
  console.log('🧪 Testing Email System...\n');

  // Test 1: Newsletter Subscription
  console.log('📧 Testing Newsletter Subscription...');
  try {
    const response = await fetch('http://localhost:10000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      }),
    });

    const data = await response.json();
    console.log('✅ Newsletter API Response:', data);
    
    if (data.success) {
      console.log('✅ Newsletter subscription successful - Welcome email should be sent!');
    } else {
      console.log('❌ Newsletter subscription failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Newsletter API Error:', error.message);
    console.log('💡 Make sure the server is running on port 3001');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Booking Confirmation Email
  console.log('📧 Testing Booking Confirmation Email...');
  try {
    const bookingData = {
      serviceName: 'Traditional Healing Session',
      practitionerName: 'Feq\'ad Wolde',
      date: 'Monday, July 15, 2025',
      time: '10:00 AM',
      serviceDuration: '60 minutes',
      name: 'Test User',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      notes: 'First time session'
    };

    const paymentDetails = {
      transactionId: 'TEST-' + Date.now(),
      amount: 150,
      paymentMethod: 'PayPal'
    };

    const response = await fetch('http://localhost:10000/api/send-booking-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'test@example.com',
        bookingData,
        paymentDetails
      }),
    });

    const data = await response.json();
    console.log('✅ Booking Email API Response:', data);
    
    if (data.success) {
      console.log('✅ Booking confirmation email sent successfully!');
    } else {
      console.log('❌ Booking confirmation email failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Booking Email API Error:', error.message);
    console.log('💡 Make sure the server is running on port 3001');
  }

  console.log('\n📋 Test Summary:');
  console.log('1. Newsletter subscription with welcome email');
  console.log('2. Booking confirmation email with detailed template');
  console.log('\n🚀 To run the server: cd server && npm run dev');
  console.log('🔧 Server should run on http://localhost:10000');
};

// Run the test
testEmailSystem();
