import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetching user data
        const fetchUserData = async () => {
            const res = await fetch(`${BASE_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUser(data);
            setBio(data?.profile?.bio);
            setProfilePicture(data?.profile?.profilePicture);
        };

        fetchUserData();
    }, [navigate]);

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const updatedProfile = { bio, profilePicture };

        const res = await fetch(`${BASE_URL}//complete-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: user._id,
                ...updatedProfile,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setUser((prevUser) => ({
                ...prevUser,
                credits: data.credits,
                profile: updatedProfile,
            }));
            alert('Profile updated successfully!');
            navigate('/dashboard');
        } else {
            console.error('Error updating profile:', data.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Update Your Profile</h1>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Profile Picture</label>
                        <input
                            type="url"
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter image URL"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Tell us about yourself"
                        />
                    </div>
                    <button
                        onClick={handleProfileUpdate}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
