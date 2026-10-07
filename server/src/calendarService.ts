import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// These values will need to be set via environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:10000/oauth2callback';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Create an OAuth2 client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set the refresh token
if (REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });
}

// Create Google Calendar instance
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

interface CalendarEventDetails {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
  timeZone?: string;
}

export const createCalendarEvent = async (details: CalendarEventDetails) => {
  try {
    const { summary, description, start, end, attendeeEmail, timeZone = 'America/New_York' } = details;
    
    // Create event resource
    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone,
      },
      attendees: [
        { email: attendeeEmail }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    // Insert the event
    const response = await calendar.events.insert({
      calendarId: 'portalsofsamadhi@gmail.com', // Use the specific email address
      requestBody: event,
      sendUpdates: 'all', // Send email updates to attendees
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink // Link to the event in Google Calendar
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getCalendarAvailability = async (startDate: Date, endDate: Date) => {
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }]
      }
    });

    return {
      success: true,
      busy: response.data.calendars?.primary?.busy || []
    };
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
