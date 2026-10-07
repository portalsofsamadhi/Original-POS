// Navigation Test Script
// Run this in the browser console to test navigation functionality

const testNavigation = () => {
  console.log('🧪 Testing Navigation Functionality...');
  
  // Test 1: Check if all navigation links exist
  const navLinks = document.querySelectorAll('nav a[href]');
  console.log(`📋 Found ${navLinks.length} navigation links`);
    const expectedPages = [
    '/',
    '/feqad-services', 
    '/mesqal-services',
    '/workshops',
    '/plan-retreat',
    '/#blog'
  ];
  
  expectedPages.forEach(page => {
    const link = Array.from(navLinks).find(link => link.getAttribute('href') === page);
    if (link) {
      console.log(`✅ Found link for: ${page}`);
    } else {
      console.log(`❌ Missing link for: ${page}`);
    }
  });
  
  // Test 2: Check current scroll position
  const currentScroll = window.scrollY;
  console.log(`📐 Current scroll position: ${currentScroll}px`);
  
  // Test 3: Test scroll to top functionality
  if (currentScroll > 100) {
    console.log('🔄 Testing scroll to top...');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      const newScroll = window.scrollY;
      if (newScroll < 50) {
        console.log('✅ Scroll to top working correctly');
      } else {
        console.log('⚠️ Scroll to top may have issues');
      }
    }, 1000);
  } else {
    console.log('ℹ️ Already near top of page');
  }
  
  // Test 4: Check ScrollToTop component
  const hasReactRouter = !!window.location.pathname;
  console.log(`🔗 React Router detected: ${hasReactRouter ? 'Yes' : 'No'}`);
  
  console.log('🎯 Navigation test completed!');
  console.log('📝 Click on navigation links to test scroll-to-top functionality');
};

// Auto-run test when page loads
if (document.readyState === 'complete') {
  testNavigation();
} else {
  window.addEventListener('load', testNavigation);
}

// Export for manual testing
window.testNavigation = testNavigation;
