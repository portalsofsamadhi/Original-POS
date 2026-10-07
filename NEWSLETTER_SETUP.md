# Newsletter Server Setup and Testing Guide

## Quick Start (Recommended)

### Windows
```bash
# Start the server
node newsletter-server.cjs

# In another terminal, test it
node test-newsletter-quick.js
```

### Using npm scripts
```bash
# Start server
npm run newsletter

# Test server
npm run newsletter:test
```

## Alternative Methods

### TypeScript version (if you prefer)
```bash
npm run newsletter:ts
```

### Development mode with auto-restart
```bash
npm install -g nodemon
npm run newsletter:dev
```

## Testing the Newsletter

### Quick Test
```bash
node test-newsletter-quick.js
```

### Full Test (sends actual email)
```bash
node test-newsletter-email.cjs
```

### Manual Testing
```bash
# Health check
curl http://localhost:3001/api/newsletter/health

# Subscribe test
curl -X POST http://localhost:3001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Files Created/Fixed

1. **newsletter-server.cjs** - CommonJS version (main, most reliable)
2. **newsletter-server.ts** - TypeScript version (updated for ES modules)
3. **test-newsletter-quick.js** - Quick test without email sending
4. **start-newsletter.bat** - Windows batch file to start server
5. **start-newsletter.sh** - Unix shell script to start server

## Environment Variables

Make sure your `.env` file has:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Your Name <your-email@gmail.com>
```

## Troubleshooting

### If you get "ERR_UNKNOWN_FILE_EXTENSION"
- Use the `.cjs` version: `node newsletter-server.cjs`

### If you get "Cannot find module"
- Install dependencies: `npm install`

### If emails don't send
- Check your Gmail app password in `.env`
- Verify SMTP settings
- Check Gmail security settings

### If port 3001 is busy
- Kill the process: `taskkill /f /im node.exe`
- Or change the port in the server file

## Production Deployment

For production, consider:
1. Using PM2: `pm2 start newsletter-server.cjs --name newsletter`
2. Setting up proper logging
3. Adding rate limiting
4. Using a proper database instead of JSON file

## API Endpoints

- `GET /api/newsletter/health` - Health check
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/update-profile` - Update subscriber profile
- `GET /api/newsletter/subscribers` - Get all subscribers
