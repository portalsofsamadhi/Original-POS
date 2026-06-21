import { toast } from "../components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

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
    const response = await fetch(`${API_URL}/calendar/create-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create calendar event');
    }

    return data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    toast({
      title: "Calendar Error",
      description: "Failed to add event to calendar. Please try again.",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const getAvailableTimeSlots = async (date: Date) => {
  // Create start and end date for the entire day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  try {
    const response = await fetch(`${API_URL}/calendar/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get calendar availability');
    }

    // Create standard time slots (30 minute intervals from 9 AM to 5 PM)
    const standardTimeSlots: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      standardTimeSlots.push(`${hourFormatted}:00 ${amPm}`);
      standardTimeSlots.push(`${hourFormatted}:30 ${amPm}`);
    }
    
    // Filter out busy time slots
    if (!data.busy || data.busy.length === 0) {
      return standardTimeSlots;
    }
    // Fix: Type assertion for busy slots
    const busySlots = data.busy.map((slot: unknown) => {
      const { start, end } = slot as { start: string; end: string };
      return { start: new Date(start), end: new Date(end) };
    });
    
    // Filter out standard slots that overlap with busy periods
    return standardTimeSlots.filter(timeSlot => {
      const [time, period] = timeSlot.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      
      let hourIn24 = hour;
      if (period === 'PM' && hour !== 12) hourIn24 += 12;
      if (period === 'AM' && hour === 12) hourIn24 = 0;
      
      const slotDate = new Date(date);
      slotDate.setHours(hourIn24, minute, 0, 0);
      
      // Check if this slot overlaps with any busy period
      for (const busySlot of busySlots) {
        const slotEnd = new Date(slotDate);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);
        
        if (
          (slotDate >= busySlot.start && slotDate < busySlot.end) ||
          (slotEnd > busySlot.start && slotEnd <= busySlot.end) ||
          (slotDate <= busySlot.start && slotEnd >= busySlot.end)
        ) {
          return false;
        }
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    toast({
      title: "Calendar Error",
      description: "Failed to load available time slots. Please try again.",
      variant: "destructive",
    });
    
    // Return standard time slots as fallback
    const fallbackSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      fallbackSlots.push(`${hourFormatted}:00 ${amPm}`);
      fallbackSlots.push(`${hourFormatted}:30 ${amPm}`);
    }
    return fallbackSlots;
  }
};
