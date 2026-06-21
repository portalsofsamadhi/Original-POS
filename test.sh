echo "Testing newsletter server..."
node --version
echo "Starting newsletter server test..."
timeout 5 node newsletter-server.cjs &
sleep 2
curl -s http://localhost:3001/api/newsletter/health || echo "Health check failed"
echo "Newsletter test complete"
