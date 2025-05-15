import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  const updateCredits = async (userId, credits) => {
    const token = localStorage.getItem('token');
    await axios.put(`${BASE_URL}/admin/credits/${userId}`, { credits }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  useEffect(()=>{ 
    fetchUsers(); 
    },[]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage User Credits</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Email</th><th>Credits</th><th>Update</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.credits}</td>
              <td>
                <input
                  type="number"
                  defaultValue={user.credits}
                  onBlur={(e) => updateCredits(user._id, Number(e.target.value))}
                  className="border p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
