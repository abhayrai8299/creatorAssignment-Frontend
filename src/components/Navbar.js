import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAdmin(decoded.role === 'admin');
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
        setIsAdmin(false);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  }, []);
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAdmin(decoded.role === 'admin');
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    navigate('/login');
  };


  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link className="text-white font-bold">Creator Dashboard</Link>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin ? (
            <Link to="/admin-dashboard" className="text-white bg-yellow-500 px-4 py-2 rounded-md font-semibold">
              Admin Dashboard
            </Link>
          ) : (
            <>
              {user && (
                <div className="text-white">
                  <span>{user.username}</span>
                  <Link to="/profile" className="ml-4 hover:text-gray-300">Profile</Link>
                </div>
              )}
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white">Login</Link>
              <Link to="/register" className="ml-4 text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
