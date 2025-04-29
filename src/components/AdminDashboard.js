import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [updatedCredits, setUpdatedCredits] = useState({});
  const [userFeedActivity, setUserFeedActivity] = useState([]);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalUsers = res.data.filter(user => user.role !== 'admin');
      setUsers(normalUsers);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin-login');
      }
    }
  };
  const fetchUserFeedActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/admin/feed/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserFeedActivity(res.data);
    } catch (error) {
      console.error('Failed to fetch feed activity', error);
    }
  };
  
  
  const handleCreditChange = (id, value) => {
    setUpdatedCredits(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateCredits = async (userId) => {
    const credits = parseInt(updatedCredits[userId]);
    if (isNaN(credits)) {
      alert('Please enter a valid number');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/admin/credits/${userId}`, { credits }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Credits updated successfully');
      setUpdatedCredits(prev => {
        const newCredits = { ...prev };
        delete newCredits[userId];
        return newCredits;
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update credits');
    }
  };
  
  useEffect(() => {
    fetchUsers();
    fetchUserFeedActivity();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
  
      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-300 mb-10">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b">Username</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Credits</th>
              <th className="px-6 py-3 border-b">Update Credits</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{user.username}</td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{user.credits}</td>
                <td className="px-6 py-4 border-b">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      className="border p-2 rounded w-24"
                      value={updatedCredits[user._id] ?? ''}
                      onChange={(e) => handleCreditChange(user._id, e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateCredits(user._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* User Feed Activity */}
      <h3 className="text-xl font-semibold mb-4">User Feed Activity</h3>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Recent Activity</th>
            </tr>
          </thead>
          <tbody>
            {userFeedActivity.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b align-top font-medium text-gray-800">{user.email}</td>
                <td className="px-6 py-4 border-b">
                  <ul className="space-y-2">
                    {user.recentActivity.slice(0, 5).map((act, idx) => (
                      <li key={idx} className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <div className="text-sm text-gray-800">
                          <span className="font-semibold">{act.action}</span>: {act.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(act.date).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default AdminDashboard;
