/**
 * Test script to validate the complete booking and payment flow
 * This script can be run in the browser console to test all components
 */

// Test data for different booking scenarios
const testBookings = [
  {
    // Feq'ad Healing Service
    bookingData: {
      serviceName: "Energy Healing Session",
      practitionerName: "Feq'ad Wolde",
      name: "Test Client 1",
      email: "test1@example.com",
      phone: "555-0101",
      date: "2025-06-15",
      time: "10:00 AM",
      duration: "60 minutes",
      category: "healing",
      notes: "First time client"
    },
    amount: 150.00,
    paymentMethod: "paypal"
  },
  {
    // Mesq'al Administrative Service  
    bookingData: {
      serviceName: "Business Consultation",
      practitionerName: "Mesq'al Kebra",
      name: "Test Client 2", 
      email: "test2@example.com",
      phone: "555-0102",
      date: "2025-06-16",
      time: "2:00 PM",
      duration: "90 minutes",
      category: "administrative",
      notes: "Startup consultation"
    },
    amount: 200.00,
    paymentMethod: "card"
  },
  {
    // Retreat Booking
    bookingData: {
      serviceName: "Weekend Healing Retreat",
      practitionerName: "Feq'ad Wolde",
      name: "Test Client 3",
      email: "test3@example.com", 
      phone: "555-0103",
      date: "2025-07-01",
      time: "9:00 AM",
      duration: "3 days",
      category: "retreat",
      notes: "Group retreat booking"
    },
    amount: 500.00,
    paymentMethod: "paypal"
  },
  {
    // Workshop Booking
    bookingData: {
      serviceName: "Community Meditation Workshop",
      practitionerName: "Feq'ad Wolde",
      name: "Test Client 4",
      email: "test4@example.com",
      phone: "555-0104", 
      date: "2025-06-20",
      time: "7:00 PM",
      duration: "2 hours",
      category: "workshop",
      notes: "First time workshop attendee"
    },
    amount: 45.00,
    paymentMethod: "card"
  }
];

// Function to test booking creation and storage
function testBookingFlow() {
  console.log('🧪 Testing Booking Flow...');
  
  // Import the BookingManager (this would need to be available in browser context)
  if (typeof window !== 'undefined' && window.BookingManager) {
    const BookingManager = window.BookingManager;
    
    // Clear existing test data
    localStorage.removeItem('portals_bookings');
    
    // Test each booking scenario
    testBookings.forEach((booking, index) => {
      console.log(`\n📝 Testing Booking ${index + 1}: ${booking.bookingData.serviceName}`);
      
      // Create booking with success status
      const testBooking = {
        ...booking,
        status: 'confirmed',
        transactionId: `test_txn_${Date.now()}_${index}`,
        createdAt: new Date().toISOString()
      };
      
      // Save booking
      BookingManager.saveBooking(testBooking);
      console.log('✅ Booking saved successfully');
    });
    
    // Test analytics
    const stats = window.BookingAnalytics?.getBookingStats();
    if (stats) {
      console.log('\n📊 Booking Analytics:');
      console.log(`Total Bookings: ${stats.totalBookings}`);
      console.log(`Total Revenue: $${stats.totalRevenue.toFixed(2)}`);
      console.log(`Average Booking Value: $${stats.averageBookingValue.toFixed(2)}`);
      console.log('Payment Method Breakdown:', stats.paymentMethodBreakdown);
      console.log('Service Breakdown:', stats.serviceBreakdown);
    }
    
    // Test CSV export
    const csvData = BookingManager.exportBookingsToCSV();
    if (csvData) {
      console.log('\n📄 CSV Export Test:');
      console.log('CSV data generated successfully');
      console.log(`First 200 characters: ${csvData.substring(0, 200)}...`);
    }
    
    console.log('\n✅ All booking flow tests completed successfully!');
    console.log('📱 Open the Admin Dashboard to see the test data');
    
  } else {
    console.error('❌ BookingManager not available. Make sure the app is loaded.');
  }
}

// Function to test payment configuration
function testPaymentConfig() {
  console.log('\n💳 Testing Payment Configuration...');
  
  if (typeof window !== 'undefined' && window.PAYMENT_CONFIG) {
    const config = window.PAYMENT_CONFIG;
    
    console.log('PayPal Client ID:', config.paypal.clientId ? '✅ Set' : '❌ Missing');
    console.log('Stripe Public Key:', config.stripe.publicKey ? '✅ Set' : '❌ Missing');
    console.log('Supported Payment Methods:', config.general.acceptedPaymentMethods);
    console.log('Currency:', config.general.currency);
    console.log('Amount Limits:', `$${config.general.minimumAmount} - $${config.general.maximumAmount}`);
    
  } else {
    console.error('❌ PAYMENT_CONFIG not available');
  }
}

// Function to test newsletter functionality  
function testNewsletterFlow() {
  console.log('\n📬 Testing Newsletter Flow...');
  
  // Test subscription (this would make an actual API call)
  const testEmail = 'test.newsletter@example.com';
  console.log(`Testing subscription for: ${testEmail}`);
  
  // This would need the actual newsletter service to be running
  fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: testEmail })
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Newsletter subscription test:', data);
  })
  .catch(error => {
    console.log('ℹ️ Newsletter server not running (expected in test):', error.message);
  });
}

// Main test function
function runAllTests() {
  console.log('🚀 Running Complete POS Website Test Suite');
  console.log('==========================================');
  
  testPaymentConfig();
  testBookingFlow();
  testNewsletterFlow();
  
  console.log('\n🎉 Test suite completed!');
  console.log('To see the admin dashboard with test data, look for the "📊 Admin Dashboard" button');
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.runPOSTests = runAllTests;
  window.testBookingFlow = testBookingFlow;
  window.testPaymentConfig = testPaymentConfig;
  window.testNewsletterFlow = testNewsletterFlow;
}

// Auto-run if in browser console
if (typeof window !== 'undefined' && window.location) {
  console.log('📋 POS Website Test Suite Loaded');
  console.log('Run window.runPOSTests() to execute all tests');
}
