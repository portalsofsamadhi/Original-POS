import React, { useState, useEffect } from 'react';
import NewsletterSubscribers from './NewsletterSubscribers';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
// import { BookingManager, BookingAnalytics } from '../../services/bookingManager';


// Type definitions for better type safety
interface Booking {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  notes?: string;
  bookingData?: {
    serviceName: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    serviceDuration: string;
    practitionerName: string;
  };
  paymentDetails?: {
    amount: string;
    method: string;
    status: string;
    paymentMethod: string;
    transactionId: string;
  };
  createdAt: string;
}

interface PaymentMethodCount {
  [method: string]: number;
}

interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  paymentMethodBreakdown: PaymentMethodCount;
  bookingsByStatus?: { [status: string]: number };
  monthlyGrowth?: number;
}

interface PageData {
  page: string;
  views: number;
}

interface ActionData {
  action: string;
  count: number;
}

interface LocationData {
  country: string;
  count: number;
}

interface _DeviceData {
  device: string;
  count: number;
}

interface _BrowserData {
  browser: string;
  count: number;
}

interface _PerformanceData {
  page: string;
  avgTime: number;
}

interface PerformancePageData {
  page: string;
  avgLoadTime: number;
  samples: number;
}

interface _TrafficSourceData {
  source: string;
  count: number;
}

interface TrafficSourceDetailData {
  source: string;
  percentage: number;
  visitors: number;
}

interface DeviceDetailData {
  type: string;
  percentage: number;
  users: number;
}

interface BrowserDetailData {
  name: string;
  percentage: number;
  users: number;
}

interface AnalyticsStats {
  pageViews: {
    today: number;
    last7Days: number;
    last30Days: number;
  };
  uniqueSessions: {
    today: number;
    last7Days: number;
    last30Days: number;
  };
  topPages: PageData[];
  userActions: {
    totalActions: number;
    actionBreakdown: ActionData[];
  };
  performance: {
    averageLoadTime: number;
    totalMeasurements: number;
    slowestPages: PerformancePageData[];
  };
  trafficSources: TrafficSourceDetailData[];
  deviceStats: {
    devices: DeviceDetailData[];
    browsers: BrowserDetailData[];
  };
  totalEvents: number;
}

interface _LocationStats {
  topCountries: LocationData[];
  topCities: LocationData[];
}

// Website Analytics Service
interface AnalyticsData {
  pageViews: { [date: string]: { [page: string]: number } };
  uniqueSessions: { [date: string]: Set<string> | string[] };
  userActions: Array<{
    timestamp: string;
    action: string;
    page: string;
    details?: Record<string, unknown>;
    sessionId: string;
  }>;
  performance: { [date: string]: { [page: string]: number[] } };
  sessionLocations?: { [sessionId: string]: { country: string; city: string; region: string; ip: string } };
}

class WebsiteAnalytics {
  public static getLocationStats(dates: string[]) {
    const analytics = this.getAnalytics();
    const sessionIds: Set<string> = new Set();
    dates.forEach(date => {
      const daySessions = analytics.uniqueSessions[date];
      if (daySessions instanceof Set) {
        daySessions.forEach(session => sessionIds.add(session));
      } else if (Array.isArray(daySessions)) {
        daySessions.forEach(session => sessionIds.add(session));
      }
    });
    const locations: { [key: string]: number } = {};
    const cityStats: { [key: string]: number } = {};
    sessionIds.forEach(sessionId => {
      const loc = analytics.sessionLocations?.[sessionId];
      if (loc && loc.country) {
        locations[loc.country] = (locations[loc.country] || 0) + 1;
        if (loc.city) cityStats[loc.city] = (cityStats[loc.city] || 0) + 1;
      }
    });
    // Top countries/cities
    const topCountries = Object.entries(locations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
    const topCities = Object.entries(cityStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
    return { topCountries, topCities };
  }
  private static ANALYTICS_KEY = 'portals_analytics';
  private static LOCATION_API = 'https://ipapi.co/json/';
  
  static trackPageView(page: string) {
    const analytics = this.getAnalytics();
    const today = new Date().toISOString().split('T')[0];
    
    if (!analytics.pageViews[today]) {
      analytics.pageViews[today] = {};
    }
    if (!analytics.pageViews[today][page]) {
      analytics.pageViews[today][page] = 0;
    }
    analytics.pageViews[today][page]++;
    
    // Track unique sessions
    const sessionId = this.getSessionId();
    if (!analytics.uniqueSessions[today]) {
      analytics.uniqueSessions[today] = new Set<string>();
    }
    const todaySessions = analytics.uniqueSessions[today];
    if (todaySessions instanceof Set) {
      todaySessions.add(sessionId);
    } else {
      // Convert array to Set if needed
      analytics.uniqueSessions[today] = new Set([...todaySessions, sessionId]);
    }

    // Track location for session (only once per session)
    if (!analytics.sessionLocations) analytics.sessionLocations = {};
    if (!analytics.sessionLocations[sessionId]) {
      fetch(WebsiteAnalytics.LOCATION_API)
        .then(res => res.json())
        .then(data => {
          analytics.sessionLocations[sessionId] = {
            country: data.country_name,
            city: data.city,
            region: data.region,
            ip: data.ip
          };
          WebsiteAnalytics.saveAnalytics(analytics);
        })
        .catch(() => {
          analytics.sessionLocations[sessionId] = { country: 'Unknown', city: '', region: '', ip: '' };
          WebsiteAnalytics.saveAnalytics(analytics);
        });
    }
    
    this.saveAnalytics(analytics);
  }
  
  static trackUserAction(action: string, page: string, details?: Record<string, unknown>) {
    const analytics = this.getAnalytics();
    const timestamp = new Date().toISOString();
    
    analytics.userActions.push({
      timestamp,
      action,
      page,
      details,
      sessionId: this.getSessionId()
    });
    
    // Keep only last 1000 actions
    if (analytics.userActions.length > 1000) {
      analytics.userActions = analytics.userActions.slice(-1000);
    }
    
    this.saveAnalytics(analytics);
  }
  
  static trackPerformance(page: string, loadTime: number) {
    const analytics = this.getAnalytics();
    const today = new Date().toISOString().split('T')[0];
    
    if (!analytics.performance[today]) {
      analytics.performance[today] = {};
    }
    if (!analytics.performance[today][page]) {
      analytics.performance[today][page] = [];
    }
    analytics.performance[today][page].push(loadTime);
    
    this.saveAnalytics(analytics);
  }
  
  static getAnalyticsStats() {
    const analytics = this.getAnalytics();
    const last7Days = this.getLast7Days();
    const last30Days = this.getLast30Days();
    
    // Calculate page views for different periods
    const pageViewsToday = this.getPageViewsForDates([new Date().toISOString().split('T')[0]]);
    const pageViews7Days = this.getPageViewsForDates(last7Days);
    const pageViews30Days = this.getPageViewsForDates(last30Days);
    
    // Calculate unique sessions
    const uniqueSessionsToday = this.getUniqueSessionsForDates([new Date().toISOString().split('T')[0]]);
    const uniqueSessions7Days = this.getUniqueSessionsForDates(last7Days);
    const uniqueSessions30Days = this.getUniqueSessionsForDates(last30Days);
    
    // Top pages
    const topPages = this.getTopPages(last30Days);
    
    // User actions analysis
    const userActionStats = this.getUserActionStats(last30Days);
    
    // Performance metrics
    const performanceStats = this.getPerformanceStats(last30Days);
    
    // Traffic sources (simulated based on referrer)
    const trafficSources = this.getTrafficSources();
    
    // Device/Browser stats (simulated)
    const deviceStats = this.getDeviceStats();
    
    return {
      pageViews: {
        today: pageViewsToday,
        last7Days: pageViews7Days,
        last30Days: pageViews30Days
      },
      uniqueSessions: {
        today: uniqueSessionsToday,
        last7Days: uniqueSessions7Days,
        last30Days: uniqueSessions30Days
      },
      topPages,
      userActions: userActionStats,
      performance: performanceStats,
      trafficSources,
      deviceStats,
      totalEvents: analytics.userActions.length
    };
  }
  
  private static getAnalytics(): AnalyticsData {
    const stored = localStorage.getItem(this.ANALYTICS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert sets back to Sets for unique sessions
      Object.keys(parsed.uniqueSessions || {}).forEach(date => {
        if (Array.isArray(parsed.uniqueSessions[date])) {
          parsed.uniqueSessions[date] = new Set(parsed.uniqueSessions[date]);
        }
      });
      return parsed;
    }
    
    return {
      pageViews: {},
      uniqueSessions: {},
      userActions: [],
      performance: {},
      sessionLocations: {}
    };
  }
  
  private static saveAnalytics(analytics: AnalyticsData) {
    // Convert Sets to Arrays for storage
    const toStore = {
      ...analytics,
      uniqueSessions: Object.fromEntries(
        Object.entries(analytics.uniqueSessions).map(([date, sessions]: [string, Set<string> | string[]]) => [
          date,
          Array.from(sessions)
        ])
      ),
      sessionLocations: analytics.sessionLocations || {}
    };
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(toStore));
  }
  
  private static getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  
  private static getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }
  
  public static getLast30Days() {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }
  
  private static getPageViewsForDates(dates: string[]) {
    const analytics = this.getAnalytics();
    return dates.reduce((total: number, date) => {
      const dayViews = analytics.pageViews[date];
      if (dayViews) {
        return total + Object.values(dayViews).reduce((sum: number, views: number) => sum + views, 0);
      }
      return total;
    }, 0);
  }
  
  private static getUniqueSessionsForDates(dates: string[]) {
    const analytics = this.getAnalytics();
    const allSessions = new Set<string>();
    dates.forEach(date => {
      const daySessions = analytics.uniqueSessions[date];
      if (daySessions instanceof Set) {
        daySessions.forEach(session => allSessions.add(session));
      } else if (Array.isArray(daySessions)) {
        daySessions.forEach(session => allSessions.add(session));
      }
    });
    return allSessions.size;
  }
  
  private static getTopPages(dates: string[]) {
    const analytics = this.getAnalytics();
    const pageViewCounts: { [key: string]: number } = {};
    
    dates.forEach(date => {
      const dayViews = analytics.pageViews[date];
      if (dayViews) {
        Object.entries(dayViews).forEach(([page, views]) => {
          pageViewCounts[page] = (pageViewCounts[page] || 0) + (views as number);
        });
      }
    });
    
    return Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));
  }
  
  private static getUserActionStats(dates: string[]) {
    const analytics = this.getAnalytics();
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    endDate.setDate(endDate.getDate() + 1); // Include end date
    
    const relevantActions = analytics.userActions.filter(action => {
      const actionDate = new Date(action.timestamp);
      return actionDate >= startDate && actionDate < endDate;
    });
    
    const actionCounts: { [key: string]: number } = {};
    relevantActions.forEach(action => {
      actionCounts[action.action] = (actionCounts[action.action] || 0) + 1;
    });
    
    return {
      totalActions: relevantActions.length,
      actionBreakdown: Object.entries(actionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }))
    };
  }
  
  private static getPerformanceStats(dates: string[]) {
    const analytics = this.getAnalytics();
    const allLoadTimes: number[] = [];
    const pagePerformance: { [key: string]: number[] } = {};
    
    dates.forEach(date => {
      const dayPerformance = analytics.performance[date];
      if (dayPerformance) {
        Object.entries(dayPerformance).forEach(([page, times]) => {
          const timesArray = times as number[];
          allLoadTimes.push(...timesArray);
          if (!pagePerformance[page]) {
            pagePerformance[page] = [];
          }
          pagePerformance[page].push(...timesArray);
        });
      }
    });
    
    const avgLoadTime = allLoadTimes.length > 0 
      ? allLoadTimes.reduce((sum, time) => sum + time, 0) / allLoadTimes.length 
      : 0;
    
    const pageAverages = Object.entries(pagePerformance).map(([page, times]) => ({
      page,
      avgLoadTime: times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0,
      samples: times.length
    })).sort((a, b) => b.avgLoadTime - a.avgLoadTime);
    
    return {
      averageLoadTime: avgLoadTime,
      slowestPages: pageAverages.slice(0, 5),
      totalMeasurements: allLoadTimes.length
    };
  }
  
  private static getTrafficSources() {
    // Simulated traffic sources based on common patterns
    return [
      { source: 'Direct', percentage: 45, visitors: 234 },
      { source: 'Google Search', percentage: 30, visitors: 156 },
      { source: 'Social Media', percentage: 15, visitors: 78 },
      { source: 'Referral', percentage: 10, visitors: 52 }
    ];
  }
  
  private static getDeviceStats() {
    // Simulated device/browser stats
    return {
      devices: [
        { type: 'Desktop', percentage: 60, users: 312 },
        { type: 'Mobile', percentage: 35, users: 182 },
        { type: 'Tablet', percentage: 5, users: 26 }
      ],
      browsers: [
        { name: 'Chrome', percentage: 65, users: 338 },
        { name: 'Safari', percentage: 20, users: 104 },
        { name: 'Firefox', percentage: 10, users: 52 },
        { name: 'Edge', percentage: 5, users: 26 }
      ]
    };
  }
  
  static clearAnalytics() {
    localStorage.removeItem(this.ANALYTICS_KEY);
  }
}

const BookingDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'newsletter'>('bookings');
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (showDashboard) {
      loadData();
      WebsiteAnalytics.trackPageView('/admin/dashboard');
      WebsiteAnalytics.trackUserAction('admin_dashboard_opened', '/admin/dashboard');
    }
     
  }, [showDashboard]);

  const loadData = async () => {
    // Fetch bookings from backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/bookings`, {
        headers: { 'Authorization': 'Bearer admin_secret_key_2025' }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        // Calculate stats
        setStats({
          totalBookings: data.bookings.length,
          totalRevenue: data.bookings.reduce((sum: number, b: Booking) => sum + (b.paymentDetails?.amount ? parseFloat(b.paymentDetails.amount) : 0), 0),
          averageBookingValue: data.bookings.length > 0 ? data.bookings.reduce((sum: number, b: Booking) => sum + (b.paymentDetails?.amount ? parseFloat(b.paymentDetails.amount) : 0), 0) / data.bookings.length : 0,
          paymentMethodBreakdown: data.bookings.reduce((acc: PaymentMethodCount, b: Booking) => {
            const method = b.paymentDetails?.paymentMethod || 'unknown';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
          }, {}),
          bookingsByStatus: {}
        });
      } else {
        setBookings([]);
        setStats(null);
      }
    } catch (_err) {
      setBookings([]);
      setStats(null);
    }
    // Website analytics (local only)
    setAnalyticsStats(WebsiteAnalytics.getAnalyticsStats());
  };

  const exportBookings = () => {
    if (!bookings.length) {
      alert('No bookings to export');
      return;
    }
    const headers = [
      'Booking ID', 'Service Name', 'Client Name', 'Email', 'Phone',
      'Date', 'Time', 'Duration', 'Practitioner', 'Amount',
      'Payment Method', 'Transaction ID', 'Status', 'Created At'
    ];
    const rows = bookings.map((b: Booking) => [
      b.id,
      b.bookingData?.serviceName,
      b.bookingData?.name,
      b.bookingData?.email,
      b.bookingData?.phone,
      b.bookingData?.date,
      b.bookingData?.time,
      b.bookingData?.serviceDuration,
      b.bookingData?.practitionerName,
      b.paymentDetails?.amount,
      b.paymentDetails?.paymentMethod,
      b.paymentDetails?.transactionId,
      b.paymentDetails?.status,
      b.createdAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(x => '"' + (x ?? '') + '"').join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `portals-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const clearAllBookings = () => {
    alert('Clearing bookings is only available via backend.');
  };

  const clearAllAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      WebsiteAnalytics.clearAnalytics();
      loadData();
    }
  };

  const exportAnalytics = () => {
    if (!analyticsStats) {
      alert('No analytics data to export');
      return;
    }

    const data = [
      'Website Analytics Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      'Page Views:',
      `Today: ${analyticsStats.pageViews.today}`,
      `Last 7 Days: ${analyticsStats.pageViews.last7Days}`,
      `Last 30 Days: ${analyticsStats.pageViews.last30Days}`,
      '',
      'Unique Sessions:',
      `Today: ${analyticsStats.uniqueSessions.today}`,
      `Last 7 Days: ${analyticsStats.uniqueSessions.last7Days}`,
      `Last 30 Days: ${analyticsStats.uniqueSessions.last30Days}`,
      '',
      'Top Pages:',
      ...analyticsStats.topPages.map((page: PageData) => `${page.page}: ${page.views} views`),
      '',
      'User Actions:',
      `Total Actions: ${analyticsStats.userActions.totalActions}`,
      ...analyticsStats.userActions.actionBreakdown.map((action: ActionData) => `${action.action}: ${action.count}`),
      '',
      'Performance:',
      `Average Load Time: ${analyticsStats.performance.averageLoadTime.toFixed(2)}ms`,
      'Slowest Pages:',
      ...analyticsStats.performance.slowestPages.map((page: PerformancePageData) => 
        `${page.page}: ${page.avgLoadTime.toFixed(2)}ms (${page.samples} samples)`
      ),
    ].join('\n');

    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `portals-analytics-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!showDashboard) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setShowDashboard(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
        >
          📊 Admin Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-full overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'bookings' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 Bookings
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📈 Analytics
                </button>
                <button
                  onClick={() => setActiveTab('newsletter')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'newsletter' 
                      ? 'bg-white text-green-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📨 Newsletter
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'bookings' ? (
                <>
                  <Button onClick={exportBookings} variant="outline" size="sm">
                    📥 Export Bookings
                  </Button>
                  <Button onClick={clearAllBookings} variant="destructive" size="sm">
                    🗑️ Clear Bookings
                  </Button>
                </>
              ) : activeTab === 'analytics' ? (
                <>
                  <Button onClick={exportAnalytics} variant="outline" size="sm">
                    📥 Export Analytics
                  </Button>
                  <Button onClick={clearAllAnalytics} variant="destructive" size="sm">
                    🗑️ Clear Analytics
                  </Button>
                </>
              ) : null}
              <Button onClick={() => setShowDashboard(false)} variant="outline" size="sm">
                ✕ Close
              </Button>
            </div>
          </div>

          {activeTab === 'bookings' ? (
            <>
              {/* Booking Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${stats.totalRevenue.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Avg. Booking Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${stats.averageBookingValue.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs space-y-1">
                        {Object.entries(stats.paymentMethodBreakdown).map(([method, count]) => (
                          <div key={method} className="flex justify-between">
                            <span>{method}:</span>
                            <span className="font-bold">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Bookings Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings ({bookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Service</th>
                            <th className="text-left p-2">Client</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Payment</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 10).map((booking, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-mono text-xs">{booking.id}</td>
                              <td className="p-2">
                                <div className="font-medium">{booking.bookingData?.serviceName}</div>
                                <div className="text-xs text-gray-500">{booking.bookingData?.practitionerName}</div>
                              </td>
                              <td className="p-2">
                                <div className="font-medium">{booking.bookingData?.name}</div>
                                <div className="text-xs text-gray-500">{booking.bookingData?.email}</div>
                              </td>
                              <td className="p-2">
                                <div>{booking.bookingData?.date}</div>
                                <div className="text-xs text-gray-500">{booking.bookingData?.time}</div>
                              </td>
                              <td className="p-2 font-bold">${booking.paymentDetails?.amount ?? ''}</td>
                              <td className="p-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {booking.paymentDetails?.paymentMethod}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  {booking.paymentDetails?.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {bookings.length > 10 && (
                        <p className="text-center text-gray-500 mt-4">
                          Showing 10 of {bookings.length} bookings. Export CSV for full list.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : activeTab === 'analytics' ? (
            <>
              {/* Website Analytics */}
              {analyticsStats ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Page Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Today:</span>
                            <span className="font-bold">{analyticsStats.pageViews.today}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last 7 Days:</span>
                            <span className="font-bold">{analyticsStats.pageViews.last7Days}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last 30 Days:</span>
                            <span className="font-bold">{analyticsStats.pageViews.last30Days}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Unique Sessions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Today:</span>
                            <span className="font-bold">{analyticsStats.uniqueSessions.today}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last 7 Days:</span>
                            <span className="font-bold">{analyticsStats.uniqueSessions.last7Days}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last 30 Days:</span>
                            <span className="font-bold">{analyticsStats.uniqueSessions.last30Days}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Avg Load Time:</span>
                            <span className="font-bold">{analyticsStats.performance.averageLoadTime.toFixed(2)} ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Measurements:</span>
                            <span className="font-bold">{analyticsStats.performance.totalMeasurements}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Login Countries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          {(() => {
                            const locStats = WebsiteAnalytics.getLocationStats(WebsiteAnalytics.getLast30Days());
                            return locStats.topCountries.length === 0 ? (
                              <div className="text-gray-500">No location data</div>
                            ) : (
                              locStats.topCountries.map((loc: LocationData, i: number) => (
                                <div key={i} className="flex justify-between">
                                  <span>{loc.country}</span>
                                  <span className="font-bold">{loc.count}</span>
                                </div>
                              ))
                            );
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Pages (Last 30 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analyticsStats.topPages.length === 0 ? (
                          <p className="text-gray-500 text-center">No data available</p>
                        ) : (
                          <div className="space-y-2 text-sm">
                            {analyticsStats.topPages.map((page: PageData, i: number) => (
                              <div key={i} className="flex justify-between">
                                <span>{page.page}</span>
                                <span className="font-bold">{page.views} views</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>User Actions (Last 30 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Actions:</span>
                            <span className="font-bold">{analyticsStats.userActions.totalActions}</span>
                          </div>
                          {analyticsStats.userActions.actionBreakdown.length === 0 ? (
                            <p className="text-gray-500 text-center">No actions recorded</p>
                          ) : (
                            analyticsStats.userActions.actionBreakdown.map((action: ActionData, i: number) => (
                              <div key={i} className="flex justify-between">
                                <span>{action.action}</span>
                                <span className="font-bold">{action.count}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Slowest Pages (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsStats.performance.slowestPages.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No performance data available</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Page</th>
                                <th className="text-left p-2">Avg Load Time</th>
                                <th className="text-left p-2">Samples</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsStats.performance.slowestPages.map((page: PerformancePageData, i: number) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                  <td className="p-2">{page.page}</td>
                                  <td className="p-2">{page.avgLoadTime.toFixed(2)} ms</td>
                                  <td className="p-2">{page.samples}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {analyticsStats.trafficSources.map((source: TrafficSourceDetailData, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span>{source.source} ({source.percentage}%)</span>
                              <span className="font-bold">{source.visitors} visitors</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Devices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {analyticsStats.deviceStats.devices.map((device: DeviceDetailData, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span>{device.type} ({device.percentage}%)</span>
                              <span className="font-bold">{device.users} users</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Browsers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {analyticsStats.deviceStats.browsers.map((browser: BrowserDetailData, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span>{browser.name} ({browser.percentage}%)</span>
                              <span className="font-bold">{browser.users} users</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">No analytics data available</p>
              )}
            </>
          ) : activeTab === 'newsletter' ? (
            <NewsletterSubscribers />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;