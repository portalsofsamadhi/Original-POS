import React, { useState, useEffect } from 'react';
import { newsletterAPI } from '../utils/newsletterAPI';

const NewsletterTestPanel = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberProfile, setMemberProfile] = useState(
    JSON.parse(localStorage.getItem('memberProfile') || 'null')
  );

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsletterAPI.getSubscribers();
      setSubscribers(result.subscribers);
      setMemberProfile(JSON.parse(localStorage.getItem('memberProfile') || 'null'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    localStorage.removeItem('memberProfile');
    setMemberProfile(null);
    // Note: Can't clear server data from here, need admin endpoint
  };

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Newsletter Test Panel</h3>
      <div className="space-y-2 text-xs">
        {loading && <div className="text-blue-500">Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        
        <div>
          <strong>Backend Subscribers:</strong> {subscribers.length}
          {subscribers.length > 0 && (
            <ul className="ml-2 mt-1 max-h-20 overflow-y-auto">
              {subscribers.map((sub, index) => (
                <li key={index} className="text-gray-600 text-xs">
                  {sub.email} {sub.phone && `(${sub.phone})`}
                  <div className="text-gray-400 text-xs">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <strong>LocalStorage Profile:</strong>
          {memberProfile ? (
            <div className="ml-2 mt-1 text-gray-600">
              <div>Email: {memberProfile.email}</div>
              {memberProfile.phone && <div>Phone: {memberProfile.phone}</div>}
              <div>Joined: {memberProfile.joinDate}</div>
            </div>
          ) : (
            <span className="ml-2 text-gray-500">None</span>
          )}
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={clearData}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
          >
            Clear Local
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterTestPanel;
