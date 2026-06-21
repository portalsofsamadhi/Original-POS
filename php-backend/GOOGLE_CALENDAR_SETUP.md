# Google Calendar Integration Setup

## Requirements Missing:
1. **Composer**: PHP package manager not installed
2. **Google API Client**: Not installed (requires Composer)
3. **Service Account Credentials**: Not configured

## To Complete Google Calendar Integration:

### Step 1: Install Composer
Download and install Composer from: https://getcomposer.org/

### Step 2: Install Google API Client
After installing Composer, run in the php-backend directory:
```bash
composer install
```

### Step 3: Set up Google Service Account
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create a Service Account
5. Download the JSON credentials file
6. Rename it to `service-account.json` and place in php-backend directory
7. Share your Google Calendar with the service account email

### Step 4: Test Integration
After setup, bookings will automatically create calendar events on portalsofsamadhi@gmail.com

### Alternative: Simplified Version
If you prefer not to set up Google API, I can create a simpler version that just adds calendar events to a local file or sends calendar invitations via email.

## Current Status:
- ✅ Google Calendar PHP endpoint created
- ✅ Booking integration added
- ❌ Composer not installed
- ❌ Google API Client not installed
- ❌ Service account credentials not configured
