# Newsletter Backend Setup

## Overview
The Newsletter system now connects to a real backend that stores subscriber data in a JSON file and provides RESTful API endpoints.

## Quick Start

### 1. Start the Newsletter Backend Server
Run this command in PowerShell from the project root:
```powershell
.\start-newsletter.ps1
```

Or manually:
```bash
npx ts-node newsletter-server.ts
```

The server will start on port 3001 and display available API endpoints.

### 2. Start the Frontend Development Server
```bash
npm run dev
```

The frontend runs on port 5173 and will connect to the backend automatically.

## API Endpoints

### Subscribe to Newsletter
- **POST** `http://localhost:3001/api/newsletter/subscribe`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "message": "Successfully subscribed to newsletter", "email": "user@example.com" }`

### Update Subscriber Profile
- **POST** `http://localhost:3001/api/newsletter/update-profile`
- **Body**: `{ "email": "user@example.com", "phone": "+1234567890" }`
- **Response**: `{ "message": "Profile updated successfully", "email": "user@example.com", "phone": "+1234567890" }`

### Get All Subscribers (Admin)
- **GET** `http://localhost:3001/api/newsletter/subscribers`
- **Response**: `{ "subscribers": [...], "count": 5 }`

## Data Storage
Subscriber data is stored in `subscribers.json` in the project root. The file includes:
- Email address
- Subscription timestamp
- Phone number (optional)

## Frontend Features
- ✅ Email validation
- ✅ Duplicate email prevention
- ✅ Two-step signup (email + optional phone)
- ✅ LocalStorage for member profiles
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## Testing
To enable the test panel for debugging:
1. Uncomment the import in `src/App.tsx`:
   ```typescript
   import NewsletterTestPanel from "./components/NewsletterTestPanel";
   ```
2. Uncomment the component in the JSX:
   ```typescript
   <NewsletterTestPanel />
   ```

The test panel shows:
- Real-time backend subscriber count
- LocalStorage member profile data
- Refresh and clear buttons

## Production Deployment
For production, consider:
- Replace JSON file storage with a proper database (PostgreSQL, MongoDB)
- Add authentication for admin endpoints
- Implement email sending functionality
- Add rate limiting and security headers
- Use environment variables for configuration

## Troubleshooting

### Backend Not Starting
- Ensure TypeScript is installed: `npm install -g typescript ts-node`
- Check if port 3001 is available
- Verify the newsletter-server.ts file exists

### CORS Issues
The server includes CORS headers, but if you encounter issues:
- Ensure both frontend and backend are running
- Check browser developer tools for CORS errors
- Verify API_BASE_URL in `src/utils/newsletterAPI.ts`

### Data Not Persisting
- Check file permissions in the project directory
- Verify subscribers.json is being created
- Check server console for error messages
