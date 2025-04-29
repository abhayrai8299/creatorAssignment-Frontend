import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetching User Data
    const fetchUserData = async () => {
      const res = await fetch(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setSavedFeeds(data.savedFeeds || []);
      setRecentActivity(data.recentActivity || []);
    };

    // Fetching Feed Data
    const fetchFeedData = async () => {
      const res = await fetch(`${BASE_URL}/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeed(data);
    };

    fetchUserData();
    fetchFeedData();
  }, [navigate]);

  // Saving Feed Item
  const saveFeedItem = async (feedItem) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${BASE_URL}/feed/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feedItem }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser((prevUser) => ({
        ...prevUser,
        credits: data.credits,
        savedFeeds: data.savedFeeds,
        recentActivity: data.recentActivity,
      }));
      setSavedFeeds(data.savedFeeds);
      setRecentActivity(data.recentActivity);
    } else {
      console.error('Error saving feed item:', data.message);
    }
  };

  // Sharing Feed Item
  const shareFeedItem = async (feedItem) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    navigator.clipboard.writeText(feedItem.url).then(() => {
      console.log("Feed URL copied to clipboard");
    }).catch((err) => {
      console.error("Error copying feed URL: ", err);
    });
    const res = await fetch(`${BASE_URL}/feed/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feedItem }),
    });

    const data = await res.json();
    if (res.ok) {
      const newActivity = {
        action: 'Shared',
        title: feedItem.title,
        date: new Date().toISOString(),
      };
      setRecentActivity((prevActivities) => [newActivity, ...prevActivities]);
      setUser((prevUser) => ({
        ...prevUser,
        credits: data.credits,
        savedFeeds: data.savedFeeds,
        recentActivity: data.recentActivity,
      }));
    } else {
      console.error('Error sharing feed item:', data.message);
    }
  };

  // Report Feed Item
  const reportFeedItem = async (feedItem) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${BASE_URL}/feed/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feedItem }),
    });

    const data = await res.json();
    if (res.ok) {
      const newActivity = {
        action: 'Reported',
        title: feedItem.title,
        date: new Date().toISOString(),
      };
      setRecentActivity((prevActivities) => [newActivity, ...prevActivities]);

      setUser((prevUser) => ({
        ...prevUser,
        credits: data.credits,
        savedFeeds: data.savedFeeds,
        recentActivity: data.recentActivity,
      }));
    } else {
      console.error('Error reporting feed item:', data.message);
    }
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading your dashboard…</div>
      </div>
    );
  }
  console.log("recentActivity", recentActivity)
  return (
    <div className="min-h-screen bg-gray-100 py-8">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Welcome, {user.username}</h1>
          <div className="text-gray-700 space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Credits:</span> {user.credits}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Saved Feeds</h2>
          {savedFeeds.length > 0 ? (
            <div className="space-y-4">
              {savedFeeds.map((feed, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-medium text-lg text-gray-800">{feed.title}</h3>
                  <p className="text-sm text-gray-600">{feed.source}</p>
                  <a
                    href={feed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                  >
                    View Post →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No saved feeds yet.</p>
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity?.length > 0 ? (
              recentActivity?.map((activity, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <p className="font-medium text-gray-800">{activity.action} feed: {activity.title}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No recent activity yet.</p>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Feed</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {feed.map((post, idx) => (
            <div key={idx} className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{post.source}</p>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Post →
                </a>
              </div>
              <div className="px-4 py-3 bg-gray-100 flex space-x-2">
                <button
                  onClick={() => saveFeedItem(post)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => shareFeedItem(post)}
                  className="bg-yellow-400 text-white px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={() => reportFeedItem(post)}
                  className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
