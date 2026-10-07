// Simple service worker registration for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      _registration => {
        // Registration successful
        // console.log('ServiceWorker registration successful:', _registration);
      },
      _err => {
        // Registration failed
        // console.warn('ServiceWorker registration failed:', _err);
      }
    );
  });
}
