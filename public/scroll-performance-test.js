// Enhanced Performance test script for scroll animations
// This script can be run in the browser console to test animation performance

const testScrollPerformance = () => {
  console.log('🚀 Testing enhanced scroll animation performance...');
  
  // Test 1: Measure animation frame rate
  let frameCount = 0;
  let startTime = performance.now();
  let isMonitoring = true;
  
  const measureFrameRate = () => {
    if (!isMonitoring) return;
    
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed >= 1000) {
      const fps = frameCount;
      console.log(`📊 Animation frame rate: ${fps} fps`);
      
      if (fps >= 55) {
        console.log('✅ Excellent performance (55+ fps)');
      } else if (fps >= 45) {
        console.log('⚡ Good performance (45+ fps)');
      } else if (fps >= 30) {
        console.log('⚠️ Fair performance (30+ fps)');
      } else {
        console.log('❌ Poor performance (<30 fps)');
      }
      
      frameCount = 0;
      startTime = currentTime;
    }
    
    requestAnimationFrame(measureFrameRate);
  };
  
  // Test 2: Check intersection observer performance
  const testElements = document.querySelectorAll('.scroll-slide-left, .scroll-slide-up-fast, .scroll-fade-in');
  console.log(`🔍 Found ${testElements.length} animated elements`);
  
  testElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const hasActiveClass = element.classList.contains('active');
    
    console.log(`Element ${index + 1}: ${isVisible ? '👁️ Visible' : '🚫 Hidden'} | ${hasActiveClass ? '✨ Active' : '💤 Inactive'}`);
  });
  
  // Test 3: Measure scroll lag and smoothness
  let lastScrollTime = 0;
  let scrollCount = 0;
  let totalLag = 0;
  
  const scrollHandler = () => {
    const currentTime = performance.now();
    const lag = currentTime - lastScrollTime;
    
    if (lastScrollTime > 0) {
      scrollCount++;
      totalLag += lag;
      
      if (lag > 16.67) { // More than 60fps threshold
        console.log(`⚠️ Scroll lag detected: ${lag.toFixed(2)}ms`);
      }
      
      // Report average performance every 50 scroll events
      if (scrollCount % 50 === 0) {
        const avgLag = totalLag / scrollCount;
        console.log(`📈 Average scroll performance: ${avgLag.toFixed(2)}ms (${(1000/avgLag).toFixed(1)} fps equivalent)`);
      }
    }
    lastScrollTime = currentTime;
  };
  
  // Test 4: Memory usage monitoring
  if (performance.memory) {
    const memStart = performance.memory.usedJSHeapSize;
    console.log(`💾 Initial memory usage: ${(memStart / 1024 / 1024).toFixed(2)} MB`);
    
    setTimeout(() => {
      const memEnd = performance.memory.usedJSHeapSize;
      const memDiff = memEnd - memStart;
      console.log(`💾 Memory change after scroll test: ${(memDiff / 1024 / 1024).toFixed(2)} MB`);
      
      if (memDiff < 1024 * 1024) { // Less than 1MB increase
        console.log('✅ Excellent memory management');
      } else if (memDiff < 5 * 1024 * 1024) { // Less than 5MB
        console.log('⚡ Good memory management');
      } else {
        console.log('⚠️ Consider optimizing memory usage');
      }
    }, 10000);
  }
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  // Start frame rate measurement
  requestAnimationFrame(measureFrameRate);
  
  console.log('🎯 Performance test started! Scroll to test animation smoothness.');
  console.log('📝 Monitor console for real-time performance metrics.');
  
  // Stop monitoring after 30 seconds
  setTimeout(() => {
    isMonitoring = false;
    window.removeEventListener('scroll', scrollHandler);
    console.log('🏁 Performance test completed.');
  }, 30000);
  
  return {
    stop: () => {
      isMonitoring = false;
      window.removeEventListener('scroll', scrollHandler);
      console.log('🛑 Performance test stopped manually.');
    }
  };
};

// Auto-start test when page is loaded
if (document.readyState === 'complete') {
  testScrollPerformance();
} else {
  window.addEventListener('load', testScrollPerformance);
}

// Export for manual testing
window.testScrollPerformance = testScrollPerformance;
